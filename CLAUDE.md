# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Site institucional do **Estúdio Entre** — hub cultural independente no Méier, Rio de Janeiro. Funciona como hub de descoberta orgânica, ferramenta de conversão e centralizador de informação (agenda, serviços, contato).

**Status:** Pré-lançamento. M1 e M2 completos. Próximo: M3 (Agenda, Galeria, CMS & Contato).

## Comandos

```bash
bun install          # Instalar dependências
bun run dev          # Dev server (http://localhost:4321)
bun run build        # Build de produção
bun run preview      # Preview do build
bun run lint         # Lint com Biome
```

## Stack

- **Framework:** Astro 5.x com SSG (static site generation)
- **UI Islands:** React 19.x (hidratado sob demanda via `client:visible`, `client:idle`)
- **Estilos:** Tailwind CSS 4.x
- **Componentes:** Shadcn/ui + Radix UI
- **Animações:** GSAP + ScrollTrigger + SplitText
- **Scroll suave:** Lenis (respeitando `prefers-reduced-motion`)
- **CMS:** Sanity.io (Free plan, schema de Evento definido no PRD)
- **Linting:** Biome
- **Runtime:** Bun
- **Deploy:** Vercel Hobby

## Arquitetura

### Modelo: Astro Islands

O site é majoritariamente HTML estático. Apenas seções interativas usam React islands:

- **Agenda** (`client:visible`) — filtro de eventos por categoria
- **Galeria** (`client:visible`) — lightbox + drag scroll
- **Contato** (`client:idle`) — formulário com validação

Header, Hero, Sobre, Eixos e Footer são Astro puro (zero JS). Animações GSAP rodam em `<script>` Astro. Navbar e CursorCustom também são Astro puro com animações GSAP.

### Rotas planejadas

```
/                    → Home one-page com âncoras (#sobre, #eixos, #agenda, #espaco, #contato)
/eventos/[slug]      → Página individual de evento (SSG dinâmico)
/studio              → Sanity Studio (não indexado)
```

### Diretórios principais

```
src/
  components/
    sections/     # Hero, Sobre, Eixos (Astro puro)
    ui/           # Navbar, CursorCustom (Astro puro)
    islands/      # Componentes React reutilizáveis (Agenda, Galeria, Contato)
  animations/     # Módulos GSAP: hero, sobre, eixos, navbar, cursor, colorTransition
  layouts/        # Layouts base das páginas
  pages/          # Páginas Astro
  styles/         # CSS global, Tailwind, fonts.css (auto-gerado)
  assets/         # Ícones SVG, logos, imagens, texturas, mockups, fontes TTF originais
  utils/          # Helpers e funções auxiliares
public/fonts/     # Fontes WOFF2 servidas estaticamente
public/icons/     # Ícones SVG (olho, spark, calendario, microfone, fone, play)
docs/             # Briefing, PRD, identidade visual
scripts/          # Conversor de fontes TTF → WOFF2
```

### Fluxo de conteúdo

Sanity Studio → Content Lake → Webhook → Vercel rebuild (SSG) → CDN. Sem renderização em tempo de requisição.

## Convenções

### Git Flow

- `main` — produção (apenas merges de release/hotfix)
- `develop` — integração (merges de feature via PR)
- `feature/*` — novas funcionalidades (de `develop`)
- `release/*` — preparação de versão (de `develop`)
- `hotfix/*` — correções críticas (de `main`)

Nunca fazer push direto para `main` ou `develop`.

### Commits

Conventional Commits: `feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`, `chore:`, `ci:`, `perf:`. Com scope opcional: `feat(hero): descrição`.

### Identidade visual

Tokens de cor (definidos no `@theme` do Tailwind):
- `--color-orange: #E8541E` — energia/convite (Hero)
- `--color-cream: #F5F0E8` — acolhimento (Sobre)
- `--color-near-black: #1A1612` — profundidade (Eixos)
- `--color-olive: #6B7A2A` — movimento (Agenda)
- `--color-purple: #6B5FBF` — conexão (Contato)

Fontes: Buvera (principal/display), Dongra Script (decorativa), Helony (logo). Usar variáveis CSS `var(--font-buvera)`, `var(--font-dongra-script)`.

### Direção de experiência imersiva

O site segue uma estética de "travessia" — não uma interface tradicional:
- Transições contínuas entre seções (GSAP + ScrollTrigger), sem cortes bruscos
- Background muda de cor por seção, animado (não instantâneo)
- Scroll como narrativa: parallax, sticky, sobreposição de camadas
- Hover com easing suave (nunca instantâneo)
- Hero com SplitText (revelação palavra por palavra)
- Meta de Lighthouse ≥ 95 em todas as categorias

## Documentação de referência

- `docs/PRD-site.md` — Requisitos completos, stack, schemas Sanity, SEO, analytics
- `docs/brifieng.md` — Missão, visão, personas, tom de voz
- `docs/identidade-visual.md` — Logo, cores, tipografia
- `.github/GIT-FLOW-CONFIG.md` — Configuração Git Flow
