<script setup lang="ts">
import type { VoiceMessage } from '~/composables/useVoice'

const { isLight } = useTheme()
const interview = useInterview()

// ---- shared history ----
const chatHistory = ref<VoiceMessage[]>([])
const pushHistory = (m: VoiceMessage) => { chatHistory.value.push(m); if (chatHistory.value.length > 30) chatHistory.value = chatHistory.value.slice(-30) }

// ---- voice ----
const voice = useVoice((m) => pushHistory(m))
const mascotState = computed<'idle' | 'listening' | 'speaking'>(() =>
  voice.faceState.value === 'speaking' ? 'speaking' : voice.faceState.value === 'listening' ? 'listening' : 'idle')
// keep hero avatar in sync
watch(() => voice.faceState.value, () => { interview.state.value = mascotState.value })

const SUGGESTIONS = ['Why should we hire you?', 'Walk me through TradeIQ', "What's your stack?"]

// ---- text chat ----
interface Msg { id: number; role: 'user' | 'bot' | 'system'; text: string; streaming?: boolean }
const isOpen = ref(false)
const messages = ref<Msg[]>([])
const input = ref('')
const messagesEl = ref<HTMLElement | null>(null)
let mid = 0
const scrollDown = () => nextTick(() => { if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight })

const toggleChat = (open?: boolean) => {
  isOpen.value = open ?? !isOpen.value
  document.body.style.overflow = isOpen.value ? 'hidden' : ''
  if (isOpen.value) { scrollDown(); nextTick(() => document.getElementById('chatbot-input')?.focus()) }
}

function md(t: string) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```([\s\S]*?)```/g, (_m, c) => `<pre><code class="code-block">${c.trim()}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}
const strip = (t: string) => t.replace(/:::JSON[\s\S]*?:::/g, '').replace(/```json[\s\S]*?```/gi, '').trim()
const render = (m: Msg) => m.role === 'user' ? md(m.text) : md(strip(m.text)) + (m.streaming ? '<span class="typing-cursor">|</span>' : '')
const prefix = (m: Msg) => m.role === 'user' ? 'visitor@avanish.dev:~$' : m.role === 'system' ? 'system:' : 'virtual-abp:'

function detectTool(full: string): any {
  const m = full.match(/:::JSON\s*({[\s\S]*?})\s*:::/) || full.match(/```json\s*({[\s\S]*?"tool"[\s\S]*?})\s*```/i)
  if (m) { try { return JSON.parse(m[1]) } catch {} }
  return null
}

async function send(text: string) {
  text = text.trim(); if (!text) return
  if (text.toLowerCase() === 'clear') { messages.value = []; chatHistory.value = []; input.value = ''; return }
  messages.value.push({ id: ++mid, role: 'user', text })
  pushHistory({ role: 'user', text }); input.value = ''; scrollDown()

  const bot: Msg = reactive({ id: ++mid, role: 'bot', text: '', streaming: true })
  messages.value.push(bot); let full = ''
  try {
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history: chatHistory.value.slice(-10) }) })
    if (!res.body) throw new Error('no stream')
    const reader = res.body.getReader(); const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read(); if (done) break
      for (const line of dec.decode(value).split('\n')) {
        if (!line.startsWith('data: ')) continue
        const d = line.slice(6); if (d === '[DONE]') continue
        try { const data = JSON.parse(d); if (data.text) { full += data.text; bot.text = full; scrollDown() } } catch {}
      }
    }
    bot.streaming = false
    if (!full) bot.text = 'Hit a rate limit — try again in a few seconds.'
    pushHistory({ role: 'model', text: full })
    const tool = detectTool(full)
    if (tool?.tool === 'send_email') {
      const link = `mailto:avanish.patidar07@gmail.com?subject=${encodeURIComponent(tool.subject || '')}&body=${encodeURIComponent(tool.body || '')}`
      messages.value.push({ id: ++mid, role: 'system', text: `📧 Opening email… [click if it doesn't](${link})` }); setTimeout(() => window.open(link, '_blank'), 400)
    }
    if (tool?.tool === 'send_whatsapp') {
      const ph = (tool.phone || '+917697793284').replace(/\+/g, ''); const link = `https://wa.me/${ph}?text=${encodeURIComponent(tool.message || '')}`
      messages.value.push({ id: ++mid, role: 'system', text: `📱 Opening WhatsApp… [click if it doesn't](${link})` }); setTimeout(() => window.open(link, '_blank'), 400)
    }
    scrollDown()
  } catch (e) { bot.text = 'Connection failed. Please try again.'; bot.streaming = false; console.error('[chat]', e) }
}
const onEnter = () => send(input.value)

