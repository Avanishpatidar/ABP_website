<script setup lang="ts">
import { products, builds, markdownFor } from '~/data/site'
usePageSeo('/work')
</script>

<template>
  <ModeView :md="markdownFor('/work')">
    <h1>Work</h1>
    <p>Three are live businesses. The rest are how I learned to build them.</p>

    <h2>Products</h2>
    <template v-for="p in products" :key="p.name">
      <h3><a :href="p.url" target="_blank" rel="noopener">{{ p.name }}</a> <small>{{ p.role }}</small></h3>
      <p>{{ p.summary }}</p>
      <ul v-if="p.points.length" class="list tight" style="margin-top: 10px">
        <li v-for="pt in p.points" :key="pt"><span>{{ pt }}</span></li>
      </ul>
      <p v-if="p.stack" class="muted small" style="margin-top: 8px">{{ p.stack }}</p>
    </template>

    <h2>More builds</h2>
    <ul class="list">
      <li v-for="b in builds" :key="b.name">
        <a v-if="b.url" :href="b.url" target="_blank" rel="noopener">{{ b.name }}</a><strong v-else>{{ b.name }}</strong>
        <span> · {{ b.text }}</span>
      </li>
    </ul>
  </ModeView>
</template>
