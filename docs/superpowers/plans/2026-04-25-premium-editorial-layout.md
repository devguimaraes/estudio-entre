# Premium Editorial Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved premium editorial refinement for the Estudio Entre home page: branded symbol loader, cinematic hero handoff, chromatic section wipes, and polished section motion.

**Architecture:** Keep the current Astro + GSAP + Lenis stack. Add small UI components for global visual layers, put orchestration in focused animation modules, and keep per-section files responsible only for their section-specific reveals.

**Tech Stack:** Astro 6, Tailwind CSS 4, GSAP 3 with ScrollTrigger, Lenis, TypeScript, Biome, Bun scripts.

---

## File Structure

- Create: `src/components/ui/Preloader.astro`
  - Renders the fixed opening layer and brand symbol.
- Create: `src/components/ui/SectionWipes.astro`
  - Renders fixed panels used by scroll-triggered chromatic wipes.
- Create: `src/animations/preloader.ts`
  - Owns page-load timeline, body loading classes, and completion event.
- Create: `src/animations/sectionWipes.ts`
  - Owns all chromatic wipe timelines and ScrollTrigger bindings.
- Create: `src/animations/servicos.ts`
  - Moves Servicos animation out of inline Astro script.
- Modify: `src/layouts/BaseLayout.astro`
  - Mounts preloader and wipe layers and initializes the new animation modules.
- Modify: `src/styles/global.css`
  - Adds global loading, wipe, and reduced-motion support.
- Modify: `src/animations/hero.ts`
  - Gates hero entrance on preloader completion and refines desktop-only parallax.
- Modify: `src/components/sections/Hero.astro`
  - Adds initial translate state for CTA reveal if needed.
- Modify: `src/animations/sobre.ts`
  - Refines image reveal, text stagger, and watermark scroll motion.
- Modify: `src/components/sections/Servicos.astro`
  - Adds stable selectors and calls `animateServicos`.
- Modify: `src/components/sections/Eixos.astro`
  - Adds stable selectors for blade image/title/body orchestration.
- Modify: `src/animations/eixos.ts`
  - Refines blade entrance and reduced-motion behavior.
- Modify: `src/animations/agenda.ts`
  - Coordinates agenda title and content reveal.
- Modify: `src/animations/espaco.ts`
  - Adds desktop/mobile parallax guards.
- Modify: `src/components/sections/Contato.astro`
  - Adds stable selectors and calls `animateContato`.
- Modify: `src/animations/contato.ts`
  - Aligns selectors with the current redesigned contact markup.
- Modify: `src/components/sections/Footer.astro`
  - Adds stable selectors and calls `animateFooter`.
- Modify: `src/animations/footer.ts`
  - Aligns selectors with the current redesigned footer markup.
- Modify: `docs/ANIMACOES.md`
  - Documents `preloader.ts`, `sectionWipes.ts`, and `servicos.ts`.

---

## Task 1: Add Branded Preloader

**Files:**
- Create: `src/components/ui/Preloader.astro`
- Create: `src/animations/preloader.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create `src/components/ui/Preloader.astro`**

Use this full file:

```astro
---
// Preloader.astro - cinematic opening layer for Estudio Entre
---

<div class="preloader" id="site-preloader" aria-hidden="true">
  <div class="preloader__texture"></div>
  <div class="preloader__mark-wrap">
    <img class="preloader__mark" src="/icons/olho.svg" alt="" />
  </div>
  <div class="preloader__meta">
    <span>Estudio Entre</span>
    <span>Meier, RJ</span>
  </div>
  <div class="preloader__progress" aria-hidden="true">
    <span class="preloader__progress-fill"></span>
  </div>
</div>

