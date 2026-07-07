<script setup lang="ts">
useHead({ title: 'Experience — Avanish Patidar', link: [{ rel: 'canonical', href: 'https://avanishpatidar.me/experience' }] })

const roles = [
  { title: 'HiringAnt – Tech Lead', time: 'Feb 2026 – Present · Indore · Hybrid', link: { url: 'https://hiringant.ai/', label: 'hiringant.ai' }, desc: 'Leading the technology vision and execution at HiringAnt, an AI-powered recruitment automation platform.', points: ['<strong>System Architecture:</strong> Designing scalable AI-first system architecture.', '<strong>AI Workflows:</strong> Building agent-based hiring workflows — screening, matching, shortlisting.', '<strong>Engineering:</strong> Overseeing backend, AI, and product engineering.', '<strong>Solutions:</strong> Translating business problems into applied AI solutions.'] },
  { title: 'RentPrompts – Agentic AI Lead', time: 'Jan 2026 – Present · Indore · Hybrid', link: { url: 'https://rentprompts.com/', label: 'rentprompts.com' }, desc: 'Leading the design and development of Agentic AI systems at RentPrompts.', points: ['<strong>Multi-Agent Systems:</strong> Architecting multi-agent workflows using LLMs.', '<strong>Autonomous Agents:</strong> Building autonomous AI agents with memory, tools, and reasoning.', '<strong>Prompt Systems:</strong> Designing prompt systems for production-grade AI use cases.', '<strong>Product Integration:</strong> Collaborating with product & design to ship AI-powered features.'] },
  { title: 'RentPrompts – GenAI Developer', time: 'Aug 2025 – Jan 2026 · Indore · Hybrid', link: null, desc: 'Built AI-driven automation products and AI agents at RentPrompts.', points: ['<strong>AI Systems & Agents:</strong> Multi-tool agents with structured reasoning, tools, and RAG (LangChain + Python).', '<strong>Backend Engineering:</strong> FastAPI microservices for AI pipelines and internal APIs.', '<strong>Payload CMS + Next.js:</strong> CMS dashboards and custom admin interfaces.', '<strong>Infrastructure:</strong> Dockerized full stack, Nginx reverse proxy with SSL, Celery/Redis workers.'] },
  { title: 'RentPrompts – GenAI Intern', time: 'Jun 2025 – Aug 2025 · Indore', link: null, desc: '', points: ['Developed intelligent AI agents using LangChain and large language models.', 'Built multi-tool agents handling complex queries via RAG pipelines.', 'Hands-on experience building Applied AI prototypes.'] }
]
</script>

<template>
  <div>
    <section id="experience" class="section">
      <h2 class="section-title">Experience</h2>
      <div v-for="(r, i) in roles" :key="r.title" class="work-item" :style="{ marginBottom: i < roles.length - 1 ? '30px' : '0' }">
        <div class="work-title">{{ r.title }}</div>
        <p class="section-text" style="font-size: 14px; margin-bottom: 10px;">{{ r.time }}</p>
        <div v-if="r.link" class="work-links" style="margin-bottom: 20px;">
          <a :href="r.link.url" target="_blank" rel="noopener" class="work-link">{{ r.link.label }}</a>
        </div>
        <p v-if="r.desc" class="work-description">{{ r.desc }}</p>
        <ul class="section-text" style="list-style: disc; padding-left: 20px;">
          <li v-for="(pt, j) in r.points" :key="j" v-html="pt"></li>
        </ul>
      </div>
    </section>

    <SkillsSection />
  </div>
</template>
