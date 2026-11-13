<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>()
const is404 = computed(() => props.error?.statusCode === 404)
useHead({ title: is404.value ? 'Page not found | Avanish Patidar' : 'Something went wrong | Avanish Patidar', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <NuxtLayout>
    <div class="page">
      <p class="eyebrow">{{ is404 ? '404' : 'Error' }}</p>
      <h1>{{ is404 ? 'That page does not exist.' : 'Something went wrong.' }}</h1>
      <div class="actions"><a class="btn primary" href="/">Go home</a></div>
    </div>
  </NuxtLayout>
</template>
