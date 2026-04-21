# Estúdio Entre — Site Institucional

> Hub cultural e criativo independente da zona norte do Rio de Janeiro

**Status:** 🚀 **M1 — Fundação & Setup: 100% COMPLETO**  
**Deploy:** ✅ Produção funcional na Vercel  
**Localização:** Rua Maria Calmon, 100 — Méier, Rio de Janeiro – RJ  
**Data de atualização:** 20 de Abril de 2026  
**Mantido por:** Equipe Estúdio Entre

---

## 📋 Sobre o Projeto

O site do **Estúdio Entre** é um site institucional de alto impacto visual que funciona como:

- **Hub de descoberta**: Ser encontrado organicamente por quem busca espaço cultural, biblioterapia, sarau ou gravação de podcast
- **Ferramenta de conversão**: Transformar visitantes em participantes de eventos ou clientes do estúdio
- **Centralizador de informação**: Agenda, serviços, formas de contato — reduzindo dependência de redes sociais

### Missão
Promover encontros significativos entre cultura, conhecimento e bem-estar, oferecendo um espaço plural onde leitura, escuta e expressão criativa convivem.

### Visão
Ser o principal ponto de encontro cultural independente da zona norte do Rio de Janeiro — um lugar que as pessoas reconhecem como seu.

### 📌 Estado Atual (M1 — Fundação & Setup)
- ✅ **M1 — Fundação & Setup:** 100% completo (11/11 issues)
- ✅ **Deploy:** Produção funcional na Vercel (Edge Runtime)
- ✅ **Sanity CMS:** Configurado (projeto ID: 7a0ee11t)
- ✅ **Sanity Studio:** Embedded em `/studio`
- ✅ **Webhook Sanity → Vercel:** Implementado (rebuilds automáticos)
- ✅ **Animações:** GSAP 3.15.0 + Lenis 1.0.42 configurados
- 🔄 **M2 — Hero, Sobre & Eixos:** Próximo milestone

---

## 🚀 Quick Start

### Pré-requisitos
- **Bun** (recomendado) ou Node.js 18+
- **Git** com Git Flow configurado

### Setup Inicial

```bash
# 1. Clonar repositório
git clone https://github.com/devguimaraes/estudio-entre.git
cd estudio-entre

# 2. Instalar dependências
bun install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local

# 4. Adicionar variáveis necessárias
# SANITY_PROJECT_ID=7a0ee11t
# SANITY_DATASET=production
# SANITY_WEBHOOK_SECRET=<gerar-uuid-seguro>
# VERCEL_DEPLOY_HOOK_URL=<do-dashboard-vercel>

# 5. Rodar dev server
bun run dev

# 6. Abrir no navegador
# → http://localhost:4321
# → Sanity Studio: http://localhost:4321/studio
```

### Comandos Disponíveis

```bash
bun run dev          # Dev server (http://localhost:4321)
bun run build        # Build de produção (~27s)
bun run preview      # Preview do build local
bun run lint         # Lint com Biome
bun run check        # Biome check + lint
bun run check:fix    # Auto-corrigir problemas Biome
```

---

## 🛠️ Stack Técnico

| Camada | Tecnologia | Versão | Status |
|---|---|---|---|
| **Framework** | Astro | 6.1.8 | ✅ Completo |
| **UI Islands** | React | 19.0.0 | ✅ Completo |
| **Estilos** | Tailwind CSS | 4.0.0 | ✅ Completo |
| **Componentes** | Shadcn/ui + Radix UI | latest | 🔄 M2 |
| **Animações** | GSAP + ScrollTrigger | 3.15.0 | ✅ Setup completo |
| **Smooth Scroll** | Lenis | 1.0.42 | ✅ Configurado |
| **CMS** | Sanity.io | 5.21.0 | ✅ Configurado |
| **Linting** | Biome | 1.9.0 | ✅ Configurado |
| **Runtime** | Bun | latest | ✅ Configurado |
| **Deploy** | Vercel (Edge Runtime) | Hobby | ✅ Produção |
| **Analytics** | GA4 + Search Console | — | 🔄 M4 |

### Otimizações Implementadas (Fase 1)
- ✅ Cache agressivo de assets (2 anos para fontes/_astro/images)
- ✅ Edge Runtime para webhook (95% mais barato que serverless)
- ✅ DNS prefetch + preconnect para domínios externos
- ✅ Preload de fontes críticas (Buvera Bold/ExtraBold)
- ✅ Headers de segurança configurados (X-Frame-Options, CSP, etc)

---

## 📂 Estrutura do Projeto