<style>
  .preloader {
    position: fixed;
    inset: 0;
    z-index: 9000;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: var(--color-near-black);
    color: var(--color-cream);
    pointer-events: none;
    clip-path: inset(0 0 0 0);
  }

  .preloader__texture {
    position: absolute;
    inset: 0;
    background-image: url("/textures/paper-texture-optimized.webp");
    background-repeat: repeat;
    opacity: 0.08;
    mix-blend-mode: screen;
  }

  .preloader__mark-wrap {
    position: relative;
    width: clamp(7rem, 18vw, 15rem);
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border: 1px solid rgba(240, 237, 232, 0.2);
    border-radius: 999px;
  }

  .preloader__mark-wrap::before,
  .preloader__mark-wrap::after {
    content: "";
    position: absolute;
    inset: 14%;
    border: 1px solid rgba(236, 104, 56, 0.32);
    border-radius: inherit;
  }

  .preloader__mark-wrap::after {
    inset: 28%;
    border-color: rgba(240, 237, 232, 0.28);
  }

  .preloader__mark {
    position: relative;
    width: 42%;
    height: auto;
    filter: brightness(0) invert(1);
  }

  .preloader__meta {
    position: absolute;
    left: clamp(1.5rem, 5vw, 4rem);
    right: clamp(1.5rem, 5vw, 4rem);
    bottom: clamp(1.5rem, 5vw, 3.5rem);
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.625rem;
    font-weight: 800;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    opacity: 0.72;
  }

  .preloader__progress {
    position: absolute;
    left: clamp(1.5rem, 5vw, 4rem);
    right: clamp(1.5rem, 5vw, 4rem);
    bottom: clamp(4rem, 8vw, 6rem);
    height: 1px;
    overflow: hidden;
    background: rgba(240, 237, 232, 0.16);
  }

  .preloader__progress-fill {
    display: block;
    width: 100%;
    height: 100%;
    background: var(--color-orange);
    transform: scaleX(0);
    transform-origin: left center;
  }

  @media (max-width: 640px) {
    .preloader__meta {
      flex-direction: column;
      align-items: center;
      text-align: center;
      letter-spacing: 0.2em;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .preloader {
      display: none;
    }
  }
</style>
```

- [ ] **Step 2: Create `src/animations/preloader.ts`**

Use this full file:

```ts
import gsap from "gsap";

export const PRELOADER_COMPLETE_EVENT = "estudio:preloader-complete";

declare global {
  interface Window {
    __estudioPreloaderDone?: boolean;
    __estudioPreloaderPromise?: Promise<void>;
  }
}

function completePreloader(): void {
  if (window.__estudioPreloaderDone) return;

  window.__estudioPreloaderDone = true;
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-loaded");
  document.dispatchEvent(new CustomEvent(PRELOADER_COMPLETE_EVENT));
}

export function onPreloaderComplete(callback: () => void): void {
  if (window.__estudioPreloaderDone || document.body.classList.contains("is-loaded")) {
    requestAnimationFrame(callback);
    return;
  }

  document.addEventListener(PRELOADER_COMPLETE_EVENT, callback, { once: true });
}

export function initPreloader(): Promise<void> {
  if (window.__estudioPreloaderPromise) return window.__estudioPreloaderPromise;

  window.__estudioPreloaderPromise = new Promise((resolve) => {
    const preloader = document.querySelector<HTMLElement>("#site-preloader");
    const markWrap = document.querySelector<HTMLElement>(".preloader__mark-wrap");
    const mark = document.querySelector<HTMLElement>(".preloader__mark");
    const progress = document.querySelector<HTMLElement>(".preloader__progress-fill");
    const meta = document.querySelectorAll<HTMLElement>(".preloader__meta span");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.body.classList.add("is-loading");

    const finish = () => {
      completePreloader();
      resolve();
    };

    if (!preloader || prefersReducedMotion) {
      if (preloader) gsap.set(preloader, { autoAlpha: 0, display: "none" });
      finish();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: finish,
    });

    tl.set(preloader, { autoAlpha: 1 })
      .fromTo(
        markWrap,
        { autoAlpha: 0, scale: 0.72, rotate: -8 },
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.1 },
      )
      .fromTo(
        mark,
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.9 },
        "-=0.75",
      )
      .fromTo(
        meta,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.75 },
        "-=0.55",
      )
      .to(
        progress,
        { scaleX: 1, duration: 1.25, ease: "power3.inOut" },
        "-=0.85",
      )
      .to(markWrap, { scale: 1.18, duration: 0.5, ease: "power2.inOut" })
      .to(
        preloader,
        { clipPath: "inset(0 0 100% 0)", duration: 0.95, ease: "expo.inOut" },
        "-=0.05",
      )
      .set(preloader, { display: "none" });
  });

  return window.__estudioPreloaderPromise;
}
```

- [ ] **Step 3: Modify `src/layouts/BaseLayout.astro` imports and body markup**

At the top, add:

```astro
import Preloader from "@/components/ui/Preloader.astro";
```

In the body, change:

```astro
<body>
  <CursorCustom />
  <Navbar />
  <slot />
