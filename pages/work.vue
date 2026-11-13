<script setup lang="ts">
import { products, builds, markdownFor } from '~/data/site'
usePageSeo('/work')
</script>

<template>
  <ModeView :md="markdownFor('/work')">
    <p class="eyebrow">Work</p>
    <h1>Products I have built, with links you can open.</h1>
    <p class="lede">Three are live businesses. The rest are how I learned to build them.</p>

    <section>
      <span class="label">01</span>
      <h2 id="products">Products</h2>
      <div class="rows">
        <div v-for="p in products" :key="p.name" class="row">
          <div class="row-head">
            <a :href="p.url" target="_blank" rel="noopener" class="arrow">{{ p.name }}</a>
            <span class="row-meta">{{ p.role }}</span>
          </div>
          <div>
            <p class="strong">{{ p.summary }}</p>
            <ul v-if="p.points.length"><li v-for="pt in p.points" :key="pt">{{ pt }}</li></ul>
            <p v-if="p.stack" class="stackline">{{ p.stack }}</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <span class="label">02</span>
      <h2 id="more-builds">More builds</h2>
      <div class="rows">
        <div v-for="b in builds" :key="b.name" class="row">
          <div class="row-head">
            <a v-if="b.url" :href="b.url" target="_blank" rel="noopener" class="arrow">{{ b.name }}</a>
            <template v-else>{{ b.name }}</template>
          </div>
          <p>{{ b.text }}</p>
        </div>
      </div>
    </section>

    <ContactBlock />
  </ModeView>
</template>
