// Light / dark theme. Every visit starts on the system's setting. The toggle
// switches between light and dark for the rest of that visit only (kept in
// sessionStorage and applied before first paint by the inline script in
// nuxt.config.ts), so a new visit follows the system again.
export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  const init = () => {
    if (!import.meta.client) return
    const set = document.documentElement.dataset.theme
    theme.value = set === 'dark' || set === 'light'
      ? set
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme.value
    try { sessionStorage.setItem('theme', theme.value) } catch {}
  }

  return { theme, toggle, init }
}
