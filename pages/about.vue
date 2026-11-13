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
    <p class="eyebrow">About</p>
    <h1>From GenAI intern to co-founder and CTO in under a year.</h1>
    <div class="prose lede">
      <p v-for="p in about.intro" :key="p">{{ p }}</p>
    </div>

    <section>
      <span class="label">01</span>
      <h2 id="how-i-work">How I work</h2>
      <div class="grid2">
        <div v-for="p in about.principles" :key="p.title" class="cell">
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </div>
      </div>
    </section>

    <section>
      <span class="label">02</span>
      <h2 id="experience">Experience</h2>
      <div class="rows">
        <div v-for="r in experience" :key="r.title + r.org" class="row">
          <div class="row-head">
            {{ r.title }}
            <span class="row-meta">
              <a v-if="r.url" :href="r.url" target="_blank" rel="noopener">{{ r.org }}</a><template v-else>{{ r.org }}</template>
              <br />{{ r.time }}
            </span>
          </div>
          <ul><li v-for="pt in r.points" :key="pt">{{ pt }}</li></ul>
        </div>
      </div>
    </section>

    <section>
      <span class="label">03</span>
      <h2 id="stack">Stack</h2>
      <div class="rows">
        <div v-for="(items, group) in stack" :key="group" class="row">
          <div class="row-head">{{ group }}</div>
          <div class="tags"><span v-for="i in items" :key="i">{{ i }}</span></div>
        </div>
      </div>
    </section>

    <ContactBlock title="Want the longer version?" text="Ask my AI twin anything about my work, or write to me directly." />
  </ModeView>
</template>
