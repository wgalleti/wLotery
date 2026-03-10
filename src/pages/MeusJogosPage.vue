<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useGamesStore } from '@/stores/games'
import { useGameChecker } from '@/composables/useGameChecker'
import NumberBall from '@/components/common/NumberBall.vue'
import LotteryBadge from '@/components/common/LotteryBadge.vue'
import GameChecker from '@/components/games/GameChecker.vue'
import { LOTTERY_CONFIGS, STRATEGIES } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'
import type { LotteryType } from '@/types/lottery'

const toast = useToast()
const gamesStore = useGamesStore()
const { checkAllGamesAgainstNewDraws, checkGameManually } = useGameChecker()

const filterLottery = ref<LotteryType | 'all'>('all')
const filterFavorites = ref(false)
const expandedGame = ref<string | null>(null)
const manualContest = ref<number | null>(null)

const filteredGames = computed(() => {
  let games = gamesStore.games
  if (filterLottery.value !== 'all') {
    games = games.filter((g) => g.lottery === filterLottery.value)
  }
  if (filterFavorites.value) {
    games = games.filter((g) => g.favorite)
  }
  return [...games].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

function toggleExpand(id: string) {
  expandedGame.value = expandedGame.value === id ? null : id
}

function removeGame(id: string) {
  if (confirm('Remover este jogo?')) {
    gamesStore.removeGame(id)
    toast.add({ severity: 'info', summary: 'Jogo removido', life: 2000 })
  }
}

async function copyNumbers(numbers: number[]) {
  const text = numbers.map((n) => String(n).padStart(2, '0')).join(' - ')
  await navigator.clipboard.writeText(text)
  toast.add({ severity: 'success', summary: 'Copiado!', life: 1500 })
}

function conferirManual(gameId: string) {
  if (!manualContest.value) return
  const result = checkGameManually(gameId, manualContest.value)
  if (result) {
    toast.add({
      severity: result.hitCount > 0 ? 'success' : 'info',
      summary: `${result.hitCount} acerto${result.hitCount !== 1 ? 's' : ''}`,
      detail: result.prize ? `Faixa: ${result.prize}` : undefined,
      life: 3000,
    })
  } else {
    toast.add({ severity: 'warn', summary: 'Concurso não encontrado', detail: 'Verifique se os dados estão atualizados', life: 3000 })
  }
  manualContest.value = null
}

function conferirTodos() {
  checkAllGamesAgainstNewDraws('megasena')
  checkAllGamesAgainstNewDraws('lotofacil')
  toast.add({ severity: 'success', summary: 'Conferência concluída', life: 2000 })
}

function getStrategyLabel(value: string): string {
  return STRATEGIES.find((s) => s.value === value)?.label ?? value
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-text-bright">Meus Jogos</h1>
      <button
        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/15 text-accent hover:bg-primary/25 transition-colors cursor-pointer"
        @click="conferirTodos"
      >
        Conferir todos
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="opt in (['all', 'megasena', 'lotofacil'] as const)"
        :key="opt"
        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer"
        :class="filterLottery === opt ? 'bg-primary text-white' : 'bg-bg-surface-hover text-text-muted hover:text-text-base'"
        @click="filterLottery = opt"
      >
        {{ opt === 'all' ? 'Todas' : LOTTERY_CONFIGS[opt].name }}
      </button>
      <button
        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer"
        :class="filterFavorites ? 'bg-primary text-white' : 'bg-bg-surface-hover text-text-muted hover:text-text-base'"
        @click="filterFavorites = !filterFavorites"
      >
        Favoritos
      </button>
    </div>

    <!-- Empty -->
    <div v-if="filteredGames.length === 0" class="text-center py-16">
      <p class="text-text-muted text-sm">Nenhum jogo salvo.</p>
      <p class="text-text-dim text-xs mt-1">Gere jogos no dashboard e salve os que gostar.</p>
    </div>

    <!-- Games list -->
    <div v-else class="space-y-4">
      <div
        v-for="game in filteredGames"
        :key="game.id"
        class="bg-bg-surface border border-border-base rounded-xl overflow-hidden"
      >
        <!-- Game header -->
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <LotteryBadge :lottery="game.lottery" />
              <span class="text-xs text-text-dim">{{ formatDate(game.createdAt) }}</span>
              <span class="text-xs text-text-dim">· {{ getStrategyLabel(game.strategy) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                class="p-1.5 rounded-lg text-text-muted hover:text-accent transition-colors cursor-pointer"
                :class="game.favorite ? 'text-accent' : ''"
                @click="gamesStore.toggleFavorite(game.id)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" :fill="game.favorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Numbers -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <NumberBall v-for="n in game.numbers" :key="n" :number="n" size="sm" />
          </div>

          <!-- Actions -->
          <div class="flex gap-2 text-xs">
            <button
              class="px-3 py-1.5 rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-base transition-colors cursor-pointer"
              @click="copyNumbers(game.numbers)"
            >
              Copiar
            </button>
            <button
              class="px-3 py-1.5 rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-base transition-colors cursor-pointer"
              @click="toggleExpand(game.id)"
            >
              {{ expandedGame === game.id ? 'Fechar' : 'Conferências' }} ({{ game.checks.length }})
            </button>
            <button
              class="px-3 py-1.5 rounded-lg bg-bg-surface-hover text-text-muted hover:text-error transition-colors cursor-pointer"
              @click="removeGame(game.id)"
            >
              Remover
            </button>
          </div>
        </div>

        <!-- Expanded: checker -->
        <div v-if="expandedGame === game.id" class="border-t border-border-base p-4 space-y-3">
          <GameChecker :game="game" />

          <!-- Manual check -->
          <div class="flex gap-2 items-end">
            <div class="flex-1">
              <label class="block text-xs text-text-muted mb-1">Conferir concurso</label>
              <input
                v-model.number="manualContest"
                type="number"
                placeholder="Nº do concurso"
                class="w-full bg-bg-base border border-border-base rounded-lg px-3 py-2 text-sm text-text-base focus:outline-none focus:border-primary"
              />
            </div>
            <button
              class="px-4 py-2 text-xs font-medium rounded-lg bg-primary/15 text-accent hover:bg-primary/25 transition-colors cursor-pointer"
              :disabled="!manualContest"
              @click="conferirManual(game.id)"
            >
              Conferir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
