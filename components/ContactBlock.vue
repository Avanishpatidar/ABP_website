<script setup lang="ts">
import { EMAIL, profile } from '~/data/site'
defineProps<{ title?: string; text?: string }>()
</script>

<template>
  <aside class="contact" aria-labelledby="contact-title">
    <h2 id="contact-title">{{ title || 'Have something to build?' }}</h2>
    <p>{{ text || 'Tell me what you are trying to do and what is in the way. A paragraph is enough. I read every email myself.' }}</p>
    <a class="email" :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
    <div class="links">
      <a v-for="l in profile.links" :key="l.url" :href="l.url" target="_blank" rel="noopener me">{{ l.label }}</a>
    </div>
  </aside>
</template>
