// Shared interview state so any page (e.g. the home hero) can open the chat,
// ask a question, or start voice — the AiDock component reacts to these.
export const useInterview = () => {
  const isOpen = useState('iv-open', () => false)
  const queued = useState<string | null>('iv-queued', () => null)
  const wantVoice = useState('iv-wantVoice', () => false)
  // Mascot visual state, kept in sync by AiDock so the hero avatar can mirror it.
  const state = useState<'idle' | 'listening' | 'speaking'>('iv-state', () => 'idle')

  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  const ask = (q: string) => { queued.value = q; isOpen.value = true }
  const startVoice = () => { wantVoice.value = true }

  return { isOpen, queued, wantVoice, state, open, close, ask, startVoice }
}
