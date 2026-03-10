<script setup lang="ts">
import { computed } from 'vue'
import type { LotteryType } from '@/types/lottery'
import { LOTTERY_CONFIGS } from '@/utils/constants'

const props = defineProps<{
  lottery: LotteryType
}>()

const config = computed(() => LOTTERY_CONFIGS[props.lottery])
</script>

<template>
  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/15 text-accent border border-primary/20">
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="3" />
    </svg>
    {{ config.name }}
  </span>
</template>
