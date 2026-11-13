// Light / dark theme. Follows the system until the visitor picks one; the
// choice is saved and applied before first paint by the inline script in
// nuxt.config.ts (data-theme on <html>).
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
    try { localStorage.setItem('theme', theme.value) } catch {}
  }

  return { theme, toggle, init }
}