// ---- voice controls (no auto-start; only on user action) ----
const clickMascot = () => {
  if (!voice.started.value) voice.start(true)
  else voice.interruptIfSpeaking()
}

// ---- react to interview triggers from other pages ----
watch(() => interview.queued.value, (q) => { if (q) { toggleChat(true); send(q); interview.queued.value = null } })
watch(() => interview.wantVoice.value, (w) => { if (w) { voice.start(true); interview.wantVoice.value = false } })

// Warm the voice SDK during idle time so the first click connects fast.
onMounted(() => {
  const warm = () => voice.prewarm()
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(warm, { timeout: 3000 })
  else setTimeout(warm, 1800)
})

onBeforeUnmount(() => { voice.stop(); document.body.style.overflow = '' })
</script>

<template>
  <div id="ai-chatbot-container">
    <!-- Ask ABP: text chat trigger -->
    <div id="chatbot-toggle" class="cta-btn cta-ask-abp" :class="{ hidden: isOpen }" @click="toggleChat()">
      <div class="cta-icon">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      </div>
      <span class="cta-text">Ask ABP</span>
    </div>

    <!-- Terminal chat overlay -->
    <div id="chatbot-overlay" class="chatbot-overlay" :class="{ active: isOpen }" @click.self="toggleChat(false)">
      <div class="chatbot-terminal">
        <div class="terminal-header">
          <div class="terminal-title">virtual-abp — interview — 80x24</div>
          <div class="terminal-controls"><button class="close-terminal" @click="toggleChat(false)">[x] close</button></div>
        </div>
        <div ref="messagesEl" class="terminal-messages">
          <div v-if="messages.length === 0" class="mascot-container">
            <div class="mascot-wave">👋</div>
            <div class="intro-text">Interview me — I answer as Avanish</div>
            <div class="intro-sub">Ask about my work, stack, or projects. Or hit the mic to talk.</div>
            <div class="terminal-suggest">
              <button v-for="s in SUGGESTIONS" :key="s" class="ask-chip" @click="send(s)">{{ s }}</button>
            </div>
          </div>
          <div v-for="m in messages" :key="m.id" class="term-msg" :class="m.role">
            <div class="msg-prefix">{{ prefix(m) }}</div>
            <div class="msg-content" v-html="render(m)"></div>
          </div>
        </div>
        <div class="terminal-input-area">
          <span class="prompt-label">visitor@avanish.dev:~$</span>
          <input id="chatbot-input" v-model="input" type="text" class="terminal-input" autocomplete="off" spellcheck="false" @keypress.enter="onEnter" />
          <div class="terminal-cursor"></div>
        </div>
      </div>
    </div>

    <!-- Floating voice mascot (3D) -->
    <div id="voice-mascot" class="voice-mascot">
      <div class="voice-mascot-inner" style="cursor: pointer;" @click="clickMascot">
        <div class="voice-mascot-face" :class="voice.faceState.value">
          <div class="mascot-face-ring"></div>
          <MascotAvatar :state="mascotState" :dark="!isLight" />
          <div class="mascot-face-waves" :class="voice.faceState.value"><span></span><span></span><span></span></div>
        </div>
        <div class="voice-mascot-body">
          <div class="voice-mascot-status">{{ voice.started.value ? (voice.status.value || '') : 'Talk to Avanish' }}</div>
          <div class="voice-mascot-controls" :style="{ display: voice.started.value ? 'flex' : 'none' }">
            <button class="mascot-mic-btn" :class="{ muted: !voice.micOn.value }" :title="voice.micOn.value ? 'Mute' : 'Unmute'" @click.stop="voice.toggleMic()">
              <svg v-if="!voice.micOn.value" class="mic-off-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.12 1.49-.35 2.17"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              <svg v-else class="mic-on-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
            <button class="mascot-stop-btn" title="End" @click.stop="voice.stop()">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="voice-mascot-action-display" :class="{ active: voice.actionCard.value }">
        <div v-if="voice.actionCard.value" class="mascot-action-card">
          <span class="mascot-action-icon">{{ voice.actionCard.value.icon }}</span>
          <span class="mascot-action-text">{{ voice.actionCard.value.text }}</span>
          <span v-if="voice.actionCard.value.sub" class="mascot-action-sub">{{ voice.actionCard.value.sub }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
