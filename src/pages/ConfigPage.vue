<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useDrawsStore } from '@/stores/draws'
import { useGamesStore } from '@/stores/games'
import { useStorage } from '@/composables/useStorage'
import { useExportImport } from '@/composables/useExportImport'
import { useLotteryApi } from '@/composables/useLotteryApi'
import { useGameChecker } from '@/composables/useGameChecker'

const toast = useToast()
const drawsStore = useDrawsStore()
const gamesStore = useGamesStore()
const storage = useStorage()
const { downloadExport, importFromFile, downloadGamesTxt } = useExportImport()
const api = useLotteryApi()
const { checkAllGamesAgainstNewDraws } = useGameChecker()

const fileInput = ref<HTMLInputElement | null>(null)

const megasenaCount = computed(() => drawsStore.totalDraws('megasena'))
const lotofacilCount = computed(() => drawsStore.totalDraws('lotofacil'))
const gamesCount = computed(() => gamesStore.games.length)
const storageUsed = computed(() => {
  const bytes = storage.getUsedBytes()
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

async function syncAll() {
  const m = await api.syncDraws('megasena')
  const l = await api.syncDraws('lotofacil')
  const total = m.added + l.added
  if (total > 0) {
    checkAllGamesAgainstNewDraws('megasena')
    checkAllGamesAgainstNewDraws('lotofacil')
    toast.add({ severity: 'success', summary: 'Sincronizado', detail: `${total} novos sorteios`, life: 3000 })
  } else if (!api.error.value) {
    toast.add({ severity: 'info', summary: 'Dados já atualizados', life: 2000 })
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: api.error.value, life: 4000 })
  }
}

function handleExport() {
  downloadExport()
  toast.add({ severity: 'success', summary: 'Exportado', life: 2000 })
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const result = await importFromFile(file)
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Importado', detail: result.message, life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: result.message, life: 4000 })
  }
  target.value = ''
}

function clearCache() {
  if (!confirm('Limpar todos os sorteios do cache? Jogos salvos serão mantidos.')) return
  drawsStore.clearDraws('megasena')
  drawsStore.clearDraws('lotofacil')
  toast.add({ severity: 'info', summary: 'Cache limpo', life: 2000 })
}

function handleExportTxt() {
  downloadGamesTxt()
  toast.add({ severity: 'success', summary: 'TXT exportado', life: 2000 })
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">
    <h1 class="text-xl font-bold text-text-bright">Configurações</h1>

    <!-- Data -->
    <section class="bg-bg-surface border border-border-base rounded-xl p-5 space-y-3">
      <h2 class="text-sm font-medium text-text-bright">Dados</h2>
      <div class="text-xs text-text-muted space-y-1">
        <p>Mega-Sena: <span class="text-text-base font-lottery">{{ megasenaCount }}</span> sorteios</p>
        <p>Lotofácil: <span class="text-text-base font-lottery">{{ lotofacilCount }}</span> sorteios</p>
        <p>Jogos salvos: <span class="text-text-base font-lottery">{{ gamesCount }}</span></p>
      </div>
      <button
        class="w-full bg-primary/15 text-accent hover:bg-primary/25 font-medium py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
        :disabled="api.isLoading.value"
        @click="syncAll"
      >
        {{ api.isLoading.value ? 'Sincronizando...' : 'Sincronizar tudo' }}
      </button>
      <p v-if="api.progress.value" class="text-xs text-text-dim">{{ api.progress.value }}</p>
    </section>

    <!-- Backup -->
    <section class="bg-bg-surface border border-border-base rounded-xl p-5 space-y-3">
      <h2 class="text-sm font-medium text-text-bright">Backup</h2>
      <div class="grid grid-cols-2 gap-2">
        <button
          class="bg-bg-surface-hover text-text-base hover:text-accent font-medium py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
          @click="handleExport"
        >
          Exportar JSON
        </button>
        <button
          class="bg-bg-surface-hover text-text-base hover:text-accent font-medium py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
          @click="triggerImport"
        >
          Importar JSON
        </button>
      </div>
      <button
        v-if="gamesCount > 0"
        class="w-full bg-bg-surface-hover text-text-muted hover:text-text-base font-medium py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
        @click="handleExportTxt"
      >
        Exportar jogos como TXT
      </button>
      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleImport" />
    </section>

    <!-- Storage -->
    <section class="bg-bg-surface border border-border-base rounded-xl p-5 space-y-3">
      <h2 class="text-sm font-medium text-text-bright">Armazenamento</h2>
      <div class="text-xs text-text-muted">
        <p>localStorage usado: <span class="text-text-base font-lottery">{{ storageUsed }}</span> / 5.0 MB</p>
      </div>
      <button
        class="w-full bg-bg-surface-hover text-text-muted hover:text-error font-medium py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
        @click="clearCache"
      >
        Limpar cache de sorteios
      </button>
    </section>

    <!-- About -->
    <section class="bg-bg-surface border border-border-base rounded-xl p-5">
      <h2 class="text-sm font-medium text-text-bright mb-2">Sobre</h2>
      <div class="text-xs text-text-muted space-y-1">
        <p>LotoStats v1.0</p>
        <p>Uso pessoal — dados da Caixa Econômica Federal</p>
        <p>Análise estatística com fins recreativos</p>
      </div>
    </section>
  </div>
</template>
