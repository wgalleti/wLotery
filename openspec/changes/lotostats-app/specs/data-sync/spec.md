## ADDED Requirements

### Requirement: Fetch de sorteios via CORS proxy com fallback
O sistema SHALL buscar dados de sorteios da API oficial da Caixa (servicebus2.caixa.gov.br) usando uma cadeia de CORS proxies com fallback automático. Se o primeiro proxy falhar, MUST tentar o próximo na cadeia. Se todos falharem, MUST exibir mensagem informando que os dados locais continuam disponíveis.

#### Scenario: Fetch bem-sucedido pelo primeiro proxy
- **WHEN** o usuário solicita atualização de dados e o primeiro CORS proxy está disponível
- **THEN** o sistema busca os sorteios via primeiro proxy e retorna os dados

#### Scenario: Fallback para segundo proxy
- **WHEN** o primeiro CORS proxy retorna erro ou timeout (5s)
- **THEN** o sistema automaticamente tenta o próximo proxy da cadeia sem interação do usuário

#### Scenario: Todos os proxies falham
- **WHEN** todos os CORS proxies da cadeia falham
- **THEN** o sistema exibe mensagem "Não foi possível conectar à API. Seus dados locais continuam disponíveis." e não perde dados existentes

### Requirement: Sync incremental de sorteios
O sistema SHALL buscar apenas sorteios mais novos que o último concurso salvo no localStorage. MUST NOT rebuscar sorteios já existentes.

#### Scenario: Primeiro fetch (localStorage vazio)
- **WHEN** não existem sorteios salvos para a loteria selecionada
- **THEN** o sistema busca todos os sorteios disponíveis da API

#### Scenario: Fetch incremental (dados existentes)
- **WHEN** já existem sorteios salvos com último concurso #2980
- **THEN** o sistema busca apenas concursos a partir do #2981

#### Scenario: Dados já atualizados
- **WHEN** o último concurso local é igual ao último concurso da API
- **THEN** o sistema informa "Dados já atualizados" sem fazer fetch adicional

### Requirement: Persistência automática em localStorage
O sistema SHALL salvar todos os sorteios buscados em localStorage imediatamente após o fetch. Os dados MUST sobreviver a reload da página.

#### Scenario: Sorteios persistidos após fetch
- **WHEN** o fetch retorna novos sorteios
- **THEN** os sorteios são salvos em `lotostats:draws:<lottery>` no localStorage e estão disponíveis após reload

### Requirement: Merge por contest number
O sistema SHALL usar o número do concurso como chave primária para deduplicação. Ao receber dados (via fetch ou import), MUST ignorar concursos que já existem e inserir apenas os novos. MUST reordenar por contest number ao final.

#### Scenario: Merge sem duplicatas
- **WHEN** localStorage tem concursos [2900..2980] e novos dados contêm [2975..2985]
- **THEN** apenas concursos [2981..2985] são inseridos, resultado final é [2900..2985] ordenado

#### Scenario: Import com dados sobrepostos
- **WHEN** localStorage tem concursos [2900..2980] e import JSON contém [2850..2970]
- **THEN** apenas concursos [2850..2899] são inseridos, resultado final é [2850..2980] ordenado
