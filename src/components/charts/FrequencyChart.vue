<script setup lang="ts">
import { computed } from 'vue'
import type { NumberStats } from '@/types/statistics'

const props = defineProps<{
  stats: NumberStats[]
}>()

const sorted = computed(() => [...props.stats].sort((a, b) => b.frequency - a.frequency))
const top15 = computed(() => sorted.value.slice(0, 15))
const bottom15 = computed(() => sorted.value.slice(-15).reverse())

const maxFreq = computed(() => sorted.value[0]?.frequency ?? 1)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h4 class="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Top 15 mais frequentes</h4>
      <div class="flex items-end gap-1 h-32">
        <div
          v-for="stat in top15"
          :key="stat.number"
          class="flex-1 flex flex-col items-center gap-1"
        >
          <span class="text-[9px] text-text-muted font-lottery">{{ stat.frequency }}</span>
          <div
            class="w-full rounded-t bg-accent/80 transition-all"
            :style="{ height: (stat.frequency / maxFreq) * 100 + '%', minHeight: '4px' }"
          />
          <span class="text-[9px] text-text-dim font-lottery">{{ String(stat.number).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>

    <div>
      <h4 class="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Top 15 menos frequentes</h4>
      <div class="flex items-end gap-1 h-32">
        <div
          v-for="stat in bottom15"
          :key="stat.number"
          class="flex-1 flex flex-col items-center gap-1"
        >
          <span class="text-[9px] text-text-muted font-lottery">{{ stat.frequency }}</span>
          <div
            class="w-full rounded-t bg-text-muted/50 transition-all"
            :style="{ height: (stat.frequency / maxFreq) * 100 + '%', minHeight: '4px' }"
          />
          <span class="text-[9px] text-text-dim font-lottery">{{ String(stat.number).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
