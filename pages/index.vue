<script setup lang="ts">
import { profile, products, clients, hiringantPosts, services, markdownFor, EMAIL } from '~/data/site'
const interview = useInterview()
usePageSeo('/')
</script>

<template>
  <ModeView :md="markdownFor('/')">
    <div class="intro">
      <img class="photo" src="/images/avanish.jpg" alt="Avanish Patidar" width="112" height="112" />
      <div>
        <p>
          I am the CTO of <a href="https://hiringant.ai" target="_blank" rel="noopener">HiringAnt</a>, an AI hiring platform
          I built from the first commit and took to paying users. More than 3,600 job seekers and 160 employers
          have signed up. I also lead agentic AI at
          <a href="https://rentprompts.com" target="_blank" rel="noopener">RentPrompts</a>.
        </p>
        <p>
          I am an AI product engineer in Indore, India. I build scalable AI products, solutions and automation, end to
          end: the agents, the app around them, and the parts that decide whether people pay. Then I market them
          myself, from the ads and videos to the SEO, so they get found. <NuxtLink to="/about">More</NuxtLink>
        </p>
        <p class="social">
          <a v-for="l in profile.links" :key="l.url" :href="l.url" target="_blank" rel="noopener me">{{ l.label }}</a>
          <a :href="`mailto:${EMAIL}`">Email</a>
        </p>
      </div>
    </div>

    <h2>Building</h2>
    <ul class="list">
      <li v-for="p in products" :key="p.name">
        <a :href="p.url" target="_blank" rel="noopener">{{ p.name }}</a>
        <span> · {{ p.summary }}</span>
      </li>
    </ul>

    <h2>Built for clients</h2>
    <ul class="list">
      <li v-for="c in clients" :key="c.name">
        <a :href="c.url" target="_blank" rel="noopener">{{ c.name }}</a>
        <span> · {{ c.text }}</span>
      </li>
      <li><NuxtLink to="/work">Everything I have built</NuxtLink></li>
    </ul>

    <h2>Writing</h2>
    <ul class="list">
      <li v-for="p in hiringantPosts.slice(0, 4)" :key="p.url">
        <a :href="p.url" target="_blank" rel="noopener">{{ p.title }}</a>
      </li>
      <li><NuxtLink to="/writing">All writing</NuxtLink></li>
    </ul>

    <h2>Work with me</h2>
    <p>
      I take on a few projects as an AI product engineer and builder:
      <template v-for="(s, i) in services" :key="s.name">{{ s.name.charAt(0).toLowerCase() + s.name.slice(1) }}{{ i < services.length - 2 ? ', ' : i === services.length - 2 ? ', and ' : '' }}</template>.
      See <NuxtLink to="/services">how I work</NuxtLink>, <button type="button" class="talk" @click="interview.open()">ask my AI twin</button>,
      or write to <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>.
    </p>
  </ModeView>
</template>
