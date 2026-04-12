# Estúdio Entre — Site Institucional

> Hub cultural e criativo independente da zona norte do Rio de Janeiro

**Status:** Pré-lançamento (desenvolvimento em andamento)  
**Localização:** Rua Maria Calmon, 100 — Méier, Rio de Janeiro – RJ  
**Data de atualização:** Abril 2026

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

---

## 🛠️ Stack Técnico

| Camada | Tecnologia | Versão |
|---|---|---|
| **Framework** | Astro | 5.x |
| **UI Islands** | React | 19.x |
| **Estilos** | Tailwind CSS | 4.x |
| **Componentes** | Shadcn/ui + Radix UI | latest |
| **Animações** | GSAP + ScrollTrigger + SplitText | 3.x |
| **CMS** | Sanity.io | Free plan |
| **Scroll suave** | Lenis | latest |
| **Linting** | Biome | latest |
| **Runtime** | Bun | latest |
| **Deploy** | Vercel Hobby | — |
| **Analytics** | GA4 + Search Console | — |

---

## 📂 Estrutura do Projeto

```
estudios-entre/
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   ├── layouts/           # Layouts base das páginas
│   ├── pages/             # Páginas Astro (index, sobre, agenda, etc)
│   ├── styles/            # Estilos globais e configuração Tailwind
│   ├── assets/            # Imagens otimizadas, ícones
│   └── utils/             # Funções auxiliares, helpers
│
├── public/                # Assets estáticos (favicon, etc)
├── docs/                  # Documentação do projeto
│
├── ESTÚDIO ENTRE/         # Identidade visual, ícones, assets da marca
│   ├── [IDENTIDADE]/      # Logo, fontes, paleta
│   ├── ÍCONES/            # Biblioteca de ícones
│   ├── IMPRESSOS/         # Layouts de impressos
│   └── INSTAGRAM/         # Assets para redes sociais
│
├── .github/               # Workflows, templates de issue/PR
├── .editorconfig          # Configuração de editor (espaçamento, fim de linha)
├── .gitignore             # Arquivos a ignorar no controle de versão
└── README.md              # Este arquivo
```

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

| Métrica | Meta (3 meses pós-lançamento) |
|---|---|
| Lighthouse Performance | ≥ 95 |
| Lighthouse SEO | ≥ 98 |
| Lighthouse Accessibility | ≥ 95 |
| Core Web Vitals (LCP) | < 2.5s |
| Core Web Vitals (CLS) | < 0.1 |
| Cliques orgânicos/mês | > 200 |
| Posição média keywords-alvo | Top 5 local |

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

**Última atualização:** Abril 2026  
**Mantido por:** Equipe Estúdio Entre
