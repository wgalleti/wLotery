<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  subtitle?: string
}>()
</script>

<template>
  <div class="bg-bg-surface border border-border-base rounded-xl p-4 hover:border-border-base/80 transition-colors">
    <p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">{{ title }}</p>
    <p class="text-2xl font-bold text-text-bright font-lottery">{{ value }}</p>
    <p v-if="subtitle" class="text-xs text-text-dim mt-1">{{ subtitle }}</p>
  </div>
</template>
