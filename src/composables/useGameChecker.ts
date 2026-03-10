import { LOTTERY_CONFIGS } from '@/utils/constants'
import { useGamesStore } from '@/stores/games'
import { useDrawsStore } from '@/stores/draws'
import type { Draw, LotteryType } from '@/types/lottery'
import type { GameCheck, SavedGame } from '@/types/game'

export function useGameChecker() {
  function checkGame(game: SavedGame, draw: Draw): GameCheck {
    const hits = game.numbers.filter((n) => draw.numbers.includes(n))
    const config = LOTTERY_CONFIGS[game.lottery]

    let prize: string | null = null
    for (const tier of config.prizeTiers) {
      if (hits.length >= tier.hits) {
        prize = tier.label
        break
      }
    }

    return {
      contest: draw.contest,
      date: draw.date,
      drawnNumbers: draw.numbers,
      hits,
      hitCount: hits.length,
      prize,
    }
  }

  function checkAllGamesAgainstNewDraws(lottery: LotteryType) {
    const gamesStore = useGamesStore()
    const drawsStore = useDrawsStore()

    const games = gamesStore.games.filter((g) => g.lottery === lottery)
    const draws = drawsStore.getDraws(lottery)

    for (const game of games) {
      const checkedContests = new Set(game.checks.map((c: GameCheck) => c.contest))
      const createdAt = new Date(game.createdAt)

      for (const draw of draws) {
        if (checkedContests.has(draw.contest)) continue
        const drawDate = new Date(draw.date)
        if (drawDate < createdAt) continue

        const check = checkGame(game, draw)
        gamesStore.addCheck(game.id, check)
      }
    }
  }

  function checkGameManually(gameId: string, contest: number): GameCheck | null {
    const gamesStore = useGamesStore()
    const drawsStore = useDrawsStore()

    const game = gamesStore.games.find((g) => g.id === gameId)
    if (!game) return null

    const draws = drawsStore.getDraws(game.lottery)
    const draw = draws.find((d) => d.contest === contest)
    if (!draw) return null

    const check = checkGame(game, draw)
    gamesStore.addCheck(game.id, check)
    return check
  }

  return { checkGame, checkAllGamesAgainstNewDraws, checkGameManually }
}
