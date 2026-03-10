import { ref } from 'vue'
import { CORS_PROXIES, CAIXA_API_BASE, PROXY_TIMEOUT_MS } from '@/utils/constants'
import { useDrawsStore } from '@/stores/draws'
import type { Draw, LotteryType } from '@/types/lottery'
import { LOTTERY_CONFIGS } from '@/utils/constants'

interface CaixaDrawResponse {
  numero?: number
  concurso?: number
  data?: string
  dataApuracao?: string
  dezenas?: string[]
  listaDezenas?: string[]
  dezenasSorteadasOrdemSorteio?: string[]
}

function parseDrawResponse(raw: CaixaDrawResponse): Draw | null {
  const contest = raw.numero ?? raw.concurso
  const date = raw.data ?? raw.dataApuracao
  const numbersRaw = raw.dezenas ?? raw.listaDezenas ?? raw.dezenasSorteadasOrdemSorteio

  if (!contest || !date || !numbersRaw) return null

  const numbers = numbersRaw.map((n) => parseInt(n, 10)).sort((a, b) => a - b)
  return { contest, date, numbers }
}

async function fetchWithProxy(url: string): Promise<Response> {
  for (const makeProxyUrl of CORS_PROXIES) {
    const proxyUrl = makeProxyUrl(url)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS)

    try {
      const response = await fetch(proxyUrl, { signal: controller.signal })
      clearTimeout(timeout)
      if (response.ok) return response
    } catch {
      clearTimeout(timeout)
    }
  }
  throw new Error('Todos os proxies falharam. Seus dados locais continuam disponíveis.')
}

export function useLotteryApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref('')

  async function fetchLatest(lottery: LotteryType): Promise<Draw | null> {
    const config = LOTTERY_CONFIGS[lottery]
    const url = `${CAIXA_API_BASE}/${config.apiSlug}/latest`

    try {
      const response = await fetchWithProxy(url)
      const data = await response.json() as CaixaDrawResponse
      return parseDrawResponse(data)
    } catch {
      return null
    }
  }

  async function fetchAllDraws(lottery: LotteryType): Promise<Draw[]> {
    const config = LOTTERY_CONFIGS[lottery]
    const url = `${CAIXA_API_BASE}/${config.apiSlug}`

    const response = await fetchWithProxy(url)
    const data = await response.json()

    if (Array.isArray(data)) {
      return data
        .map((item: CaixaDrawResponse) => parseDrawResponse(item))
        .filter((d): d is Draw => d !== null)
        .sort((a, b) => a.contest - b.contest)
    }

    const single = parseDrawResponse(data as CaixaDrawResponse)
    return single ? [single] : []
  }

  async function fetchDrawByContest(lottery: LotteryType, contest: number): Promise<Draw | null> {
    const config = LOTTERY_CONFIGS[lottery]
    const url = `${CAIXA_API_BASE}/${config.apiSlug}/${contest}`

    try {
      const response = await fetchWithProxy(url)
      const data = await response.json() as CaixaDrawResponse
      return parseDrawResponse(data)
    } catch {
      return null
    }
  }

  async function syncDraws(lottery: LotteryType): Promise<{ added: number; total: number }> {
    const drawsStore = useDrawsStore()
    isLoading.value = true
    error.value = null

    try {
      const lastLocal = drawsStore.lastContest(lottery)

      if (lastLocal === null) {
        progress.value = `Buscando todos os sorteios da ${LOTTERY_CONFIGS[lottery].name}...`
        const allDraws = await fetchAllDraws(lottery)
        const added = drawsStore.mergeDraws(lottery, allDraws)
        return { added, total: drawsStore.totalDraws(lottery) }
      }

      progress.value = `Verificando novos sorteios da ${LOTTERY_CONFIGS[lottery].name}...`
      const latest = await fetchLatest(lottery)

      if (!latest) {
        error.value = 'Não foi possível verificar novos sorteios.'
        return { added: 0, total: drawsStore.totalDraws(lottery) }
      }

      if (latest.contest <= lastLocal) {
        progress.value = 'Dados já atualizados.'
        return { added: 0, total: drawsStore.totalDraws(lottery) }
      }

      progress.value = `Buscando concursos #${lastLocal + 1} a #${latest.contest}...`
      const newDraws: Draw[] = []

      for (let c = lastLocal + 1; c <= latest.contest; c++) {
        progress.value = `Buscando concurso #${c}...`
        const draw = await fetchDrawByContest(lottery, c)
        if (draw) newDraws.push(draw)
      }

      const added = drawsStore.mergeDraws(lottery, newDraws)
      return { added, total: drawsStore.totalDraws(lottery) }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao sincronizar dados.'
      return { added: 0, total: drawsStore.totalDraws(lottery) }
    } finally {
      isLoading.value = false
      progress.value = ''
    }
  }

  return {
    isLoading,
    error,
    progress,
    fetchLatest,
    fetchAllDraws,
    fetchDrawByContest,
    syncDraws,
  }
}
