<script setup lang="ts">
import { about, experience, stack, markdownFor, SITE_URL } from '~/data/site'
usePageSeo('/about')
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfilePage', url: `${SITE_URL}/about`, mainEntity: { '@id': `${SITE_URL}/#person` } })
  }]
})
</script>

<template>
  <ModeView :md="markdownFor('/about')">
    <h1>About</h1>
    <p v-for="p in about.intro" :key="p">{{ p }}</p>

    <h2>How I work</h2>
    <ul class="list">
      <li v-for="p in about.principles" :key="p.title"><strong>{{ p.title }}.</strong> <span>{{ p.text }}</span></li>
    </ul>

    <h2>Experience</h2>
    <template v-for="r in experience" :key="r.title + r.org">
      <h3>
        {{ r.title }},
        <a v-if="r.url" :href="r.url" target="_blank" rel="noopener">{{ r.org }}</a><template v-else>{{ r.org }}</template>
        <small>{{ r.time }}</small>
      </h3>
      <ul class="list tight"><li v-for="pt in r.points" :key="pt"><span>{{ pt }}</span></li></ul>
    </template>

    <h2>Stack</h2>
    <ul class="list tight">
      <li v-for="(items, group) in stack" :key="group"><strong>{{ group }}:</strong> <span>{{ items.join(', ') }}</span></li>
    </ul>
  </ModeView>
</template>
