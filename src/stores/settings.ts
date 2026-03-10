import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useStorage } from '@/composables/useStorage'
import { STORAGE_KEYS, DEFAULT_VOLUME, DEFAULT_GAME_COUNT } from '@/utils/constants'
import type { LotteryType } from '@/types/lottery'
import type { Strategy, PeriodMode } from '@/types/statistics'

interface SettingsState {
  activeLottery: LotteryType
  periodMode: PeriodMode
  volume: number
  dateFrom: string | null
  dateTo: string | null
  strategy: Strategy
  gameCount: number
}

const DEFAULT_SETTINGS: SettingsState = {
  activeLottery: 'megasena',
  periodMode: 'volume',
  volume: DEFAULT_VOLUME,
  dateFrom: null,
  dateTo: null,
  strategy: 'weighted',
  gameCount: DEFAULT_GAME_COUNT,
}

export const useSettingsStore = defineStore('settings', () => {
  const storage = useStorage()
  const saved = storage.get<SettingsState>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)

  const activeLottery = ref<LotteryType>(saved.activeLottery)
  const periodMode = ref<PeriodMode>(saved.periodMode)
  const volume = ref(saved.volume)
  const dateFrom = ref<string | null>(saved.dateFrom)
  const dateTo = ref<string | null>(saved.dateTo)
  const strategy = ref<Strategy>(saved.strategy)
  const gameCount = ref(saved.gameCount)

  function persist() {
    storage.set(STORAGE_KEYS.settings, {
      activeLottery: activeLottery.value,
      periodMode: periodMode.value,
      volume: volume.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      strategy: strategy.value,
      gameCount: gameCount.value,
    })
  }

  watch([activeLottery, periodMode, volume, dateFrom, dateTo, strategy, gameCount], persist, { deep: true })

  return {
    activeLottery,
    periodMode,
    volume,
    dateFrom,
    dateTo,
    strategy,
    gameCount,
  }
})
