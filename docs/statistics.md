# Motor Estatistico

## Metricas Calculadas

Todas as metricas sao calculadas pelo composable `useStatistics` sobre o subconjunto de sorteios filtrado (por volume ou periodo).

### Frequencia Absoluta e Relativa

Para cada numero no range da loteria (1-60 Mega, 1-25 Loto), conta quantas vezes apareceu nos sorteios analisados.

```
frequencia_absoluta = count(sorteios onde numero aparece)
frequencia_relativa = frequencia_absoluta / total_sorteios * 100
```

### Numeros Quentes e Frios

- **Quentes**: top 10 numeros com maior frequencia absoluta
- **Frios**: bottom 10 numeros com menor frequencia absoluta

Esses grupos alimentam a classificacao visual no heatmap e nos NumberBalls.

### Atraso (Delay)

Para cada numero, conta quantos sorteios consecutivos (do mais recente para tras) ele NAO apareceu.

```
numero 45 nao saiu nos ultimos 25 sorteios → atraso = 25
numero 12 saiu no ultimo sorteio → atraso = 0
```

### Paridade

Media da proporcao de numeros pares vs impares por sorteio.

```
Mega-Sena com 6 numeros: se em media 3.2 sao pares
  → even = 53.3%, odd = 46.7%
```

### Soma Media

Media aritmetica da soma de todos os numeros de cada sorteio.

```
Sorteio 1: 4+17+23+35+48+57 = 184
Sorteio 2: 2+10+28+33+45+59 = 177
Soma media = (184 + 177) / 2 = 180.5
```

### Distribuicao por Faixas de Dezenas

Conta quantos numeros sorteados caem em cada faixa.

| Loteria | Faixas |
|---|---|
| Mega-Sena | 01-10, 11-20, 21-30, 31-40, 41-50, 51-60 |
| Lotofacil | 01-05, 06-10, 11-15, 16-20, 21-25 |

### Sequencias Consecutivas

Media de pares de numeros consecutivos por sorteio.

```
Sorteio [04, 12, 13, 23, 35, 36]:
  12-13 = par consecutivo
  35-36 = par consecutivo
  → 2 pares neste sorteio
```

## Estrategias de Geracao

O composable `useGameGenerator` usa selecao ponderada (weighted random sampling without replacement) para gerar jogos.

### Algoritmo Base

```
Para cada posicao no jogo:
  1. Calcular peso de cada numero restante no pool
  2. Sortear usando random ponderado
  3. Remover numero selecionado do pool
  4. Repetir ate completar o jogo
```

### Frequencia Ponderada

Peso de cada numero = sua frequencia absoluta no periodo analisado.

Numeros que sairam mais vezes tem maior probabilidade de serem escolhidos.

### Equilibrio

Divide a selecao em dois grupos:
- Numeros quentes: peso = 3
- Numeros frios: peso = 3
- Numeros neutros: peso = 1

Isso garante que tanto quentes quanto frios tenham probabilidade elevada, resultando num jogo equilibrado.

### Inversao

Peso = (maior frequencia do periodo) - frequencia do numero + 1

Numeros menos sorteados ganham maior peso. Baseada na teoria (nao comprovada) de reversao a media.

### Aleatorio Puro

Peso = 1 para todos os numeros. Distribuicao uniforme, sem vies estatistico. Serve como baseline de comparacao.

### Unicidade

Apos gerar cada jogo, verifica se e identico a algum ja gerado na mesma sessao. Se for, descarta e gera novamente. Limite de 100 tentativas por jogo para evitar loop infinito.

## Conferencia

O composable `useGameChecker` compara jogos salvos contra sorteios.

### Faixas de Premiacao

| Mega-Sena | | Lotofacil | |
|---|---|---|---|
| 6 acertos | Sena | 15 acertos | 1o Premio |
| 5 acertos | Quina | 14 acertos | 2o Premio |
| 4 acertos | Quadra | 13 acertos | 3o Premio |
| | | 12 acertos | 4o Premio |
| | | 11 acertos | 5o Premio |

### Conferencia Automatica

Ao sincronizar novos sorteios, todos os jogos salvos sao automaticamente conferidos contra os concursos que ocorreram apos a data de criacao do jogo.

### Conferencia Manual

O usuario pode informar um numero de concurso especifico para conferir um jogo, desde que o sorteio esteja nos dados locais.
