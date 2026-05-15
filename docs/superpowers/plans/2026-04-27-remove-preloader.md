# Remove Preloader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the preloader and adjust the Hero animation to start with a 300ms delay.

**Architecture:** Remove Preloader component and animation logic. Update Hero GSAP timeline to start automatically.

**Tech Stack:** Astro, GSAP.

---

### Task 1: Update Hero Animation Logic

**Files:**
- Modify: `src/animations/hero.ts`

- [ ] **Step 1: Remove preloader dependency and add delay**

```typescript
// src/animations/hero.ts
// 1. Remove import { onPreloaderComplete } from "@/animations/preloader";
// 2. Call runHeroTimeline() directly
// 3. Add delay to timeline

  const runHeroTimeline = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.5 },
      delay: 0.3 // 300ms delay
    });
    // ... rest of timeline
  }

  // Replace: onPreloaderComplete(runHeroTimeline);
  runHeroTimeline();
```

- [ ] **Step 2: Commit hero changes**

```bash
git add src/animations/hero.ts
git commit -m "feat(hero): remover dependência do preloader e adicionar delay de 300ms"
```

---

### Task 2: Remove Preloader from Layout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Remove Preloader component, imports, and scripts**

```astro
<!-- src/layouts/BaseLayout.astro -->
<!-- 1. Remove import Preloader from "@/components/ui/Preloader.astro"; -->
<!-- 2. Remove <Preloader /> -->
<!-- 3. Remove the entire <script is:inline> block for preloader fallback -->
<!-- 4. Update <body> class: remove "is-loading" -->
<!-- 5. Remove import { initPreloader } from "@/animations/preloader"; -->
<!-- 6. Remove initPreloader(); -->
```

- [ ] **Step 2: Commit layout changes**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "refactor(layout): remover componente e lógica do preloader"
```

---

### Task 3: Cleanup Unused Files

**Files:**
- Delete: `src/components/ui/Preloader.astro`
- Delete: `src/animations/preloader.ts`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Delete files**

```bash
rm src/components/ui/Preloader.astro src/animations/preloader.ts
```

- [ ] **Step 2: Remove preloader styles from global.css**

```css
/* src/styles/global.css */
/* Remove rules like body.no-js .preloader { ... } */
```

- [ ] **Step 3: Commit cleanup**

```bash
git add src/styles/global.css
git rm src/components/ui/Preloader.astro src/animations/preloader.ts
git commit -m "chore: remover arquivos e estilos órfãos do preloader"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Check build**

Run: `bun run build`
Expected: Success.

- [ ] **Step 2: Manual Check**
- Confirm no console errors related to missing preloader.
- Confirm Hero animation starts after a short delay.
