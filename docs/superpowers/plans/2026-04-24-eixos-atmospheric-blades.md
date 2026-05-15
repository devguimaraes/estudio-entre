# Eixos - Atmospheric Blades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Eixos section to "Atmospheric Blades" (full-width vertical sections) with hover glow and background SVG anchors.

**Architecture:** Use CSS for full-width layout and hover effects. Use GSAP ScrollTrigger for initial reveal. Absolute positioned SVG icons for atmospheric background.

**Tech Stack:** Astro, Tailwind, GSAP.

---

### Task 1: Refactor Eixos.astro structure

**Files:**
- Modify: `src/components/sections/Eixos.astro`

- [ ] **Step 1: Refactor .eixos__grid to .eixos__blades container**
Refactor the grid into two full-width section containers.

```astro
<section class="eixos" id="eixos">
  <div class="eixos__blade eixos__blade--cultura">
    <!-- Header, Services, CTA -->
  </div>
  <div class="eixos__blade eixos__blade--producao">
    <!-- Header, Services, CTA -->
  </div>
</section>
```

- [ ] **Step 2: Add SVG background anchors**
Add background icons to each blade.

```astro
<div class="eixos__blade eixos__blade--cultura">
  <img src="/icons/olho.svg" class="eixos__blade-anchor" alt="" aria-hidden="true" />
  ...
</div>
```

- [ ] **Step 3: Commit**
`git add src/components/sections/Eixos.astro`
`git commit -m "refactor: convert eixos to blade layout"`

### Task 2: Implement Atmospheric Styles

**Files:**
- Modify: `src/components/sections/Eixos.astro` (Styles section)

- [ ] **Step 1: Update .eixos CSS**
Set `.eixos__blade` to full width. Add atmospheric styles.

```css
.eixos__blade {
  position: relative;
  min-height: 100vh;
  padding: 10rem 4rem;
  overflow: hidden;
  transition: box-shadow 0.4s ease;
}

.eixos__blade-anchor {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 400px;
  opacity: 0.1;
  pointer-events: none;
  filter: brightness(0) invert(1);
}

.eixos__blade:hover {
  box-shadow: inset 0 0 100px rgba(255, 255, 255, 0.05);
}
```

- [ ] **Step 2: Commit**
`git add src/components/sections/Eixos.astro`
`git commit -m "style: add atmospheric blade styles and background anchors"`

### Task 3: Verify and Lint

**Files:**
- Run: `bun run lint`

- [ ] **Step 1: Verify layout responsiveness and linting**
Ensure no linting errors.

- [ ] **Step 2: Finalize**
Done.
