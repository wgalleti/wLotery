## 1. Project Scaffolding

- [x] 1.1 Criar projeto Vite com template vue-ts (`npm create vite@latest lotostats -- --template vue-ts`)
- [x] 1.2 Instalar dependências: PrimeVue 4, Tailwind CSS 4, Pinia, Vue Router, Chart.js, vite-plugin-pwa
- [x] 1.3 Configurar Tailwind CSS com paleta customizada verde escuro (cores definidas no design)
- [x] 1.4 Configurar PrimeVue 4 unstyled mode com Tailwind passthrough
- [x] 1.5 Configurar vite-plugin-pwa com precache de assets e web app manifest (nome, ícones, cores, standalone)
- [x] 1.6 Configurar Vue Router com rotas: `/`, `/mega-sena`, `/lotofacil`, `/meus-jogos`, `/historico`, `/configuracoes`
- [x] 1.7 Configurar Pinia e criar estrutura de stores vazia
- [x] 1.8 Adicionar fontes: JetBrains Mono (números) e Inter (textos) via Google Fonts ou local

## 2. Types e Constantes

- [x] 2.1 Criar `src/types/lottery.ts` — interfaces Draw, LotteryType, LotteryConfig (ranges, quantidades, faixas de premiação)
- [x] 2.2 Criar `src/types/game.ts` — interfaces SavedGame, GameCheck, GameSource
- [x] 2.3 Criar `src/types/statistics.ts` — interfaces FrequencyMap, AnalysisResult, PeriodConfig, Strategy
- [x] 2.4 Criar `src/utils/constants.ts` — paleta de cores, configurações de cada loteria (Mega: 6/60, Loto: 15/25), faixas de premiação, lista de proxies CORS

## 3. Camada de Storage

- [x] 3.1 Criar composable `useStorage.ts` — abstração sobre localStorage com namespace `lotostats:`, get/set genérico tipado, controle de tamanho
- [x] 3.2 Criar store `stores/settings.ts` — preferências do usuário (loteria ativa, modo período, volume, estratégia, contagem de jogos), persistência automática via useStorage
- [x] 3.3 Criar store `stores/draws.ts` — sorteios por loteria, getters para último concurso, total por loteria, persistência via useStorage
- [x] 3.4 Criar store `stores/games.ts` — jogos salvos, favoritos, conferências, CRUD completo, persistência via useStorage
- [x] 3.5 Criar store `stores/history.ts` — log de análises (data, loteria, qtd sorteios, estratégia, qtd jogos), persistência via useStorage

## 4. Data Sync (API Caixa)

- [x] 4.1 Criar composable `useLotteryApi.ts` — fetch via cadeia de CORS proxies com fallback automático e timeout de 5s por proxy
- [x] 4.2 Implementar fetch do último concurso (endpoint `/api/<loteria>/latest`)
- [x] 4.3 Implementar fetch de todos os concursos (endpoint `/api/<loteria>`)
- [x] 4.4 Implementar sync incremental — detectar último concurso local, buscar apenas novos, merge no store de draws
- [x] 4.5 Implementar lógica de merge por contest number (insert-or-ignore, reordenar por número do concurso)

## 5. Motor Estatístico

- [x] 5.1 Criar composable `useStatistics.ts` — recebe array de draws e retorna AnalysisResult
- [x] 5.2 Implementar cálculo de frequência absoluta e relativa por número
- [x] 5.3 Implementar classificação de números quentes (top 10) e frios (bottom 10)
- [x] 5.4 Implementar cálculo de atraso (delay) por número a partir do sorteio mais recente
- [x] 5.5 Implementar análise de paridade (% pares vs ímpares médio por sorteio)
- [x] 5.6 Implementar soma média dos sorteios
- [x] 5.7 Implementar distribuição por faixas de dezenas (parametrizado por loteria)
- [x] 5.8 Implementar detecção de sequências consecutivas (média por sorteio)
- [x] 5.9 Criar store `stores/analysis.ts` — armazena resultado da análise atual, trigger de recálculo quando draws ou config mudam

## 6. Gerador de Jogos

- [x] 6.1 Criar composable `useGameGenerator.ts` — geração de jogos com seleção ponderada
- [x] 6.2 Implementar algoritmo de seleção ponderada genérico (recebe pesos por número, retorna N números distintos)
- [x] 6.3 Implementar estratégia "Frequência Ponderada" — peso = frequência absoluta
- [x] 6.4 Implementar estratégia "Equilíbrio" — metade quentes, metade frios
- [x] 6.5 Implementar estratégia "Inversão" — peso = inverso da frequência
- [x] 6.6 Implementar estratégia "Aleatório Puro" — peso uniforme
- [x] 6.7 Implementar validação de unicidade entre jogos gerados na mesma sessão
- [x] 6.8 Implementar regeração de jogos usando mesmos dados estatísticos

