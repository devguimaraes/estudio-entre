# Hero Refinement (Logo Focus) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Hero section to make the Logo the main focus and update the tagline text and style.

**Architecture:** Adjust Tailwind classes for scale and typography. Update GSAP timeline for the new hierarchy.

**Tech Stack:** Astro, GSAP, Tailwind CSS.

---

### Task 1: Update Hero Content and Styles

**Files:**
- Modify: `src/components/sections/Hero.astro`

- [ ] **Step 1: Update Logo size and Tagline content/style**

```astro
<!-- src/components/sections/Hero.astro -->
<!-- Update Logo Image classes -->
<Image
  src={logoClaro}
  class="hero__logo opacity-0 w-full max-w-[280px] sm:max-w-[420px] h-auto"
  alt="Estúdio Entre"
  loading="eager"
  fetchpriority="high"
/>

<!-- Update Tagline structure -->
<div class="hero__description mt-10 text-cream text-center opacity-0">
  <p class="font-display text-xs sm:text-sm uppercase tracking-[0.3em] mb-2">
    Espaço cultural independente
  </p>
  <p class="font-display italic text-lg sm:text-xl opacity-90">
    encontros, palavra e som.
  </p>
</div>
```

- [ ] **Step 2: Remove old tagline classes if any**

- [ ] **Step 3: Commit structural changes**

```bash
git add src/components/sections/Hero.astro
git commit -m "style(hero): destacar logo e atualizar para nova descrição institucional"
```

---

### Task 2: Update Animation for New Hierarchy

**Files:**
- Modify: `src/animations/hero.ts`

- [ ] **Step 1: Adjust GSAP timeline to reveal the new description container**

```typescript
// src/animations/hero.ts

  // Update target to .hero__description instead of .hero__tagline and .hero__reveal-word
  tl.set(".hero__logo, .hero__description, .hero__ctas, .hero__scroll", { opacity: 0 });

  // ... after symbol zoom ...
  .fromTo(".hero__logo",
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 1.2 },
    "-=1.0"
  )
  .fromTo(".hero__description",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1 },
    "-=0.6"
  )
```

- [ ] **Step 2: Commit animation changes**

```bash
git add src/animations/hero.ts
git commit -m "feat(hero): ajustar animação para a nova hierarquia Logo > Descrição"
```

---

### Task 3: Final Verification

- [ ] **Step 1: Check build**

Run: `bun run build`
Expected: Success.

- [ ] **Step 2: Manual Check**
- Is the logo properly sized?
- Is the new description legible and elegant?
- Is the "Portal" effect still working smoothly?
