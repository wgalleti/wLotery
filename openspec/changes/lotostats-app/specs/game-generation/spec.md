## ADDED Requirements

### Requirement: Geração de jogos para Mega-Sena
O sistema SHALL gerar jogos de Mega-Sena com exatamente 6 números distintos de 1 a 60, ordenados em ordem crescente.

#### Scenario: Jogo válido da Mega-Sena
- **WHEN** o usuário gera um jogo para Mega-Sena
- **THEN** o jogo contém exatamente 6 números distintos no intervalo [1, 60] em ordem crescente

### Requirement: Geração de jogos para Lotofácil
O sistema SHALL gerar jogos de Lotofácil com exatamente 15 números distintos de 1 a 25, ordenados em ordem crescente.

#### Scenario: Jogo válido da Lotofácil
- **WHEN** o usuário gera um jogo para Lotofácil
- **THEN** o jogo contém exatamente 15 números distintos no intervalo [1, 25] em ordem crescente

### Requirement: Estratégia de Frequência Ponderada
O sistema SHALL oferecer estratégia onde números mais sorteados no período analisado têm maior probabilidade de serem selecionados, usando seleção ponderada pela frequência absoluta.

#### Scenario: Números quentes priorizados
- **WHEN** o usuário gera jogos com estratégia "Frequência Ponderada"
- **THEN** números com maior frequência no período analisado têm probabilidade proporcionalmente maior de serem incluídos

### Requirement: Estratégia de Equilíbrio
O sistema SHALL oferecer estratégia que mistura proporcionalmente números quentes e frios, selecionando metade do jogo dos mais frequentes e metade dos menos frequentes.

#### Scenario: Mix de quentes e frios
- **WHEN** o usuário gera um jogo de Mega-Sena com estratégia "Equilíbrio"
- **THEN** o jogo contém aproximadamente 3 números do grupo quente e 3 do grupo frio

### Requirement: Estratégia de Inversão
O sistema SHALL oferecer estratégia que prioriza números menos sorteados, usando seleção ponderada inversa à frequência (teoria de reversão à média).

#### Scenario: Números frios priorizados
- **WHEN** o usuário gera jogos com estratégia "Inversão"
- **THEN** números com menor frequência no período analisado têm probabilidade proporcionalmente maior de serem incluídos

### Requirement: Estratégia Aleatório Puro
O sistema SHALL oferecer estratégia sem viés estatístico, onde todos os números têm probabilidade igual de seleção.

#### Scenario: Distribuição uniforme
- **WHEN** o usuário gera jogos com estratégia "Aleatório Puro"
- **THEN** cada número tem probabilidade igual de ser selecionado, independente de frequência histórica

### Requirement: Unicidade de jogos gerados
O sistema SHALL garantir que nenhum jogo gerado em uma mesma sessão de geração seja idêntico a outro.

#### Scenario: Jogos distintos
- **WHEN** o usuário gera 4 jogos de uma vez
- **THEN** todos os 4 jogos têm combinações de números diferentes entre si

### Requirement: Quantidade configurável de jogos
O sistema SHALL permitir ao usuário configurar quantos jogos gerar, de 1 a 10, com padrão de 4.

#### Scenario: Geração de múltiplos jogos
- **WHEN** o usuário configura 6 jogos e clica em gerar
- **THEN** o sistema gera exatamente 6 jogos distintos

### Requirement: Regeração sem rebuscar dados
O sistema SHALL permitir regerar jogos usando os mesmos dados estatísticos já calculados, sem necessidade de novo fetch da API.

#### Scenario: Regerar mantém dados
- **WHEN** o usuário clica em "Regerar jogos"
- **THEN** novos jogos são gerados usando as estatísticas já calculadas, sem nova chamada à API
