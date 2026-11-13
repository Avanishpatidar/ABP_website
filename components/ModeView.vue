<script setup lang="ts">
// Shows the designed page in Human mode and the same content as markdown in
// Agent mode. `md` comes from data/site.ts, so the two never disagree.
const props = defineProps<{ md: string }>()
const { mode } = useMode()
const copied = ref(false)

const copy = async () => {
  try { await navigator.clipboard.writeText(props.md); copied.value = true; setTimeout(() => (copied.value = false), 1600) } catch {}
}
</script>

<template>
  <div>
    <div v-show="mode === 'human'"><slot /></div>
    <div v-if="mode === 'agent'">
      <div class="agent-bar">
        <span>This page as markdown</span>
        <div>
          <button type="button" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
          <a href="/llms.txt">Whole site</a>
        </div>
      </div>
      <pre class="agent-md">{{ md }}</pre>
    </div>
  </div>
</template>
