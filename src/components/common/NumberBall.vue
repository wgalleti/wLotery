<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  number: number
  variant?: 'hot' | 'cold' | 'neutral' | 'default'
  size?: 'sm' | 'md' | 'lg'
  highlighted?: boolean
}>(), {
  variant: 'default',
  size: 'md',
  highlighted: false,
})

const sizeMap = { sm: 32, md: 40, lg: 52 }
const fontSize = { sm: 11, md: 13, lg: 16 }

const svgSize = computed(() => sizeMap[props.size])
const radius = computed(() => svgSize.value / 2 - 2)
const textSize = computed(() => fontSize[props.size])

const colors = computed(() => {
  switch (props.variant) {
    case 'hot':
      return { fill: '#ef444420', stroke: '#ef4444', text: '#fca5a5' }
    case 'cold':
      return { fill: '#3b82f620', stroke: '#3b82f6', text: '#93c5fd' }
    case 'neutral':
      return { fill: '#6b728020', stroke: '#6b7280', text: '#9ca3af' }
    default:
      return { fill: '#16a34a20', stroke: '#16a34a', text: '#e5e7eb' }
  }
})
</script>

<template>
  <svg
    :width="svgSize"
    :height="svgSize"
    :viewBox="`0 0 ${svgSize} ${svgSize}`"
    class="inline-block"
  >
    <!-- Glow -->
    <circle
      v-if="highlighted"
      :cx="svgSize / 2"
      :cy="svgSize / 2"
      :r="radius + 2"
      :fill="colors.stroke"
      opacity="0.2"
    />
    <!-- Background -->
    <circle
      :cx="svgSize / 2"
      :cy="svgSize / 2"
      :r="radius"
      :fill="colors.fill"
      :stroke="colors.stroke"
      stroke-width="1.5"
    />
    <!-- Number -->
    <text
      :x="svgSize / 2"
      :y="svgSize / 2"
      text-anchor="middle"
      dominant-baseline="central"
      :fill="colors.text"
      :font-size="textSize"
      font-family="'JetBrains Mono', monospace"
      font-weight="600"
    >
      {{ String(number).padStart(2, '0') }}
    </text>
  </svg>
</template>
