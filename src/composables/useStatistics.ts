import { HOT_COUNT, COLD_COUNT } from '@/utils/constants'
import type { Draw, LotteryConfig } from '@/types/lottery'
import type { AnalysisResult, NumberStats, DecadeRange } from '@/types/statistics'

export function useStatistics() {
  function analyze(draws: Draw[], config: LotteryConfig): AnalysisResult {
    const totalDraws = draws.length
    if (totalDraws === 0) {
      return emptyResult(config)
    }

    const sorted = [...draws].sort((a, b) => a.contest - b.contest)
    const fromContest = sorted[0]!.contest
    const toContest = sorted[sorted.length - 1]!.contest

    const frequencyMap = calcFrequency(sorted, config)
    const delayMap = calcDelay(sorted, config)
    const numberStats = buildNumberStats(frequencyMap, delayMap, totalDraws, config)
    const hotNumbers = numberStats.filter((n) => n.isHot).map((n) => n.number)
    const coldNumbers = numberStats.filter((n) => n.isCold).map((n) => n.number)
    const averageParity = calcParity(sorted, config)
    const averageSum = calcAverageSum(sorted)
    const decadeDistribution = calcDecadeDistribution(sorted, config)
    const averageConsecutives = calcConsecutives(sorted)
    const sumPerDraw = sorted.map((d) => ({
      contest: d.contest,
      sum: d.numbers.reduce((a, b) => a + b, 0),
    }))

    return {
      totalDraws,
      fromContest,
      toContest,
      numberStats,
      hotNumbers,
      coldNumbers,
      averageParity,
      averageSum,
      decadeDistribution,
      averageConsecutives,
      sumPerDraw,
    }
  }

  function calcFrequency(draws: Draw[], config: LotteryConfig): Map<number, number> {
    const freq = new Map<number, number>()
    for (let n = config.minNumber; n <= config.maxNumber; n++) {
      freq.set(n, 0)
    }
    for (const draw of draws) {
      for (const num of draw.numbers) {
        freq.set(num, (freq.get(num) ?? 0) + 1)
      }
    }
    return freq
  }

  function calcDelay(draws: Draw[], config: LotteryConfig): Map<number, number> {
    const delay = new Map<number, number>()
    const sorted = [...draws].sort((a, b) => b.contest - a.contest)

    for (let n = config.minNumber; n <= config.maxNumber; n++) {
      let d = 0
      for (const draw of sorted) {
        if (draw.numbers.includes(n)) break
        d++
      }
      delay.set(n, d)
    }
    return delay
  }

  function buildNumberStats(
    freqMap: Map<number, number>,
    delayMap: Map<number, number>,
    totalDraws: number,
    config: LotteryConfig,
  ): NumberStats[] {
    const entries: NumberStats[] = []
    for (let n = config.minNumber; n <= config.maxNumber; n++) {
      const frequency = freqMap.get(n) ?? 0
      entries.push({
        number: n,
        frequency,
        frequencyPercent: totalDraws > 0 ? (frequency / totalDraws) * 100 : 0,
        delay: delayMap.get(n) ?? 0,
        isHot: false,
        isCold: false,
      })
    }

    const byFreqDesc = [...entries].sort((a, b) => b.frequency - a.frequency)
    for (let i = 0; i < Math.min(HOT_COUNT, byFreqDesc.length); i++) {
      const item = byFreqDesc[i]
      if (!item) continue
      const stat = entries.find((e) => e.number === item.number)
      if (stat) stat.isHot = true
    }
    for (let i = byFreqDesc.length - 1; i >= Math.max(0, byFreqDesc.length - COLD_COUNT); i--) {
      const item = byFreqDesc[i]
      if (!item) continue
      const stat = entries.find((e) => e.number === item.number)
      if (stat) stat.isCold = true
    }

    return entries
  }

  function calcParity(draws: Draw[], _config: LotteryConfig): { even: number; odd: number } {
    if (draws.length === 0) return { even: 50, odd: 50 }

    let totalEven = 0
    let totalNumbers = 0

    for (const draw of draws) {
      for (const num of draw.numbers) {
        if (num % 2 === 0) totalEven++
        totalNumbers++
      }
    }

    const evenPercent = (totalEven / totalNumbers) * 100
    return { even: Math.round(evenPercent * 10) / 10, odd: Math.round((100 - evenPercent) * 10) / 10 }
  }

  function calcAverageSum(draws: Draw[]): number {
    if (draws.length === 0) return 0
    const total = draws.reduce((acc, d) => acc + d.numbers.reduce((a, b) => a + b, 0), 0)
    return Math.round((total / draws.length) * 10) / 10
  }

  function calcDecadeDistribution(draws: Draw[], config: LotteryConfig): DecadeRange[] {
    const counts = new Map<string, number>()
    let totalNumbers = 0

    for (const range of config.decadeRanges) {
      counts.set(`${range[0]}-${range[1]}`, 0)
    }

    for (const draw of draws) {
      for (const num of draw.numbers) {
        totalNumbers++
        for (const range of config.decadeRanges) {
          if (num >= range[0] && num <= range[1]) {
            const key = `${range[0]}-${range[1]}`
            counts.set(key, (counts.get(key) ?? 0) + 1)
            break
          }
        }
      }
    }

    return config.decadeRanges.map((range) => {
      const key = `${range[0]}-${range[1]}`
      const count = counts.get(key) ?? 0
      return {
        range,
        label: `${String(range[0]).padStart(2, '0')}-${String(range[1]).padStart(2, '0')}`,
        count,
        percent: totalNumbers > 0 ? Math.round((count / totalNumbers) * 1000) / 10 : 0,
      }
    })
  }

  function calcConsecutives(draws: Draw[]): number {
    if (draws.length === 0) return 0

    let totalConsecutivePairs = 0
    for (const draw of draws) {
      const sorted = [...draw.numbers].sort((a, b) => a - b)
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i]! === sorted[i - 1]! + 1) totalConsecutivePairs++
      }
    }

    return Math.round((totalConsecutivePairs / draws.length) * 100) / 100
  }

  function emptyResult(config: LotteryConfig): AnalysisResult {
    return {
      totalDraws: 0,
      fromContest: 0,
      toContest: 0,
      numberStats: Array.from({ length: config.maxNumber }, (_, i) => ({
        number: i + 1,
        frequency: 0,
        frequencyPercent: 0,
        delay: 0,
        isHot: false,
        isCold: false,
      })),
      hotNumbers: [],
      coldNumbers: [],
      averageParity: { even: 50, odd: 50 },
      averageSum: 0,
      decadeDistribution: [],
      averageConsecutives: 0,
      sumPerDraw: [],
    }
  }

  return { analyze }
}
