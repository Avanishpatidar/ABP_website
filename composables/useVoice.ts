// Live voice: browser <-> Gemini Live via an ephemeral token (Vercel-native).
// Handles mic capture (AudioWorklet -> PCM16), streaming, playback, tool calls,
// and section/hover page awareness. Client-only.
const LIVE_INPUT_MIME = 'audio/pcm;rate=16000'
const SDK_URL = 'https://cdn.jsdelivr.net/npm/@google/genai@1.44.0/+esm'
const RECORDER_WORKLET = 'pcm-recorder-processor'

// Warm the (large) SDK download once, ahead of the first connect, so clicking
// the mascot doesn't pay for the CDN fetch. Shared across all instances.
let sdkPromise: Promise<any> | null = null
const warmSdk = () => (sdkPromise ||= import(/* @vite-ignore */ SDK_URL))

type Ctx = { type: string; title: string; description?: string }
type ActionCard = { icon: string; text: string; sub?: string } | null

export interface VoiceMessage { role: 'user' | 'model'; text: string }

export function useVoice(onMessage?: (m: VoiceMessage) => void) {
  const started = ref(false)
  const connected = ref(false)
  const micOn = ref(false)
  const faceState = ref('') // '', 'idle', 'listening', 'speaking', 'connecting'
  const status = ref('')
  const actionCard = ref<ActionCard>(null)

  let session: any = null // { sendAudio, sendText, sendSystem, close }
  let startWithMic = false

  // ---- mic / audio graph ----
  let micStream: MediaStream | null = null
  let micCtx: AudioContext | null = null
  let workletNode: any = null
  let workletLoaded = false
  let streaming = false
  let pcmBuffer: Uint8Array[] = []
  let pcmLen = 0
  let flushTimer: any = null
  const FLUSH_MS = 50 // stream mic audio more continuously for a "live" feel

  // ---- playback ----
  let playCtx: AudioContext | null = null
  let nextStart = 0
  let stopAudio = false
  let sources: AudioBufferSourceNode[] = []

  // ---- live lip-sync: analyse the AI's voice, publish a mouth level (0..1) ----
  const iv = useInterview()
  let analyser: AnalyserNode | null = null
  let mouthData: Uint8Array | null = null
  let mouthRaf = 0
  const startMouthLoop = () => {
    if (mouthRaf || !analyser || !mouthData) return
    const tick = () => {
      if (!analyser || !mouthData) { mouthRaf = 0; return }
      analyser.getByteTimeDomainData(mouthData)
      let sum = 0
      for (let i = 0; i < mouthData.length; i++) { const v = (mouthData[i] - 128) / 128; sum += v * v }
      const rms = Math.sqrt(sum / mouthData.length)
      const target = sources.length ? Math.min(1, rms * 3.2) : 0
      iv.mouth.value += (target - iv.mouth.value) * 0.35 // smooth
      mouthRaf = requestAnimationFrame(tick)
    }
    mouthRaf = requestAnimationFrame(tick)
  }
  const stopMouthLoop = () => { if (mouthRaf) cancelAnimationFrame(mouthRaf); mouthRaf = 0; iv.mouth.value = 0 }

  const floatTo16 = (f32: Float32Array) => {
    const buf = new ArrayBuffer(f32.length * 2)
    const v = new DataView(buf)
    for (let i = 0; i < f32.length; i++) {
      const s = Math.max(-1, Math.min(1, f32[i]))
      v.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
    return new Uint8Array(buf)
  }
  const u8ToB64 = (u8: Uint8Array) => {
    let b = ''
    for (let i = 0; i < u8.length; i++) b += String.fromCharCode(u8[i])
    return btoa(b)
  }

  const setState = (s: string) => { faceState.value = s }

  // ---- Gemini Live bridge (ephemeral token -> direct connection) ----
  async function connect() {
    // Load the SDK and mint the token in parallel (SDK is usually already warm).
    const sdkP = warmSdk()
    const res = await fetch('/api/voice-token', { method: 'POST' })
    if (!res.ok) throw new Error('Could not create a voice session')
    const { token, model } = await res.json()
    if (!token) throw new Error('No voice token returned')

    const { GoogleGenAI, Modality } = await sdkP
    const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: 'v1alpha' } })

    let s: any = null
    s = await ai.live.connect({
      model,
      config: { responseModalities: [Modality.AUDIO], inputAudioTranscription: {}, outputAudioTranscription: {} },
      callbacks: {
        onopen: onOpen,
        onmessage: (msg: any) => {
          const sc = msg.serverContent
          if (sc?.interrupted) onInterrupted()
          if (sc?.modelTurn?.parts) for (const p of sc.modelTurn.parts) if (p.inlineData?.data) onAudio(p.inlineData.data)
          if (sc?.inputTranscription?.text) onInputTranscript(sc.inputTranscription.text)
          if (sc?.outputTranscription?.text) onTranscript(sc.outputTranscription.text)
          if (sc?.groundingMetadata) {
            const q = sc.groundingMetadata.webSearchQueries || []
            showAction('🔍', 'Searching...', q[0] || ''); hideAction(4000)
          }
          if (msg.toolCall?.functionCalls) {
            const responses = []
            for (const call of msg.toolCall.functionCalls) {
              handleToolCall(call.name, call.args)
              responses.push({ id: call.id, name: call.name, response: { success: true, result: 'Action completed by user' } })
            }
            try { s?.sendToolResponse({ functionResponses: responses }) } catch {}
          }
          if (sc?.turnComplete && faceState.value !== 'speaking') setState(micOn.value ? 'listening' : 'idle')
        },
        onerror: (err: any) => {
          console.error('[voice] Connection error event:', err);
          status.value = 'Connection issue';
          setState('idle');
        },
        onclose: (e: any) => {
          console.log(`[voice] Connection closed. Code: ${e?.code}, Reason: ${e?.reason || 'none'}, Clean: ${e?.wasClean}`);
          connected.value = false;
          const reason = String((e && e.reason) || '');
          if (started.value) endSession();
          session = null;
          // Surface the free-tier quota / rate-limit close (code 1011) clearly.
          if (/quota|exceed|rate limit|resource has been exhausted/i.test(reason)) {
            status.value = 'Voice is rate-limited right now — try again in a minute';
          }
        }
      }
    })

    return {
      sendAudio: (b64: string) => { try { s.sendRealtimeInput({ audio: { data: b64, mimeType: LIVE_INPUT_MIME } }) } catch {} },
      sendText: (t: string) => { try { s.sendClientContent({ turns: [{ role: 'user', parts: [{ text: t }] }], turnComplete: true }) } catch {} },
      sendSystem: (t: string) => { try { s.sendClientContent({ turns: [{ role: 'user', parts: [{ text: `[SYSTEM: ${t}]` }] }], turnComplete: true }) } catch {} },
      close: () => { try { s?.close() } catch {} }
    }
  }

  // ---- callbacks ----
  function onOpen() {
    connected.value = true
    setState('idle'); status.value = ''
    if (startWithMic) {
      startWithMic = false
      micOn.value = true
      startStream()
    }
  }
  function onInterrupted() {
    stopAllAudio()
    setState(micOn.value ? 'listening' : 'idle')
    status.value = micOn.value ? 'Listening...' : ''
  }
  function onInputTranscript(text: string) {
    status.value = `"${text}"`
    onMessage?.({ role: 'user', text })
  }
  function onTranscript(text: string) {
    status.value = text.length > 60 ? text.slice(0, 60) + '...' : text
    onMessage?.({ role: 'model', text })
  }
  function onAudio(b64: string) {
    if (stopAudio) return
    setState('speaking'); status.value = 'Speaking...'
    playChunk(b64)
  }

  // ---- tool calls ----
  function handleToolCall(tool: string, args: any = {}) {
    if (tool === 'send_email') {
      showAction('📧', 'Opening Email', args.subject || '')
      setTimeout(() => window.open(`mailto:avanish.patidar07@gmail.com?subject=${encodeURIComponent(args.subject || '')}&body=${encodeURIComponent(args.body || '')}`, '_blank'), 1500)
      hideAction(4000)
    }
    if (tool === 'send_whatsapp') {
      showAction('📱', 'Opening WhatsApp')
      setTimeout(() => {
        const ph = (args.phone || '+917697793284').replace(/\+/g, '')
        window.open(`https://wa.me/${ph}?text=${encodeURIComponent(args.message || '')}`, '_blank')
      }, 1500)
      hideAction(4000)
    }
  }
  const showAction = (icon: string, text: string, sub = '') => { actionCard.value = { icon, text, sub } }
  const hideAction = (delay = 3000) => setTimeout(() => { actionCard.value = null }, delay)

  // ---- mic capture ----
  async function ensureWorklet() {
    if (!micCtx?.audioWorklet || workletLoaded) return
    const src = `class P extends AudioWorkletProcessor{process(i){const c=i[0]?.[0];if(c?.length>0)this.port.postMessage(c.slice());return true}}registerProcessor('${RECORDER_WORKLET}',P);`
    await micCtx.audioWorklet.addModule(URL.createObjectURL(new Blob([src], { type: 'application/javascript' })))
    workletLoaded = true
  }
  async function initMic() {
    if (micStream) return true
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true, noiseSuppression: true, autoGainControl: true } })
      micCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 })
      return true
    } catch (e) { console.error('Mic error:', e); return false }
  }
  const onChunk = (f32: Float32Array) => { if (!streaming) return; const pcm = floatTo16(f32); pcmBuffer.push(pcm); pcmLen += pcm.length }
  const flush = () => {
    if (pcmLen === 0 || !session || !connected.value) return
    const combined = new Uint8Array(pcmLen); let off = 0
    for (const c of pcmBuffer) { combined.set(c, off); off += c.length }
    pcmBuffer = []; pcmLen = 0
    session.sendAudio(u8ToB64(combined))
  }
  async function startStream() {
    if (streaming) return
    if (!(await initMic())) { status.value = 'Mic access denied'; micOn.value = false; return }
    streaming = true; pcmBuffer = []; pcmLen = 0
    const source = micCtx!.createMediaStreamSource(micStream!)
    if (micCtx!.audioWorklet) {
      await ensureWorklet()
      const wn = new (window as any).AudioWorkletNode(micCtx, RECORDER_WORKLET, { numberOfInputs: 1, numberOfOutputs: 0, channelCount: 1 })
      source.connect(wn); wn.port.onmessage = (e: any) => onChunk(e.data); workletNode = wn
    } else {
      const sn = (micCtx as any).createScriptProcessor(4096, 1, 1)
      source.connect(sn); sn.connect(micCtx!.destination); sn.onaudioprocess = (e: any) => onChunk(e.inputBuffer.getChannelData(0)); workletNode = sn
    }
    flushTimer = setInterval(flush, FLUSH_MS)
    setState('listening'); status.value = 'Listening...'
  }
  function stopStream() {
    streaming = false
    if (flushTimer) { clearInterval(flushTimer); flushTimer = null }
    flush(); pcmBuffer = []; pcmLen = 0
    if (workletNode) { try { workletNode.disconnect() } catch {} workletNode = null }
  }

  // ---- playback ----
  function playChunk(b64: string) {
    if (stopAudio) return
    if (!playCtx) playCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    if (playCtx.state === 'suspended') playCtx.resume()
    if (!analyser) {
      analyser = playCtx.createAnalyser(); analyser.fftSize = 512
      mouthData = new Uint8Array(analyser.fftSize)
      analyser.connect(playCtx.destination)
    }
    startMouthLoop()
    try {
      const bin = atob(b64); const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
      const i16 = new Int16Array(bytes.buffer); const f32 = new Float32Array(i16.length)
      for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768
      const buf = playCtx.createBuffer(1, f32.length, 24000); buf.getChannelData(0).set(f32)
      const src = playCtx.createBufferSource(); src.buffer = buf; src.connect(playCtx.destination); src.connect(analyser)
      const now = playCtx.currentTime; if (nextStart < now) nextStart = now
      src.start(nextStart); nextStart += buf.duration; sources.push(src)
      src.onended = () => {
        const i = sources.indexOf(src); if (i > -1) sources.splice(i, 1)
        if (sources.length === 0 && !stopAudio) { setState(micOn.value ? 'listening' : 'idle'); status.value = micOn.value ? 'Listening...' : '' }
      }
    } catch (e) { console.error('Playback error:', e) }
  }
  function stopAllAudio() {
    stopAudio = true
    for (const s of sources) { try { s.stop() } catch {} }
    sources = []
    if (playCtx) nextStart = playCtx.currentTime
    setTimeout(() => { stopAudio = false }, 100)
  }

  // ---- page awareness (stubbed) ----
  function sendGreet() {
    session?.sendSystem(`Start your response exactly with "Hello, my name is Avanish" or "Hello, mera naam Avanish hai" (depending on the language they are using), introduce yourself briefly, and invite them to chat. Keep it warm, brief, and under 3 sentences.`)
  }
  function notifySection(id: string) {}
  function notifyHover(ctx: Ctx) {}

  // ---- lifecycle ----
  async function start(withMic = false) {
    if (started.value) return
    started.value = true; startWithMic = withMic
    status.value = 'Connecting...'; setState('connecting'); micOn.value = false; stopAudio = false
    try {
      session = await connect()
      sendGreet()
    } catch (e) {
      console.error('[voice] connect failed', e)
      status.value = 'Failed to connect'
      started.value = false
      connected.value = false
      setState('')
    }
  }
  function endSession() {
    started.value = false; setState(''); status.value = 'reconnect'; stopStream()
  }
  function stop() {
    started.value = false; micOn.value = false; connected.value = false
    stopStream(); stopAllAudio(); stopMouthLoop()
    setState(''); status.value = ''
    if (session) { session.close(); session = null }
  }
  async function toggleMic() {
    if (!session || !connected.value) return
    micOn.value = !micOn.value
    if (micOn.value) await startStream()
    else { stopStream(); setState('idle'); status.value = '' }
  }
  function interruptIfSpeaking() {
    if (!started.value) { start(true); return }
    if (faceState.value === 'speaking') { stopAllAudio(); setState(micOn.value ? 'listening' : 'idle'); status.value = micOn.value ? 'Listening...' : 'Interrupted' }
  }

  return {
    started, connected, micOn, faceState, status, actionCard,
    start, stop, toggleMic, interruptIfSpeaking, notifySection, notifyHover,
    prewarm: warmSdk
  }
}
