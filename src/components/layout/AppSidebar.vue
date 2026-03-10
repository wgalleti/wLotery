<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { STRATEGIES, MIN_VOLUME, MAX_VOLUME, MIN_GAME_COUNT, MAX_GAME_COUNT } from '@/utils/constants'
import type { PeriodMode } from '@/types/statistics'

const emit = defineEmits<{
  analyze: []
}>()

const settings = useSettingsStore()

const periodModes: { value: PeriodMode; label: string }[] = [
  { value: 'volume', label: 'Por volume' },
  { value: 'period', label: 'Por período' },
]
</script>

<template>
  <aside class="space-y-5">
    <!-- Period Mode -->
    <div>
      <label class="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Período</label>
      <div class="flex gap-1 bg-bg-base rounded-lg p-1">
        <button
          v-for="mode in periodModes"
          :key="mode.value"
          class="flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer"
          :class="settings.periodMode === mode.value
            ? 'bg-primary text-white'
            : 'text-text-muted hover:text-text-base'"
          @click="settings.periodMode = mode.value"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <!-- Volume slider -->
    <div v-if="settings.periodMode === 'volume'">
      <label class="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
        Sorteios: <span class="text-accent font-lottery">{{ settings.volume }}</span>
      </label>
      <input
        v-model.number="settings.volume"
        type="range"
        :min="MIN_VOLUME"
        :max="MAX_VOLUME"
        step="10"
        class="w-full accent-primary"
      />
      <div class="flex justify-between text-[10px] text-text-dim mt-1">
        <span>{{ MIN_VOLUME }}</span>
        <span>{{ MAX_VOLUME }}</span>
      </div>
    </div>

    <!-- Date range -->
    <div v-else class="space-y-2">
      <div>
        <label class="block text-xs font-medium text-text-muted uppercase tracking-wider mb-1">De</label>
        <input
          v-model="settings.dateFrom"
          type="date"
          class="w-full bg-bg-base border border-border-base rounded-lg px-3 py-2 text-sm text-text-base focus:outline-none focus:border-primary"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Até</label>
        <input
          v-model="settings.dateTo"
          type="date"
          class="w-full bg-bg-base border border-border-base rounded-lg px-3 py-2 text-sm text-text-base focus:outline-none focus:border-primary"
        />
      </div>
    </div>

    <!-- Strategy -->
    <div>
      <label class="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Estratégia</label>
      <select
        v-model="settings.strategy"
        class="w-full bg-bg-base border border-border-base rounded-lg px-3 py-2 text-sm text-text-base focus:outline-none focus:border-primary"
      >
        <option
          v-for="s in STRATEGIES"
          :key="s.value"
          :value="s.value"
        >
          {{ s.label }}
        </option>
      </select>
      <p class="text-[11px] text-text-dim mt-1">
        {{ STRATEGIES.find(s => s.value === settings.strategy)?.description }}
      </p>
    </div>

    <!-- Game count -->
    <div>
      <label class="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
        Jogos: <span class="text-accent font-lottery">{{ settings.gameCount }}</span>
      </label>
      <input
        v-model.number="settings.gameCount"
        type="range"
        :min="MIN_GAME_COUNT"
        :max="MAX_GAME_COUNT"
        step="1"
        class="w-full accent-primary"
      />
    </div>

    <!-- Analyze button -->
    <button
      class="w-full bg-primary hover:bg-primary-light text-white font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
      @click="emit('analyze')"
    >
      Analisar e Gerar
    </button>
  </aside>
</template>
