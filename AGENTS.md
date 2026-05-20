# Repository Guidelines

## Stack & Architecture Overview

**Site institucional do Estúdio Entre — Hub Cultural no Méier, RJ.**

| Camada | Tecnologia |
|--------|-----------|
| Framework | Astro v6 (SSG + SSR híbrido) |
| UI Library | React 19 (apenas para componentes interativos) |
| CMS | Sanity v5 (embutido em `/studio`) |
| CSS | Tailwind CSS v4 (plugin Vite) + CSS scoped Astro |
| Deploy | Vercel (serverless, Node.js 22) |
| Animação | GSAP 3 + Lenis 1 (smooth scroll) + ScrollTrigger |
| Lint/Format | Biome 1.9 |
| TypeScript | v5, strict mode |

---

## Project Structure & Module Organization

```
src/
├── pages/                    # Rotas Astro e API
│   ├── index.astro           # Homepage (8 seções)
│   ├── agenda.astro          # Agenda com filtro interativo
│   ├── galeria.astro         # Listagem de álbuns (masonry)
│   ├── exposicoes.astro      # Listagem de exposições (filtro por status)
│   ├── exposicoes/[slug].astro   # Detalhe de exposição (SSG)
│   ├── galeria/[slug].astro      # Detalhe de álbum (SSG, masonry + lightbox)
│   ├── studio/index.astro    # Sanity Studio embutido
│   └── api/                  # Endpoints serverless
│       ├── contato.ts        # POST /api/contato
│       └── webhook.ts        # Sanity webhook → Vercel deploy hook (Edge)
├── components/
│   ├── sections/             # Blocos de página Astro (14 arquivos)
│   ├── ui/                   # Elementos de UI reutilizáveis (9 Astro + 3 React)
│   └── islands/              # Componentes React com hidratação no cliente (12)
├── layouts/
│   ├── BaseLayout.astro      # Layout base (HTML shell, navbar, cursor, WhatsApp, scripts globais)
│   └── EventoLayout.astro    # [NÃO UTILIZADO] Wrapper com breadcrumb para eventos
├── animations/               # Módulos GSAP/Lenis (16 TS), um por seção/componente + globais
├── sanity/
│   ├── schemas/              # 4 tipos de documento: evento, exposicao, albumGaleria, configuracao
│   ├── queries/              # Queries GROQ (12 no total)
│   └── image.ts              # urlFor() — geração de URLs de imagem Sanity
├── styles/
│   ├── global.css            # Tailwind @theme (design tokens), estilos base (209 linhas)
│   └── fonts/fonts.css       # @font-face: Buvera (10 pesos), Dongra Script, Space Grotesk, DM Serif
├── types/                    # Interfaces TypeScript: contato, evento, exposicao, foto, galeria
├── utils/                    # Utilitários: categorias.ts, eventos.ts
├── lib/                      # utils.ts (funções genéricas)
└── assets/                   # icons (SVG), images (WebP), logos (PNG), textures (WebP)
public/                       # Arquivos estáticos: fonts (woff2), icons, logos, imagens
docs/                         # Documentação, planos, specs (superpowers/plans/, superpowers/specs/)
```

Artefatos de build (`dist/`, `.astro/`, `.vercel/`) não devem ser editados manualmente.
Não existem diretórios `tests/` nem `src/content/` (conteúdo é gerenciado via Sanity).

### Componentes por camada

| Camada | Astro (.astro) | React (.tsx) | Total |
|--------|---------------|--------------|-------|
| Páginas | 7 | 0 | 7 |
| Layouts | 2 | 0 | 2 |
| Sections | 14 | 0 | 14 |
| UI | 9 | 3 | 12 |
| Islands | 0 | 12 | 12 |

React é usado apenas onde há interatividade no cliente. Todo conteúdo estático é renderizado em Astro.

### Seções não utilizadas em páginas atualmente

`Eixos.astro`, `Servicos.astro`, `Espaco.astro`, `ExposicoesHome.astro` — existem no código mas não são importadas por nenhuma rota.
`EventoLayout.astro` — definido mas não usado (eventos são exibidos na home e agenda, sem página de detalhe).

---

## Sanity CMS

