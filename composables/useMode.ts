// Human / Agent reading mode. Human is the designed page; Agent is the same
// content as plain markdown, for people pasting it into an LLM and for agents.
export const useMode = () => {
  const mode = useState<'human' | 'agent'>('mode', () => 'human')

  const init = () => {
    if (!import.meta.client) return
    // ?view=agent opens the page straight in Agent mode, so the link can be shared.
    const q = new URLSearchParams(location.search).get('view')
    if (q === 'agent' || q === 'human') { mode.value = q; return }
    try { if (sessionStorage.getItem('mode') === 'agent') mode.value = 'agent' } catch {}
  }

  const set = (m: 'human' | 'agent') => {
    mode.value = m
    try { sessionStorage.setItem('mode', m) } catch {}
    const u = new URL(location.href)
    m === 'agent' ? u.searchParams.set('view', 'agent') : u.searchParams.delete('view')
    history.replaceState(history.state, '', u)
    window.scrollTo({ top: 0 })
  }

  return { mode, set, init }
}
