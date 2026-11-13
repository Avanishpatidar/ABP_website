<script setup lang="ts">
import { nav, EMAIL } from '~/data/site'

const { theme, toggle, init: initTheme } = useTheme()
const { mode, set: setMode, init: initMode } = useMode()
const route = useRoute()
const open = ref(false)

// "On this page": every <h2 id> in the current page, with the one in view marked.
const toc = ref<{ id: string; text: string }[]>([])
const current = ref('')
let io: IntersectionObserver | null = null

const buildToc = () => {
  io?.disconnect()
  const heads = Array.from(document.querySelectorAll<HTMLElement>('main h2[id]'))
  toc.value = heads.map(h => ({ id: h.id, text: h.textContent || '' }))
  current.value = heads[0]?.id || ''
  if (!heads.length) return
  io = new IntersectionObserver(
    entries => { for (const e of entries) if (e.isIntersecting) current.value = e.target.id },
    { rootMargin: '-20% 0px -65% 0px' }
  )
  heads.forEach(h => io!.observe(h))
}

onMounted(() => { initTheme(); initMode(); nextTick(buildToc) })
watch([() => route.path, mode], () => { open.value = false; nextTick(buildToc) }, { flush: 'post' })
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div class="shell">
    <header class="side" :class="{ open }">
      <NuxtLink to="/" class="brand"><span class="brand-mark" aria-hidden="true"></span><span class="brand-full">Avanish Patidar</span><span class="brand-short" aria-hidden="true">ABP</span></NuxtLink>

      <div class="side-right">
        <div class="mode" role="group" aria-label="Reading mode">
          <button type="button" :aria-pressed="mode === 'human'" @click="setMode('human')">Human</button>
          <button type="button" :aria-pressed="mode === 'agent'" @click="setMode('agent')">Agent</button>
        </div>
        <button type="button" class="menu-btn" :aria-expanded="open" aria-controls="site-nav" @click="open = !open">{{ open ? 'Close' : 'Menu' }}</button>
      </div>

      <nav id="site-nav" class="nav" aria-label="Main">
        <NuxtLink v-for="n in nav" :key="n.to" :to="n.to" :class="{ 'is-active': n.to !== '/' && route.path.startsWith(n.to) }">{{ n.label }}</NuxtLink>
      </nav>

      <nav v-if="toc.length && mode === 'human'" class="toc" aria-label="On this page">
        <span class="label">On this page</span>
        <a v-for="t in toc" :key="t.id" :href="`#${t.id}`" :class="{ 'is-current': current === t.id }">{{ t.text }}</a>
      </nav>

      <div class="side-foot">
        <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
        <button type="button" class="theme-btn" :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`" @click="toggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" /></svg>
          {{ theme === 'dark' ? 'Dark' : 'Light' }}
        </button>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <ClientOnly><AiDock /></ClientOnly>
  </div>
</template>
