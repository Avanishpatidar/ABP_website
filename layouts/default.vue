<script setup lang="ts">
import { nav, EMAIL, profile } from '~/data/site'

const { theme, toggle, init: initTheme } = useTheme()
const { mode, set: setMode, init: initMode } = useMode()
const interview = useInterview()
const route = useRoute()
const links = nav.filter(n => n.to !== '/')

onMounted(() => { initTheme(); initMode() })
</script>

<template>
  <div class="wrap">
    <header class="top">
      <NuxtLink to="/" class="name">{{ profile.name }}</NuxtLink>
      <div class="tools">
        <div class="mode" role="group" aria-label="Reading mode">
          <button type="button" :aria-pressed="mode === 'human'" @click="setMode('human')">Human</button>
          <button type="button" :aria-pressed="mode === 'agent'" @click="setMode('agent')">Agent</button>
        </div>
        <button type="button" class="theme-btn" :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`" @click="toggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" /></svg>
        </button>
      </div>
      <nav class="nav" aria-label="Main">
        <NuxtLink v-for="n in links" :key="n.to" :to="n.to" :class="{ 'is-active': route.path.startsWith(n.to) }">{{ n.label }}</NuxtLink>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer class="foot">
      <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
      <a v-for="l in profile.links" :key="l.url" :href="l.url" target="_blank" rel="noopener me">{{ l.label }}</a>
      <button type="button" class="talk" @click="interview.open()">Ask my AI twin (it has jokes)</button>
    </footer>

    <ClientOnly><AiDock /><LinkPreview /></ClientOnly>
  </div>
</template>
