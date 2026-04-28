# Hero Portal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a cinematic "Portal" reveal effect for the Hero section using the "Chave" symbol, primary orange background, and halftone texture.

**Architecture:** Use GSAP for high-performance animations. The "Chave" symbol will act as a portal by scaling up massively (zoom-in) while content reveals behind it. Background will use a CSS-based halftone pattern.

**Tech Stack:** Astro, GSAP (GreenSock), Tailwind CSS.

---

### Task 1: Update Hero Structure and Styles

**Files:**
- Modify: `src/components/sections/Hero.astro`

- [ ] **Step 1: Update Hero HTML structure to include the Halftone layer and refine the Symbol container**

```astro
<!-- src/components/sections/Hero.astro -->
<!-- Replace current texture and symbol layers -->
<section class="hero h-screen relative bg-orange overflow-hidden" role="banner" aria-label="Estúdio Entre — Hub Cultural no Méier, RJ">
  <!-- Layer 0: Texture (Halftone) -->
  <div class="hero__texture absolute inset-0 pointer-events-none z-0">
    <div class="absolute inset-0 hero__halftone opacity-15"></div>
    <div class="absolute inset-0 bg-[url('/textures/paper-texture-optimized.webp')] bg-repeat opacity-10 mix-blend-multiply"></div>
  </div>
  
  <!-- Layer 1: The Portal Symbol (Chave) -->
  <div class="hero__symbol-container absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
    <img src="/icons/olho.svg" class="hero__symbol w-[200px] h-auto opacity-0" alt="" />
  </div>

  <!-- Layer 2: Content -->
  <div class="hero__layer-content relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
    <!-- ... Logo and Tagline ... -->
```

- [ ] **Step 2: Add Halftone CSS to the style block**

```css
/* src/components/sections/Hero.astro */
<style>
  .hero__halftone {
    background-image: radial-gradient(rgba(0, 0, 0, 0.2) 1.5px, transparent 1.5px);
    background-size: 10px 10px;
  }
  
  .hero {
    perspective: 1000px;
  }
  /* ... rest of styles ... */
</style>
```

- [ ] **Step 3: Commit structural changes**

```bash
git add src/components/sections/Hero.astro
git commit -m "feat(hero): atualizar estrutura para suporte ao portal e textura halftone"
```

---

### Task 2: Implement "Portal" Animation Logic

**Files:**
- Modify: `src/animations/hero.ts`

- [ ] **Step 1: Update `animateHero` function with the portal sequence**

```typescript
// src/animations/hero.ts
// Replace runHeroTimeline function content

  const runHeroTimeline = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.5 },
    });

    // 1. Initial State: Symbol is visible and centered
    tl.set(".hero__symbol", { opacity: 1, scale: 0.8 });
    tl.set(".hero__logo, .hero__tagline, .hero__ctas, .hero__scroll", { opacity: 0 });

    // 2. The Portal Reveal: Symbol zooms in and fades
    tl.to(".hero__symbol", {
      scale: 25,
      opacity: 0,
      duration: 1.8,
      ease: "expo.inOut",
    })
    // 3. Content Reveal: Logo and Tagline appear from depth
    .fromTo(".hero__logo", 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.2 },
      "-=1.2"
    )
    .fromTo(".hero__reveal-word",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.2 },
      "-=0.8"
    )
    // 4. Secondary elements
    .to(".hero__ctas", { opacity: 1, y: 0, duration: 1 }, "-=0.6")
    .to(".hero__scroll", { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");
  };
```

- [ ] **Step 2: Verify animation behavior**

Run: `bun run build` (to check for type errors)
Expected: Build passes without errors in `hero.ts`.

- [ ] **Step 3: Commit animation changes**

```bash
git add src/animations/hero.ts
git commit -m "feat(hero): implementar animação de portal 'zoom-through'"
```

---

### Task 3: Refine Tagline and Logo Visuals

**Files:**
- Modify: `src/components/sections/Hero.astro`

- [ ] **Step 1: Ensure Tagline uses Buvera Black and proper spacing**

```astro
<!-- src/components/sections/Hero.astro -->
<h1 class="hero__tagline font-display text-[clamp(4rem,15vw,10rem)] leading-[0.85] italic uppercase text-cream pointer-events-none font-black">
   <span class="block overflow-hidden"><span class="hero__reveal-word inline-block">Entre</span></span>
   <span class="block overflow-hidden"><span class="hero__reveal-word inline-block">Vozes</span></span>
   <span class="block overflow-hidden"><span class="hero__reveal-word inline-block">& Beats</span></span>
</h1>
```

- [ ] **Step 2: Commit visual refinements**

```bash
git add src/components/sections/Hero.astro
git commit -m "style(hero): aplicar Buvera Black e ajustes de escala na tagline"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Check build and lint**

Run: `bun run check`
Expected: No Biome errors.

- [ ] **Step 2: Manual verification (Self-Review)**
- Is the halftone texture visible?
- Does the "eye" symbol scale up to create a portal effect?
- Is the tagline legible and using the correct font?

- [ ] **Step 3: Final Commit**

```bash
git commit --allow-empty -m "chore(hero): finalização do redesign do portal de entrada"
```
