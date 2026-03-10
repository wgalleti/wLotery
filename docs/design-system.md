# Design System

## Paleta de Cores

Tema dark mode com verde escuro como identidade ("sorte"), sem vinculo com a Caixa.

### Backgrounds

| Token | Hex | Uso |
|---|---|---|
| `bg-base` | `#0a0f0d` | Fundo principal da pagina |
| `bg-surface` | `#111b16` | Cards, paineis, modais |
| `bg-surface-hover` | `#1a2b22` | Hover em surfaces |
| `bg-surface-alt` | `#0d1410` | Alternancia em tabelas |

### Bordas

| Token | Hex | Uso |
|---|---|---|
| `border-base` | `#243b2e` | Bordas de cards e separadores |
| `border-subtle` | `#1a2b22` | Bordas mais sutis |

### Cores Primarias

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#16a34a` | Botoes, links, acoes principais |
| `primary-light` | `#22c55e` | Hover em primario |
| `primary-dark` | `#15803d` | Pressed/active |
| `primary-glow` | `#16a34a20` | Glow sutil em cards |

### Accent

| Token | Hex | Uso |
|---|---|---|
| `accent` | `#4ade80` | Destaques, valores numericos importantes |
| `accent-dim` | `#4ade8040` | Versao com opacidade |

### Texto

| Token | Hex | Uso |
|---|---|---|
| `text-base` | `#e5e7eb` | Texto principal |
| `text-bright` | `#f9fafb` | Titulos, valores destacados |
| `text-muted` | `#6b7280` | Labels, texto secundario |
| `text-dim` | `#4b5563` | Texto terciario, hints |

### Semanticas

| Token | Hex | Uso |
|---|---|---|
| `hot` | `#ef4444` | Numeros quentes |
| `cold` | `#3b82f6` | Numeros frios |
| `success` | `#22c55e` | Acoes bem-sucedidas |
| `warning` | `#f59e0b` | Alertas |
| `error` | `#ef4444` | Erros |

## Tipografia

| Tipo | Fonte | Uso |
|---|---|---|
| Texto geral | Inter | Paragrafos, labels, navegacao |
| Numeros | JetBrains Mono | Numeros de loteria, estatisticas, valores |

Para numeros de loteria, usar a classe `font-lottery`:
```html
<span class="font-lottery">04 - 17 - 23</span>
```

## Componentes Visuais

### NumberBall

Bolinha SVG com numero centralizado. Variantes:

| Variante | Aparencia |
|---|---|
| `default` | Borda verde, fundo verde/10 |
| `hot` | Borda vermelha, fundo vermelho/10 |
| `cold` | Borda azul, fundo azul/10 |
| `neutral` | Borda cinza, fundo cinza/10 |

Tamanhos: `sm` (32px), `md` (40px), `lg` (52px).

### StatCard

Card com:
- Titulo (uppercase, muted, xs)
- Valor principal (2xl, bold, bright, font-lottery)
- Subtitulo opcional (xs, dim)

### HeatmapGrid

Grade SVG com todos os numeros da loteria. Cor de cada celula e proporcional a frequencia, usando gradiente de verde escuro (baixa freq) a verde claro (alta freq). Indicadores de quente/frio como circulos pequenos no canto.

## Animacoes

### fade-slide-up

Entrada dos cards de jogos gerados. Cada card tem delay escalonado de 100ms.

```css
@keyframes fade-slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Transicao de rotas

Fade simples de 200ms entre paginas.

## Layout

### Desktop (>= 1024px)

```
┌──────────────────────────────────────────┐
│  Header (sticky)                         │
├──────────┬───────────────────────────────┤
│ Sidebar  │  Main Content                 │
│ (fixa)   │                               │
│ 256px    │  flex-1                        │
└──────────┴───────────────────────────────┘
│  Footer                                  │
└──────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────┐
│  Header + burger │
├──────────────────┤
│  Main Content    │
│  (full width)    │
│                  │
│  Sidebar = Drawer│
│  (overlay)       │
└──────────────────┘
│  Footer          │
└──────────────────┘
```

## Icones

Todos em SVG inline. Nenhum icone raster (PNG/JPG) no app (exceto PWA manifest que aceita SVG).

O logo usa circulos verdes representando "bolinhas de loteria" estilizadas.
