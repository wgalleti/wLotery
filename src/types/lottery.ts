export type LotteryType = 'megasena' | 'lotofacil'

export interface Draw {
  contest: number
  date: string
  numbers: number[]
}

export interface PrizeTier {
  hits: number
  label: string
}

export interface LotteryConfig {
  type: LotteryType
  name: string
  slug: string
  apiSlug: string
  numbersPerGame: number
  maxNumber: number
  minNumber: number
  prizeTiers: PrizeTier[]
  decadeRanges: [number, number][]
}