## 7. Conferência de Jogos

- [x] 7.1 Criar composable `useGameChecker.ts` — confere um jogo contra um sorteio, retorna acertos e faixa
- [x] 7.2 Implementar detecção de faixa de premiação parametrizada por loteria (Mega: 4/5/6, Loto: 11-15)
- [x] 7.3 Implementar conferência automática em batch — ao receber novos sorteios, conferir todos os jogos salvos
- [x] 7.4 Implementar conferência manual por número de concurso

## 8. Export/Import

- [x] 8.1 Criar composable `useExportImport.ts` — export de todos os dados como JSON com metadados (version, exportedAt)
- [x] 8.2 Implementar download do JSON como arquivo `lotostats-backup-YYYY-MM-DD.json`
- [x] 8.3 Implementar import via FileUpload — validar JSON, validar versão, merge com dados existentes
- [x] 8.4 Implementar merge de import — sorteios por contest number, jogos por id, settings sobrescreve

## 9. Layout e Navegação

- [x] 9.1 Criar `App.vue` com layout base: header fixo, router-view, footer com aviso legal
- [x] 9.2 Criar `AppHeader.vue` — logo SVG, nome "LotoStats", navegação com links para todas as rotas, botão hamburger em mobile
- [x] 9.3 Criar `AppSidebar.vue` — painel de configurações (seleção de período, volume/slider, estratégia, contagem de jogos, botão analisar), converte em Drawer (PrimeVue) em mobile
- [x] 9.4 Criar `AppFooter.vue` — aviso legal e versão
- [x] 9.5 Criar logo SVG do LotoStats (tema trevo/sorte em verde escuro)

## 10. Componentes Comuns

- [x] 10.1 Criar `NumberBall.vue` — SVG circle com número centralizado, variantes quente (glow vermelho), frio (glow azul), neutro
- [x] 10.2 Criar `StatCard.vue` — card com título, valor principal, subtítulo/descrição, ícone SVG
- [x] 10.3 Criar `LotteryBadge.vue` — badge com nome da loteria e ícone

## 11. Componentes de Visualização

- [x] 11.1 Criar `HeatmapGrid.vue` — SVG customizado: grade de números com cores por frequência (gradiente verde), tooltip com frequência e atraso no hover
- [x] 11.2 Criar `FrequencyChart.vue` — SVG barras com top 15 mais e menos frequentes
- [x] 11.3 Criar `SumTrendChart.vue` — SVG linha com evolução da soma por concurso + média móvel
- [x] 11.4 Criar `ParityDonut.vue` — SVG donut com % pares vs ímpares

## 12. Componentes de Jogos

- [x] 12.1 Criar `GameCard.vue` — card com números (NumberBall), soma, % par/ímpar, indicadores quente/frio, botões salvar/copiar
- [x] 12.2 Criar `GameList.vue` — lista de GameCards com animação escalonada (fade + slide-up)
- [x] 12.3 Criar `GameChecker.vue` — painel de conferência com histórico de acertos por concurso, faixa de premiação

## 13. Páginas

- [x] 13.1 Criar `HomePage.vue` — cards resumo de cada loteria (último concurso, números, próximo sorteio), resumo de jogos salvos, link para dashboards
- [x] 13.2 Criar `DashboardPage.vue` — página parametrizada por loteria com sidebar, status bar, stats grid, charts (heatmap, barras, linha, donut), jogos gerados, botões regerar/exportar TXT
- [x] 13.3 Criar `MeusJogosPage.vue` — lista de jogos salvos com filtros (loteria, favoritos), conferência automática, ações (copiar, remover, conferir manual)
- [x] 13.4 Criar `HistoricoPage.vue` — DataTable paginada com sorteios buscados: concurso, data, números, soma, par/ímpar
- [x] 13.5 Criar `ConfigPage.vue` — status de sincronização, botões export/import, uso de localStorage, sobre

## 14. PWA e Deploy

- [x] 14.1 Criar ícones PWA em SVG (192, 512) com tema verde
- [x] 14.2 Configurar Service Worker para prompt de atualização (registerType: 'prompt')
- [x] 14.3 Adicionar indicador de modo offline na UI
- [x] 14.4 Configurar vite.config.ts com base path para GitHub Pages
- [x] 14.5 Criar script `npm run deploy` para gh-pages

## 15. Polish e UX

- [x] 15.1 Implementar barra de progresso/spinner durante fetch de dados
- [x] 15.2 Implementar Toast (PrimeVue) para feedback: dados atualizados, jogo salvo, erro de conexão
- [x] 15.3 Implementar feedback visual no botão "Copiar" (texto muda para "Copiado!" por 2s)
- [x] 15.4 Layout responsivo implementado com Tailwind breakpoints (mobile/tablet/desktop)
- [x] 15.5 Exportar todos os jogos como TXT formatado (download de arquivo .txt)
