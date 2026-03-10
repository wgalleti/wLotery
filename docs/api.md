# API da Caixa

## Endpoints

Base URL: `https://servicebus2.caixa.gov.br/portaldeloterias/api`

| Endpoint | Descricao | Resposta |
|---|---|---|
| `/{loteria}` | Todos os sorteios | Array de objetos |
| `/{loteria}/latest` | Ultimo sorteio | Objeto unico |
| `/{loteria}/{concurso}` | Sorteio especifico | Objeto unico |

Onde `{loteria}` e `megasena` ou `lotofacil`.

## Formato da Resposta

A API retorna campos variados dependendo da loteria. O app normaliza usando os campos:

```json
{
  "numero": 2981,
  "data": "08/03/2026",
  "dezenas": ["04", "17", "23", "35", "48", "57"]
}
```

Campos alternativos que tambem sao aceitos:
- `concurso` em vez de `numero`
- `dataApuracao` em vez de `data`
- `listaDezenas` ou `dezenasSorteadasOrdemSorteio` em vez de `dezenas`

## CORS

A API da Caixa nao permite CORS para dominos externos. O app usa proxies publicos para contornar:

```
Tentativa 1: corsproxy.io
     │
     └─ falhou (timeout 5s)?
          │
          └─ Tentativa 2: allorigins.win
               │
               └─ falhou?
                    │
                    └─ Tentativa 3: codetabs.com
                         │
                         └─ falhou?
                              │
                              └─ Erro: usa dados locais
```

### Proxies Utilizados

| Proxy | URL Pattern |
|---|---|
| corsproxy.io | `https://corsproxy.io/?url={url}` |
| allorigins.win | `https://api.allorigins.win/raw?url={url}` |
| codetabs.com | `https://api.codetabs.com/v1/proxy?quest={url}` |

### Timeout

Cada proxy tem timeout de 5 segundos. Se nao responder nesse tempo, o app tenta o proximo.

### Fallback

Se todos os proxies falharem, o app continua funcional com dados do localStorage. O usuario tambem pode importar dados via JSON como fallback manual.

## Sync Incremental

```
1. Verificar ultimo concurso local (localStorage)
2. Buscar /latest na API para saber o mais recente
3. Se local == remoto → "Dados ja atualizados"
4. Se local < remoto → buscar concursos faltantes um a um
5. Merge no localStorage (insert-or-ignore por contest number)
```

Na primeira execucao (localStorage vazio), busca todos os sorteios de uma vez via `/{loteria}`.
