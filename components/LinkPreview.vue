<script setup lang="ts">
import { previews } from '~/data/site'

// One floating card for the whole site. Hovering (or keyboard-focusing) any
// link to a site listed in `previews` shows its screenshot. Mouse and keyboard
// only: touch devices just follow the link.
const card = ref<{ img: string; title: string; note: string; host: string } | null>(null)
const pos = ref({ left: 0, top: 0, above: false })
const W = 320
const H = 250
let hideTimer: ReturnType<typeof setTimeout> | undefined

const lookup = (a: HTMLAnchorElement) => {
  let u: URL
  try { u = new URL(a.href) } catch { return null }
  if (u.origin === location.origin) return null
  const host = u.hostname.replace(/^www\./, '')
  if (host === 'github.com' && !/^\/Avanishpatidar\/?$/i.test(u.pathname)) return null
  if (host === 'hiringant.ai' && u.pathname.startsWith('/blog')) return null
  const p = previews[host]
  return p ? { ...p, host } : null
}

const show = (e: Event) => {
  const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null
  if (!a) return
  const p = lookup(a)
  if (!p) return
  clearTimeout(hideTimer)
  const r = a.getBoundingClientRect()
  const above = r.bottom + H + 16 > window.innerHeight && r.top > H + 16
  pos.value = {
    left: Math.max(12, Math.min(r.left, window.innerWidth - W - 12)),
    top: above ? r.top - H - 10 : r.bottom + 10,
    above
  }
  card.value = p
}
const hide = (e: Event) => {
  if (!(e.target as HTMLElement).closest?.('a[href]')) return
  hideTimer = setTimeout(() => { card.value = null }, 80)
}
const hideNow = () => { card.value = null }

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  document.addEventListener('mouseover', show)
  document.addEventListener('mouseout', hide)
  document.addEventListener('focusin', show)
  document.addEventListener('focusout', hide)
  window.addEventListener('scroll', hideNow, { passive: true })
  // Warm the images so the first hover is instant.
  const warm = () => Object.values(previews).forEach(p => { new Image().src = p.img })
  'requestIdleCallback' in window ? (window as any).requestIdleCallback(warm) : setTimeout(warm, 1500)
})
onBeforeUnmount(() => {
  document.removeEventListener('mouseover', show)
  document.removeEventListener('mouseout', hide)
  document.removeEventListener('focusin', show)
  document.removeEventListener('focusout', hide)
  window.removeEventListener('scroll', hideNow)
})
</script>

<template>
  <Transition name="pv">
    <div v-if="card" :key="card.host" class="pv" :style="{ left: pos.left + 'px', top: pos.top + 'px' }" aria-hidden="true">
      <img :src="card.img" alt="" width="320" height="200" />
      <div class="pv-text"><strong>{{ card.title }}</strong><span>{{ card.note }}</span><small>{{ card.host }}</small></div>
    </div>
  </Transition>
</template>
