<script setup lang="ts">
import { skillsData, type Skill } from '~/data/skills'
const categories = Object.entries(skillsData)
const INITIAL = 2
const showAll = ref(false)
const visible = computed(() => (showAll.value ? categories : categories.slice(0, INITIAL)))
const outline = ['Node.js', 'Express.js', 'Next.js', 'Payload CMS', 'Vercel', 'Railway']

const onEnter = (e: Event, s: Skill) => {
  const el = e.currentTarget as HTMLElement
  el.style.borderColor = s.color; el.style.backgroundColor = `${s.color}15`
  el.style.boxShadow = `0 8px 20px -4px ${s.color}40`; el.style.color = '#fff'
}
const onLeave = (e: Event) => {
  const el = e.currentTarget as HTMLElement
  el.style.borderColor = ''; el.style.backgroundColor = ''; el.style.boxShadow = ''; el.style.color = ''
}
const toggle = () => {
  const was = showAll.value; showAll.value = !showAll.value
  if (was) nextTick(() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }))
}
</script>

<template>
  <section id="skills" class="section">
    <h2 class="section-title">Skills</h2>
    <div id="skills-container" class="skills-container" style="margin-bottom: 40px;">
      <div v-for="([cat, skills], i) in visible" :key="cat" class="skill-category fade-in" :style="{ animationDelay: i * 0.1 + 's' }">
        <div class="skill-category-title">{{ cat }}</div>
        <div class="skill-category-grid">
          <div v-for="s in skills" :key="s.name" class="skill-tag" @mouseenter="onEnter($event, s)" @mouseleave="onLeave($event)">
            <img :src="s.logoUrl" :alt="`${s.name} logo`" :class="outline.includes(s.name) ? 'skill-logo outline' : 'skill-logo'" />
            {{ s.name }}
          </div>
        </div>
      </div>
      <div v-if="categories.length > INITIAL" class="skills-toggle-container">
        <button class="view-button skills-toggle-btn" @click="toggle">{{ showAll ? 'Show Less' : 'Show More Tools' }}</button>
      </div>
    </div>
  </section>
</template>
