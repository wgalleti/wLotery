<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import StatCard from '@/components/common/StatCard.vue'
import HeatmapGrid from '@/components/charts/HeatmapGrid.vue'
import FrequencyChart from '@/components/charts/FrequencyChart.vue'
import SumTrendChart from '@/components/charts/SumTrendChart.vue'
import ParityDonut from '@/components/charts/ParityDonut.vue'
import GameList from '@/components/games/GameList.vue'
import LotteryBadge from '@/components/common/LotteryBadge.vue'
import { useSettingsStore } from '@/stores/settings'
import { useDrawsStore } from '@/stores/draws'
import { useAnalysisStore } from '@/stores/analysis'
import { useGamesStore } from '@/stores/games'
import { useHistoryStore } from '@/stores/history'
import { useLotteryApi } from '@/composables/useLotteryApi'
import { useGameGenerator } from '@/composables/useGameGenerator'
import { useGameChecker } from '@/composables/useGameChecker'
import { LOTTERY_CONFIGS } from '@/utils/constants'
import { formatContestRange } from '@/utils/formatters'
import type { LotteryType } from '@/types/lottery'

const props = defineProps<{ lottery: LotteryType }>()

const toast = useToast()
const settings = useSettingsStore()
const drawsStore = useDrawsStore()
const analysisStore = useAnalysisStore()
const gamesStore = useGamesStore()
const historyStore = useHistoryStore()
const api = useLotteryApi()
const { generate } = useGameGenerator()
const { checkAllGamesAgainstNewDraws } = useGameChecker()

const config = computed(() => LOTTERY_CONFIGS[props.lottery])
const generatedGames = ref<number[][]>([])
const sidebarOpen = ref(false)

onMounted(() => {
  settings.activeLottery = props.lottery
  if (drawsStore.totalDraws(props.lottery) > 0) {
    analysisStore.runAnalysis(props.lottery)
  }
})

async function handleAnalyze() {
  sidebarOpen.value = false

  if (drawsStore.totalDraws(props.lottery) === 0) {
    const result = await api.syncDraws(props.lottery)
    if (result.added > 0) {
      toast.add({ severity: 'success', summary: 'Dados carregados', detail: `${result.added} sorteios importados`, life: 3000 })
      checkAllGamesAgainstNewDraws(props.lottery)
    }
  }

  analysisStore.runAnalysis(props.lottery)

  if (analysisStore.result) {
    generatedGames.value = generate(
      config.value,
      analysisStore.result,
      settings.strategy,
      settings.gameCount,
    )

    historyStore.addEntry({
      lottery: props.lottery,
      drawsAnalyzed: analysisStore.result.totalDraws,
      strategy: settings.strategy,
      gamesGenerated: settings.gameCount,
      fromContest: analysisStore.result.fromContest,
      toContest: analysisStore.result.toContest,
    })
  }
}

function regenerateGames() {
  if (!analysisStore.result) return
  generatedGames.value = generate(
    config.value,
    analysisStore.result,
    settings.strategy,
    settings.gameCount,
  )
}

function saveGame(numbers: number[]) {
  if (!analysisStore.result) return
  gamesStore.addGame({
    lottery: props.lottery,
    numbers,
    strategy: settings.strategy,
    source: {
      drawsAnalyzed: analysisStore.result.totalDraws,
      fromContest: analysisStore.result.fromContest,
      toContest: analysisStore.result.toContest,
    },
  })
  toast.add({ severity: 'success', summary: 'Jogo salvo', life: 2000 })
}

