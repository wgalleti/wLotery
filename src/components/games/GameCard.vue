<script setup lang="ts">
import { ref, computed } from 'vue'
import NumberBall from '@/components/common/NumberBall.vue'
import type { AnalysisResult } from '@/types/statistics'

const props = defineProps<{
  numbers: number[]
  analysis?: AnalysisResult | null
  index?: number
  showSaveButton?: boolean
}>()

const emit = defineEmits<{
  save: [numbers: number[]]
  copy: [numbers: number[]]
}>()

const copied = ref(false)

const stats = computed(() => {
  const sum = props.numbers.reduce((a, b) => a + b, 0)
  const even = props.numbers.filter((n) => n % 2 === 0).length
  const odd = props.numbers.length - even
  return {
    sum,
    evenPercent: Math.round((even / props.numbers.length) * 100),
    oddPercent: Math.round((odd / props.numbers.length) * 100),
  }
})

function getVariant(n: number): 'hot' | 'cold' | 'neutral' | 'default' {
  if (!props.analysis) return 'default'
  if (props.analysis.hotNumbers.includes(n)) return 'hot'
  if (props.analysis.coldNumbers.includes(n)) return 'cold'
  return 'default'
}

async function copyNumbers() {
  const text = props.numbers.map((n) => String(n).padStart(2, '0')).join(' - ')
  await navigator.clipboard.writeText(text)
  copied.value = true
  emit('copy', props.numbers)
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div
    class="bg-bg-surface border border-border-base rounded-xl p-4 animate-fade-slide-up"
    :style="{ animationDelay: `${(index ?? 0) * 100}ms` }"
  >
    <!-- Numbers -->
    <div class="flex flex-wrap gap-1.5 justify-center mb-3">
      <NumberBall
        v-for="n in numbers"
        :key="n"
        :number="n"
        :variant="getVariant(n)"
        size="md"
      />
    </div>

    <!-- Stats -->
    <div class="flex justify-center gap-4 text-xs text-text-muted mb-3">
      <span class="font-lottery">Soma: <span class="text-text-base">{{ stats.sum }}</span></span>
      <span>Par: {{ stats.evenPercent }}%</span>
      <span>Ímpar: {{ stats.oddPercent }}%</span>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 justify-center">
      <button
        v-if="showSaveButton"
        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/15 text-accent hover:bg-primary/25 transition-colors cursor-pointer"
        @click="emit('save', numbers)"
      >
        Salvar
      </button>
      <button
        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-base transition-colors cursor-pointer"
        @click="copyNumbers"
      >
        {{ copied ? 'Copiado!' : 'Copiar' }}
      </button>
    </div>
  </div>
</template>
