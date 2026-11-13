import { EMAIL, SITE_URL, pages, profile, ownPosts } from './data/site'

const home = pages['/']
const OG_IMAGE = `${SITE_URL}/images/og-image.png`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  experimental: { appManifest: false },

  css: ['~/assets/css/main.css'],

  // GEMINI_API_KEY stays server-only; never exposed to the client.
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || ''
  },

  routeRules: {
    // Old URLs keep working.
    '/blogs': { redirect: { to: '/writing', statusCode: 301 } },
    '/writings': { redirect: { to: '/writing', statusCode: 301 } },
    '/experience': { redirect: { to: '/about', statusCode: 301 } },
    '/contact': { redirect: { to: '/services', statusCode: 301 } },
    // Content pages are static; build them once.
    '/': { prerender: true },
    '/about': { prerender: true },
    '/work': { prerender: true },
    '/services': { prerender: true },
    '/writing': { prerender: true },
    '/writing/**': { prerender: true },
    // Security headers on every route (microphone=self is required for voice).
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'SAMEORIGIN',
        'Permissions-Policy': 'microphone=(self), camera=(), geolocation=()'
      }
    }
  },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/', '/about', '/work', '/services', '/writing', ...ownPosts.map(p => `/writing/${p.slug}`)]
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: home.title,
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: home.description },
        { name: 'author', content: profile.name },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
        { property: 'og:site_name', content: profile.name },
        { property: 'og:locale', content: 'en_IN' },
        { property: 'og:image', content: OG_IMAGE },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: OG_IMAGE },
        { name: 'theme-color', content: '#faf9f6', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0f0f0d', media: '(prefers-color-scheme: dark)' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'alternate', type: 'text/plain', title: 'Site as markdown for agents', href: '/llms.txt' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap' }
      ],
      script: [
        // Apply a saved theme before first paint so the page never flashes.
        { innerHTML: `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`, tagPosition: 'head' },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                '@id': `${SITE_URL}/#person`,
                name: profile.name,
                alternateName: profile.aka,
                url: SITE_URL,
                image: OG_IMAGE,
                jobTitle: 'AI Product Engineer, CTO',
                description: home.description,
                worksFor: [
                  { '@type': 'Organization', name: 'HiringAnt', url: 'https://hiringant.ai' },
                  { '@type': 'Organization', name: 'RentPrompts', url: 'https://rentprompts.com' }
                ],
                knowsAbout: ['AI agents', 'Agentic AI', 'Multi-agent systems', 'Voice AI', 'RAG', 'FastAPI', 'Next.js', 'AI product engineering'],
                address: { '@type': 'PostalAddress', addressLocality: 'Indore', addressRegion: 'Madhya Pradesh', addressCountry: 'IN' },
                sameAs: [...profile.links.map(l => l.url), 'https://hiringant.ai/blog/author/avanish-patidar'],
                email: EMAIL
              },
              {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: SITE_URL,
                name: profile.name,
                publisher: { '@id': `${SITE_URL}/#person` }
              }
            ]
          })
        }
      ]
    }
  }
})
