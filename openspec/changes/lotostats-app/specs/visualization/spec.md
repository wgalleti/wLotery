## ADDED Requirements

### Requirement: Heatmap SVG de frequência
O sistema SHALL exibir um heatmap SVG com todos os números da loteria (1-60 Mega-Sena, 1-25 Lotofácil) coloridos por intensidade de frequência. MUST usar gradiente de cor do verde escuro (baixa freq) ao verde claro/accent (alta freq). MUST exibir tooltip no hover com frequência exata e atraso.

#### Scenario: Heatmap da Mega-Sena
- **WHEN** a análise da Mega-Sena é exibida
- **THEN** o heatmap mostra uma grade com 60 números, cada um colorido proporcionalmente à frequência, com tooltip exibindo "Número X: Y vezes, atraso Z"

#### Scenario: Heatmap da Lotofácil
- **WHEN** a análise da Lotofácil é exibida
- **THEN** o heatmap mostra uma grade com 25 números com a mesma lógica de cores e tooltip

### Requirement: Gráfico de barras de frequência
O sistema SHALL exibir um gráfico de barras via PrimeVue Chart mostrando os 15 números mais frequentes e os 15 menos frequentes lado a lado.

#### Scenario: Barras de frequência
- **WHEN** a análise é exibida
- **THEN** o gráfico mostra dois datasets (mais frequentes em verde accent, menos frequentes em cor muted) com labels dos números no eixo X

### Requirement: Linha de tendência de soma
O sistema SHALL exibir um gráfico de linha via PrimeVue Chart mostrando a evolução da soma dos números sorteados ao longo do tempo (eixo X = concurso, eixo Y = soma).

#### Scenario: Tendência de soma
- **WHEN** a análise de 100 sorteios é exibida
- **THEN** o gráfico de linha mostra 100 pontos com a soma de cada sorteio e uma linha de tendência (média móvel)

### Requirement: Donut de paridade
O sistema SHALL exibir um gráfico donut via PrimeVue Chart mostrando a proporção média de números pares vs ímpares nos sorteios analisados.

#### Scenario: Donut par/ímpar
- **WHEN** a análise é exibida
- **THEN** o donut mostra dois segmentos (pares e ímpares) com % no centro

### Requirement: Responsividade dos gráficos
Todos os gráficos MUST ser responsivos, adaptando tamanho ao container. Em telas mobile, os gráficos MUST empilhar verticalmente.

#### Scenario: Layout mobile
- **WHEN** a tela tem largura < 768px
- **THEN** os gráficos ocupam largura total e empilham verticalmente
