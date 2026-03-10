import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStorage } from '@/composables/useStorage'
import { STORAGE_KEYS } from '@/utils/constants'
import { generateId } from '@/utils/formatters'
import type { SavedGame, GameCheck } from '@/types/game'
import type { LotteryType } from '@/types/lottery'

export const useGamesStore = defineStore('games', () => {
  const storage = useStorage()

  const games = ref<SavedGame[]>(storage.get<SavedGame[]>(STORAGE_KEYS.games, []))

  watch(games, (v) => storage.set(STORAGE_KEYS.games, v), { deep: true })

  const gamesByLottery = computed(() => (lottery: LotteryType) =>
    games.value.filter((g) => g.lottery === lottery),
  )

  const favorites = computed(() => games.value.filter((g) => g.favorite))

  function addGame(game: Omit<SavedGame, 'id' | 'createdAt' | 'favorite' | 'checks'>): SavedGame {
    const newGame: SavedGame = {
      ...game,
      id: generateId(),
      createdAt: new Date().toISOString(),
      favorite: false,
      checks: [],
    }
    games.value.push(newGame)
    return newGame
  }

  function removeGame(id: string) {
    const idx = games.value.findIndex((g) => g.id === id)
    if (idx !== -1) games.value.splice(idx, 1)
  }

  function toggleFavorite(id: string) {
    const game = games.value.find((g) => g.id === id)
    if (game) game.favorite = !game.favorite
  }

  function addCheck(gameId: string, check: GameCheck) {
    const game = games.value.find((g) => g.id === gameId)
    if (!game) return
    const exists = game.checks.some((c) => c.contest === check.contest)
    if (!exists) game.checks.push(check)
  }

  function mergeGames(incoming: SavedGame[]) {
    const existingIds = new Set(games.value.map((g) => g.id))
    const newGames = incoming.filter((g) => !existingIds.has(g.id))
    if (newGames.length > 0) {
      games.value.push(...newGames)
    }
    return newGames.length
  }

  return {
    games,
    gamesByLottery,
    favorites,
    addGame,
    removeGame,
    toggleFavorite,
    addCheck,
    mergeGames,
  }
})
