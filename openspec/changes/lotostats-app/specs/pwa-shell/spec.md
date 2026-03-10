## ADDED Requirements

### Requirement: Funcionamento offline
O sistema SHALL funcionar offline após o primeiro carregamento, servindo o app shell (HTML, JS, CSS, fontes, SVGs) a partir do cache do Service Worker.

#### Scenario: Acesso offline
- **WHEN** o usuário acessa o app sem conexão à internet após pelo menos um acesso anterior
- **THEN** o app carrega normalmente com dados do localStorage, exibindo indicador de modo offline

### Requirement: Precache de assets estáticos
O sistema SHALL fazer precache de todos os assets estáticos (HTML, JS, CSS, SVGs, fontes) durante a instalação do Service Worker via vite-plugin-pwa.

#### Scenario: Instalação do SW
- **WHEN** o usuário acessa o app pela primeira vez
- **THEN** o Service Worker é instalado e faz precache de todos os assets do build

### Requirement: Atualização automática do app
O sistema SHALL detectar quando uma nova versão está disponível e MUST notificar o usuário com opção de atualizar.

#### Scenario: Nova versão disponível
- **WHEN** o Service Worker detecta nova versão dos assets
- **THEN** o app exibe notificação "Nova versão disponível" com botão "Atualizar"

### Requirement: Manifest e instalabilidade
O sistema SHALL incluir um web app manifest completo com nome, ícones (SVG e PNG), cores do tema e configuração standalone para permitir instalação como app.

#### Scenario: Instalação como app
- **WHEN** o usuário acessa pelo browser mobile ou desktop
- **THEN** o browser oferece opção de instalar o app (prompt de instalação nativo)
