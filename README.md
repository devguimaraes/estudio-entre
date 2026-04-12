# Estúdio Entre — Site Institucional

> Hub cultural e criativo independente da zona norte do Rio de Janeiro

**Status:** 🔄 Pré-lançamento — Documentação 100% / Assets prontos / Implementação técnica iniciando  
**Localização:** Rua Maria Calmon, 100 — Méier, Rio de Janeiro – RJ  
**Data de atualização:** 12 de Abril de 2026  
**Mantido por:** Equipe Estúdio Entre

---

## 📋 Sobre o Projeto

O site do **Estúdio Entre** é um platform institucional que funciona como:

- **Hub de descoberta**: Ser encontrado organicamente por quem busca espaço cultural, biblioterapia, sarau ou gravação de podcast
- **Ferramenta de conversão**: Transformar visitantes em participantes de eventos ou clientes do estúdio
- **Centralizador de informação**: Agenda, serviços, formas de contato — reduzindo dependência de redes sociais

### Missão
Promover encontros significativos entre cultura, conhecimento e bem-estar, oferecendo um espaço plural onde leitura, escuta e expressão criativa convivem.

### Visão
Ser o principal ponto de encontro cultural independente da zona norte do Rio de Janeiro — um lugar que as pessoas reconhecem como seu.

### 📌 Estado do Projeto
- ✅ **Documentação:** Completa (Branding, PRD, identidade visual, Git Flow)
- ✅ **Identidade Visual & Assets:** Prontos (logos, ícones, texturas, mockups, images sociais)
- ✅ **Fontes Otimizadas:** Convertidas para WOFF2, CSS auto-gerado
- 🔄 **Implementação técnica:** Iniciando (estrutura Astro ainda a criar)
- ❌ **CI/CD & Deploy:** A ser configurado

---

## � Quick Start

### Pré-requisitos
- **Node.js** 18+ ou **Bun** (recomendado)
- **Git** com Git Flow configurado

### Setup Inicial (TODO)
```bash
# 1. Clonar repositório
git clone https://github.com/devguimaraes/estudio-entre.git
cd estudio-entre

# 2. Instalar dependências
bun install
# ou: npm install / yarn install / pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Adicionar: SANITY_PROJECT_ID, SANITY_DATASET, GA_MEASUREMENT_ID, etc.

# 4. Inicializar Sanity CMS
sanity init

# 5. Rodar dev server
bun run dev

# 6. Abrir no navegador
# → http://localhost:4321
```

**Status:** Estrutura técnica ainda a ser criada. Após este setup estar pronto, as instruções acima funcionarão.

---

## 🛠️ Stack Técnico (Planejado)

> 📝 **Nota:** Stack abaixo representa a arquitetura **planejada**. Implementação em progresso.

| Camada | Tecnologia | Versão | Status |
|---|---|---|---|
| **Framework** | Astro | 5.x | 🔄 Iniciando |
| **UI Islands** | React | 19.x | 🔄 Iniciando |
| **Estilos** | Tailwind CSS | 4.x | 🔄 Iniciando |
| **Componentes** | Shadcn/ui + Radix UI | latest | 🔄 Iniciando |
| **Animações** | GSAP + ScrollTrigger + SplitText | 3.x | 🔄 Iniciando |
| **CMS** | Sanity.io | Free plan | 🔄 Iniciando |
| **Scroll suave** | Lenis | latest | 🔄 Iniciando |
| **Linting** | Biome | latest | 🔄 Iniciando |
| **Runtime** | Bun | latest | ❌ Aguardando |
| **Deploy** | Vercel Hobby | — | ❌ Aguardando |
| **Analytics** | GA4 + Search Console | — | ❌ Aguardando |

### ✅ Recursos Já Prontos
- **Fontes:** 3 famílias (Buvera sans, Dongra script, Helony script) otimizadas em WOFF2
- **Tipografia CSS:** Auto-gerado com `--font-*` variables, `@font-face` com `font-display: swap`
- **Ícones:** 22 SVGs otimizados em `src/assets/icons/`
- **Logos:** 9 variações (claro, preto, vinho) em `src/assets/logos/`
- **Imagens sociais:** 31 assets (avatares, stories, feeds) em `src/assets/images/`
- **Texturas:** 5 backgrounds em `src/assets/textures/`
- **Mockups:** 6 aplicações em contextos reais em `src/assets/mockups/`

---

## 📂 Estrutura do Projeto

