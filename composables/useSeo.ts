import { pages, SITE_URL } from '~/data/site'

// Title, description, canonical and social tags for a page, from data/site.ts.
export const usePageSeo = (path: string, override?: { title: string; description: string; type?: string }) => {
  const meta = override || pages[path]
  const url = SITE_URL + (path === '/' ? '/' : path)
  // Each content page has a markdown twin at <path>.md for AI agents.
  const md = override ? null : SITE_URL + (path === '/' ? '/index.md' : `${path}.md`)
  useHead({
    title: meta.title,
    link: [
      { rel: 'canonical', href: url },
      ...(md ? [{ rel: 'alternate', type: 'text/markdown', href: md, title: 'This page as markdown' }] : [])
    ]
  })
  useSeoMeta({
    description: meta.description,
    ogTitle: meta.title,
    ogDescription: meta.description,
    ogUrl: url,
    ogType: (override?.type as any) || 'website',
    twitterTitle: meta.title,
    twitterDescription: meta.description
  })
}
