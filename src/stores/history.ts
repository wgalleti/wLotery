import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useStorage } from '@/composables/useStorage'
import { STORAGE_KEYS } from '@/utils/constants'
import type { LotteryType } from '@/types/lottery'
import type { Strategy } from '@/types/statistics'

export interface HistoryEntry {
  date: string
  lottery: LotteryType
  drawsAnalyzed: number
  strategy: Strategy
  gamesGenerated: number
  fromContest: number
  toContest: number
}

export const useHistoryStore = defineStore('history', () => {
  const storage = useStorage()

  const entries = ref<HistoryEntry[]>(storage.get<HistoryEntry[]>(STORAGE_KEYS.history, []))

  watch(entries, (v) => storage.set(STORAGE_KEYS.history, v), { deep: true })

  function addEntry(entry: Omit<HistoryEntry, 'date'>) {
    entries.value.unshift({
      ...entry,
      date: new Date().toISOString(),
    })
  }

  function mergeEntries(incoming: HistoryEntry[]) {
    entries.value.push(...incoming)
    entries.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return { entries, addEntry, mergeEntries }
})
