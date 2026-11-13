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
    <p class="eyebrow">Open to select projects</p>
    <h1>An AI product engineer who builds the whole thing.</h1>
    <p class="lede">I work with founders and small teams who need an AI product or agent shipped, not a slide about one. I have done it for my own company, so I know which parts decide whether users pay.</p>
    <div class="actions">
      <a class="btn primary" :href="`mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry')}`">Start a conversation</a>
      <NuxtLink class="btn" to="/work">See the work</NuxtLink>
    </div>

    <section>
      <span class="label">01</span>
      <h2 id="what-i-do">What I do</h2>
      <div class="grid2">
        <div v-for="s in services" :key="s.name" class="cell">
          <h3>{{ s.name }}</h3>
          <p>{{ s.text }}</p>
          <ul><li v-for="i in s.includes" :key="i">{{ i }}</li></ul>
        </div>
      </div>
    </section>

    <section>
      <span class="label">02</span>
      <h2 id="how-it-works">How it works</h2>
      <ol class="steps">
        <li v-for="s in howItWorks" :key="s.step"><div><strong>{{ s.step }}</strong><span>{{ s.text }}</span></div></li>
      </ol>
    </section>

    <ContactBlock title="Tell me what you are building" />
  </ModeView>
</template>
