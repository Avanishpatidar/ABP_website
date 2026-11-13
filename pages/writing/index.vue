<script setup lang="ts">
import { hiringantPosts, ownPosts, HIRINGANT_AUTHOR_URL, markdownFor } from '~/data/site'
usePageSeo('/writing')
</script>

<template>
  <ModeView :md="markdownFor('/writing')">
    <p class="eyebrow">Writing</p>
    <h1>Notes from building, and guides for people looking for work.</h1>
    <p class="lede">Most of what I write now goes on the HiringAnt blog. Older essays live here.</p>

    <section>
      <span class="label">01</span>
      <h2 id="hiringant">On the HiringAnt blog</h2>
      <div class="posts">
        <a v-for="p in hiringantPosts" :key="p.url" :href="p.url" target="_blank" rel="noopener" class="post">
          <span class="post-meta">{{ p.date }}</span>
          <span class="post-title">{{ p.title }}</span>
          <span class="post-sum">{{ p.summary }}</span>
        </a>
      </div>
      <a :href="HIRINGANT_AUTHOR_URL" target="_blank" rel="noopener" class="more arrow">All my HiringAnt posts</a>
    </section>

    <section>
      <span class="label">02</span>
      <h2 id="essays">Essays on this site</h2>
      <div class="posts">
        <NuxtLink v-for="p in ownPosts" :key="p.slug" :to="`/writing/${p.slug}`" class="post">
          <span class="post-meta">{{ p.date }}</span>
          <span class="post-title">{{ p.title }}</span>
          <span class="post-sum">{{ p.summary }}</span>
        </NuxtLink>
      </div>
    </section>
  </ModeView>
</template>
