// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  // Global stylesheet — original rich design, recolored to monochrome.
  css: ['~/assets/css/styles.css', '~/assets/css/mascot.css'],

  // Resolve components by filename regardless of subfolder (no path prefix).
  components: [{ path: '~/components', pathPrefix: false }],

  // GEMINI_API_KEY stays server-only; never exposed to the client.
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || ''
  },

  routeRules: {
    // Legacy aliases from the old static site.
    '/blogs': { redirect: '/writing' },
    '/writings': { redirect: '/writing' },
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

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Avanish Patidar - GenAI Engineer & Full-Stack Developer',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'I design and lead production-grade Agentic AI systems. Currently Tech Lead at HiringAnt and Agentic AI Lead at RentPrompts. I bridge the gap between experimental LLMs and scalable business automation.' },
        { name: 'keywords', content: 'Agentic AI, Multi-Agent Systems, RAG, GenAI Engineer, Full-Stack Developer, Python, TypeScript, Next.js, AI Agents, LangChain, FastAPI, Avanish Patidar, Software Engineer, Indore' },
        { name: 'author', content: 'Avanish Patidar' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://avanishpatidar.me/' },
        { property: 'og:title', content: 'Avanish Patidar - GenAI Engineer & Full-Stack Developer' },
        { property: 'og:description', content: 'I design and lead production-grade Agentic AI systems. Currently Tech Lead at HiringAnt and Agentic AI Lead at RentPrompts.' },
        { property: 'og:image', content: 'https://avanishpatidar.me/images/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:site_name', content: 'Avanish Patidar Portfolio' },
        { property: 'og:locale', content: 'en_US' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Avanish Patidar - GenAI Engineer & Full-Stack Developer' },
        { name: 'twitter:description', content: 'I design and lead production-grade Agentic AI systems.' },
        { name: 'twitter:image', content: 'https://avanishpatidar.me/images/og-image.png' },
        { name: 'theme-color', content: '#000000' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://avanishpatidar.me/' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                '@id': 'https://avanishpatidar.me/#person',
                name: 'Avanish Patidar',
                alternateName: 'ABP',
                url: 'https://avanishpatidar.me',
                image: 'https://avanishpatidar.me/images/og-image.png',
                jobTitle: 'GenAI Engineer & Agentic AI Lead',
                worksFor: [
                  { '@type': 'Organization', name: 'HiringAnt', url: 'https://hiringant.ai' },
                  { '@type': 'Organization', name: 'RentPrompts', url: 'https://rentprompts.com' }
                ],
                address: { '@type': 'PostalAddress', addressLocality: 'Indore', addressCountry: 'IN' },
                sameAs: [
                  'https://github.com/Avanishpatidar',
                  'https://www.linkedin.com/in/avanish-patidar-b3ba2b230/',
                  'https://www.youtube.com/@error_by_night_'
                ],
                email: 'avanish.patidar07@gmail.com'
              },
              {
                '@type': 'WebSite',
                '@id': 'https://avanishpatidar.me/#website',
                url: 'https://avanishpatidar.me',
                name: 'Avanish Patidar Portfolio',
                publisher: { '@id': 'https://avanishpatidar.me/#person' }
              }
            ]
          })
        }
      ]
    }
  }
})
