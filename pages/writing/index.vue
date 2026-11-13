<script setup lang="ts">
import { hiringantPosts, ownPosts, HIRINGANT_AUTHOR_URL, markdownFor } from '~/data/site'
usePageSeo('/writing')
</script>

<template>
  <ModeView :md="markdownFor('/writing')">
    <h1>Writing</h1>
    <p>Most of what I write now goes on the HiringAnt blog. Older essays live here.</p>

    <h2>On the HiringAnt blog</h2>
    <ul class="list">
      <li v-for="p in hiringantPosts" :key="p.url">
        <a :href="p.url" target="_blank" rel="noopener">{{ p.title }}</a>
        <span class="small"> · {{ p.date }}</span>
      </li>
      <li><a :href="HIRINGANT_AUTHOR_URL" target="_blank" rel="noopener">All my HiringAnt posts</a></li>
    </ul>

    <h2>Essays</h2>
    <ul class="list">
      <li v-for="p in ownPosts" :key="p.slug">
        <NuxtLink :to="`/writing/${p.slug}`">{{ p.title }}</NuxtLink>
        <span class="small"> · {{ p.date }}</span>
      </li>
    </ul>
  </ModeView>
</template>
