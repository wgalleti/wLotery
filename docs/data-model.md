# Modelo de Dados

## localStorage Keys

Todas as chaves usam o prefixo `lotostats:` para isolamento.

## Draw (Sorteio)

Armazenado em `lotostats:draws:megasena` e `lotostats:draws:lotofacil`.

```typescript
interface Draw {
  contest: number    // numero do concurso (PK)
  date: string       // data do sorteio (ISO ou dd/mm/yyyy)
  numbers: number[]  // numeros sorteados, ordenados crescente
}
```

Exemplo:
```json
{
  "contest": 2981,
  "date": "08/03/2026",
  "numbers": [4, 17, 23, 35, 48, 57]
}
```

## SavedGame (Jogo Salvo)

Armazenado em `lotostats:games` como array.

```typescript
interface SavedGame {
  id: string             // UUID v4
  lottery: LotteryType   // "megasena" | "lotofacil"
  numbers: number[]      // numeros do jogo, ordenados
  strategy: string       // estrategia usada na geracao
  createdAt: string      // ISO datetime
  favorite: boolean      // marcado como favorito
  source: {
    drawsAnalyzed: number  // quantos sorteios foram analisados
    fromContest: number    // primeiro concurso do range
    toContest: number      // ultimo concurso do range
  }
  checks: GameCheck[]    // conferencias realizadas
}
```

## GameCheck (Conferencia)

Cada conferencia de um jogo contra um sorteio.

```typescript
interface GameCheck {
  contest: number      // concurso conferido
  date: string         // data do sorteio
  drawnNumbers: number[] // numeros sorteados nesse concurso
  hits: number[]       // numeros que acertou
  hitCount: number     // total de acertos
  prize: string | null // faixa de premiacao ou null
}
```

## Settings (Configuracoes)

Armazenado em `lotostats:settings`.

```typescript
interface Settings {
  activeLottery: "megasena" | "lotofacil"
  periodMode: "volume" | "period"
  volume: number          // 10 a 500
  dateFrom: string | null // ISO date
  dateTo: string | null   // ISO date
  strategy: "weighted" | "balanced" | "inverse" | "random"
  gameCount: number       // 1 a 10
}
```

## HistoryEntry (Log de Analise)

Armazenado em `lotostats:history` como array.

```typescript
interface HistoryEntry {
  date: string              // ISO datetime
  lottery: LotteryType
  drawsAnalyzed: number
  strategy: Strategy
  gamesGenerated: number
  fromContest: number
  toContest: number
}
```

## AnalysisResult (Em memoria)

Nao persiste em localStorage. Recalculado a cada analise.

```typescript
interface AnalysisResult {
  totalDraws: number
  fromContest: number
  toContest: number
  numberStats: NumberStats[]   // stats por numero
  hotNumbers: number[]         // top 10 mais frequentes
  coldNumbers: number[]        // top 10 menos frequentes
  averageParity: { even: number; odd: number }
  averageSum: number
  decadeDistribution: DecadeRange[]
  averageConsecutives: number
  sumPerDraw: { contest: number; sum: number }[]
}
```

## Export JSON

Formato do arquivo exportado:

```json
{
  "version": "1.0",
  "exportedAt": "2026-03-10T15:30:00.000Z",
  "settings": { ... },
  "draws": {
    "megasena": [ ... ],
    "lotofacil": [ ... ]
  },
  "games": [ ... ],
  "history": [ ... ]
}
```

O campo `version` e obrigatorio e validado no import. Versoes incompativeis sao rejeitadas.

## Regras de Merge

| Tipo | Chave | Comportamento |
|---|---|---|
| Draws | `contest` | Insert-or-ignore, reordena por contest |
| Games | `id` | Insert-or-ignore |
| Settings | _(unico)_ | Sobrescreve com valores do import |
| History | _(append)_ | Adiciona e reordena por data desc |
