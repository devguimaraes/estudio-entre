# Repository Guidelines

## Project Structure & Module Organization
O projeto é um site Astro com conteúdo integrado ao Sanity.
- `src/pages/`: rotas Astro e API (`src/pages/api/webhook.ts`).
- `src/components/sections/` e `src/components/ui/`: blocos de página e UI reutilizável.
- `src/layouts/`: layouts base (`BaseLayout.astro`, `EventoLayout.astro`).
- `src/animations/`: lógica GSAP/Lenis por seção.
- `src/sanity/`: schemas, queries e utilitários de imagem.
- `public/`: arquivos estáticos servidos diretamente (fonts, icons, logos).
- `docs/`: decisões, planos e documentação de produto/deploy.

Artefatos de build (`dist/`, `.astro/`) não devem ser editados manualmente.

## Build, Test, and Development Commands
Use Bun como runtime principal:
- `bun install`: instala dependências.
- `bun run dev`: sobe ambiente local em `http://localhost:4321`.
- `bun run build`: gera build de produção.
- `bun run preview`: valida localmente o build.
- `bun run check`: executa validações Biome.
- `bun run check:fix`: corrige problemas automáticos do Biome.
- `bun run lint` / `bun run format`: lint e formatação isolados.

## Coding Style & Naming Conventions
- Indentação: 2 espaços; encoding UTF-8; newline LF (`.editorconfig`).
- Padrões Biome: aspas duplas, ponto e vírgula, trailing commas, largura de linha 100.
- Componentes Astro/React: `PascalCase` (ex.: `Hero.astro`).
- Módulos utilitários/animações: nome curto e descritivo em `camelCase`/minúsculo (ex.: `colorTransition.ts`, `navbar.ts`).
- Prefira mudanças pequenas e locais; reutilize padrões já existentes antes de criar abstrações.

## Testing Guidelines
Ainda não há suíte de testes automatizados dedicada. Para cada alteração:
1. Execute `bun run check`.
2. Execute `bun run build`.
3. Faça verificação manual das rotas afetadas (principalmente `/`, `/studio` e fluxos com animação/responsividade).

## Commit & Pull Request Guidelines
- Siga Conventional Commits: `type(scope): subject` (ex.: `feat(hero): ajustar animação de entrada`).
- Tipos mais usados no histórico: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`.
- Fluxo de branch: criar `feature/*` a partir de `develop`; abrir PR para `develop`.
- Não fazer push direto em `main` ou `develop`.
- PRs de UI devem incluir contexto, impacto, e screenshot/gif antes/depois.

## Security & Configuration Tips
- Use `.env.example` como base para `.env.local`; nunca commitar segredos.
- Em endpoints/API, valide entradas e evite expor detalhes internos de erro.
- Antes de adicionar dependências, verifique manutenção ativa e riscos de segurança.