### Configuração
- **Project ID**: `7a0ee11t` (fallback em `astro.config.mjs`; sobrescrevível via `SANITY_PROJECT_ID` no `.env`)
- **Dataset**: `production` (sobrescrevível via `SANITY_DATASET`)
- **CDN**: desabilitado (`useCdn: false`) — conteúdo sempre fresco
- **Studio**: acessível em `/studio`, embutido no próprio site Astro

### Tipos de Documento (4 schemas)

| Schema | Campos principais |
|--------|------------------|
| `evento` | titulo, slug, categoria (show/oficina/roda-de-conversa/lancamento/sarau/exposicao/biblioterapia/dj-session), dataHora, local, descricao, imagens (1-3), valor, linkCompra, ativo |
| `exposicao` | titulo, slug, subtitulo, textoCuratorial (rich text), artista, curadoria, dataInicio, dataFim, local, tecnica, apoio, imagemCapa, imagens, albumRelacionado→albumGaleria (weak), linkAgendamento, status (em-cartaz/futura/passada), ativo |
| `albumGaleria` | titulo, slug, descricao, dataInicio, dataFim, imagens, eventoRelacionado→evento (weak), ativo |
| `configuracao` | titulo, descricao, ogImage, redesSociais (instagram, spotify, youtube) |

Referências são `weak: true` — não bloqueiam exclusão do documento referenciado.

### Queries GROQ (12)
- **evento**: `eventosQuery`, `eventoBySlugQuery`, `eventosFuturosQuery`, `todosEventosSlugsQuery`
- **configuracao**: `configuracaoQuery`
- **galeria**: `albunsQuery`, `albumBySlugQuery`, `todosAlbunsSlugsQuery`
- **exposicao**: `exposicoesEmCartazQuery`, `exposicoesFuturasQuery`, `exposicoesByStatusQuery`, `exposicaoBySlugQuery`, `todasExposicoesSlugsQuery`

### Webhook (`/api/webhook.ts`)
- Runtime: Edge (Vercel) com `maxDuration: 5s`
- Autenticação via header `x-sanity-webhook-secret`
- Só processa tipos `evento` e `configuracao`
- Dispara `VERCEL_DEPLOY_HOOK_URL` para rebuild do site

---

## Sistema de Animação

### Motor global (`init.ts`)
Inicializa Lenis (smooth scroll), conecta ao ticker GSAP, registra ScrollTrigger.

### Animações globais (carregadas no BaseLayout)
| Arquivo | Função |
|---------|--------|
| `colorTransition.ts` | Transição de `background-color` do `<body>` conforme a seção visível |
| `sectionWipes.ts` | Painéis cromáticos que "varrem" a tela entre seções |
| `cursor.ts` | Cursor editorial customizado com labels contextuais (`data-cursor`) |
| `navbar.ts` | Tracking de scroll para destacar link ativo |

### Animações por seção (16 arquivos)
`hero.ts`, `galeria.ts`, `pilares.ts`, `agenda.ts`, `sobre.ts`, `visitacao.ts`, `contato.ts`, `footer.ts`, `eixos.ts`, `servicos.ts`, `espaco.ts`

Todas usam GSAP + ScrollTrigger com timeline, stagger e parallax. Algumas islands React (`GaleriaDetalhe.tsx`, `AgendaFilter.tsx`, `AgendaPageFilter.tsx`) também usam GSAP.

### Paleta cromática por seção
| Seção | Cor de fundo |
|-------|-------------|
| Hero | `#EC6838` (laranja) |
| Galeria | `#B9E4EB` (ciano) |
| Pilares | `#1A1612` (near-black) |
| Agenda | `#1D432C` (verde floresta) |
| Sobre | `#F0EDE8` (creme) |
| Visitação CTA | `#3D1020` (bordô) |
| Contato | `#F0EDE8` (creme) |
| Footer | `#1A1612` (near-black) |

---

## Estilização

### Abordagem em 3 camadas
1. **CSS Global + Tailwind v4** — `global.css` com `@import "tailwindcss"` e `@theme` (design tokens: 20+ cores, tipografia, easings)
2. **Tailwind Utility Classes** — 90%+ da estilização no markup
3. **CSS Scoped Astro** — 12 componentes com `<style>` para animações `@keyframes`, overrides mobile e `will-change`

