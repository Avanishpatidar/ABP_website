<script setup lang="ts">
import { services, howItWorks, markdownFor, EMAIL, SITE_URL } from '~/data/site'
usePageSeo('/services')
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: services.map((s, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Service', name: s.name, description: s.text, provider: { '@id': `${SITE_URL}/#person` }, areaServed: 'Worldwide' }
      }))
    })
  }]
})
</script>

<template>
  <ModeView :md="markdownFor('/services')">
    <h1>Work with me</h1>
    <p>
      I work with founders and small teams who need an AI product or agent shipped, not a slide about one. I have done
      it for my own company, so I know which parts decide whether users pay.
    </p>
    <p>To start, write to <a :href="`mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry')}`">{{ EMAIL }}</a>.</p>

    <h2>What I do</h2>
    <template v-for="s in services" :key="s.name">
      <h3>{{ s.name }}</h3>
      <p>{{ s.text }}</p>
      <ul class="list tight" style="margin-top: 10px"><li v-for="i in s.includes" :key="i"><span>{{ i }}</span></li></ul>
    </template>

    <h2>How it works</h2>
    <ol class="list">
      <li v-for="s in howItWorks" :key="s.step"><strong>{{ s.step }}.</strong> <span class="muted">{{ s.text }}</span></li>
    </ol>
  </ModeView>
</template>
