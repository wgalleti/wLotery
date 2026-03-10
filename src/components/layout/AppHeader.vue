<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)

const navItems = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Mega-Sena', to: '/mega-sena', icon: 'star' },
  { label: 'Lotofácil', to: '/lotofacil', icon: 'grid' },
  { label: 'Meus Jogos', to: '/meus-jogos', icon: 'heart' },
  { label: 'Histórico', to: '/historico', icon: 'clock' },
  { label: 'Config', to: '/configuracoes', icon: 'settings' },
]

function navigate(to: string) {
  router.push(to)
  mobileMenuOpen.value = false
}

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-bg-surface/95 backdrop-blur border-b border-border-base">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
      <!-- Logo -->
      <button class="flex items-center gap-2 cursor-pointer" @click="navigate('/')">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#16a34a" stroke-width="2" fill="#16a34a20" />
          <circle cx="11" cy="13" r="2.5" fill="#4ade80" />
          <circle cx="20" cy="11" r="2.5" fill="#4ade80" />
          <circle cx="16" cy="19" r="2.5" fill="#4ade80" />
          <circle cx="22" cy="18" r="1.5" fill="#16a34a" />
        </svg>
        <span class="text-text-bright font-bold text-lg tracking-tight">LotoStats</span>
      </button>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1">
        <button
          v-for="item in navItems"
          :key="item.to"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          :class="isActive(item.to) ? 'bg-primary/15 text-accent' : 'text-text-muted hover:text-text-base hover:bg-bg-surface-hover'"
          @click="navigate(item.to)"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden p-2 text-text-muted hover:text-text-base cursor-pointer"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <template v-if="!mobileMenuOpen">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </template>
          <template v-else>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </template>
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="slide">
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-border-base bg-bg-surface">
        <nav class="flex flex-col p-2">
          <button
            v-for="item in navItems"
            :key="item.to"
            class="px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors cursor-pointer"
            :class="isActive(item.to) ? 'bg-primary/15 text-accent' : 'text-text-muted hover:text-text-base hover:bg-bg-surface-hover'"
            @click="navigate(item.to)"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
