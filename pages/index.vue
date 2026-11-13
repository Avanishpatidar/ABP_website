<script setup lang="ts">
import { profile, products, hiringantPosts, services, markdownFor, EMAIL } from '~/data/site'
const interview = useInterview()
usePageSeo('/')
</script>

<template>
  <ModeView :md="markdownFor('/')">
    <p class="eyebrow">{{ profile.role }} · {{ profile.location }}</p>
    <h1>{{ profile.headline }}</h1>
    <p class="lede">I am Avanish Patidar. {{ profile.sub }}</p>
    <div class="actions">
      <button type="button" class="btn primary" @click="interview.open()">Ask my AI twin</button>
      <a class="btn" :href="`mailto:${EMAIL}`">Email me</a>
    </div>

    <section>
      <span class="label">01</span>
      <h2 id="shipping">What I am shipping</h2>
      <div class="rows">
        <div v-for="p in products" :key="p.name" class="row">
          <div class="row-head">
            <a :href="p.url" target="_blank" rel="noopener" class="arrow">{{ p.name }}</a>
            <span class="row-meta">{{ p.role }}</span>
          </div>
          <div>
            <p>{{ p.summary }}</p>
            <p v-if="p.points[0]" class="strong" style="margin-top: 8px">{{ p.points[0] }}</p>
          </div>
        </div>
      </div>
      <NuxtLink to="/work" class="more">All work</NuxtLink>
    </section>

    <section>
      <span class="label">02</span>
      <h2 id="services">What I can do for you</h2>
      <div class="grid2">
        <div v-for="s in services" :key="s.name" class="cell">
          <h3>{{ s.name }}</h3>
          <p>{{ s.text }}</p>
        </div>
      </div>
      <NuxtLink to="/services" class="more">How I work with teams</NuxtLink>
    </section>

    <section>
      <span class="label">03</span>
      <h2 id="writing">Recent writing</h2>
      <div class="posts">
        <a v-for="p in hiringantPosts.slice(0, 3)" :key="p.url" :href="p.url" target="_blank" rel="noopener" class="post">
          <span class="post-meta">{{ p.where }} · {{ p.date }}</span>
          <span class="post-title">{{ p.title }}</span>
          <span class="post-sum">{{ p.summary }}</span>
        </a>
      </div>
      <NuxtLink to="/writing" class="more">All writing</NuxtLink>
    </section>

    <ContactBlock />
  </ModeView>
</template>
