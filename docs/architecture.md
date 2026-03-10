# Arquitetura

## Visao Geral

LotoStats e uma PWA 100% client-side. Nao possui backend. Todos os dados sao persistidos em localStorage e a unica comunicacao externa e com a API da Caixa Economica Federal via CORS proxy.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Vue 3 App                          │   │
│  │                                                      │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │   │
│  │  │ Pages  │  │Compone-│  │Composa-│  │ Stores │    │   │
│  │  │        │──│ ntes   │──│ bles   │──│(Pinia) │    │   │
│  │  └────────┘  └────────┘  └────────┘  └───┬────┘    │   │
│  │                                           │         │   │
│  │                                    ┌──────▼──────┐  │   │
│  │                                    │ localStorage│  │   │
│  │                                    └─────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────┐                                           │
│  │Service Worker│  ← precache de assets para offline        │
│  └──────────────┘                                           │
│                                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │ fetch (via CORS proxy)
                            ▼
                 ┌─────────────────────┐
                 │   API Caixa (HTTPS) │
                 │ servicebus2.caixa.  │
                 │ gov.br/portaldelo-  │
                 │ terias/api/         │
                 └─────────────────────┘
```

## Camadas

### Pages (src/pages/)

Componentes de rota. Cada pagina corresponde a uma URL:

| Rota | Componente | Responsabilidade |
|---|---|---|
| `/` | `HomePage` | Resumo das loterias, links rapidos |
| `/mega-sena` | `DashboardPage` | Dashboard parametrizado (lottery=megasena) |
| `/lotofacil` | `DashboardPage` | Dashboard parametrizado (lottery=lotofacil) |
| `/meus-jogos` | `MeusJogosPage` | Jogos salvos, conferencia, filtros |
| `/historico` | `HistoricoPage` | Tabela paginada de sorteios |
| `/configuracoes` | `ConfigPage` | Sync, export/import, storage |

O `DashboardPage` e reutilizado para ambas loterias via props.

### Stores (src/stores/)

Estado global com Pinia. Cada store persiste automaticamente em localStorage.

| Store | Chave localStorage | Descricao |
|---|---|---|
| `settings` | `lotostats:settings` | Preferencias do usuario |
| `draws` | `lotostats:draws:megasena`, `lotostats:draws:lotofacil` | Sorteios baixados |
| `games` | `lotostats:games` | Jogos salvos com conferencias |
| `history` | `lotostats:history` | Log de analises realizadas |
| `analysis` | _(nao persiste)_ | Resultado da analise atual |

### Composables (src/composables/)

Logica de negocio reutilizavel, sem estado global.

| Composable | Responsabilidade |
|---|---|
| `useStorage` | Abstrai localStorage com namespace `lotostats:` |
| `useLotteryApi` | Fetch da API Caixa via CORS proxy chain com fallback |
| `useStatistics` | Calculos estatisticos sobre sorteios |
| `useGameGenerator` | Geracao de jogos com selecao ponderada |
| `useGameChecker` | Conferencia de jogos contra sorteios |
| `useExportImport` | Export/import JSON e TXT |

### Components (src/components/)

Organizados por funcao:

```
components/
  layout/     → AppHeader, AppSidebar, AppFooter
  common/     → NumberBall, StatCard, LotteryBadge
  charts/     → HeatmapGrid, FrequencyChart, SumTrendChart, ParityDonut
  games/      → GameCard, GameList, GameChecker
```

## Fluxo de Dados

### Sync de Sorteios

```
Usuario clica "Analisar"
  │
  ├─ localStorage vazio?
  │   └─ SIM → fetchAllDraws() via CORS proxy
  │             └─ mergeDraws() → localStorage
  │
  └─ localStorage tem dados?
      └─ SIM → fetchLatest() para comparar
               ├─ Tem novos? → fetch incremental → mergeDraws()
               └─ Atualizado? → usa dados locais
```

### CORS Proxy Chain

A API da Caixa bloqueia CORS. O composable `useLotteryApi` tenta proxies em sequencia:

1. `corsproxy.io`
2. `allorigins.win`
3. `codetabs.com`

Timeout de 5s por proxy. Se todos falharem, o app continua funcional com dados locais.

### Merge

Chave primaria: `contest` (numero do concurso). Dados de sorteio sao imutaveis — insert-or-ignore, reordena por contest ao final. Mesma logica para fetch e import JSON.

## Persistencia

Todo dado vive em localStorage (limite ~5MB por dominio).

Estimativa de uso:
- 3000 sorteios Mega-Sena: ~300KB
- 3000 sorteios Lotofacil: ~400KB
- 100 jogos salvos: ~50KB
- Settings + history: ~5KB
- **Total estimado: ~800KB**

O export JSON e a unica forma de backup. Se o usuario limpar dados do browser, perde tudo que nao exportou.
