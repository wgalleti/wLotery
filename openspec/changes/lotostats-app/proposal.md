## Why

Aplicação web pessoal para análise estatística de loterias brasileiras (Mega-Sena e Lotofácil). O objetivo é ter uma ferramenta própria, offline-capable, para analisar padrões em sorteios históricos, gerar jogos com estratégias estatísticas configuráveis, salvar jogos e conferir automaticamente contra resultados futuros. Deploy em GitHub Pages, sem backend — tudo client-side com persistência em localStorage e export/import JSON para portabilidade.

## What Changes

- Criar aplicação Vue 3 + PrimeVue 4 + Tailwind CSS 3 com TypeScript
- PWA com vite-plugin-pwa para uso offline
- Busca de dados da API oficial da Caixa via CORS proxy com fallback chain
- Persistência total em localStorage com merge/update incremental
- Export/import de todos os dados via JSON
- Dashboard de análise estatística parametrizado por loteria (Mega-Sena / Lotofácil)
- Geração de jogos com 4 estratégias: frequência ponderada, equilíbrio, inversão, aleatório puro
- Salvamento de jogos com conferência automática contra novos sorteios
- Heatmap SVG customizado para visualização de frequências
- Gráficos via PrimeVue Chart (Chart.js): barras de frequência, linha de tendência, donut de paridade
- Rotas: Home, Mega-Sena, Lotofácil, Meus Jogos, Histórico, Configurações
- Paleta dark mode com verde escuro (tema "sorte", sem vínculo com Caixa)
- Todas as imagens em SVG

## Capabilities

### New Capabilities

- `data-sync`: Busca de sorteios da API Caixa via CORS proxy com fallback, cache em localStorage, merge/update incremental ao buscar novos dados ou importar JSON
- `statistical-analysis`: Cálculos estatísticos sobre sorteios — frequência absoluta/relativa, números quentes/frios, atraso, paridade, soma média, faixas de dezenas, sequências consecutivas
- `game-generation`: Geração de jogos com seleção ponderada baseada em 4 estratégias estatísticas, garantia de unicidade, respeitando regras de cada loteria (6/60 Mega, 15/25 Loto)
- `saved-games`: Persistência de jogos gerados com tags, favoritos, metadados de geração e conferência automática contra novos sorteios com detecção de faixa de premiação
- `data-portability`: Export completo de todos os dados (settings, draws, games, history) em JSON e import com merge inteligente por contest number
- `visualization`: Heatmap SVG interativo com tooltip, gráfico de barras de frequência, linha de tendência de soma, donut de paridade — todos via PrimeVue Chart e SVG custom
- `pwa-shell`: Service Worker via vite-plugin-pwa, cache de assets, funcionamento offline com dados do localStorage
- `app-layout`: Layout responsivo com header, sidebar colapsável (drawer em mobile), rotas nomeadas, paleta verde escuro dark mode, tipografia com fontes mono para números

### Modified Capabilities

_(nenhuma — projeto greenfield)_

## Impact

- **Dependências**: Vue 3, PrimeVue 4, Tailwind CSS 3, Pinia, Vue Router, Chart.js, vite-plugin-pwa, Vite
- **APIs externas**: API oficial da Caixa (servicebus2.caixa.gov.br) via CORS proxy público (corsproxy.io, allorigins.win como fallback)
- **Storage**: localStorage do browser (~5MB limit, uso estimado ~1-2MB)
- **Deploy**: GitHub Pages via vite build → branch gh-pages
- **Browser support**: Navegadores modernos com suporte a Service Worker e localStorage
