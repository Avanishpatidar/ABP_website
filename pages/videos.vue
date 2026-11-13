<script setup lang="ts">
import { videoIntro, reels, reelGroups, youtube, YOUTUBE_URL, INSTAGRAM_URL, markdownFor } from '~/data/site'
usePageSeo('/videos')
</script>

<template>
  <ModeView :md="markdownFor('/videos')">
    <h1>Videos</h1>
    <p>{{ videoIntro }}</p>

    <template v-for="g in reelGroups" :key="g.kind">
      <h2>{{ g.title }}</h2>
      <p>{{ g.text }}</p>
      <ReelRow :reels="reels.filter(r => r.kind === g.kind)" />
    </template>
    <p class="small muted" style="margin-top: 14px">The AI and real reels are from <a :href="INSTAGRAM_URL" target="_blank" rel="noopener">HiringAnt on Instagram</a>; the animated ads are from <a href="https://www.instagram.com/rentprompts/" target="_blank" rel="noopener">RentPrompts</a>.</p>

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
