<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>()
const is404 = computed(() => props.error?.statusCode === 404)
useHead({ title: is404.value ? 'Page not found | Avanish Patidar' : 'Something went wrong | Avanish Patidar', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <NuxtLayout>
    <h1>{{ is404 ? 'That page does not exist.' : 'Something went wrong.' }}</h1>
    <p><a href="/">Go to the home page</a></p>
  </NuxtLayout>
</template>
