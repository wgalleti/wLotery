## ADDED Requirements

### Requirement: Frequência absoluta e relativa
O sistema SHALL calcular quantas vezes cada número foi sorteado (frequência absoluta) e a porcentagem em relação ao total de sorteios analisados (frequência relativa).

#### Scenario: Cálculo de frequência
- **WHEN** o usuário analisa 100 sorteios da Mega-Sena e o número 23 apareceu em 18 sorteios
- **THEN** o sistema exibe frequência absoluta = 18 e frequência relativa = 18.0%

### Requirement: Números quentes e frios
O sistema SHALL classificar números como "quentes" (top 10 mais frequentes) e "frios" (bottom 10 menos frequentes) com base na frequência absoluta no período analisado.

#### Scenario: Identificação de quentes e frios
- **WHEN** a análise é executada sobre um conjunto de sorteios
- **THEN** o sistema destaca os 10 números mais frequentes como "quentes" e os 10 menos frequentes como "frios"

### Requirement: Atraso (delay) por número
O sistema SHALL calcular há quantos sorteios cada número não é sorteado, contando a partir do sorteio mais recente do período analisado.

#### Scenario: Número com alto atraso
- **WHEN** o número 45 não aparece nos últimos 25 sorteios analisados
- **THEN** o sistema exibe atraso = 25 para o número 45

#### Scenario: Número sorteado no último concurso
- **WHEN** o número 12 aparece no sorteio mais recente
- **THEN** o sistema exibe atraso = 0 para o número 12

### Requirement: Análise de paridade
O sistema SHALL calcular a média de porcentagem de números pares vs ímpares por sorteio no período analisado.

#### Scenario: Cálculo de paridade na Mega-Sena
- **WHEN** o usuário analisa sorteios da Mega-Sena (6 números por sorteio)
- **THEN** o sistema exibe a média de % pares e % ímpares (ex: "53% pares, 47% ímpares")

### Requirement: Soma média dos sorteios
O sistema SHALL calcular a média da soma de todos os números sorteados em cada concurso do período analisado.

#### Scenario: Cálculo de soma média
- **WHEN** o usuário analisa 100 sorteios da Mega-Sena
- **THEN** o sistema exibe a soma média (ex: "Soma média: 182.5")

### Requirement: Distribuição por faixas de dezenas
O sistema SHALL calcular a porcentagem de números sorteados por faixa de dezenas. Para Mega-Sena: 01-10, 11-20, 21-30, 31-40, 41-50, 51-60. Para Lotofácil: 01-05, 06-10, 11-15, 16-20, 21-25.

#### Scenario: Distribuição por faixa na Mega-Sena
- **WHEN** a análise é executada para Mega-Sena
- **THEN** o sistema exibe a % de ocorrências em cada faixa de 10 números (01-10, 11-20, ..., 51-60)

### Requirement: Sequências consecutivas
O sistema SHALL calcular a média de números consecutivos por sorteio (ex: 12-13, 34-35-36) no período analisado.

#### Scenario: Detecção de consecutivos
- **WHEN** um sorteio contém os números [04, 12, 13, 23, 35, 36]
- **THEN** o sistema identifica 2 pares consecutivos (12-13 e 35-36) nesse sorteio

### Requirement: Configuração do período de análise
O sistema SHALL permitir ao usuário escolher entre dois modos de seleção de período: por volume (quantidade de sorteios, 10 a 500) ou por período (data inicial e data final).

#### Scenario: Análise por volume
- **WHEN** o usuário seleciona modo "volume" com valor 100
- **THEN** o sistema analisa os 100 sorteios mais recentes

#### Scenario: Análise por período
- **WHEN** o usuário seleciona modo "período" com data inicial 01/01/2025 e data final 10/03/2026
- **THEN** o sistema analisa apenas sorteios cujas datas estão dentro do intervalo
