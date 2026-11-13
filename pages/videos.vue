<script setup lang="ts">
import { videoIntro, reels, youtube, YOUTUBE_URL, markdownFor } from '~/data/site'
usePageSeo('/videos')
</script>

<template>
  <ModeView :md="markdownFor('/videos')">
    <h1>Videos</h1>
    <p>{{ videoIntro }}</p>

    <h2 v-if="reels.length">Ads and reels</h2>
    <div v-if="reels.length" class="reels">
      <figure v-for="r in reels" :key="r.id" class="reel">
        <iframe :src="`https://www.instagram.com/reel/${r.id}/embed/`" :title="r.title" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen scrolling="no"></iframe>
        <figcaption><strong>{{ r.title }}</strong> <span class="muted">· {{ r.note }}</span></figcaption>
      </figure>
    </div>

    <h2>Error by Night</h2>
    <p>
      My <a :href="YOUTUBE_URL" target="_blank" rel="noopener me">YouTube channel</a>, 11.9K subscribers. I plan, record and
      edit every tutorial.
    </p>
    <div class="videos">
      <figure v-for="v in youtube" :key="v.id" class="video">
        <iframe :src="`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`" :title="v.title" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>
        <figcaption><strong>{{ v.title }}</strong> <span class="muted">· {{ v.views }}</span></figcaption>
      </figure>
    </div>
  </ModeView>
</template>
