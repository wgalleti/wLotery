import { useStorage } from '@/composables/useStorage'
import { useDrawsStore } from '@/stores/draws'
import { useGamesStore } from '@/stores/games'
import { useHistoryStore } from '@/stores/history'
import { useSettingsStore } from '@/stores/settings'
import { STORAGE_KEYS, EXPORT_VERSION } from '@/utils/constants'
import { formatDateForExport } from '@/utils/formatters'
import type { Draw } from '@/types/lottery'
import type { SavedGame } from '@/types/game'
import type { HistoryEntry } from '@/stores/history'

interface ExportData {
  version: string
  exportedAt: string
  settings: Record<string, unknown>
  draws: {
    megasena: Draw[]
    lotofacil: Draw[]
  }
  games: SavedGame[]
  history: HistoryEntry[]
}

export function useExportImport() {
  const storage = useStorage()

  function exportAll(): string {
    const drawsStore = useDrawsStore()
    const gamesStore = useGamesStore()
    const historyStore = useHistoryStore()

    const data: ExportData = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) ?? '{}'),
      draws: {
        megasena: drawsStore.megasena,
        lotofacil: drawsStore.lotofacil,
      },
      games: gamesStore.games,
      history: historyStore.entries,
    }

    return JSON.stringify(data, null, 2)
  }

  function downloadExport() {
    const json = exportAll()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lotostats-backup-${formatDateForExport()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(jsonString: string): { success: boolean; message: string } {
    let data: ExportData

    try {
      data = JSON.parse(jsonString) as ExportData
    } catch {
      return { success: false, message: 'Arquivo JSON inválido.' }
    }

    if (!data.version) {
      return { success: false, message: 'Arquivo inválido — campo "version" não encontrado.' }
    }

    if (data.version !== EXPORT_VERSION) {
      return { success: false, message: `Versão do arquivo não suportada. Esperado: ${EXPORT_VERSION}` }
    }

    const drawsStore = useDrawsStore()
    const gamesStore = useGamesStore()
    const historyStore = useHistoryStore()

    let addedDraws = 0
    if (data.draws?.megasena) {
      addedDraws += drawsStore.mergeDraws('megasena', data.draws.megasena)
    }
    if (data.draws?.lotofacil) {
      addedDraws += drawsStore.mergeDraws('lotofacil', data.draws.lotofacil)
    }

    let addedGames = 0
    if (data.games) {
      addedGames = gamesStore.mergeGames(data.games)
    }

    if (data.history) {
      historyStore.mergeEntries(data.history)
    }

    if (data.settings) {
      storage.set(STORAGE_KEYS.settings, data.settings)
      const settingsStore = useSettingsStore()
      Object.assign(settingsStore, data.settings)
    }

    return {
      success: true,
      message: `Importado: ${addedDraws} sorteios, ${addedGames} jogos.`,
    }
  }

  function importFromFile(file: File): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = importData(reader.result as string)
        resolve(result)
      }
      reader.onerror = () => {
        resolve({ success: false, message: 'Erro ao ler o arquivo.' })
      }
      reader.readAsText(file)
    })
  }

  function exportGamesTxt(): string {
    const gamesStore = useGamesStore()
    const lines: string[] = ['LotoStats — Jogos Exportados', `Data: ${new Date().toLocaleDateString('pt-BR')}`, '']

    for (const game of gamesStore.games) {
      const lotteryName = game.lottery === 'megasena' ? 'Mega-Sena' : 'Lotofácil'
      lines.push(`${lotteryName} — ${game.strategy}`)
      lines.push(game.numbers.map((n) => String(n).padStart(2, '0')).join(' - '))
      lines.push('')
    }

    return lines.join('\n')
  }

  function downloadGamesTxt() {
    const txt = exportGamesTxt()
    const blob = new Blob([txt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lotostats-jogos-${formatDateForExport()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { exportAll, downloadExport, importData, importFromFile, downloadGamesTxt }
}
