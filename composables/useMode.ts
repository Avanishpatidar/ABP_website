// Human / Agent reading mode. Human is the designed page; Agent is the same
// content as plain markdown, for people pasting it into an LLM and for agents.
export const useMode = () => {
  const mode = useState<'human' | 'agent'>('mode', () => 'human')

  const init = () => {
    if (!import.meta.client) return
    try { if (sessionStorage.getItem('mode') === 'agent') mode.value = 'agent' } catch {}
  }

  const set = (m: 'human' | 'agent') => {
    mode.value = m
    try { sessionStorage.setItem('mode', m) } catch {}
    window.scrollTo({ top: 0 })
  }

  return { mode, set, init }
}