```

to:

```astro
<body class="is-loading">
  <Preloader />
  <CursorCustom />
  <Navbar />
  <slot />
```

In the bottom script, add the preloader import and call:

```astro
<script>
  import { initGlobalAnimations } from "@/animations/init";
  import { initColorTransitions } from "@/animations/colorTransition";
  import { initCursor } from "@/animations/cursor";
  import { initPreloader } from "@/animations/preloader";

  initPreloader();
  initGlobalAnimations();
  initColorTransitions();
  initCursor();
</script>
```

- [ ] **Step 4: Add global loading state to `src/styles/global.css`**

Append this block after the body rule:

```css
body.is-loading {
  overflow: hidden;
}

body.is-loading .navbar,
body.is-loading .cursor-wrapper {
  opacity: 0;
}

body.is-loaded .navbar,
body.is-loaded .cursor-wrapper {
  opacity: 1;
}
```

- [ ] **Step 5: Run format/check**

Run:

```bash
bun run check
```

Expected: command exits with code 0 and no Biome errors.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add src/components/ui/Preloader.astro src/animations/preloader.ts src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: add branded editorial preloader"
```

---

## Task 2: Gate and Refine Hero Entrance

**Files:**
- Modify: `src/animations/hero.ts`
- Modify: `src/components/sections/Hero.astro`

- [ ] **Step 1: Replace `src/animations/hero.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { onPreloaderComplete } from "@/animations/preloader";

export function animateHero(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const revealTargets =
    ".hero__symbol, .hero__logo, .hero__reveal-word, .hero__ctas, .hero__scroll";

  if (prefersReducedMotion) {
    gsap.set(revealTargets, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    });
    return;
  }

  gsap.set(".hero__ctas", { y: 24 });
  gsap.set(".hero__scroll", { y: 12 });

  const runHeroTimeline = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.35 },
    });

    tl.to(".hero__symbol", {
      opacity: 0.12,
      scale: 1.14,
      duration: 2.4,
      ease: "expo.out",
    })
      .to(
        ".hero__logo",
        {
          opacity: 1,
          y: 0,
          duration: 1.45,
        },
        "-=2.05",
      )
      .to(
        ".hero__reveal-word",
        {
          y: 0,
          stagger: 0.13,
          duration: 1.45,
        },
        "-=1.2",
      )
      .to(
        ".hero__ctas",
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.75",
      )
      .to(
        ".hero__scroll",
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
        },
        "-=0.55",
      )
      .to(
        ".hero__scroll-line",
        {
          x: 0,
          duration: 1.25,
          ease: "expo.inOut",
        },
        "-=0.8",
      );
  };

  onPreloaderComplete(runHeroTimeline);

  if (!canHover) return;

  const symbol = document.querySelector<HTMLElement>(".hero__symbol");
  if (!symbol) return;

  const onMouseMove = (event: MouseEvent) => {
    const xPos = (event.clientX / window.innerWidth - 0.5) * 22;
    const yPos = (event.clientY / window.innerHeight - 0.5) * 22;

    gsap.to(symbol, {
      x: xPos,
      y: yPos,
      duration: 1.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  window.addEventListener("mousemove", onMouseMove, { passive: true });
}
```

- [ ] **Step 2: Update CTA initial state in `src/components/sections/Hero.astro`**

Change the CTA wrapper class from:

```astro
<div class="hero__ctas mt-16 flex flex-col sm:flex-row gap-6 opacity-0">
```

to:

```astro
<div class="hero__ctas mt-16 flex translate-y-6 flex-col gap-6 opacity-0 sm:flex-row">
```

- [ ] **Step 3: Run check**

Run:

```bash
bun run check
```

Expected: command exits with code 0 and no Biome errors.

- [ ] **Step 4: Commit Task 2**

Run:

```bash
git add src/animations/hero.ts src/components/sections/Hero.astro
git commit -m "feat: refine cinematic hero entrance"
```

---

## Task 3: Add Chromatic Section Wipes

**Files:**
- Create: `src/components/ui/SectionWipes.astro`
- Create: `src/animations/sectionWipes.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create `src/components/ui/SectionWipes.astro`**

Use this full file:

```astro
---
// SectionWipes.astro - fixed chromatic panels for editorial section transitions
---

<div class="section-wipes" id="section-wipes" aria-hidden="true">
  <span class="section-wipes__panel"></span>
  <span class="section-wipes__panel"></span>
  <span class="section-wipes__panel"></span>
