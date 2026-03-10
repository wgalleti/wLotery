## ADDED Requirements

### Requirement: Export completo em JSON
O sistema SHALL permitir exportar todos os dados (settings, sorteios, jogos salvos, histórico) em um único arquivo JSON com metadados de versão e data de exportação.

#### Scenario: Export gera arquivo completo
- **WHEN** o usuário clica em "Exportar dados"
- **THEN** o browser inicia download de um arquivo `lotostats-backup-YYYY-MM-DD.json` contendo todos os dados com campo `version` e `exportedAt`

### Requirement: Import com merge inteligente
O sistema SHALL permitir importar um arquivo JSON previamente exportado. Ao importar, MUST fazer merge com dados existentes no localStorage: sorteios são deduplicados por contest number, jogos salvos são deduplicados por id, settings são sobrescritos pelo import.

#### Scenario: Import em localStorage vazio
- **WHEN** o usuário importa um JSON e o localStorage está vazio
- **THEN** todos os dados do JSON são inseridos no localStorage

#### Scenario: Import com dados existentes (merge)
- **WHEN** o usuário importa um JSON e o localStorage já tem dados
- **THEN** sorteios novos são inseridos (dedup por contest number), jogos novos são inseridos (dedup por id), settings são atualizados com os valores do import

#### Scenario: Arquivo inválido
- **WHEN** o usuário tenta importar um arquivo que não é JSON válido ou não contém o campo `version`
- **THEN** o sistema exibe mensagem de erro "Arquivo inválido" sem alterar dados existentes

### Requirement: Validação de versão no import
O sistema SHALL validar a versão do arquivo importado e MUST rejeitar versões incompatíveis com mensagem informativa.

#### Scenario: Versão compatível
- **WHEN** o arquivo JSON tem `version: "1.0"` e o app suporta versão "1.0"
- **THEN** o import prossegue normalmente

#### Scenario: Versão incompatível
- **WHEN** o arquivo JSON tem uma versão não suportada
- **THEN** o sistema exibe "Versão do arquivo não suportada. Esperado: 1.0"
