<script setup lang="ts">
import type { VoiceMessage } from '~/composables/useVoice'
import { EMAIL } from '~/data/site'

// "Ask my AI twin": a text chat that streams from /api/chat, plus live voice.
const interview = useInterview()
const open = interview.isOpen

const history = ref<VoiceMessage[]>([])
const remember = (m: VoiceMessage) => { history.value = [...history.value, m].slice(-30) }
const voice = useVoice(remember)

interface Msg { id: number; role: 'user' | 'bot' | 'system'; text: string }
const messages = ref<Msg[]>([])
const input = ref('')
const busy = ref(false)
const logEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
let id = 0

const SUGGESTIONS = ['What did you build at HiringAnt?', 'What is your stack?', 'Can you help with my project?']

const scrollDown = () => nextTick(() => { if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight })

// Escape first, then allow a small, safe subset of markdown.
const md = (t: string) => t
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/```([\s\S]*?)```/g, (_m, c) => `<pre><code>${c.trim()}</code></pre>`)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(((?:https?:|mailto:)[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
const stripTool = (t: string) => t.replace(/:::JSON[\s\S]*?:::/g, '').trim()

async function send(text: string) {
  text = text.trim()
  if (!text || busy.value) return
  messages.value.push({ id: ++id, role: 'user', text })
  remember({ role: 'user', text })
  input.value = ''
  busy.value = true
  const bot = reactive<Msg>({ id: ++id, role: 'bot', text: '' })
  messages.value.push(bot)
  scrollDown()
  let full = ''
  try {
    const res = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.value.slice(-10) })
    })
    if (!res.ok || !res.body) throw new Error(`chat ${res.status}`)
    const reader = res.body.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      for (const line of dec.decode(value, { stream: true }).split('\n')) {
        if (!line.startsWith('data: ') || line.slice(6) === '[DONE]') continue
        try { const d = JSON.parse(line.slice(6)); if (d.text) { full += d.text; bot.text = stripTool(full); scrollDown() } } catch {}
      }
    }
    if (!full) throw new Error('empty')
    remember({ role: 'model', text: full })
    const tool = full.match(/:::JSON\s*({[\s\S]*?})\s*:::/)
    if (tool) {
      try {
        const t = JSON.parse(tool[1])
        if (t.tool === 'send_email') {
          const href = `mailto:${EMAIL}?subject=${encodeURIComponent(t.subject || '')}&body=${encodeURIComponent(t.body || '')}`
          messages.value.push({ id: ++id, role: 'system', text: `[Open this email in your mail app](${href})` })
        }
      } catch {}
    }
  } catch (e) {
    bot.text = `I could not answer just now. You can email Avanish at ${EMAIL}.`
    console.error('[chat]', e)
  } finally { busy.value = false; scrollDown() }
}

const close = () => { open.value = false }
watch(open, (v) => { if (v) { scrollDown(); nextTick(() => inputEl.value?.focus()) } })
watch(() => interview.queued.value, (q) => { if (q) { open.value = true; send(q); interview.queued.value = null } })
watch(() => interview.wantVoice.value, (w) => { if (w) { open.value = true; voice.start(true); interview.wantVoice.value = false } })
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open.value) close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); voice.stop() })
</script>

<template>
  <button v-if="!open" type="button" class="twin-fab" @click="open = true"><i aria-hidden="true"></i>Ask my AI twin</button>

  <div v-else class="twin" role="dialog" aria-label="Chat with Avanish's AI twin">
    <div class="twin-head">
      <div><strong>Avanish's AI twin</strong><small>Answers as me. It can be wrong.</small></div>
      <div>
        <button type="button" class="icon-btn" :class="{ on: voice.started.value }" :aria-label="voice.started.value ? 'End voice call' : 'Talk by voice'" @click="voice.started.value ? voice.stop() : voice.start(true)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v4" /></svg>
        </button>
        <button type="button" class="icon-btn" aria-label="Close chat" @click="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </div>

    <div ref="logEl" class="twin-log" aria-live="polite">
      <div v-if="!messages.length" class="twin-empty">
        Ask about my work, my stack or whether I can help with your project.
        <div><button v-for="s in SUGGESTIONS" :key="s" type="button" class="chip" @click="send(s)">{{ s }}</button></div>
      </div>
      <div v-for="m in messages" :key="m.id" class="msg" :class="m.role" v-html="md(m.text) || '…'"></div>
    </div>

    <div v-if="voice.started.value" class="voice-bar">
      <span class="voice-dot" :class="voice.faceState.value" aria-hidden="true"></span>
      <span style="flex: 1">{{ voice.status.value || 'Voice call' }}</span>
      <button type="button" class="chip" @click="voice.toggleMic()">{{ voice.micOn.value ? 'Mute' : 'Unmute' }}</button>
      <button type="button" class="chip" @click="voice.stop()">End</button>
    </div>

    <form class="twin-form" @submit.prevent="send(input)">
      <input ref="inputEl" v-model="input" type="text" placeholder="Ask a question" aria-label="Your question" autocomplete="off" maxlength="2000" />
      <button type="submit" :disabled="busy">Send</button>
    </form>
  </div>
</template>
