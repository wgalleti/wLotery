import type { LotteryConfig } from '@/types/lottery'
import type { AnalysisResult } from '@/types/statistics'
import type { Strategy } from '@/types/statistics'

function weightedRandomPick(pool: number[], weights: Map<number, number>): number {
  const totalWeight = pool.reduce((acc, n) => acc + (weights.get(n) ?? 1), 0)
  let random = Math.random() * totalWeight

  for (const n of pool) {
    random -= weights.get(n) ?? 1
    if (random <= 0) return n
  }

  return pool[pool.length - 1] ?? 1
}

function generateSingleGame(
  config: LotteryConfig,
  weights: Map<number, number>,
): number[] {
  const pool: number[] = []
  for (let n = config.minNumber; n <= config.maxNumber; n++) {
    pool.push(n)
  }

  const selected: number[] = []
  const remaining = [...pool]

  for (let i = 0; i < config.numbersPerGame; i++) {
    const pick = weightedRandomPick(remaining, weights)
    selected.push(pick)
    remaining.splice(remaining.indexOf(pick), 1)
  }

  return selected.sort((a, b) => a - b)
}

function buildWeights(
  config: LotteryConfig,
  analysis: AnalysisResult,
  strategy: Strategy,
): Map<number, number> {
  const weights = new Map<number, number>()

  if (strategy === 'random') {
    for (let n = config.minNumber; n <= config.maxNumber; n++) {
      weights.set(n, 1)
    }
    return weights
  }

  if (strategy === 'weighted') {
    for (const stat of analysis.numberStats) {
      weights.set(stat.number, Math.max(stat.frequency, 1))
    }
    return weights
  }

  if (strategy === 'inverse') {
    const maxFreq = Math.max(...analysis.numberStats.map((s) => s.frequency))
    for (const stat of analysis.numberStats) {
      weights.set(stat.number, Math.max(maxFreq - stat.frequency + 1, 1))
    }
    return weights
  }

  if (strategy === 'balanced') {
    for (const stat of analysis.numberStats) {
      if (stat.isHot) {
        weights.set(stat.number, 3)
      } else if (stat.isCold) {
        weights.set(stat.number, 3)
      } else {
        weights.set(stat.number, 1)
      }
    }
    return weights
  }

  return weights
}

function gamesAreEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  return a.every((n, i) => n === b[i])
}

export function useGameGenerator() {
  function generate(
    config: LotteryConfig,
    analysis: AnalysisResult,
    strategy: Strategy,
    count: number,
  ): number[][] {
    const weights = buildWeights(config, analysis, strategy)
    const games: number[][] = []
    let attempts = 0
    const maxAttempts = count * 100

    while (games.length < count && attempts < maxAttempts) {
      attempts++
      const game = generateSingleGame(config, weights)
      const isDuplicate = games.some((existing) => gamesAreEqual(existing, game))
      if (!isDuplicate) {
        games.push(game)
      }
    }

    return games
  }

  return { generate }
}
