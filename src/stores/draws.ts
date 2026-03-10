import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@/composables/useStorage'
import { STORAGE_KEYS } from '@/utils/constants'
import type { Draw, LotteryType } from '@/types/lottery'

export const useDrawsStore = defineStore('draws', () => {
  const storage = useStorage()

  const megasena = ref<Draw[]>(storage.get<Draw[]>(STORAGE_KEYS.drawsMegasena, []))
  const lotofacil = ref<Draw[]>(storage.get<Draw[]>(STORAGE_KEYS.drawsLotofacil, []))

  function getDraws(lottery: LotteryType): Draw[] {
    return lottery === 'megasena' ? megasena.value : lotofacil.value
  }

  function setDraws(lottery: LotteryType, draws: Draw[]) {
    if (lottery === 'megasena') {
      megasena.value = draws
    } else {
      lotofacil.value = draws
    }
    persist(lottery)
  }

  function lastContest(lottery: LotteryType): number | null {
    const draws = getDraws(lottery)
    if (draws.length === 0) return null
    return draws[draws.length - 1]!.contest
  }

  function totalDraws(lottery: LotteryType): number {
    return getDraws(lottery).length
  }

  function mergeDraws(lottery: LotteryType, incoming: Draw[]) {
    const existing = getDraws(lottery)
    const existingSet = new Set(existing.map((d) => d.contest))
    const newDraws = incoming.filter((d) => !existingSet.has(d.contest))

    if (newDraws.length === 0) return 0

    const merged = [...existing, ...newDraws].sort((a, b) => a.contest - b.contest)
    setDraws(lottery, merged)
    return newDraws.length
  }

  function persist(lottery: LotteryType) {
    const key = lottery === 'megasena' ? STORAGE_KEYS.drawsMegasena : STORAGE_KEYS.drawsLotofacil
    storage.set(key, getDraws(lottery))
  }

  function clearDraws(lottery: LotteryType) {
    setDraws(lottery, [])
  }

  return {
    megasena,
    lotofacil,
    getDraws,
    setDraws,
    lastContest,
    totalDraws,
    mergeDraws,
    clearDraws,
  }
})
