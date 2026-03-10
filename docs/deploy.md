# Deploy

## GitHub Pages (GitHub Actions)

O deploy e automatico via GitHub Actions. A cada push na branch `main`, o workflow `.github/workflows/deploy.yml` executa build e deploy.

### Pipeline

```
push main → build (Node 20, npm ci, vite build) → upload artifact → deploy to Pages
```

### O que acontece

1. `npm ci` — instala dependencias com lock exato
2. `vue-tsc -b` — type-check do TypeScript
3. `vite build` — build de producao com minificacao
4. `vite-plugin-pwa` — gera Service Worker e manifest
5. `actions/upload-pages-artifact` — empacota `dist/`
6. `actions/deploy-pages` — publica no GitHub Pages

### Configuracao do Repositorio

No GitHub, ir em **Settings > Pages** e configurar:
- Source: **GitHub Actions**

### URL

Apos deploy, o app fica disponivel em:

```
https://wgalleti.github.io/wLotery/
```

### Deploy Manual

Tambem e possivel disparar o deploy manualmente via **Actions > Deploy to GitHub Pages > Run workflow**.

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
