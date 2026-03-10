<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawsStore } from '@/stores/draws'
import { useGamesStore } from '@/stores/games'
import NumberBall from '@/components/common/NumberBall.vue'
import type { LotteryType } from '@/types/lottery'
import { LOTTERY_CONFIGS } from '@/utils/constants'

const router = useRouter()
const drawsStore = useDrawsStore()
const gamesStore = useGamesStore()

const lotteries: LotteryType[] = ['megasena', 'lotofacil']

function getLastDraw(lottery: LotteryType) {
  const draws = drawsStore.getDraws(lottery)
  return draws.length > 0 ? draws[draws.length - 1] : null
}

const totalGames = computed(() => gamesStore.games.length)

function goTo(lottery: LotteryType) {
  const config = LOTTERY_CONFIGS[lottery]
  router.push(`/${config.slug}`)
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
    <!-- Hero -->
    <div class="text-center space-y-3">
      <div class="flex justify-center">
        <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#16a34a" stroke-width="2" fill="#16a34a20" />
          <circle cx="11" cy="13" r="2.5" fill="#4ade80" />
          <circle cx="20" cy="11" r="2.5" fill="#4ade80" />
          <circle cx="16" cy="19" r="2.5" fill="#4ade80" />
          <circle cx="22" cy="18" r="1.5" fill="#16a34a" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-text-bright">LotoStats</h1>
      <p class="text-text-muted text-sm max-w-md mx-auto">
        Análise estatística inteligente de loterias brasileiras. Explore padrões, gere jogos e acompanhe resultados.
      </p>
    </div>

    <!-- Lottery cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        v-for="lottery in lotteries"
        :key="lottery"
        class="bg-bg-surface border border-border-base rounded-2xl p-6 text-left hover:border-primary/40 transition-all cursor-pointer group"
        @click="goTo(lottery)"
      >
        <h2 class="text-lg font-bold text-text-bright mb-1 group-hover:text-accent transition-colors">
          {{ LOTTERY_CONFIGS[lottery].name }}
        </h2>

        <template v-if="getLastDraw(lottery)">
          <p class="text-xs text-text-muted mb-3">
            Último: Concurso #{{ getLastDraw(lottery)!.contest }}
          </p>
          <div class="flex flex-wrap gap-1 mb-3">
            <NumberBall
              v-for="n in getLastDraw(lottery)!.numbers"
              :key="n"
              :number="n"
              size="sm"
            />
          </div>
          <p class="text-xs text-text-dim">
            {{ drawsStore.totalDraws(lottery) }} sorteios carregados
          </p>
        </template>
        <template v-else>
          <p class="text-xs text-text-dim mt-2">
            Nenhum dado carregado. Clique para analisar.
          </p>
        </template>

        <div class="mt-3 text-xs font-medium text-primary group-hover:text-accent transition-colors">
          Analisar →
        </div>
      </button>
    </div>

    <!-- Quick stats -->
    <div v-if="totalGames > 0" class="bg-bg-surface border border-border-base rounded-xl p-4">
      <h3 class="text-sm font-medium text-text-muted mb-1">Resumo</h3>
      <p class="text-sm text-text-base">
        {{ totalGames }} jogo{{ totalGames > 1 ? 's' : '' }} salvo{{ totalGames > 1 ? 's' : '' }}
      </p>
    </div>
  </div>
</template>
