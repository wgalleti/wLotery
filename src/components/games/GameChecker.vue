<script setup lang="ts">
import { computed } from 'vue'
import type { SavedGame } from '@/types/game'
import { formatDate } from '@/utils/formatters'
import { LOTTERY_CONFIGS } from '@/utils/constants'

const props = defineProps<{
  game: SavedGame
}>()

const config = computed(() => LOTTERY_CONFIGS[props.game.lottery])
const sortedChecks = computed(() =>
  [...props.game.checks].sort((a, b) => b.contest - a.contest),
)
const bestResult = computed(() => {
  if (props.game.checks.length === 0) return null
  return props.game.checks.reduce((best, c) => (c.hitCount > best.hitCount ? c : best))
})
</script>

<template>
  <div class="space-y-3">
    <!-- Best result highlight -->
    <div
      v-if="bestResult && bestResult.hitCount > 0"
      class="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 text-xs"
    >
      <span class="text-accent font-medium">
        Melhor resultado: {{ bestResult.hitCount }} acertos no concurso #{{ bestResult.contest }}
        <template v-if="bestResult.prize"> — {{ bestResult.prize }}</template>
      </span>
    </div>

    <!-- Checks table -->
    <div v-if="sortedChecks.length > 0" class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead>
          <tr class="text-text-muted border-b border-border-base">
            <th class="text-left py-2 px-2 font-medium">Concurso</th>
            <th class="text-left py-2 px-2 font-medium">Data</th>
            <th class="text-center py-2 px-2 font-medium">Acertos</th>
            <th class="text-left py-2 px-2 font-medium">Faixa</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="check in sortedChecks"
            :key="check.contest"
            class="border-b border-border-subtle hover:bg-bg-surface-hover"
          >
            <td class="py-2 px-2 font-lottery text-text-base">#{{ check.contest }}</td>
            <td class="py-2 px-2 text-text-muted">{{ formatDate(check.date) }}</td>
            <td class="py-2 px-2 text-center">
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
                :class="check.hitCount >= (config.prizeTiers[config.prizeTiers.length - 1]?.hits ?? 99) ? 'bg-accent/20 text-accent' : 'bg-bg-surface-hover text-text-muted'"
              >
                {{ check.hitCount }}
              </span>
            </td>
            <td class="py-2 px-2">
              <span v-if="check.prize" class="text-accent font-medium">{{ check.prize }}</span>
              <span v-else class="text-text-dim">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-xs text-text-dim text-center py-4">
      Nenhuma conferência realizada ainda.
    </p>
  </div>
</template>
