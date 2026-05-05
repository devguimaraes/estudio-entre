# Hero Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestruturar a Hero Section para um layout editorial imponente, utilizando a foto vertical do salão com moldura de papel rasgado e preenchendo o espaço visual com tipografia ampliada.

**Architecture:** Refatoração do grid do `Hero.astro` para proporções 70/30, aplicação do `TornPaperFrame` na imagem e atualização das animações GSAP para suportar o novo design.

**Tech Stack:** Astro, TailwindCSS, GSAP, TornPaperFrame.

---

### Task 1: Reestruturar o Componente Hero.astro

**Files:**
- Modify: `src/components/sections/Hero.astro`

- [ ] **Step 1: Atualizar imports e aumentar escalas de texto/logo**
Aumentar o tamanho do logotipo e os espaçamentos tipográficos.

- [ ] **Step 2: Reconfigurar o layout de colunas**
Mudar de 3/5 e 2/5 para uma proporção mais generosa no texto (~70%) e a faixa vertical à direita (~30%).

- [ ] **Step 3: Aplicar TornPaperFrame na imagem**
Substituir o `clip-path` manual pelo componente unificado.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.astro
git commit -m "feat(hero): restructure layout to 70/30 editorial style"
```

---

### Task 2: Refinar Animações e Parallax

**Files:**
- Modify: `src/animations/hero.ts`

- [ ] **Step 1: Ajustar a Timeline de entrada**
Garantir que os novos elementos ampliados surjam com fluidez.

- [ ] **Step 2: Implementar Parallax Diferencial**
Adicionar movimento de scroll independente para a coluna da imagem e para a watermark de fundo.

- [ ] **Step 3: Validar responsividade mobile**
Garantir que no mobile o layout continue funcional (geralmente ocultando a faixa de imagem editorial).

- [ ] **Step 4: Commit**

```bash
git add src/animations/hero.ts
git commit -m "style(hero): update animations and parallax for new layout"
```

---

### Task 3: Validação Visual Final

- [ ] **Step 1: Build de produção**
Executar `bun run build` para checar erros.

- [ ] **Step 2: Screenshot de validação**
Usar `agent-browser` para capturar a nova Hero e validar o equilíbrio visual.

- [ ] **Step 3: Commit final**

```bash
git commit --allow-empty -m "fix(hero): final visual polish for editorial redesign"
```
