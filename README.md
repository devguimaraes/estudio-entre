# Estúdio Entre

> Hub cultural e criativo independente — Méier, Rio de Janeiro

Site institucional com CMS integrado. Desenvolvido com Astro, React, Sanity, Tailwind CSS e GSAP. Deploy serverless na Vercel.

---

## Quick Start

```bash
git clone https://github.com/devguimaraes/estudio-entre.git
cd estudio-entre

bun install
cp .env.example .env.local

# Preencher .env.local com:
#   SANITY_PROJECT_ID=7a0ee11t
#   SANITY_DATASET=production

bun run dev        # http://localhost:4321
```

**Sanity Studio:** http://localhost:4321/studio

### Comandos

| Comando | Descrição |
|---------|-----------|
| `bun run dev` | Servidor de desenvolvimento |
| `bun run build` | Build de produção |
| `bun run preview` | Preview do build local |
| `bun run check` | Biome (lint + format) |
| `bun run check:fix` | Biome com correção automática |
| `bun run lint` | Apenas lint |
| `bun run format` | Apenas formatação |

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Astro](https://astro.build) v6 (SSG + SSR híbrido) |
| UI interativa | [React](https://react.dev) 19 (apenas islands) |
| CMS | [Sanity](https://www.sanity.io) v5 (embutido em `/studio`) |
| Estilos | [Tailwind CSS](https://tailwindcss.com) v4 |
| Animações | [GSAP](https://gsap.com) 3 + [Lenis](https://lenis.studiofreight.com) 1 (smooth scroll) |
| Lint/Format | [Biome](https://biomejs.dev) 1.9 |
| Deploy | [Vercel](https://vercel.com) (serverless, Node.js 22) |
| Runtime | [Bun](https://bun.sh) |

### Dependências principais

| Biblioteca | Uso |
|-----------|-----|
| `@astrojs/vercel` | Adapter serverless Vercel |
| `@sanity/astro` | Integração Sanity + Astro |
| `@sanity/client` / `@sanity/image-url` | Cliente HTTP e geração de imagens |
| `@portabletext/react` | Renderização de Portable Text |
| `@tailwindcss/vite` | Tailwind v4 via Vite |
| `@radix-ui/react-dialog` | Sheet acessível (menu mobile) |
| `embla-carousel-react` | Carrossel |
| `sharp` | Otimização de imagens |

---

## Estrutura

```
src/
├── pages/                 # Rotas Astro + API
│   ├── index.astro        # Homepage (8 seções)
│   ├── agenda.astro       # Agenda com filtro interativo
│   ├── galeria.astro      # Listagem de álbuns
│   ├── exposicoes.astro   # Listagem de exposições
│   ├── exposicoes/[slug].astro  # Detalhe de exposição (SSG)
│   ├── galeria/[slug].astro     # Detalhe de álbum (SSG, masonry + lightbox)
│   ├── studio/index.astro       # Sanity Studio embutido
│   └── api/               # Endpoints serverless
├── components/
│   ├── sections/          # Blocos de página (14 Astro)
│   ├── ui/                # Elementos de UI (9 Astro + 3 React)
│   └── islands/           # Componentes interativos (12 React)
├── layouts/
│   └── BaseLayout.astro   # HTML shell, navbar, cursor, scripts globais
├── animations/            # Módulos GSAP/Lenis (16 TS)
├── sanity/
│   ├── schemas/           # 4 tipos de documento
│   ├── queries/           # 12 queries GROQ
│   └── image.ts           # urlFor() — URLs de imagem
├── styles/
│   ├── global.css         # Tailwind @theme + design tokens
│   └── fonts/             # @font-face (Buvera, Dongra Script)
├── types/                 # Interfaces TypeScript
└── assets/                # Ícones, imagens, logos, texturas
```

---

## Sanity CMS

O CMS é embutido no próprio site Astro, acessível em `/studio`. O conteúdo é gerenciado por 4 tipos de documento:

| Schema | Descrição |
|--------|-----------|
| `evento` | Eventos com categoria, data, local, valor e até 3 imagens |
| `exposicao` | Exposições com status (em cartaz/futura/passada), texto curatorial e ficha técnica |
| `albumGaleria` | Álbuns de fotos vinculados a eventos |
| `configuracao` | Configurações do site (SEO, redes sociais) |

Conteúdo publicado no Sanity aciona rebuild automático via webhook (`/api/webhook`).

---

## Variáveis de Ambiente

```bash
# .env.local (não versionado)
SANITY_PROJECT_ID=7a0ee11t
SANITY_DATASET=production
SANITY_WEBHOOK_SECRET=<uuid>         # opcional
VERCEL_DEPLOY_HOOK_URL=<url>         # opcional
```

---

## Desenvolvimento

### Fluxo de branches

- `main` — produção
- `develop` — integração
- `feature/*` — novas funcionalidades (criar a partir de `develop`)

### Commits

Conventional Commits em português: `tipo(escopo): descrição`

Tipos: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `perf`

### Antes de commitar

```bash
bun run check
bun run build
```

---

## Documentação

- [Briefing de Marca](./docs/brifieng.md)
- [PRD do Site](./docs/PRD-site.md)
- [Identidade Visual](./docs/identidade-visual.md)
- [Sistema de Animações](./docs/ANIMACOES.md)
- [Guia de Deploy Vercel](./docs/VERCEL-DEPLOY.md)
- [Otimização Vercel](./docs/VERCEL-OPTIMIZACAO-RECURSOS.md)
- [Git Flow](./.github/GIT-FLOW-CONFIG.md)

---

## Contato

- **Instagram:** [@entrenoestudio](https://www.instagram.com/entrenoestudio/)
- **TikTok:** [@entrenoestudio](https://www.tiktok.com/@entrenoestudio)
- **Endereço:** Rua Maria Calmon, 100 — Méier, Rio de Janeiro – RJ
