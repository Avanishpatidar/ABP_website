import { markdownFor, markdownPaths } from '../../data/site'

// Serves every content page as markdown at <path>.md (and / at /index.md), so
// AI agents can read a page without parsing HTML.
export default defineEventHandler((event) => {
  const path = (event.path || '').split('?')[0]
  if (!path.endsWith('.md')) return
  const page = path === '/index.md' ? '/' : path.slice(0, -3)
  if (!markdownPaths.includes(page)) return
  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  return markdownFor(page) + '\n'
})
