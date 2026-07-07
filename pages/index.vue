<script setup lang="ts">
const interview = useInterview()
const { isLight } = useTheme()
useHead({ title: 'Avanish Patidar — GenAI Engineer & Agentic AI Lead' })

const heroState = computed(() => interview.state.value)
const isLive = computed(() => interview.state.value !== 'idle')
const prompts = ['Why should we hire you?', 'Walk me through TradeIQ', "What's your stack?"]
</script>

<template>
  <section id="about" class="section" aria-label="About Me">
    <div class="about-content">
      <h1 class="section-title main-name">
        Avanish Patidar
        <span class="aka-text">AKA ABP</span>
      </h1>

      <!-- Prominent 3D interview mascot -->
      <div class="mascot-hero" :class="{ 'is-live': isLive }">
        <MascotAvatar :state="heroState" :dark="!isLight" />
      </div>
      <p class="mascot-cap">Ask my AI twin anything — it answers as me, in my voice.</p>
      <div class="ask-row">
        <button v-for="p in prompts" :key="p" class="ask-chip" @click="interview.ask(p)">{{ p }}</button>
      </div>

      <div class="main-buttons" style="flex-wrap: wrap; justify-content: center; margin-top: 8px;">
        <button class="view-button" @click="interview.startVoice()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
          Interview me
        </button>
        <a href="https://drive.google.com/file/d/1iLQ3DnJYuzxreQKVlS1HIICkkTJBVbgx/view?usp=sharing" download class="view-button btn-resume">
          <svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Résumé
        </a>
      </div>

      <div class="bio-container">
        <p class="role-badge">Agentic AI Lead · Tech Lead</p>
        <p class="section-text">
          I design and lead production-grade <strong>Agentic AI</strong> systems.
          Currently <strong>Tech Lead at HiringAnt</strong> and <strong>Agentic AI Lead at RentPrompts</strong>.
          I bridge the gap between experimental LLMs and scalable business automation.
        </p>
      </div>

      <div class="strengths-grid">
        <div class="strength-card">
          <div class="strength-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          </div>
          <h3>AI Engineering</h3>
          <p>Multi-tool AI agents, RAG pipelines, workflow automation (n8n), email automation agents.</p>
        </div>
        <div class="strength-card">
          <div class="strength-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <h3>Full-Stack Dev</h3>
          <p>Next.js apps (production-grade), Payload CMS, FastAPI backends, real-time WebSockets.</p>
        </div>
      </div>

      <p class="section-text" style="margin-top: 30px;">
        I enjoy building real-world systems that make work faster, smarter, and more automated.
        Explore my <NuxtLink to="/work">work</NuxtLink> and <NuxtLink to="/writing">writing</NuxtLink> to see what I've been up to.
      </p>
    </div>
  </section>
</template>
