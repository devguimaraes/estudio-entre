# GEMINI.md

Este arquivo contém as instruções e o contexto necessários para trabalhar no projeto **Estúdio Entre**.

## 1. Visão Geral do Projeto

O **Estúdio Entre** é um hub cultural e criativo independente localizado no Méier, Rio de Janeiro. O site institucional é um hub de descoberta e conversão para serviços de cultura, bem-estar e criatividade, focado em uma experiência imersiva e performática.

- **Status:** MVP / Pré-lançamento (Desenvolvimento Ativo).
- **Stack:** Astro 6.x, React 19.x, Tailwind CSS 4.x, Bun, Shadcn/ui.
- **CMS:** Sanity.io (Content Lake + Studio embutido).
- **Animações:** GSAP 3.x + Lenis (Scroll Suave).
- **Linter/Formatter:** Biome 1.9.

## 2. Estrutura de Diretórios e Componentes

- `src/animations/`: Módulos de animação GSAP por seção (hero, sobre, agenda, etc.).
- `src/components/islands/`: Componentes React hidratados (AgendaFilter, ContatoForm, Galeria).
- `src/components/sections/`: Seções Astro puras (Hero, Sobre, Eixos, Espaco, etc.).
- `src/components/ui/`: Componentes de interface compartilhados (Navbar, CursorCustom).
- `src/layouts/`: Layouts base (BaseLayout.astro, EventoLayout.astro).
- `src/pages/`: Rotas do site, incluindo `/studio` para o Sanity CMS.
- `src/sanity/`: Schemas, queries e utilitários para integração com o CMS.
- `src/styles/`: CSS global com configuração do tema Tailwind 4.
- `docs/`: Documentação técnica, estratégica e de identidade visual (v3.0).

## 3. Fluxo de Trabalho (Git Flow)

Este projeto adota o Git Flow estrito:

- `main`: Produção.
- `develop`: Integração (merges de `feature`).
- `feature/*`: Novas funcionalidades ou correções.
- `release/*`: Preparação para deploy.
- `hotfix/*`: Correções críticas em produção.

**Regras de Ouro:**
- Use **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`, `perf:`).
- Sempre execute o lint (`bun run lint`) antes de abrir um PR.

## 4. Comandos e Scripts

O projeto utiliza o **Bun** para máxima performance.

- `bun install`: Instala dependências.
- `bun run dev`: Inicia ambiente de desenvolvimento.
- `bun run build`: Gera o build estático (SSG) com adapter Vercel.
- `bun run lint`: Verifica erros com Biome.
- `bun run format`: Formata o código com Biome.
- `bun run check:fix`: Aplica correções automáticas do Biome.

## 5. Convenções e Design System

- **Tailwind 4:** O tema é definido via `@theme` no arquivo `src/styles/global.css`. Use as variáveis de cor e fonte definidas lá (ex: `text-orange`, `font-display`).
- **Sanity:** O CMS é acessível via `/studio` em desenvolvimento e produção.
- **Hidratação:** Use diretivas de hidratação estratégica (`client:visible`, `client:idle`) para manter o JS no mínimo.
- **Animações:** Centralizadas em `src/animations/` e inicializadas no `BaseLayout.astro`.
- **Imagens:** Use o componente `<Image />` do Astro com `sharp` para otimização automática para WebP/AVIF.

## 6. Variáveis de Ambiente (.env)

| Variável | Descrição |
|---|---|
| `SANITY_PROJECT_ID` | ID do projeto no Sanity.io |
| `SANITY_DATASET` | Geralmente `production` |
| `SANITY_API_TOKEN` | Token de escrita (opcional, para scripts) |

---
*Para detalhes de design, consulte `docs/identidade-visual.md`. Para metas técnicas, veja `docs/PRD-site.md`.*