```
estudio-entre/
├── src/
│   ├── animations/        # ✅ Setup GSAP + Lenis
│   │   ├── init.ts        # Inicialização Lenis + ScrollTrigger
│   │   └── utils.ts       # 8 utilitários de animação
│   ├── components/        # 🔄 Componentes React (M2)
│   ├── layouts/           # ✅ BaseLayout com DNS prefetch/preload
│   ├── pages/             # ✅ Páginas Astro + API routes
│   │   ├── api/webhook.ts # ✅ Edge Function para webhook Sanity
│   │   └── studio/        # ✅ Sanity Studio embedded
│   ├── styles/            # ✅ Estilos globais + Tailwind
│   ├── assets/            # ✅ Ícones, logos, imagens, texturas
│   ├── sanity/            # ✅ Schemas Sanity + client
│   └── utils/             # 🔄 Helpers (M2)
│
├── public/                # ✅ Assets estáticos
│   ├── fonts/             # ✅ Fontes WOFF2 (Buvera, Dongra, Helony)
│   └── robots.txt         # ✅ Bloquear /studio da indexação
│
├── docs/                  # ✅ Documentação completa
│   ├── briefing.md        # Missão, visão, personas
│   ├── PRD-site.md        # Requisitos, arquitetura, schemas
│   ├── identidade-visual.md  # Logo, cores, tipografia
│   ├── VERCEL-DEPLOY.md   # ✅ Guia de deploy Vercel
│   ├── ANIMACOES.md       # ✅ Documentação GSAP + Lenis
│   ├── M1-RESUMO.md       # ✅ Resumo M1 completo
│   └── VERCEL-OPTIMIZACAO-RECURSOS.md # ✅ Plano otimização
│
├── .github/
│   └── GIT-FLOW-CONFIG.md # ✅ Documentação Git Flow
│
├── .vercel/               # ✅ Configuração Vercel
├── vercel.json            # ✅ Build + headers + cache
├── sanity.config.ts       # ✅ Config Sanity Studio
├── astro.config.mjs       # ✅ Config Astro + adapter Vercel
└── README.md              # ✅ Este arquivo
```

**Legenda:** ✅ Completo | 🔄 Em andamento | ❌ Aguardando

---

## 🌊 Git Flow — Fluxo de Branches

Este projeto segue o modelo **Git Flow** com as seguintes branches:

### Branches Permanentes

- **`main`** — Produção
  - Apenas merges de `release` e `hotfix`
  - Sempre em estado estável e pronto para deploy
  - Recebe tags de versão semântica (v0.1.0, v0.2.0, etc)

- **`develop`** — Integração
  - Branch principal de desenvolvimento
  - Recebe merges de `feature` e `release`
  - Sempre em estado testável (mesmo que com features incompletas)

### Branches Temporárias

#### 1. **Feature Branch** — Novas funcionalidades
```bash
# Padrão de nomenclatura
git checkout -b feature/nome-da-feature develop

# Exemplo
git checkout -b feature/section-agenda develop
```
- Origem: `develop`
- Destino: `develop` (via Pull Request)
- Convenção: `feature/` + nome descritivo em kebab-case

#### 2. **Release Branch** — Preparação de versão
```bash
# Padrão de nomenclatura
git checkout -b release/1.0.0 develop
```
- Origem: `develop`
- Destino: `main` (merge final) e `develop` (sincronização)
- Convenção: `release/` + versão semântica
- **Uso**: Ajustes finais, bump de versão, preparação de deployment

#### 3. **Hotfix Branch** — Correções críticas em produção
```bash
# Padrão de nomenclatura
git checkout -b hotfix/1.0.1 main
```
- Origem: `main`
- Destino: `main` (merge com tag) e `develop` (backport)
- Convenção: `hotfix/` + versão semântica (patch)
- **Uso**: Corrigir bugs críticos em produção sem aguardar nova release

---

## 📝 Convenções de Commit

Utilizamos **Conventional Commits** para manter histórico organizado:

```
type(scope): subject

body

footer
```

### Tipos válidos

- **`feat`** — Nova funcionalidade
- **`fix`** — Correção de bug
- **`refactor`** — Mudanças sem alterar funcionalidade
- **`style`** — Formatação (espaços, quebras de linha, etc)
- **`test`** — Adicionar ou atualizar testes
- **`docs`** — Apenas documentação
- **`chore`** — Dependências, configuração, build
- **`ci`** — CI/CD relacionados
- **`perf`** — Melhorias de performance

### Exemplos

```bash
git commit -m "feat(hero): adicionar seção hero com animação GSAP"
git commit -m "fix(agenda): corrigir horário dos eventos"
git commit -m "refactor(components): extrair lógica de filtro para hook"
git commit -m "docs(readme): atualizar instruções de setup"
git commit -m "chore(deps): atualizar Astro para 5.1.0"
```

---

## 🎯 Roadmap

### Milestone 1: Fundação & Setup ✅ (100%)
**Deadline:** 30 de Abril de 2026 | **Concluído:** 20 de Abril

- ✅ Repositório Astro 6 + Bun + Biome configurado
- ✅ Design system tokens (cores, tipografia, BaseLayout)
- ✅ Sanity CMS configurado com schemas
- ✅ Fontes convertidas TTF → WOFF2
- ✅ Ativos organizados e documentação unificada
- ✅ Imagens otimizadas para WebP
- ✅ Vercel deploy configurado (vercel.json + webhook)
- ✅ GSAP + Lenis setup completo

### Milestone 2: Hero, Sobre & Eixos 🔄 (Próximo)
**Deadline:** 31 de Maio de 2026

