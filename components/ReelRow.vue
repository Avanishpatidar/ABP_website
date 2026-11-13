<script setup lang="ts">
import type { Reel } from '~/data/site'
// A sideways-scrolling row of playable Instagram reels. Each frame crops
// Instagram's header and footer so only the video shows. Instagram tells the
// page how tall each embed is, and the frame is sized from that.
defineProps<{ reels: Reel[] }>()

const HEADER = 54 // Instagram's profile bar above the video
const CHROME = 208 // header plus the likes / comments footer, at this width
const row = ref<HTMLElement | null>(null)

const onMessage = (e: MessageEvent) => {
  if (!/(^|\.)instagram\.com$/.test(new URL(e.origin).hostname) || !row.value) return
  let d: any = e.data
  try { if (typeof d === 'string') d = JSON.parse(d) } catch { return }
  const h = d?.type === 'MEASURE' && Number(d.details?.height)
  if (!h) return
  for (const f of row.value.querySelectorAll('iframe')) {
    if (f.contentWindow === e.source) (f.parentElement as HTMLElement).style.height = `${Math.max(140, h - CHROME)}px`
  }
}

// Slow automatic scroll, back and forth. It runs only while the row is on
// screen and stops for good the moment someone touches, hovers or focuses it,
// so it never fights the visitor. Off entirely for reduced-motion.
let raf = 0
let dir = 1
let visible = false
let stopped = false
let io: IntersectionObserver | null = null
let pos = 0
const step = () => {
  const el = row.value
  if (el && visible && !stopped) {
    const max = el.scrollWidth - el.clientWidth
    if (max > 4) {
      pos = Math.max(0, Math.min(max, pos + dir * 0.45))
      el.scrollLeft = pos
      if (pos >= max) dir = -1
      else if (pos <= 0) dir = 1
    }
  }
  raf = requestAnimationFrame(step)
}
const pause = () => { stopped = true }
const resume = () => { if (row.value) pos = row.value.scrollLeft; stopped = false }

onMounted(() => {
  window.addEventListener('message', onMessage)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !row.value) return
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.25 })
  io.observe(row.value)
  // The iframes swallow pointer events, so watch the window losing focus to one of ours.
  window.addEventListener('blur', onBlur)
  raf = requestAnimationFrame(step)
})
const onBlur = () => { if (row.value?.contains(document.activeElement)) stopped = true }
onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  window.removeEventListener('blur', onBlur)
  cancelAnimationFrame(raf)
  io?.disconnect()
})
</script>

<template>
  <div ref="row" class="reels" @pointerenter="pause" @pointerleave="resume" @touchstart.passive="pause" @focusin="pause">
    <figure v-for="r in reels" :key="r.id" class="reel">
      <div class="reel-frame">
        <iframe :src="`https://www.instagram.com/reel/${r.id}/embed/`" :title="r.title || 'Reel'" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen scrolling="no" :style="{ marginTop: `-${HEADER}px` }"></iframe>
      </div>
      <figcaption v-if="r.title || r.views"><strong v-if="r.title">{{ r.title }}</strong><span v-if="r.title && r.views" class="muted"> · </span><span v-if="r.views" class="muted">{{ r.views }}</span></figcaption>
    </figure>
  </div>
</template>
