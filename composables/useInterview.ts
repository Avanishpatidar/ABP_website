// Shared interview state so any page (e.g. the home hero) can open the chat,
// ask a question, or start voice — the AiDock component reacts to these.
// `state` (idle/listening/speaking) and `mouth` (0..1, live lip-sync amplitude)
// are kept in sync by the voice engine so the 3D mascot can mirror them.
export const useInterview = () => {
  const isOpen = useState('iv-open', () => false)
  const queued = useState<string | null>('iv-queued', () => null)
  const wantVoice = useState('iv-wantVoice', () => false)
  const state = useState<'idle' | 'listening' | 'speaking'>('iv-state', () => 'idle')
  const mouth = useState('iv-mouth', () => 0)

  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  const ask = (q: string) => { queued.value = q; isOpen.value = true }
  const startVoice = () => { wantVoice.value = true }

  return { isOpen, queued, wantVoice, state, mouth, open, close, ask, startVoice }
}
