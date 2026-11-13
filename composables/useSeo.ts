import { pages, SITE_URL } from '~/data/site'

// Title, description, canonical and social tags for a page, from data/site.ts.
export const usePageSeo = (path: string, override?: { title: string; description: string; type?: string }) => {
  const meta = override || pages[path]
  const url = SITE_URL + (path === '/' ? '/' : path)
  useHead({ title: meta.title, link: [{ rel: 'canonical', href: url }] })
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
