import type { LotteryType } from './lottery'

export interface GameSource {
  drawsAnalyzed: number
  fromContest: number
  toContest: number
}

export interface GameCheck {
  contest: number
  date: string
  drawnNumbers: number[]
  hits: number[]
  hitCount: number
  prize: string | null
}

export interface SavedGame {
  id: string
  lottery: LotteryType
  numbers: number[]
  strategy: string
  createdAt: string
  source: GameSource
  favorite: boolean
  checks: GameCheck[]
}
