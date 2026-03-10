<script setup lang="ts">
import GameCard from './GameCard.vue'
import type { AnalysisResult } from '@/types/statistics'

defineProps<{
  games: number[][]
  analysis?: AnalysisResult | null
  showSaveButton?: boolean
}>()

const emit = defineEmits<{
  save: [numbers: number[]]
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <GameCard
      v-for="(game, index) in games"
      :key="index"
      :numbers="game"
      :analysis="analysis"
      :index="index"
      :show-save-button="showSaveButton"
      @save="emit('save', $event)"
    />
  </div>
</template>
