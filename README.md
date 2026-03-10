# LotoStats

Aplicacao web PWA para analise estatistica de loterias brasileiras (Mega-Sena e Lotofacil). Uso pessoal, sem backend, 100% client-side.

## Stack

- **Vue 3** (Composition API, `<script setup>`, TypeScript)
- **PrimeVue 4** (unstyled mode)
- **Tailwind CSS 4**
- **Pinia** (state management com persistencia localStorage)
- **Vite** (build + dev)
- **vite-plugin-pwa** (Service Worker, offline support)

## Funcionalidades

- Busca de sorteios da API oficial da Caixa via CORS proxy com fallback
- Persistencia total em localStorage com sync incremental
- Analise estatistica: frequencia, numeros quentes/frios, atraso, paridade, soma, faixas, consecutivos
- Geracao de jogos com 4 estrategias: frequencia ponderada, equilibrio, inversao, aleatorio puro
- Salvamento de jogos com conferencia automatica contra novos sorteios
- Heatmap SVG customizado para visualizacao de frequencias
- Export/import de dados via JSON
- Export de jogos como TXT
- PWA com funcionamento offline
- Dark mode com paleta verde escuro

## Rotas

| Rota | Descricao |
|---|---|
| `/` | Home com resumo das loterias |
| `/mega-sena` | Dashboard de analise da Mega-Sena |
| `/lotofacil` | Dashboard de analise da Lotofacil |
| `/meus-jogos` | Jogos salvos com conferencia |
| `/historico` | Historico de sorteios |
| `/configuracoes` | Settings, export/import, storage |

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (GitHub Pages)

```bash
npm run deploy
```

## Estrutura

```
src/
  components/
    layout/       # AppHeader, AppSidebar, AppFooter
    common/       # NumberBall, StatCard, LotteryBadge
    charts/       # HeatmapGrid, FrequencyChart, SumTrendChart, ParityDonut
    games/        # GameCard, GameList, GameChecker
  composables/    # useLotteryApi, useStatistics, useGameGenerator, useGameChecker, useStorage, useExportImport
  stores/         # settings, draws, games, history, analysis
  pages/          # HomePage, DashboardPage, MeusJogosPage, HistoricoPage, ConfigPage
  router/
  types/
  utils/
```

## Licenca

Uso pessoal.