- 🔄 Seção Hero com SplitText (DEV-46)
- 🔄 Seção Sobre editorial (DEV-49)
- 🔄 Seção Eixos interativos (DEV-50)
- 🔄 Transição de background (DEV-48)

### Milestone 3: Agenda, Galeria, CMS & Contato
**Deadline:** 30 de Junho de 2026

- ❌ Integração completa Sanity CMS
- ❌ Seção Agenda com filtros
- ❌ Galeria do espaço
- ❌ Formulário de contato
- ❌ Páginas dinâmicas de eventos

### Milestone 4: QA, Performance & Launch
**Deadline:** 31 de Julho de 2026

- ❌ Otimização final de performance
- ❌ Testes cross-browser e dispositivos
- ❌ Acessibilidade (WCAG AA)
- ❌ Configuração de Analytics
- ❌ Revisão de conteúdo com cliente
- ❌ Lançamento em produção

---

## 🎯 Métricas de Sucesso

### Performance & UX
| Métrica | Meta | Atual |
|---|---|---|
| Lighthouse Performance | ≥ 95 | 🔄 M2 |
| Lighthouse SEO | ≥ 98 | 🔄 M2 |
| Lighthouse Accessibility | ≥ 95 | 🔄 M2 |
| Build Time | < 30s | ✅ ~27s |
| Edge Requests | < 1000/mês | 🔄 Monitorando |

### Acquisition & Engagement (3 meses pós-lançamento)
| Métrica | Meta |
|---|---|
| Cliques orgânicos/mês | > 200 |
| Posição média keywords-alvo | Top 5 local |
| Taxa de clique (CTR) | > 3% |
| Bounce rate | < 60% |

### Conversão
| Métrica | Meta |
|---|---|
| Eventos/mês reservados via site | > 50 |
| Leads via formulário | > 20/mês |
| Newsletter subscribers | > 100 (1º mês) |

---

## 🚀 Deploy na Vercel

### Produção
- **URL:** https://estudio-entre.vercel.app (ou domínio customizado em M4)
- **Status:** ✅ Ativo
- **Build:** Automático via push para `main`
- **Webhook Sanity:** ✅ Configurado (rebuilds automáticos)

### Variáveis de Ambiente

```bash
# Sanity CMS
SANITY_PROJECT_ID=7a0ee11t
SANITY_DATASET=production
SANITY_WEBHOOK_SECRET=<uuid-seguro>

# Vercel
VERCEL_DEPLOY_HOOK_URL=<do-dashboard-vercel>

# Analytics (M4)
GA_MEASUREMENT_ID=<g-tag>
```

### Webhook Sanity

Quando conteúdo muda no Sanity CMS, um webhook é disparado:
1. Sanity detecta mudança em `evento` ou `configuracao`
2. Webhook chama `/api/webhook` (Edge Function)
3. Valida secret e dispara deploy hook da Vercel
4. Vercel faz rebuild automaticamente
5. Novo conteúdo aparece em ~2-3 minutos

---

## 👥 Como Contribuir

1. **Sempre** criar uma feature branch a partir de `develop`
2. **Sempre** fazer commit seguindo Conventional Commits
3. **Sempre** abrir Pull Request para revisão antes de merge
4. **Nunca** fazer push direto para `main` ou `develop`
5. **Sempre** sincronizar `develop` antes de criar novas branches
6. **Sempre** rodar `bun run check` antes de commitar

---

## 📚 Documentação

- [Briefing de Marca](./docs/briefing.md) — Identidade, missão e valores
- [PRD — Site Institucional](./docs/PRD-site.md) — Requisitos, objetivos e stack técnico
- [Identidade Visual](./docs/identidade-visual.md) — Guia de estilo e componentes
- [Guia de Deploy Vercel](./docs/VERCEL-DEPLOY.md) — Deploy passo a passo
- [Sistema de Animações](./docs/ANIMACOES.md) — GSAP + Lenis documentation
- [Otimização de Recursos](./docs/VERCEL-OPTIMIZACAO-RECURSOS.md) — Plano de otimização Vercel

---

## 📞 Contato

- **Instagram:** [@entrenoestudio](https://www.instagram.com/entrenoestudio/)
- **TikTok:** [@entrenoestudio](https://www.tiktok.com/@entrenoestudio)
- **Facebook:** [facebook.com/61583641444105](https://www.facebook.com/61583641444105)
- **Endereço:** Rua Maria Calmon, 100 — Méier, Rio de Janeiro – RJ, 20710-030

---

## 📊 Progresso do Projeto

- **M1 — Fundação & Setup:** ✅ 100% (11/11 issues)
- **M2 — Hero, Sobre & Eixos:** 🔄 0% (0/4 issues)
- **M3 — Agenda, Galeria, CMS:** ❌ 0% (0/6 issues)
- **M4 — QA, Performance & Launch:** ❌ 0% (0/5 issues)

**Progresso Geral:** 11/26 issues (42%)

---

**Última atualização:** 20 de Abril de 2026  
**Próximo milestone:** M2 — Hero, Sobre & Eixos (Deadline: 31 de Maio)
