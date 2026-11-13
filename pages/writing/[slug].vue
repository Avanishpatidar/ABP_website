<script setup lang="ts">
import { marked } from 'marked'
import { ownPosts, profile, SITE_URL } from '~/data/site'

// Posts are markdown files in /posts, bundled at build time.
const files = import.meta.glob('~/posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const route = useRoute()
const slug = String(route.params.slug)
const post = ownPosts.find(p => p.slug === slug)
const raw = Object.entries(files).find(([path]) => path.endsWith(`/${slug}.md`))?.[1]
if (!post || !raw) throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })

const html = marked.parse(raw, { async: false }) as string
const url = `${SITE_URL}/writing/${slug}`

usePageSeo(`/writing/${slug}`, { title: `${post.title} | ${profile.name}`, description: post.summary, type: 'article' })
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.summary,
      datePublished: post.iso, dateModified: post.iso, image: `${SITE_URL}/images/og.jpg`, publisher: { '@id': `${SITE_URL}/#person` }, url, mainEntityOfPage: url, author: { '@id': `${SITE_URL}/#person` }
    })
  }]
})
</script>

<template>
  <ModeView :md="raw!">
    <article class="article" v-html="html"></article>
  </ModeView>
</template>
