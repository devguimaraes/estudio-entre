# Premium Editorial Layout Refinement Design

Date: 2026-04-25
Branch: `feature/redesign-layout`
Status: Approved for implementation planning

## Context

The `feature/redesign-layout` branch already contains a complete visual redesign for the Estudio Entre home page, including Astro sections, GSAP/ScrollTrigger animations, Lenis smooth scroll, a custom cursor, section color transitions, and editorial layouts for Hero, Sobre, Servicos, Eixos, Agenda, Espaco, Contato, and Footer.

The next step is not a new visual direction. It is a refinement pass that makes the current direction feel more premium, immersive, and editorial, closer to a directed cultural experience than a set of independently animated sections.

The chosen creative direction is:

- Cinematic editorial experience
- Loader based on the brand symbol opening the scene
- Chromatic wipes between sections
- Full home-page immersion, with performance and readability preserved

## Goals

1. Create a memorable first impression with a branded loader.
2. Make the transition from loader to hero feel intentional and cinematic.
3. Replace abrupt section changes with chromatic editorial wipes.
4. Refine section animations so the home page reads as one continuous narrative.
5. Preserve accessibility, reduced-motion behavior, mobile readability, and build performance.

## Non-Goals

- Do not redesign the brand identity, palette, or typography.
- Do not replace the existing Astro, GSAP, Lenis, or Tailwind setup.
- Do not add heavy WebGL, video backgrounds, or animation libraries beyond the current stack.
- Do not rebuild CMS/data flows or contact form behavior as part of this pass.

## Experience Direction

The site opens on a dark preloader. The brand symbol appears as a central mark, pulses or scales with a controlled cinematic rhythm, and then expands into a transition that reveals the hero. The hero animation starts only after this loader resolves, so the visitor reads the opening as a single designed sequence.

After the hero, each major section behaves like a chapter. Chromatic panels use the brand palette to wipe across the viewport when entering key sections. These wipes should feel like editorial page turns or stage curtains, not generic loading screens.

The result should be expressive but restrained. Motion should have weight, timing, and hierarchy.

## Component Architecture

### `Preloader.astro`

Add a global preloader component in `src/components/ui/Preloader.astro`.

Responsibilities:

- Render the loader layer at the top of the DOM inside `BaseLayout.astro`.
- Display the brand symbol as the focal point.
- Include minimal supporting details such as a small status label or understated progress line if needed.
- Stay accessible by using `aria-hidden` when decorative and avoiding focus traps.

### `preloader.ts`

Add `src/animations/preloader.ts`.

Responsibilities:

- Run the opening timeline on page load.
- Respect `prefers-reduced-motion`.
- Set initial page state while loading.
- Add a loaded state class such as `is-loaded` to `document.body`.
- Dispatch or call a hook that allows the hero entrance to begin after the loader completes.

### Section Wipe Layer

Add either:

- `src/components/ui/SectionWipes.astro`, if markup is clearer as a component; or
- a global layer inside `BaseLayout.astro`, if keeping the DOM small is cleaner.

Responsibilities:

- Provide fixed overlay panels used by chromatic wipes.
- Stay pointer-events disabled.
- Use theme colors from the existing design system.

### `sectionWipes.ts`

Add `src/animations/sectionWipes.ts`.

Responsibilities:

- Register ScrollTrigger events for major sections.
- Trigger chromatic wipe timelines when entering sections.
- Coordinate with the existing `colorTransition.ts` module instead of fighting it.
- Respect reduced motion by disabling wipe animation and falling back to direct color/theme changes.

## Existing Animation Refinements

### Hero

- Gate the hero timeline so it starts after the preloader completes.
- Keep the symbol parallax subtle and desktop-only.
- Refine tagline and logo reveals with consistent mask timing.
- Keep CTAs readable and avoid delaying interaction for too long.

### Sobre

- Keep the sticky editorial layout.
- Reveal the image with a vertical wipe.
- Stagger text blocks with measured timing.
- Let the watermark breathe subtly through scroll, without distracting from the text.

### Servicos

- Give the header a typographic reveal.
- Animate cards in sequence with a slight vertical lift.
- Make icon hover states feel tactile but not bouncy.
- Keep the grid stable on mobile.

### Eixos

- Preserve the blade interaction.
- Add a theatrical entrance where image, overlay, title, and body text resolve in order.
- Avoid hover-only meaning; important content should remain discoverable on touch devices.

### Agenda

- Reveal the section title and event content as one editorial group.
- If no events are available, animate the empty state gently but keep it legible.

### Espaco

- Keep the scattered gallery on desktop.
- Reduce parallax intensity on smaller screens.
- Ensure captions and images do not overlap during scroll.

### Contato

- Animate form fields in a quiet stagger.
- Keep focus states immediate and accessible.
- Do not block form interaction behind decorative timelines.

### Footer

- Treat the footer as a final signature moment.
- Animate social links and the large typographic mark with restrained timing.

## Motion Rules

- Prefer `transform`, `opacity`, and controlled `clip-path`.
- Avoid continuous expensive filters.
- Avoid layout-affecting animation.
- Use GSAP timelines for orchestration and CSS transitions for simple hover states.
- Use shared durations/easing from `DESIGN.md` where possible.
- Keep microinteractions under 500ms.
- Keep entrance/reveal moments around 800ms to 1800ms depending on complexity.

## Reduced Motion

When `prefers-reduced-motion: reduce` is enabled:

- The preloader should resolve immediately.
- Wipes should not animate; section state should update directly.
- Parallax should be disabled.
- Revealed content should appear visible without delayed opacity.
- Smooth scroll behavior should remain disabled as already specified globally.

## Mobile Behavior

Mobile should feel editorial, not overloaded.

- Disable or significantly reduce parallax.
- Avoid hover-dependent states.
- Keep section wipes shorter and less dramatic.
- Maintain stable vertical rhythm and readable text.
- Ensure the loader completes quickly and does not make the site feel blocked.

## Validation Plan

1. Run `bun run check`.
2. Run `bun run build`.
3. Start the local dev server and visually inspect:
   - loader opening
   - loader-to-hero handoff
   - hero animation timing
   - section wipes
   - mobile layout
   - reduced-motion fallback
4. Confirm no `.superpowers/` visual companion files are staged.

## Implementation Notes

- Initialize the preloader before other decorative animations in `BaseLayout.astro`.
- Initialize section wipes after global animation setup and before per-section ScrollTriggers if ordering matters.
- Keep `colorTransition.ts` as the theme authority unless implementation proves a merge is cleaner.
- Prefer small, focused modules instead of adding more inline scripts inside section components.
- Update `docs/ANIMACOES.md` after implementation if new animation modules become part of the public project documentation.