</div>
```

- [ ] **Step 2: Create `src/animations/sectionWipes.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type WipeConfig = {
  trigger: string;
  colors: [string, string, string];
};

const WIPE_CONFIGS: WipeConfig[] = [
  { trigger: ".sobre", colors: ["#ec6838", "#f0ede8", "#3d1020"] },
  { trigger: ".servicos", colors: ["#f0ede8", "#ec6838", "#777bde"] },
  { trigger: ".eixos", colors: ["#3d1020", "#9e4b2d", "#1a1612"] },
  { trigger: ".agenda", colors: ["#8e8100", "#dec72c", "#3d1020"] },
  { trigger: ".espaco", colors: ["#3d1020", "#ec6838", "#f0ede8"] },
  { trigger: ".contato", colors: ["#1a1612", "#777bde", "#ec6838"] },
  { trigger: ".footer", colors: ["#f0ede8", "#c4a54b", "#1a1612"] },
];

function playWipe(panels: HTMLElement[], colors: WipeConfig["colors"]): void {
  gsap.killTweensOf(panels);

  for (const [index, panel] of panels.entries()) {
    panel.style.backgroundColor = colors[index];
  }

  gsap
    .timeline()
    .set(panels, { xPercent: -110 })
    .to(panels, {
      xPercent: 0,
      duration: 0.42,
      stagger: 0.055,
      ease: "power3.inOut",
    })
    .to(
      panels,
      {
        xPercent: 110,
        duration: 0.72,
        stagger: 0.06,
        ease: "expo.inOut",
      },
      "+=0.04",
    )
    .set(panels, { xPercent: -110 });
}

export function initSectionWipes(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  const panels = Array.from(
    document.querySelectorAll<HTMLElement>(".section-wipes__panel"),
  );

  if (panels.length === 0) return;

  gsap.set(panels, { xPercent: -110 });

  for (const config of WIPE_CONFIGS) {
    const trigger = document.querySelector<HTMLElement>(config.trigger);
    if (!trigger) continue;

    ScrollTrigger.create({
      trigger,
      start: "top 78%",
      onEnter: () => playWipe(panels, config.colors),
      onEnterBack: () => playWipe(panels, config.colors),
    });
  }
}
```

- [ ] **Step 3: Modify `src/layouts/BaseLayout.astro`**

Add import:

```astro
import SectionWipes from "@/components/ui/SectionWipes.astro";
```

In the body, place wipes after the preloader and before cursor/navbar:

```astro
<body class="is-loading">
  <Preloader />
  <SectionWipes />
  <CursorCustom />
  <Navbar />
  <slot />
```

In the script, add:

```astro
import { initSectionWipes } from "@/animations/sectionWipes";
```

Then initialize after color transitions:

```astro
initPreloader();
initGlobalAnimations();
initColorTransitions();
initSectionWipes();
initCursor();
```

- [ ] **Step 4: Add wipe CSS to `src/styles/global.css`**

Append:

```css
.section-wipes {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  pointer-events: none;
  overflow: hidden;
}

