<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDrawsStore } from '@/stores/draws'
import { useSettingsStore } from '@/stores/settings'
import NumberBall from '@/components/common/NumberBall.vue'
import { LOTTERY_CONFIGS } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'
import type { LotteryType } from '@/types/lottery'

const drawsStore = useDrawsStore()
const settings = useSettingsStore()

const activeLottery = ref<LotteryType>(settings.activeLottery)
const page = ref(1)
const perPage = 10

const config = computed(() => LOTTERY_CONFIGS[activeLottery.value])

const allDraws = computed(() => {
  return [...drawsStore.getDraws(activeLottery.value)].sort((a, b) => b.contest - a.contest)
})

const totalPages = computed(() => Math.ceil(allDraws.value.length / perPage))

const paginatedDraws = computed(() => {
  const start = (page.value - 1) * perPage
  return allDraws.value.slice(start, start + perPage)
})

function calcSum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}

function calcParity(numbers: number[]): string {
  const even = numbers.filter((n) => n % 2 === 0).length
  return `${even}P / ${numbers.length - even}I`
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-6 space-y-6">
    <h1 class="text-xl font-bold text-text-bright">Histórico de Sorteios</h1>

    <!-- Lottery toggle -->
    <div class="flex gap-2">
      <button
        v-for="lt in (['megasena', 'lotofacil'] as const)"
        :key="lt"
        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer"
        :class="activeLottery === lt ? 'bg-primary text-white' : 'bg-bg-surface-hover text-text-muted hover:text-text-base'"
        @click="activeLottery = lt; page = 1"
      >
        {{ LOTTERY_CONFIGS[lt].name }}
      </button>
    </div>

    <p class="text-xs text-text-muted">
      {{ allDraws.length }} sorteios da {{ config.name }}
    </p>

    <!-- Table -->
    <div v-if="allDraws.length > 0" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-text-muted border-b border-border-base text-xs">
            <th class="text-left py-2 px-2 font-medium">Concurso</th>
            <th class="text-left py-2 px-2 font-medium">Data</th>
            <th class="text-left py-2 px-2 font-medium">Números</th>
            <th class="text-center py-2 px-2 font-medium">Soma</th>
            <th class="text-center py-2 px-2 font-medium">Par/Ímpar</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="draw in paginatedDraws"
            :key="draw.contest"
            class="border-b border-border-subtle hover:bg-bg-surface-hover"
          >
            <td class="py-2 px-2 font-lottery text-text-base">#{{ draw.contest }}</td>
            <td class="py-2 px-2 text-text-muted text-xs">{{ formatDate(draw.date) }}</td>
            <td class="py-2 px-2">
              <div class="flex flex-wrap gap-1">
                <NumberBall v-for="n in draw.numbers" :key="n" :number="n" size="sm" />
              </div>
            </td>
            <td class="py-2 px-2 text-center font-lottery text-text-muted">{{ calcSum(draw.numbers) }}</td>
            <td class="py-2 px-2 text-center text-xs text-text-muted">{{ calcParity(draw.numbers) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-16">
      <p class="text-text-muted text-sm">Nenhum sorteio carregado.</p>
      <p class="text-text-dim text-xs mt-1">Vá ao dashboard e carregue os dados.</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        class="px-3 py-1.5 text-xs rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-base cursor-pointer disabled:opacity-30"
        :disabled="page <= 1"
        @click="page--"
      >
        Anterior
      </button>
      <span class="text-xs text-text-muted font-lottery">{{ page }} / {{ totalPages }}</span>
      <button
        class="px-3 py-1.5 text-xs rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-base cursor-pointer disabled:opacity-30"
        :disabled="page >= totalPages"
        @click="page++"
      >
        Próxima
      </button>
    </div>
  </div>
</template>
