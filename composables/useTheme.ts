// Dark (default) / light theme, persisted to localStorage.
// Original stylesheet targets `body.light-mode`.
export const useTheme = () => {
  const isLight = useState('isLight', () => false)

  const applyClass = () => {
    if (import.meta.client) document.body.classList.toggle('light-mode', isLight.value)
  }

  const init = () => {
    if (!import.meta.client) return
    isLight.value = localStorage.getItem('theme') === 'light'
    applyClass()
  }

  const toggle = () => {
    isLight.value = !isLight.value
    applyClass()
    if (import.meta.client) localStorage.setItem('theme', isLight.value ? 'light' : 'dark')
  }

  return { isLight, toggle, init }
}