async function syncData() {
  const result = await api.syncDraws(props.lottery)
  if (result.added > 0) {
    toast.add({ severity: 'success', summary: 'Dados atualizados', detail: `${result.added} novos sorteios`, life: 3000 })
    checkAllGamesAgainstNewDraws(props.lottery)
    analysisStore.runAnalysis(props.lottery)
  } else if (!api.error.value) {
    toast.add({ severity: 'info', summary: 'Dados já atualizados', life: 2000 })
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: api.error.value, life: 4000 })
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <LotteryBadge :lottery="lottery" />
        <h1 class="text-xl font-bold text-text-bright">{{ config.name }}</h1>
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 text-xs font-medium rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-base transition-colors cursor-pointer"
          @click="syncData"
          :disabled="api.isLoading.value"
        >
          {{ api.isLoading.value ? 'Sincronizando...' : 'Atualizar dados' }}
        </button>
        <button
          class="md:hidden px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/15 text-accent cursor-pointer"
          @click="sidebarOpen = !sidebarOpen"
        >
          Configurar
        </button>
      </div>
    </div>

    <!-- Progress bar -->
    <div v-if="api.isLoading.value" class="mb-4">
      <div class="h-1 bg-bg-surface-hover rounded-full overflow-hidden">
        <div class="h-full bg-primary rounded-full animate-pulse w-2/3"></div>
      </div>
      <p class="text-xs text-text-muted mt-1">{{ api.progress.value }}</p>
    </div>

    <div class="flex gap-6">
      <!-- Sidebar desktop -->
      <div class="hidden md:block w-64 shrink-0">
        <div class="sticky top-20 bg-bg-surface border border-border-base rounded-xl p-4">
          <AppSidebar @analyze="handleAnalyze" />
        </div>
      </div>

      <!-- Sidebar mobile overlay -->
      <div
        v-if="sidebarOpen"
        class="md:hidden fixed inset-0 z-40 bg-black/50"
        @click="sidebarOpen = false"
      >
        <div
          class="absolute left-0 top-0 bottom-0 w-72 bg-bg-surface border-r border-border-base p-4 overflow-y-auto"
          @click.stop
        >
          <AppSidebar @analyze="handleAnalyze" />
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1 min-w-0 space-y-6">
        <!-- No data state -->
        <div v-if="!analysisStore.result" class="text-center py-16">
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none" class="mx-auto mb-4 opacity-30">
            <circle cx="16" cy="16" r="14" stroke="#16a34a" stroke-width="2" fill="#16a34a10" />
            <circle cx="11" cy="13" r="2.5" fill="#4ade8040" />
            <circle cx="20" cy="11" r="2.5" fill="#4ade8040" />
            <circle cx="16" cy="19" r="2.5" fill="#4ade8040" />
          </svg>
          <p class="text-text-muted text-sm">Configure os parâmetros e clique em <strong>Analisar e Gerar</strong></p>
          <p v-if="drawsStore.totalDraws(lottery) === 0" class="text-text-dim text-xs mt-1">
            Os dados serão baixados automaticamente na primeira análise
          </p>
        </div>

        <!-- Results -->
        <template v-else>
          <!-- Status bar -->
          <div class="bg-bg-surface border border-border-base rounded-lg px-4 py-2 text-sm text-text-muted">
            {{ analysisStore.result.totalDraws }} sorteios ·
            {{ formatContestRange(analysisStore.result.fromContest, analysisStore.result.toContest) }}
          </div>

          <!-- Stats grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard title="Sorteios" :value="analysisStore.result.totalDraws" />
            <StatCard title="Soma média" :value="analysisStore.result.averageSum" />
            <StatCard title="Consecutivos" :value="analysisStore.result.averageConsecutives" subtitle="média por sorteio" />
            <StatCard title="Paridade" :value="`${analysisStore.result.averageParity.even}% / ${analysisStore.result.averageParity.odd}%`" subtitle="pares / ímpares" />
          </div>

          <!-- Heatmap -->
          <div class="bg-bg-surface border border-border-base rounded-xl p-4">
            <h3 class="text-sm font-medium text-text-muted mb-3">Mapa de frequência</h3>
            <HeatmapGrid :stats="analysisStore.result.numberStats" :config="config" />
          </div>

          <!-- Charts row -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 bg-bg-surface border border-border-base rounded-xl p-4">
              <h3 class="text-sm font-medium text-text-muted mb-3">Frequência</h3>
              <FrequencyChart :stats="analysisStore.result.numberStats" />
            </div>
            <div class="bg-bg-surface border border-border-base rounded-xl p-4 flex flex-col items-center justify-center">
              <h3 class="text-sm font-medium text-text-muted mb-3">Paridade</h3>
              <ParityDonut :even="analysisStore.result.averageParity.even" :odd="analysisStore.result.averageParity.odd" />
            </div>
          </div>

          <!-- Sum trend -->
          <div class="bg-bg-surface border border-border-base rounded-xl p-4">
            <h3 class="text-sm font-medium text-text-muted mb-3">Tendência da soma</h3>
            <SumTrendChart :data="analysisStore.result.sumPerDraw" />
          </div>

          <!-- Generated games -->
          <div v-if="generatedGames.length > 0">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-text-bright">Jogos gerados</h3>
              <button
                class="px-3 py-1.5 text-xs font-medium rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-base transition-colors cursor-pointer"
                @click="regenerateGames"
              >
                Regerar
              </button>
            </div>
            <GameList
              :games="generatedGames"
              :analysis="analysisStore.result"
              :show-save-button="true"
              @save="saveGame"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
