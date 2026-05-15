# Sobre - Asymmetric Narrative Implementation Plan

**Goal:** Refatorar a seção `Sobre` para um layout assimétrico com tipografia watermark e animação sticky.

**Architecture:**
- **Layout**: CSS Grid refinado para quebra de alinhamento clássico.
- **Motion**: Integração de `position: sticky` via CSS, sincronizada com ScrollTrigger.
- **Assets**: Uso da tipografia do logo para o watermark "E".

**Tech Stack:** Astro 6, Tailwind CSS 4, GSAP 3, ScrollTrigger.

---

### Task 1: Refactor to Asymmetric Grid

**Files:**
- Modify: `src/components/sections/Sobre.astro`

- [ ] **Step 1: Update Grid definition**
Update `.sobre__grid` in style to allow more organic placement.
```css
  .sobre__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
```

- [ ] **Step 2: Add Watermark Typography**
Add an element inside `.sobre` container with `absolute` positioning.
```html
<div class="sobre__watermark" aria-hidden="true">E</div>
```
Style:
```css
.sobre__watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: 40vw;
  font-weight: 800;
  color: var(--color-near-black);
  opacity: 0.05;
  z-index: 1;
  pointer-events: none;
}
```

### Task 2: Implement Sticky Narrative Motion

**Files:**
- Modify: `src/animations/sobre.ts`
- Modify: `src/components/sections/Sobre.astro`

- [ ] **Step 1: Update CSS for Sticky Title**
Modify `.sobre__title` in `Sobre.astro`.
```css
  .sobre__title {
    position: sticky;
    top: 20vh;
    /* ... existing styles ... */
  }
```

- [ ] **Step 2: Update GSAP Animação**
Adjust `sobre.ts` to accommodate the sticky title (ensure pinning logic doesn't conflict).

### Task 3: Interactive Textures & Final Polish

**Files:**
- Modify: `src/components/sections/Sobre.astro`

- [ ] **Step 1: Update halftone overlay transition**
Improve the halftone mix-blend-mode behavior with explicit transition.

- [ ] **Step 2: Verify Lint**
Run `bun run lint`.
