<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NumberStats } from '@/types/statistics'
import type { LotteryConfig } from '@/types/lottery'

const props = defineProps<{
  stats: NumberStats[]
  config: LotteryConfig
}>()

const tooltip = ref<{ show: boolean; x: number; y: number; stat: NumberStats | null }>({
  show: false, x: 0, y: 0, stat: null,
})

const cols = computed(() => props.config.maxNumber <= 25 ? 5 : 10)
const cellSize = 44
const gap = 4

const maxFreq = computed(() => Math.max(...props.stats.map((s) => s.frequency), 1))

const svgWidth = computed(() => cols.value * (cellSize + gap) - gap)
const rows = computed(() => Math.ceil(props.config.maxNumber / cols.value))
const svgHeight = computed(() => rows.value * (cellSize + gap) - gap)

function cellX(n: number): number {
  return ((n - 1) % cols.value) * (cellSize + gap)
}

function cellY(n: number): number {
  return Math.floor((n - 1) / cols.value) * (cellSize + gap)
}

function cellColor(stat: NumberStats): string {
  const intensity = stat.frequency / maxFreq.value
  const r = Math.round(10 + (74 - 10) * (1 - intensity))
  const g = Math.round(15 + (222 - 15) * intensity)
  const b = Math.round(13 + (128 - 13) * intensity * 0.5)
  return `rgb(${r}, ${g}, ${b})`
}

function textColor(stat: NumberStats): string {
  const intensity = stat.frequency / maxFreq.value
  return intensity > 0.5 ? '#0a0f0d' : '#e5e7eb'
}

function showTooltip(event: MouseEvent, stat: NumberStats) {
  tooltip.value = {
    show: true,
    x: event.offsetX,
    y: event.offsetY - 40,
    stat,
  }
}

function hideTooltip() {
  tooltip.value.show = false
}
</script>

<template>
  <div class="relative w-full overflow-x-auto">
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      class="mx-auto"
    >
      <g
        v-for="stat in stats"
        :key="stat.number"
        class="cursor-pointer"
        @mouseenter="showTooltip($event, stat)"
        @mouseleave="hideTooltip"
      >
        <rect
          :x="cellX(stat.number)"
          :y="cellY(stat.number)"
          :width="cellSize"
          :height="cellSize"
          :fill="cellColor(stat)"
          rx="6"
          class="transition-all duration-200 hover:opacity-80"
        />
        <!-- Hot/Cold indicator -->
        <circle
          v-if="stat.isHot"
          :cx="cellX(stat.number) + cellSize - 6"
          :cy="cellY(stat.number) + 6"
          r="3"
          fill="#ef4444"
        />
        <circle
          v-if="stat.isCold"
          :cx="cellX(stat.number) + cellSize - 6"
          :cy="cellY(stat.number) + 6"
          r="3"
          fill="#3b82f6"
        />
        <text
          :x="cellX(stat.number) + cellSize / 2"
          :y="cellY(stat.number) + cellSize / 2"
          text-anchor="middle"
          dominant-baseline="central"
          :fill="textColor(stat)"
          font-size="13"
          font-family="'JetBrains Mono', monospace"
          font-weight="600"
        >
          {{ String(stat.number).padStart(2, '0') }}
        </text>
      </g>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="tooltip.show && tooltip.stat"
      class="absolute pointer-events-none bg-bg-surface border border-border-base rounded-lg px-3 py-2 text-xs shadow-lg z-10"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <p class="font-lottery text-text-bright font-bold">
        Número {{ String(tooltip.stat.number).padStart(2, '0') }}
      </p>
      <p class="text-text-muted">Frequência: {{ tooltip.stat.frequency }}x ({{ tooltip.stat.frequencyPercent.toFixed(1) }}%)</p>
      <p class="text-text-muted">Atraso: {{ tooltip.stat.delay }} sorteios</p>
      <p v-if="tooltip.stat.isHot" class="text-hot font-medium">Quente</p>
      <p v-if="tooltip.stat.isCold" class="text-cold font-medium">Frio</p>
    </div>
  </div>
</template>