Design tokens definidos em `@theme`: `--color-orange`, `--color-bordo`, `--color-cream`, `--color-terracota`, `--color-lilas`, `--color-forest`, `--color-cyan`, `--color-near-black`, `--font-display`, `--font-body`, `--ease-expo`, `--ease-editorial`, etc.

Fontes locais (woff2): Buvera (10 pesos + itálicos), Dongra Script. Fallbacks: Space Grotesk, DM Serif Display (Google Fonts).

### Breakpoints (Tailwind mobile-first)
`sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px. CSS scoped usa `max-width` (desktop-first).
Acessibilidade: `prefers-reduced-motion` suportado em 5 arquivos; `@media (hover: none)` para touch.

---

## Build, Test, and Development Commands

Runtime principal: **Bun** (lockfile: `bun.lockb`). O projeto também tem `package-lock.json` (npm) no `.gitignore`.

| Comando | Descrição |
|---------|-----------|
| `bun install` | Instala dependências |
| `bun run dev` | Servidor dev em `http://localhost:4321` |
| `bun run build` | Build de produção |
| `bun run preview` | Previsualiza build localmente |
| `bun run check` | Biome check (lint + format) |
| `bun run check:fix` | Biome check com correção automática |
| `bun run lint` | Apenas Biome lint |
| `bun run format` | Apenas Biome format |

### TypeScript
`tsconfig.json` estende `astro/tsconfigs/strict`. Aliases: `@/*`, `@components/*`, `@layouts/*`, `@utils/*`, `@styles/*`, `@assets/*`. JSX: `react-jsx`.

### Variáveis de ambiente
Necessárias (`.env.example` → `.env.local`):
- `SANITY_PROJECT_ID` — ID do projeto Sanity
- `SANITY_DATASET` — dataset (padrão: `production`)
- `SANITY_WEBHOOK_SECRET` — secret para o webhook
- `VERCEL_DEPLOY_HOOK_URL` — URL do deploy hook da Vercel (opcional no webhook)

---

## Coding Style & Naming Conventions
- Indentação: 2 espaços; encoding UTF-8; newline LF (`.editorconfig`).
- Padrões Biome: aspas duplas, ponto e vírgula, trailing commas, largura de linha 100.
- Regras: `noUnusedImports: "warn"`, `noNonNullAssertion: "off"`, organize imports habilitado.
- Componentes Astro/React: `PascalCase` (ex.: `Hero.astro`).
- Módulos utilitários/animações: `camelCase` (ex.: `colorTransition.ts`, `navbar.ts`).
- Prefira mudanças pequenas e locais; reutilize padrões já existentes antes de criar abstrações.

---

## Testing Guidelines
Não há suíte de testes automatizados. Para cada alteração:
1. Execute `bun run check`.
2. Execute `bun run build`.
3. Faça verificação manual das rotas afetadas (`/`, `/agenda`, `/galeria`, `/exposicoes`, `/studio` e páginas de detalhe com slug).
4. Verifique animações com GSAP/ScrollTrigger (responsivo, `prefers-reduced-motion`).

---

## Commit & Pull Request Guidelines
- **Conventional Commits** em português: `tipo(escopo): descrição` (ex.: `feat(hero): ajustar animação de entrada`).
- Tipos usados: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `perf`.
- Escopos frequentes: `galeria`, `exposicoes`, `sanity`, `assets`, `nav`, `hero`.
- Fluxo: `main` (produção) ← `develop` (dev) ← `feature/*` (branches de feature).
- Criar `feature/*` a partir de `develop`; abrir PR para `develop`.
- Não fazer push direto em `main` ou `develop`.
- PRs de UI devem incluir contexto, impacto, e screenshot/gif antes/depois.
- Padrão de desenvolvimento observado: `docs` (design spec) → `feat` (implementação) → `fix` (correções) → `style`/`chore` (polimento).

---

## Security & Configuration Tips
- Use `.env.example` como base para `.env.local`; nunca commitar segredos.
- O arquivo `.env` e `.env.local` estão no `.gitignore` (junto com `node_modules/`, `dist/`, `.astro/`, `.vercel/`).
- Em endpoints/API, valide entradas e evite expor detalhes internos de erro.
- Webhook autentica via `x-sanity-webhook-secret`; só processa tipos permitidos (`evento`, `configuracao`).
- Antes de adicionar dependências, verifique manutenção ativa e riscos de segurança.
