import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStatistics } from '@/composables/useStatistics'
import { useDrawsStore } from '@/stores/draws'
import { useSettingsStore } from '@/stores/settings'
import { LOTTERY_CONFIGS } from '@/utils/constants'
import type { AnalysisResult } from '@/types/statistics'
import type { LotteryType, Draw } from '@/types/lottery'

export const useAnalysisStore = defineStore('analysis', () => {
  const result = ref<AnalysisResult | null>(null)
  const isAnalyzing = ref(false)
  const filteredDraws = ref<Draw[]>([])

  function runAnalysis(lottery?: LotteryType) {
    const settings = useSettingsStore()
    const drawsStore = useDrawsStore()
    const { analyze } = useStatistics()

    const activeLottery = lottery ?? settings.activeLottery
    const config = LOTTERY_CONFIGS[activeLottery]
    const allDraws = drawsStore.getDraws(activeLottery)

    if (allDraws.length === 0) {
      result.value = null
      filteredDraws.value = []
      return
    }

    isAnalyzing.value = true

    let draws: Draw[]

    if (settings.periodMode === 'volume') {
      const sorted = [...allDraws].sort((a, b) => b.contest - a.contest)
      draws = sorted.slice(0, settings.volume).reverse()
    } else {
      draws = allDraws.filter((d) => {
        const drawDate = new Date(d.date)
        if (settings.dateFrom && drawDate < new Date(settings.dateFrom)) return false
        if (settings.dateTo && drawDate > new Date(settings.dateTo)) return false
        return true
      })
    }

    filteredDraws.value = draws
    result.value = analyze(draws, config)
    isAnalyzing.value = false
  }

  return { result, isAnalyzing, filteredDraws, runAnalysis }
})
