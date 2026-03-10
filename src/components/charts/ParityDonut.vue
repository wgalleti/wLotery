<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  even: number
  odd: number
}>()

const radius = 60
const stroke = 16
const circumference = 2 * Math.PI * radius
const center = radius + stroke

const evenArc = computed(() => (props.even / 100) * circumference)
</script>

<template>
  <div class="flex flex-col items-center">
    <svg :width="center * 2" :height="center * 2" :viewBox="`0 0 ${center * 2} ${center * 2}`">
      <!-- Odd segment (background) -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke-width="stroke"
        stroke="#3b82f640"
        :stroke-dasharray="`${circumference}`"
        :stroke-dashoffset="0"
        transform="rotate(-90)"
        :transform-origin="`${center} ${center}`"
      />
      <!-- Even segment (foreground) -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke-width="stroke"
        stroke="#4ade80"
        :stroke-dasharray="`${evenArc} ${circumference - evenArc}`"
        :stroke-dashoffset="0"
        transform="rotate(-90)"
        :transform-origin="`${center} ${center}`"
        stroke-linecap="round"
      />
      <!-- Center text -->
      <text
        :x="center"
        :y="center - 6"
        text-anchor="middle"
        fill="#e5e7eb"
        font-size="14"
        font-family="'JetBrains Mono', monospace"
        font-weight="700"
      >
        {{ even.toFixed(1) }}%
      </text>
      <text
        :x="center"
        :y="center + 10"
        text-anchor="middle"
        fill="#6b7280"
        font-size="10"
        font-family="'Inter', sans-serif"
      >
        pares
      </text>
    </svg>

    <div class="flex items-center gap-4 mt-2 text-xs">
      <span class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-accent"></span>
        Pares {{ even.toFixed(1) }}%
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-cold/40"></span>
        Ímpares {{ odd.toFixed(1) }}%
      </span>
    </div>
  </div>
</template>
