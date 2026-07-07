<script setup lang="ts">
const interview = useInterview()
useHead({ title: 'Contact — Avanish Patidar', link: [{ rel: 'canonical', href: 'https://avanishpatidar.me/contact' }] })
</script>

<template>
  <section id="contact" class="section">
    <h2 class="section-title">Let's Build Something Amazing</h2>
    <p class="section-text">
      📍 Indore, India<br />
      📞 +91 76977 93284<br />
      ✉️ avanish.patidar07@gmail.com
    </p>

    <div class="main-buttons" style="flex-wrap: wrap; margin-top: 24px;">
      <a href="mailto:avanish.patidar07@gmail.com" class="view-button">Email me</a>
      <a href="https://wa.me/917697793284" target="_blank" rel="noopener" class="view-button">WhatsApp</a>
      <a href="https://www.linkedin.com/in/avanish-patidar-b3ba2b230/" target="_blank" rel="noopener" class="view-button">LinkedIn</a>
      <button class="view-button" @click="interview.startVoice()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
        Ask my AI twin
      </button>
    </div>
  </section>
</template>