```
estudios-entre/
├── src/
│   ├── components/        # 🔄 Componentes React reutilizáveis (vazio — iniciando)
│   ├── layouts/           # 🔄 Layouts base das páginas (vazio — iniciando)
│   ├── pages/             # 🔄 Páginas Astro (vazio — iniciando)
│   ├── styles/            # ✅ Estilos globais + Tailwind (fonts.css pronto)
│   ├── assets/            # ✅ Imagens otimizadas, ícones, logos (completo)
│   └── utils/             # 🔄 Funções auxiliares, helpers (vazio — iniciando)
│
├── public/                # ✅ Assets estáticos (favicon, fontes WOFF2)
├── docs/                  # ✅ Documentação completa
│   ├── brifieng.md        # Missão, visão, personas, tom de voz
│   ├── PRD-site.md        # Requisitos, arquitetura, CMS schema
│   ├── identidade-visual.md  # Logo, cores, tipografia
│   └── Guia_Estudio Entre.pdf
│
├── scripts/
│   └── convert-fonts/     # ✅ Conversor TTF → WOFF2 (funcional)
│
├── .github/
│   └── GIT-FLOW-CONFIG.md # ✅ Documentação Git Flow
│
├── .editorconfig          # ✅ Configuração editor
├── .gitignore             # ✅ Configurado
└── README.md              # ✅ Este arquivo
```

**Legenda:** ✅ Pronto | 🔄 Em desenvolvimento | ❌ Aguardando
> 📝 **Nota:** Estrutura técnica (Astro, React, Tailwind, Sanity) está pronta no planejamento e documentação. O código ainda não foi inicializado — deixe o planejamento de tarefas para a próxima fase de implementação.

---

## �🌊 Git Flow — Fluxo de Branches

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

## 📋 Workflow Passo-a-Passo

### 1. Iniciar uma Feature

```bash
# Atualizar develop com as mudanças mais recentes
git checkout develop
git pull origin develop

# Criar feature branch
git checkout -b feature/nome-descritivo develop

# Trabalhar normalmente
# ... editar arquivos ...
git add .
git commit -m "feat: descrição do que foi feito"
git push origin feature/nome-descritivo
```

**Depois:** Abrir Pull Request para `develop`

### 2. Criar uma Release

```bash
# Criar release branch a partir de develop
git checkout -b release/1.0.0 develop
git push origin release/1.0.0

# Fazer ajustes finais se necessário
git commit -m "bump: versão 1.0.0"

# Fazer merge em main
git checkout main
git pull origin main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Sincronizar develop
git checkout develop
git pull origin develop
git merge --no-ff release/1.0.0
git push origin develop

# Deletar release branch
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

### 3. Corrigir um Hotfix

```bash
# Criar hotfix a partir de main
git checkout -b hotfix/1.0.1 main
git push origin hotfix/1.0.1

# Fazer correção e commit
git commit -m "fix: descrição da correção"

# Fazer merge em main
git checkout main
git pull origin main
git merge --no-ff hotfix/1.0.1
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main --tags

# Sincronizar develop (importante!)
git checkout develop
git pull origin develop
git merge --no-ff hotfix/1.0.1
git push origin develop

# Deletar hotfix branch
git branch -d hotfix/1.0.1
git push origin --delete hotfix/1.0.1
```

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

## 🎯 Métricas de Sucesso

### Performance & UX (Pós-lançamento)
| Métrica | Meta |
|---|---|
| Lighthouse Performance | ≥ 95 |
| Lighthouse SEO | ≥ 98 |
| Lighthouse Accessibility | ≥ 95 |
| Core Web Vitals — LCP | < 2.5s |
| Core Web Vitals — CLS | < 0.1 |

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
| Newsletter subscribers | > 100 (1º mês)

---

## 👥 Como Contribuir

1. **Sempre** criar uma feature branch a partir de `develop`
2. **Sempre** fazer commit seguindo Conventional Commits
3. **Sempre** abrir Pull Request para revisão antes de merge
4. **Nunca** fazer push direto para `main` ou `develop`
5. **Sempre** sincronizar `develop` antes de criar novas branches

---

## 📚 Documentação

- [Briefing de Marca](./docs/brifieng.md) — Identidade, missão e valores
- [PRD — Site Institucional](./docs/PRD-site.md) — Requisitos, objetivos e stack técnico
- [Identidade Visual](./docs/identidade-visual.md) — Guia de estilo e componentes

---

## 📞 Contato

- **Instagram:** [@entrenoestudio](https://www.instagram.com/entrenoestudio/)
- **TikTok:** [@entrenoestudio](https://www.tiktok.com/@entrenoestudio)
- **Facebook:** [facebook.com/61583641444105](https://www.facebook.com/61583641444105)
- **Endereço:** Rua Maria Calmon, 100 — Méier, Rio de Janeiro – RJ, 20710-030

---

**Última atualização:** 12 de Abril de 2026
