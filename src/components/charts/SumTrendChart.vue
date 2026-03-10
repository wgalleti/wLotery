<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: { contest: number; sum: number }[]
}>()

const chartWidth = 600
const chartHeight = 200
const padding = { top: 10, right: 10, bottom: 20, left: 40 }

const innerWidth = chartWidth - padding.left - padding.right
const innerHeight = chartHeight - padding.top - padding.bottom

const minSum = computed(() => Math.min(...props.data.map((d) => d.sum)) * 0.9)
const maxSum = computed(() => Math.max(...props.data.map((d) => d.sum)) * 1.1)

const points = computed(() => {
  if (props.data.length === 0) return ''
  return props.data
    .map((d, i) => {
      const x = padding.left + (i / Math.max(props.data.length - 1, 1)) * innerWidth
      const y = padding.top + innerHeight - ((d.sum - minSum.value) / (maxSum.value - minSum.value)) * innerHeight
      return `${x},${y}`
    })
    .join(' ')
})

const movingAvg = computed(() => {
  const window = Math.min(10, Math.floor(props.data.length / 3))
  if (window < 2) return ''

  const avgs: { x: number; y: number }[] = []
  for (let i = window - 1; i < props.data.length; i++) {
    let sum = 0
    for (let j = i - window + 1; j <= i; j++) {
      sum += props.data[j]!.sum
    }
    const avg = sum / window
    const x = padding.left + (i / Math.max(props.data.length - 1, 1)) * innerWidth
    const y = padding.top + innerHeight - ((avg - minSum.value) / (maxSum.value - minSum.value)) * innerHeight
    avgs.push({ x, y })
  }

  return avgs.map((p) => `${p.x},${p.y}`).join(' ')
})

const yTicks = computed(() => {
  const range = maxSum.value - minSum.value
  const step = Math.ceil(range / 5)
  const ticks: number[] = []
  for (let v = Math.floor(minSum.value); v <= maxSum.value; v += step) {
    ticks.push(v)
  }
  return ticks
})
</script>

<template>
  <div class="w-full overflow-x-auto">
    <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="w-full h-auto min-w-[400px]">
      <!-- Y axis ticks -->
      <template v-for="tick in yTicks" :key="tick">
        <line
          :x1="padding.left"
          :y1="padding.top + innerHeight - ((tick - minSum) / (maxSum - minSum)) * innerHeight"
          :x2="chartWidth - padding.right"
          :y2="padding.top + innerHeight - ((tick - minSum) / (maxSum - minSum)) * innerHeight"
          stroke="#243b2e"
          stroke-width="0.5"
          stroke-dasharray="4,4"
        />
        <text
          :x="padding.left - 4"
          :y="padding.top + innerHeight - ((tick - minSum) / (maxSum - minSum)) * innerHeight + 3"
          text-anchor="end"
          fill="#6b7280"
          font-size="9"
          font-family="'JetBrains Mono', monospace"
        >
          {{ tick }}
        </text>
      </template>

      <!-- Data line -->
      <polyline
        :points="points"
        fill="none"
        stroke="#16a34a"
        stroke-width="1.5"
        stroke-linejoin="round"
        opacity="0.5"
      />

      <!-- Moving average -->
      <polyline
        v-if="movingAvg"
        :points="movingAvg"
        fill="none"
        stroke="#4ade80"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
    <p class="text-[10px] text-text-dim text-center mt-1">
      Soma por concurso (verde claro = média móvel)
    </p>
  </div>
</template>
