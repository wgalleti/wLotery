import type { LotteryConfig, LotteryType } from '@/types/lottery'
import type { Strategy } from '@/types/statistics'

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  megasena: {
    type: 'megasena',
    name: 'Mega-Sena',
    slug: 'mega-sena',
    apiSlug: 'megasena',
    numbersPerGame: 6,
    maxNumber: 60,
    minNumber: 1,
    prizeTiers: [
      { hits: 6, label: 'Sena' },
      { hits: 5, label: 'Quina' },
      { hits: 4, label: 'Quadra' },
    ],
    decadeRanges: [
      [1, 10],
      [11, 20],
      [21, 30],
      [31, 40],
      [41, 50],
      [51, 60],
    ],
  },
  lotofacil: {
    type: 'lotofacil',
    name: 'Lotofácil',
    slug: 'lotofacil',
    apiSlug: 'lotofacil',
    numbersPerGame: 15,
    maxNumber: 25,
    minNumber: 1,
    prizeTiers: [
      { hits: 15, label: '1º Prêmio' },
      { hits: 14, label: '2º Prêmio' },
      { hits: 13, label: '3º Prêmio' },
      { hits: 12, label: '4º Prêmio' },
      { hits: 11, label: '5º Prêmio' },
    ],
    decadeRanges: [
      [1, 5],
      [6, 10],
      [11, 15],
      [16, 20],
      [21, 25],
    ],
  },
}

export const STRATEGIES: { value: Strategy; label: string; description: string }[] = [
  { value: 'weighted', label: 'Frequência Ponderada', description: 'Números mais sorteados têm maior peso' },
  { value: 'balanced', label: 'Equilíbrio', description: 'Mistura proporcional de quentes e frios' },
  { value: 'inverse', label: 'Inversão', description: 'Prioriza números menos sorteados' },
  { value: 'random', label: 'Aleatório Puro', description: 'Sem viés estatístico' },
]

export const CORS_PROXIES = [
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
]

export const CAIXA_API_BASE = 'https://servicebus2.caixa.gov.br/portaldeloterias/api'

export const STORAGE_KEYS = {
  settings: 'lotostats:settings',
  drawsMegasena: 'lotostats:draws:megasena',
  drawsLotofacil: 'lotostats:draws:lotofacil',
  games: 'lotostats:games',
  history: 'lotostats:history',
} as const

export const EXPORT_VERSION = '1.0'

export const HOT_COUNT = 10
export const COLD_COUNT = 10
export const DEFAULT_VOLUME = 100
export const MIN_VOLUME = 10
export const MAX_VOLUME = 500
export const DEFAULT_GAME_COUNT = 4
export const MIN_GAME_COUNT = 1
export const MAX_GAME_COUNT = 10
export const PROXY_TIMEOUT_MS = 5000
