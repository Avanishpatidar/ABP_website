import { fullMarkdown } from '../../data/site'

// The whole site as one markdown file, for agents and LLMs.
export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return fullMarkdown()
})
