import { nav, ownPosts, SITE_URL } from '../../data/site'

export default defineEventHandler((event) => {
  const urls = [
    ...nav.map(n => ({ loc: SITE_URL + (n.to === '/' ? '/' : n.to), priority: n.to === '/' ? '1.0' : '0.8' })),
    ...ownPosts.map(p => ({ loc: `${SITE_URL}/writing/${p.slug}`, priority: '0.6', lastmod: p.iso }))
  ]
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(u => `  <url><loc>${u.loc}</loc>${'lastmod' in u ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`)
    .join('\n')}\n</urlset>\n`
})
