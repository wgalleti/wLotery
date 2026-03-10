## ADDED Requirements

### Requirement: Salvar jogos gerados
O sistema SHALL permitir ao usuário salvar jogos gerados com metadados: números, estratégia usada, data de criação, dados de origem (range de concursos analisados).

#### Scenario: Salvar jogo com metadados
- **WHEN** o usuário salva um jogo gerado
- **THEN** o jogo é persistido no localStorage com id único, números, estratégia, data de criação e range de concursos de origem

### Requirement: Marcar jogos como favoritos
O sistema SHALL permitir ao usuário marcar/desmarcar jogos como favoritos para acesso rápido.

#### Scenario: Toggle de favorito
- **WHEN** o usuário clica no ícone de favorito de um jogo
- **THEN** o status de favorito é alternado e persistido no localStorage

### Requirement: Conferência automática contra novos sorteios
O sistema SHALL conferir automaticamente todos os jogos salvos contra novos sorteios quando os dados são atualizados. MUST registrar os acertos por concurso e identificar a faixa de premiação.

#### Scenario: Conferência com acertos na Mega-Sena
- **WHEN** um novo sorteio da Mega-Sena é carregado com números [07, 12, 23, 38, 45, 57] e um jogo salvo tem [04, 12, 23, 35, 48, 57]
- **THEN** o sistema registra 3 acertos (12, 23, 57) e faixa "nenhuma" (Mega exige mínimo 4)

#### Scenario: Faixas de premiação Mega-Sena
- **WHEN** o sistema confere um jogo contra um sorteio da Mega-Sena
- **THEN** identifica a faixa: 6 acertos = Sena, 5 = Quina, 4 = Quadra, <4 = nenhuma

#### Scenario: Faixas de premiação Lotofácil
- **WHEN** o sistema confere um jogo contra um sorteio da Lotofácil
- **THEN** identifica a faixa: 15 = 1º prêmio, 14 = 2º, 13 = 3º, 12 = 4º, 11 = 5º, <11 = nenhuma

### Requirement: Conferência manual por concurso
O sistema SHALL permitir ao usuário conferir um jogo manualmente contra um concurso específico informando o número do concurso.

#### Scenario: Conferência manual
- **WHEN** o usuário informa o número do concurso para conferir
- **THEN** o sistema busca os números sorteados daquele concurso e exibe os acertos

### Requirement: Histórico de conferências por jogo
O sistema SHALL manter um histórico de todas as conferências realizadas para cada jogo salvo, listando concurso, data, números sorteados, acertos e faixa.

#### Scenario: Visualizar histórico de conferências
- **WHEN** o usuário acessa um jogo salvo
- **THEN** vê a lista de todas as conferências realizadas com concurso, acertos e faixa

### Requirement: Remover jogos salvos
O sistema SHALL permitir ao usuário remover jogos salvos com confirmação.

#### Scenario: Remoção com confirmação
- **WHEN** o usuário clica em "Remover" num jogo salvo
- **THEN** o sistema pede confirmação e, se confirmado, remove o jogo e suas conferências do localStorage

### Requirement: Copiar números do jogo
O sistema SHALL permitir copiar os números de um jogo salvo para a área de transferência como texto (ex: "04 - 12 - 23 - 35 - 48 - 57").

#### Scenario: Copiar para clipboard
- **WHEN** o usuário clica em "Copiar" num jogo
- **THEN** os números são copiados como texto separado por " - " e o botão muda para ícone de confirmação por 2 segundos
