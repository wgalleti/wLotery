export type Strategy = 'weighted' | 'balanced' | 'inverse' | 'random'

export type PeriodMode = 'volume' | 'period'

export interface PeriodConfig {
  mode: PeriodMode
  volume: number
  dateFrom: string | null
  dateTo: string | null
}

export interface NumberStats {
  number: number
  frequency: number
  frequencyPercent: number
  delay: number
  isHot: boolean
  isCold: boolean
}

export interface DecadeRange {
  range: [number, number]
  label: string
  count: number
  percent: number
}

export interface AnalysisResult {
  totalDraws: number
  fromContest: number
  toContest: number
  numberStats: NumberStats[]
  hotNumbers: number[]
  coldNumbers: number[]
  averageParity: { even: number; odd: number }
  averageSum: number
  decadeDistribution: DecadeRange[]
  averageConsecutives: number
  sumPerDraw: { contest: number; sum: number }[]
}
