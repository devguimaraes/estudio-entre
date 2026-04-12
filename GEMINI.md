# GEMINI.md

Este arquivo contém as instruções e o contexto necessários para trabalhar no projeto **Estúdio Entre**.

## 1. Visão Geral do Projeto

O **Estúdio Entre** é um hub cultural e criativo independente localizado no Méier, Rio de Janeiro. O site institucional está sendo desenvolvido como um hub de descoberta e conversão para serviços de cultura, bem-estar e criatividade.

- **Status:** Pré-lançamento.
- **Stack:** Astro 5.x, React 19.x, Tailwind CSS 4.x, Bun, Shadcn/ui.
- **CMS:** Sanity.io.
- **Animações:** GSAP + Lenis (scroll suave).
- **Linter:** Biome.

## 2. Estrutura de Diretórios

- `src/`: Código-fonte (componentes, layouts, páginas, estilos, assets).
- `public/`: Arquivos estáticos.
- `docs/`: Documentação estratégica (Briefing, PRD, Identidade Visual).
- `ESTÚDIO ENTRE/`: Assets da marca (logos, fontes, mockups, social media).
- `scripts/`: Scripts de build e utilitários (ex: conversão de fontes).

## 3. Fluxo de Trabalho (Git Flow)

Este projeto adota o Git Flow estrito:

- `main`: Produção (apenas merges de `release`/`hotfix`).
- `develop`: Integração (merges de `feature`).
- `feature/*`: Novas funcionalidades.
- `release/*`: Preparação para deploy.
- `hotfix/*`: Correções críticas em produção.

**Regras de Ouro:**

- Nunca realize push direto para `main` ou `develop`.
- Use **Conventional Commits** (feat, fix, refactor, style, test, docs, chore, ci, perf).

## 4. Comandos de Desenvolvimento

O projeto utiliza o **Bun** como gerenciador de pacotes e runtime.

- **Instalação:** `bun install`
- **Desenvolvimento:** `bun run dev`
- **Build:** `bun run build`
- **Preview:** `bun run preview`
- **Lint:** `bun run lint` (utiliza Biome)

## 5. Convenções de Código

- **Estilos:** Tailwind CSS 4.x.
- **Componentes:** React com Shadcn/ui.
- **Qualidade:** Siga as regras de lint do Biome.
- **Performance:** Mire em Lighthouse > 95 em todas as categorias.

---
*Para mais detalhes, consulte o `README.md` na raiz do projeto.*
