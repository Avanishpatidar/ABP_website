<script setup lang="ts">
import { marked } from 'marked'
import { blogPosts, type BlogPost } from '~/data/blogPosts'

useHead({
  title: 'Writing — Avanish Patidar',
  link: [{ rel: 'canonical', href: 'https://avanishpatidar.me/writing' }],
  meta: [{ name: 'description', content: 'Essays on AI agents, agentic systems, and modern software engineering.' }]
})

const active = ref<BlogPost | null>(null)
const html = ref('')
const loading = ref(false)

async function openPost(post: BlogPost) {
  active.value = post; loading.value = true; html.value = ''
  try {
    const raw = await $fetch<string>(`/blog/posts/${post.slug}.md`, { responseType: 'text' })
    html.value = await marked.parse(raw)
  } catch (e) { html.value = '<p>Sorry, this post could not be loaded.</p>'; console.error('[blog]', e) }
  finally { loading.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }) }
}
const back = () => { active.value = null; html.value = '' }
</script>

<template>
  <section class="section">
    <template v-if="!active">
      <h1 class="section-title">Blogs</h1>
      <p class="section-text">A collection of my thoughts, tutorials, and insights on technology, programming and fun :)</p>
      <div id="blog-posts-container">
        <div v-for="post in blogPosts" :key="post.slug" class="blog-card" @click="openPost(post)">
          <div class="blog-card-date">{{ post.date }}</div>
          <h3 class="blog-card-title">{{ post.title }}</h3>
          <p class="blog-card-summary">{{ post.summary }}</p>
          <div class="blog-card-link">
            Read Article
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <button class="view-button" style="margin-bottom: 30px;" @click="back">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/></svg>
        Back to Posts
      </button>
      <div v-if="loading" class="section-text">Loading…</div>
      <div v-else class="blog-content" v-html="html"></div>
    </template>
  </section>
</template>
