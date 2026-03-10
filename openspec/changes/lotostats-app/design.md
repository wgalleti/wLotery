## Context

Projeto greenfield — aplicação PWA de uso pessoal para análise estatística de loterias brasileiras (Mega-Sena e Lotofácil). Sem backend, sem banco de dados. Tudo roda no browser com persistência em localStorage. Deploy estático em GitHub Pages.

A API oficial da Caixa tem restrição CORS, exigindo proxy para acesso client-side. Os dados de loterias são imutáveis uma vez publicados (um concurso nunca muda), o que simplifica a estratégia de cache e merge.

## Goals / Non-Goals

**Goals:**

- App funcional offline após primeiro carregamento (PWA)
- Dados sempre persistidos em localStorage, sobrevivendo a reloads
- Sync incremental — buscar apenas sorteios mais novos que o último salvo
- Merge inteligente no import — deduplicação por contest number
- Dashboard reutilizável parametrizado por tipo de loteria
- Heatmap SVG customizado sem dependência de biblioteca extra
- Conferência automática de jogos salvos contra novos resultados
- UI responsiva, dark mode verde escuro, design limpo e elegante

**Non-Goals:**

- Não é produto comercial — sem auth, multi-tenant, analytics
- Não tem backend/API própria — zero infraestrutura server-side
- Não usa GitHub Actions para sync de dados — tudo é client-initiated
- Não prediz resultados — é ferramenta de análise, não de adivinhação
- Não suporta outras loterias além de Mega-Sena e Lotofácil (v1)

## Decisions

### 1. CORS Proxy com fallback chain

**Decisão**: Usar múltiplos CORS proxies públicos com fallback automático.

**Alternativas consideradas**:
- Cloudflare Worker próprio: controle total, mas adiciona infraestrutura a manter
- Único proxy público: ponto único de falha
- GitHub Actions gerando JSON estático: adiciona complexidade de CI/CD

**Abordagem**: O composable `useLotteryApi` tenta proxies em sequência (corsproxy.io → allorigins.win → cors-anywhere). Se todos falharem, o app continua funcional com dados do localStorage. O usuário pode também importar dados via JSON como fallback manual.

### 2. localStorage como fonte única de verdade

**Decisão**: Todos os dados ficam em localStorage com namespace `lotostats:`.

**Estrutura de chaves**:
- `lotostats:settings` — preferências do usuário
- `lotostats:draws:megasena` — sorteios Mega-Sena
- `lotostats:draws:lotofacil` — sorteios Lotofácil
- `lotostats:games` — jogos gerados e salvos
- `lotostats:history` — log de análises

**Alternativas consideradas**:
- IndexedDB: mais capacidade, mas complexidade desnecessária para ~1-2MB de dados
- Sem persistência (só memória): UX ruim, perde dados a cada reload

**Limites**: localStorage tem ~5MB por domínio. Estimativa de uso: ~500KB para 3000 sorteios de ambas loterias + jogos salvos. Margem confortável.

### 3. Merge por contest number como PK

**Decisão**: Ao sincronizar ou importar, deduplicar por `concurso` (contest number). Se já existe, ignora. Se não existe, insere. Reordena por contest number ao final.

**Rationale**: Dados de sorteio são imutáveis — uma vez publicados pela Caixa, nunca mudam. Não há necessidade de update, apenas insert-or-ignore.

### 4. Dashboard parametrizado (componente único)

**Decisão**: Uma única `DashboardPage.vue` recebe a loteria via props da rota.

```
/mega-sena  → DashboardPage { lottery: 'megasena' }
/lotofacil  → DashboardPage { lottery: 'lotofacil' }
```

**Alternativas consideradas**:
- Dois componentes separados: duplicação de código sem benefício
- Rota dinâmica `/lottery/:type`: URL menos legível para bookmarks

### 5. Heatmap em SVG puro

**Decisão**: Implementar o heatmap como componente Vue renderizando SVG inline, sem biblioteca de charts.

**Rationale**: PrimeVue Chart (Chart.js) não tem heatmap nativo. O plugin `chartjs-chart-matrix` é limitado em customização. SVG puro dá controle total sobre cores, layout, hover, tooltips e animações — e está alinhado com o requisito de "sempre SVGs".

### 6. Gráficos via PrimeVue Chart

**Decisão**: Usar o componente `<Chart>` do PrimeVue (wrapper Chart.js) para barras, linha e donut.

**Rationale**: Já faz parte do stack, integra com o tema, zero dependência extra. O Chart.js cobre bem esses tipos de visualização.

### 7. Paleta verde escuro — identidade visual

**Decisão**: Dark mode com verde escuro como cor primária. Tema "sorte", sem referência à identidade visual da Caixa.

**Cores base**:
- Background: `#0a0f0d` / Surface: `#111b16` / Border: `#243b2e`
- Primary: `#16a34a` / Accent: `#4ade80`
- Hot numbers: `#ef4444` / Cold numbers: `#3b82f6`

Mega-Sena e Lotofácil compartilham a mesma paleta verde. Diferenciação visual entre loterias via ícones SVG e badges, não por cor.

### 8. PWA com vite-plugin-pwa

**Decisão**: Usar `vite-plugin-pwa` com estratégia `generateSW` (Workbox).

**Cache strategy**:
- App shell (HTML, JS, CSS): precache no build
- Dados do localStorage: já local, não precisa de cache SW
- Fontes e ícones SVG: precache

**Rationale**: Permite uso offline após primeiro acesso. Como todos os dados ficam em localStorage, o SW só precisa cachear os assets estáticos.

## Risks / Trade-offs

**[CORS proxies podem ficar indisponíveis]** → Fallback chain com múltiplos proxies + app funciona offline com dados locais + import JSON como último recurso manual

**[localStorage tem limite de ~5MB]** → Uso estimado de ~1-2MB. Monitorar na tela de configurações. Se necessário no futuro, migrar dados antigos para export JSON

**[API da Caixa pode mudar endpoints]** → Endpoints isolados no composable `useLotteryApi`, fácil de atualizar. Dados já baixados permanecem no localStorage

**[Dados perdidos se limpar browser data]** → Export JSON como backup. Aviso na UI sobre importância de exportar periodicamente

**[Chart.js bundle size]** → Usar tree-shaking importando apenas os componentes necessários (BarController, LineController, DoughnutController, scales, etc.)
