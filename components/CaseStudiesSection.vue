<script setup lang="ts">
import { caseStudies } from '~/data/caseStudies'

onMounted(async () => {
  try {
    const mermaid = (await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')).default
    const dark = !document.body.classList.contains('light-mode')
    mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral' })
    await nextTick()
    await mermaid.run({ nodes: document.querySelectorAll('#case-studies .mermaid') })
  } catch (e) { console.error('[mermaid]', e) }
})
</script>

<template>
  <section id="case-studies" class="section">
    <h2 class="section-title">Case Studies &amp; Architecture</h2>
    <p class="section-text" style="margin-bottom: 30px;">A look under the hood at how I design production-grade Agentic systems.</p>
    <div id="case-studies-container">
      <div v-for="s in caseStudies" :key="s.title" class="work-item" style="margin-bottom: 40px;">
        <div class="work-title" style="color: var(--highlight-color);">{{ s.title }}</div>
        <p class="section-text" style="font-size: 14px; margin-bottom: 20px;">
          <strong>Challenge:</strong> {{ s.challenge }}<br />
          <strong>Solution:</strong> {{ s.solution }}
        </p>
        <div class="mermaid" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">{{ s.mermaid }}</div>
      </div>
    </div>
  </section>
</template>