.section-wipes__panel {
  display: block;
  min-width: 100%;
  height: 100%;
  transform: translateX(-110%);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .section-wipes {
    display: none;
  }
}
```

- [ ] **Step 5: Run check**

Run:

```bash
bun run check
```

Expected: command exits with code 0 and no Biome errors.

- [ ] **Step 6: Commit Task 3**

Run:

```bash
git add src/components/ui/SectionWipes.astro src/animations/sectionWipes.ts src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: add chromatic section wipes"
```

---

## Task 4: Refine Section Animation Modules

**Files:**
- Modify: `src/animations/sobre.ts`
- Create: `src/animations/servicos.ts`
- Modify: `src/components/sections/Servicos.astro`
- Modify: `src/components/sections/Eixos.astro`
- Modify: `src/animations/eixos.ts`
- Modify: `src/animations/agenda.ts`
- Modify: `src/animations/espaco.ts`

- [ ] **Step 1: Replace `src/animations/sobre.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateSobre(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const section = document.querySelector<HTMLElement>(".sobre");

  if (!section) return;

  const title = section.querySelector<HTMLElement>(".sobre__title");
  const texts = section.querySelectorAll<HTMLElement>(".sobre__text");
  const image = section.querySelector<HTMLElement>(".sobre__image-reveal");
  const watermark = section.querySelector<HTMLElement>(".sobre__watermark");
  const signature = section.querySelector<HTMLElement>(".sobre__signature");

  if (prefersReducedMotion) {
    gsap.set([title, texts, image, watermark, signature], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: "inset(0% 0 0 0)",
    });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    title,
    { opacity: 0, x: -34 },
    { opacity: 1, x: 0, duration: 1.25, ease: "expo.out" },
  )
    .fromTo(
      texts,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.16, ease: "power3.out" },
      "-=0.75",
    )
    .fromTo(
      image,
      { clipPath: "inset(100% 0 0 0)", y: 36 },
      {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: 1.45,
        ease: "expo.inOut",
      },
      "-=1",
    )
    .fromTo(
      signature,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.95, ease: "power2.out" },
      "-=0.55",
    );

  if (watermark) {
    gsap.fromTo(
      watermark,
      { scale: 0.92, opacity: 0 },
      {
        scale: 1.05,
        opacity: 0.025,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }
}
```

- [ ] **Step 2: Create `src/animations/servicos.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateServicos(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const section = document.querySelector<HTMLElement>(".servicos");

  if (!section) return;

  const headerItems = section.querySelectorAll<HTMLElement>(
    ".servicos__eyebrow, .servicos__title",
  );
  const cards = section.querySelectorAll<HTMLElement>(".servicos__card");

  if (prefersReducedMotion) {
    gsap.set([headerItems, cards], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    headerItems,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.95, stagger: 0.12, ease: "expo.out" },
  ).fromTo(
    cards,
    { opacity: 0, y: 46 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
    "-=0.45",
  );
}
```

- [ ] **Step 3: Modify `src/components/sections/Servicos.astro` selectors and script**

Change the header opening from:

```astro
<header class="mb-20">
  <span class="text-[10px] uppercase tracking-[0.4em] text-near-black/50 block mb-4">Núcleo de Criação</span>
  <h2 class="text-6xl md:text-8xl font-display italic font-black uppercase leading-none">
```

to:

```astro
<header class="servicos__header mb-20">
  <span class="servicos__eyebrow mb-4 block text-[10px] uppercase tracking-[0.4em] text-near-black/50">Núcleo de Criação</span>
  <h2 class="servicos__title font-display text-6xl font-black uppercase italic leading-none md:text-8xl">
```

Replace the inline script at the bottom with:

```astro
<script>
  import { animateServicos } from "@/animations/servicos";

  animateServicos();
</script>
```

- [ ] **Step 4: Add stable selectors in `src/components/sections/Eixos.astro`**

For both `<Image>` elements inside `.eixos__blade`, add `eixos__image` to the class list:

```astro
class="eixos__image w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
```

For both small section labels, add `eixos__eyebrow`:

```astro
<span class="eixos__eyebrow text-[10px] uppercase tracking-[0.4em] text-cream/60">Eixo 01</span>
```

For both blade titles, add `eixos__title`:

```astro
<h2 class="eixos__title text-4xl md:text-6xl font-display font-black italic uppercase text-cream leading-tight mb-6">
```

For both blade body paragraphs, add `eixos__body`:

```astro
<p class="eixos__body max-w-xs text-sm text-cream/70 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-700 delay-300">
```

- [ ] **Step 5: Replace `src/animations/eixos.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateEixos(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const section = document.querySelector<HTMLElement>(".eixos");
  const blades = document.querySelectorAll<HTMLElement>(".eixos__blade");

  if (!section || blades.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(".eixos__blade, .eixos__image, .eixos__eyebrow, .eixos__title", {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    });
    gsap.set(".eixos__body, .eixos__cta", { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 68%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    blades,
    { opacity: 0, y: 52, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 1.35, stagger: 0.14, ease: "expo.out" },
  )
    .fromTo(
      ".eixos__image",
      { scale: 1.08 },
      { scale: 1, duration: 1.6, stagger: 0.08, ease: "power3.out" },
      "-=1.1",
    )
    .fromTo(
      ".eixos__eyebrow, .eixos__title",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" },
      "-=0.9",
    );
}
```

- [ ] **Step 6: Replace `src/animations/agenda.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateAgenda(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const section = document.querySelector<HTMLElement>(".agenda");
  const header = document.querySelector<HTMLElement>(".agenda__header");
  const content = section?.querySelector<HTMLElement>(".agenda__header + div");

  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set([header, content], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 76%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    header,
    { opacity: 0, y: 34 },
    { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
  ).fromTo(
    content,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.95, ease: "power2.out" },
    "-=0.55",
  );
}
```

- [ ] **Step 7: Replace `src/animations/espaco.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateEspaco(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isDesktop = window.matchMedia("(min-width: 769px)").matches;
  const section = document.querySelector<HTMLElement>(".espaco");
  const items = document.querySelectorAll<HTMLElement>(".espaco__item");

  if (!section || items.length === 0) return;

  if (prefersReducedMotion || !isDesktop) {
    gsap.set(items, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  gsap.fromTo(
    items,
    { opacity: 0, y: 42, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
        toggleActions: "play none none reverse",
      },
    },
  );

  for (const item of items) {
    const speed = Number.parseFloat(item.getAttribute("data-speed") || "1");

    gsap.fromTo(
      item,
      { y: 50 },
      {
        y: -120 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }
}
```

- [ ] **Step 8: Run check**

Run:

```bash
bun run check
```

Expected: command exits with code 0 and no Biome errors.

- [ ] **Step 9: Commit Task 4**

Run:

```bash
git add src/animations/sobre.ts src/animations/servicos.ts src/components/sections/Servicos.astro src/components/sections/Eixos.astro src/animations/eixos.ts src/animations/agenda.ts src/animations/espaco.ts
git commit -m "feat: polish editorial section motion"
```

---

## Task 5: Align Contact, Footer, and Animation Docs

**Files:**
- Modify: `src/components/sections/Contato.astro`
- Modify: `src/animations/contato.ts`
- Modify: `src/components/sections/Footer.astro`
- Modify: `src/animations/footer.ts`
- Modify: `docs/ANIMACOES.md`

- [ ] **Step 1: Add selectors and script to `src/components/sections/Contato.astro`**

Change the eyebrow and title block to:

```astro
<p class="contato__eyebrow text-[10px] uppercase tracking-[0.4em] opacity-50 mb-12">Conexão</p>
<h2 class="contato__title text-5xl md:text-8xl font-display font-black italic uppercase leading-[0.9] text-orange mb-20">
```

Add `contato__field` to each form field wrapper:

```astro
<div class="contato__field group relative">
```

Add `contato__submit` to the submit wrapper:

```astro
<div class="contato__submit md:col-span-2">
```

Add this script before `</section>`:

```astro
<script>
  import { animateContato } from "@/animations/contato";

  animateContato();
</script>
```

- [ ] **Step 2: Replace `src/animations/contato.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateContato(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const section = document.querySelector<HTMLElement>(".contato");
  if (!section) return;

  const headerItems = section.querySelectorAll<HTMLElement>(
    ".contato__eyebrow, .contato__title",
  );
  const fields = section.querySelectorAll<HTMLElement>(".contato__field");
  const submit = section.querySelector<HTMLElement>(".contato__submit");

  if (prefersReducedMotion) {
    gsap.set([headerItems, fields, submit], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 76%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    headerItems,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "expo.out" },
  )
    .fromTo(
      fields,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: "power2.out" },
      "-=0.45",
    )
    .fromTo(
      submit,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
      "-=0.25",
    );
}
```

- [ ] **Step 3: Add selectors and script to `src/components/sections/Footer.astro`**

For the social links wrapper, keep the current wrapper and add `footer__social`:

```astro
<div class="footer__social flex gap-12 mb-32">
```

Add `footer__social-link` to each social anchor:

```astro
class="footer__social-link opacity-40 hover:opacity-100 transition-opacity"
```

Change the copyright label class to:

```astro
<div class="footer__meta absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-10 text-[10px] uppercase tracking-[0.5em] text-near-black/30">
```

Change the final small line to:

```astro
<div class="footer__credit mt-20 text-[10px] uppercase tracking-widest text-near-black/40">
```

Add this script before `</footer>`:

```astro
<script>
  import { animateFooter } from "@/animations/footer";

  animateFooter();
</script>
```

- [ ] **Step 4: Replace `src/animations/footer.ts`**

Use this full file:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateFooter(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const section = document.querySelector<HTMLElement>(".footer");
  if (!section) return;

  const socialLinks = section.querySelectorAll<HTMLElement>(".footer__social-link");
  const meta = section.querySelector<HTMLElement>(".footer__meta");
  const signature = section.querySelector<HTMLElement>(".footer__signature h2");
  const credit = section.querySelector<HTMLElement>(".footer__credit");

  if (prefersReducedMotion) {
    gsap.set([socialLinks, meta, signature, credit], {
      opacity: 1,
      y: 0,
      scale: 1,
    });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    socialLinks,
    { opacity: 0, y: 18 },
    { opacity: 0.4, y: 0, duration: 0.75, stagger: 0.08, ease: "power2.out" },
  )
    .fromTo(
      meta,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
      "-=0.35",
    )
    .fromTo(
      signature,
      { opacity: 0, scale: 0.96, y: 36 },
      { opacity: 0.08, scale: 1, y: 0, duration: 1.1, ease: "expo.out" },
      "-=0.25",
    )
    .fromTo(
      credit,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
      "-=0.45",
    );
}
```

- [ ] **Step 5: Update `docs/ANIMACOES.md` module tree**

Replace the tree under "Estrutura" with:

```md
src/animations/
├── init.ts              # Inicialização do Lenis e ScrollTrigger
├── preloader.ts         # Abertura cinematica com simbolo da marca
├── sectionWipes.ts      # Wipes cromaticos entre secoes
├── hero.ts              # Entrada do Hero apos o preloader
├── sobre.ts             # Parallax + reveal editorial
├── servicos.ts          # Reveal dos cards de servicos
├── eixos.ts             # Entrada teatral das blades
├── agenda.ts            # Reveal da agenda
├── espaco.ts            # Galeria com parallax desktop
├── contato.ts           # Reveal do formulario
└── footer.ts            # Assinatura final
```

Add this paragraph under "Inicialização":

```md
O `preloader.ts` dispara o evento `estudio:preloader-complete`. O Hero aguarda esse evento antes de iniciar sua timeline, garantindo que a abertura e a primeira dobra parecam uma unica sequencia dirigida.
```

- [ ] **Step 6: Run check**

Run:

```bash
bun run check
```

Expected: command exits with code 0 and no Biome errors.

- [ ] **Step 7: Commit Task 5**

Run:

```bash
git add src/components/sections/Contato.astro src/animations/contato.ts src/components/sections/Footer.astro src/animations/footer.ts docs/ANIMACOES.md
git commit -m "feat: polish contact and footer motion"
```

---

## Task 6: Full Validation and Visual QA

**Files:**
- Modify only if validation exposes an issue.

- [ ] **Step 1: Run full static check**

Run:

```bash
bun run check
```

Expected: command exits with code 0 and no Biome errors.

- [ ] **Step 2: Run production build**

Run:

```bash
bun run build
```

Expected: command exits with code 0 and Astro reports a completed build.

- [ ] **Step 3: Start dev server**

Run:

```bash
bun run dev -- --host 127.0.0.1
```

Expected: local URL is printed, usually `http://127.0.0.1:4321/`.

- [ ] **Step 4: Visual QA desktop**

Open the local URL and verify:

- Preloader appears on a dark background.
- Symbol scales in and exits upward through a clipped reveal.
- Navbar and cursor do not appear before the loader resolves.
- Hero starts after the loader completes.
- Hero CTA buttons are usable shortly after the reveal.
- Wipes fire when entering Sobre, Servicos, Eixos, Agenda, Espaco, Contato, and Footer.
- Wipes do not block clicks after they finish.
- Text does not overlap images or controls.

- [ ] **Step 5: Visual QA mobile**

Use a mobile viewport around 390px wide and verify:

- Loader is not too slow.
- Hero text fits.
- Wipes are short and do not obscure reading.
- Espaco gallery uses the mobile stacked layout.
- Eixos content remains discoverable without hover.
- Contact fields remain focusable.

- [ ] **Step 6: Reduced-motion QA**

In browser devtools, emulate `prefers-reduced-motion: reduce` and verify:

- Preloader does not animate.
- Hero content is visible without delayed reveal.
- Section wipes are hidden.
- Parallax is disabled.
- Forms and links remain immediately interactive.

- [ ] **Step 7: Confirm no brainstorm artifacts are staged**

Run:

```bash
git status -sb
```

Expected: no `.superpowers/` files are listed.

- [ ] **Step 8: Commit validation fixes if any were needed**

If validation required edits, run:

```bash
git add src docs
git commit -m "fix: resolve premium layout validation issues"
```

If no edits were needed after Task 5, do not create an empty commit.
