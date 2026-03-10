# Deploy

## GitHub Pages

O projeto esta configurado para deploy em GitHub Pages com base path `/wLotery/`.

### Requisitos

- Node.js 18+
- Repositorio remoto configurado em `git@github.com:wgalleti/wLotery.git`

### Deploy Manual

```bash
npm run deploy
```

Esse comando executa `npm run build` e publica o conteudo de `dist/` na branch `gh-pages` via `gh-pages`.

### O que acontece

1. `vue-tsc -b` — type-check do TypeScript
2. `vite build` — build de producao com minificacao
3. `vite-plugin-pwa` — gera Service Worker e manifest
4. `gh-pages -d dist` — publica na branch `gh-pages`

### URL

Apos deploy, o app fica disponivel em:

```
https://wgalleti.github.io/wLotery/
```

### Configuracao do Repositorio

No GitHub, ir em **Settings > Pages** e configurar:
- Source: **Deploy from a branch**
- Branch: **gh-pages** / **/ (root)**

## PWA

O app e instalavel como PWA. Apos o primeiro acesso:
- Assets sao cacheados pelo Service Worker
- Funciona offline com dados do localStorage
- Atualizacoes sao detectadas automaticamente (prompt de atualizacao)

### Manifest

Configurado em `vite.config.ts`. Valores principais:
- Nome: LotoStats
- Tema: `#0a0f0d` (verde escuro)
- Display: standalone
- Icones: SVG

## Base Path

O base path `/wLotery/` esta configurado em dois lugares:

1. `vite.config.ts` — `base: '/wLotery/'`
2. `src/router/index.ts` — `createWebHistory('/wLotery/')`

Se o nome do repositorio mudar, atualizar ambos.
