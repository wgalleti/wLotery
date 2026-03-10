## ADDED Requirements

### Requirement: Layout responsivo com sidebar
O sistema SHALL ter layout com header fixo, sidebar de configurações à esquerda e área de conteúdo principal. Em telas < 768px, a sidebar MUST se converter em Drawer (PrimeVue) acionado por botão hamburger.

#### Scenario: Layout desktop
- **WHEN** a tela tem largura >= 1024px
- **THEN** a sidebar é visível fixa à esquerda com conteúdo principal ao lado

#### Scenario: Layout mobile
- **WHEN** a tela tem largura < 768px
- **THEN** a sidebar fica oculta e acessível via botão hamburger que abre Drawer

### Requirement: Header com navegação
O sistema SHALL exibir header fixo com logo SVG, nome "LotoStats" e navegação principal com links para as rotas: Home, Mega-Sena, Lotofácil, Meus Jogos, Histórico, Configurações.

#### Scenario: Navegação entre rotas
- **WHEN** o usuário clica em "Mega-Sena" no header
- **THEN** navega para a rota `/mega-sena` com transição suave

### Requirement: Dark mode verde escuro
O sistema SHALL usar tema dark mode com paleta baseada em verde escuro. Background principal `#0a0f0d`, surfaces `#111b16`, primary `#16a34a`, accent `#4ade80`. Texto principal em `#e5e7eb`.

#### Scenario: Tema aplicado
- **WHEN** o app é carregado
- **THEN** todo o layout usa a paleta dark verde escuro sem opção de tema claro

### Requirement: Tipografia com fontes mono para números
O sistema SHALL usar fonte mono (JetBrains Mono ou DM Mono) para exibição de números de loterias e estatísticas, e fonte sans-serif (Inter ou Sora) para textos gerais.

#### Scenario: Números em fonte mono
- **WHEN** números de sorteios ou jogos são exibidos
- **THEN** usam fonte monoespaçada para alinhamento visual consistente

### Requirement: Componente NumberBall estilizado
O sistema SHALL exibir números de loterias como "bolinhas" SVG estilizadas com fundo circular, número centralizado e indicação visual de quente/frio/neutro.

#### Scenario: NumberBall quente
- **WHEN** um número é classificado como "quente"
- **THEN** a bolinha tem borda ou glow em vermelho (#ef4444)

#### Scenario: NumberBall frio
- **WHEN** um número é classificado como "frio"
- **THEN** a bolinha tem borda ou glow em azul (#3b82f6)

### Requirement: Micro-interações
O sistema SHALL incluir animações sutis: fade + slide-up com delay escalonado nos cards de jogos, transição de cores no hover dos elementos do heatmap, feedback visual no botão de copiar (ícone muda para check por 2s).

#### Scenario: Animação de entrada dos cards
- **WHEN** jogos são gerados e exibidos
- **THEN** cada card entra com animação fade + slide-up com delay incrementado por card (ex: 100ms entre cada)

### Requirement: Aviso legal
O sistema SHALL exibir no rodapé: "Análise estatística com fins recreativos. Loterias são eventos aleatórios — frequências passadas não garantem resultados futuros."

#### Scenario: Aviso sempre visível
- **WHEN** o app é carregado em qualquer rota
- **THEN** o aviso legal é visível no footer da página

### Requirement: Rotas nomeadas
O sistema SHALL ter as seguintes rotas: `/` (Home), `/mega-sena` (Dashboard Mega-Sena), `/lotofacil` (Dashboard Lotofácil), `/meus-jogos` (Jogos salvos), `/historico` (Histórico de análises), `/configuracoes` (Settings + export/import).

#### Scenario: Rota /mega-sena e /lotofacil usam mesmo componente
- **WHEN** o usuário navega para `/mega-sena` ou `/lotofacil`
- **THEN** o mesmo componente DashboardPage é renderizado com props de loteria correspondente

### Requirement: Todas as imagens em SVG
O sistema SHALL usar exclusivamente SVG para ícones, logo, ilustrações e elementos visuais. MUST NOT usar imagens raster (PNG, JPG) exceto nos ícones do PWA manifest que exigem PNG.

#### Scenario: Logo e ícones
- **WHEN** o app é carregado
- **THEN** logo, ícones de navegação e elementos decorativos são todos SVG inline ou importados
