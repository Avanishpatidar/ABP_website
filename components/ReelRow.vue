<script setup lang="ts">
import type { Reel } from '~/data/site'
// A sideways-scrolling row of playable Instagram reels. The frame crops
// Instagram's header and footer so only the video shows.
defineProps<{ reels: Reel[] }>()
</script>

<template>
  <div class="reels">
    <figure v-for="r in reels" :key="r.id" class="reel">
      <div class="reel-frame">
        <iframe :src="`https://www.instagram.com/reel/${r.id}/embed/`" :title="r.title" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen scrolling="no"></iframe>
      </div>
      <figcaption><strong>{{ r.title }}</strong> <span v-if="r.views" class="muted">· {{ r.views }}</span></figcaption>
    </figure>
  </div>
</template>
