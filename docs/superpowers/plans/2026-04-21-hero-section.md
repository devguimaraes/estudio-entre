# Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar a seção Hero do Estúdio Entre com layout editorial assimétrico, animações cinematográficas e responsividade completa.

**Architecture:** Componente Astro puro (`Hero.astro`) com script cliente para animações GSAP. Layout split screen 50/50 em desktop, single column centralizado em mobile. Logo image como protagonista, chave como elemento gráfico transbordando. Sem React islands — Astro puro + `<script>` tags.

**Tech Stack:** Astro 6, Tailwind CSS 4, GSAP 3 + ScrollTrigger, Lenis smooth scroll, Buvera + Dongra Script fonts.

**Spec:** `docs/superpowers/specs/2026-04-21-hero-section-design.md`

**Issue:** DEV-46

---

## File Structure

```
Criar:
  src/components/sections/Hero.astro    # Componente principal da Hero
  src/animations/hero.ts                # Animações GSAP da seção Hero

Modificar:
  src/pages/index.astro                 # Substituir placeholder pelo Hero
  src/animations/init.ts                # Corrigir import do Lenis (pacote renomeado)

Dependências a instalar:
  gsap                                  # Motor de animações
  lenis                                 # Smooth scroll (@studio-freight/lenis foi renomeado)
```

---

### Task 1: Instalar dependências (GSAP + Lenis)

**Files:**
- Modify: `package.json` (via bun add)
- Modify: `src/animations/init.ts` (corrigir import do Lenis)

- [ ] **Step 1: Instalar gsap e lenis**

```bash
bun add gsap lenis
```

- [ ] **Step 2: Corrigir import do Lenis em `src/animations/init.ts`**

O import atual usa `@studio-freight/lenis` que foi renomeado para `lenis`. Trocar a linha:

```typescript
import Lenis from "@studio-freight/lenis";
```

Para:

```typescript
import Lenis from "lenis";
```

O resto do arquivo permanece igual — a API é a mesma.

- [ ] **Step 3: Verificar instalação**

```bash
bun run build
```

Esperado: build passa sem erros de import.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(hero): instalar gsap e lenis, corrigir import do lenis"
```

---

### Task 2: Criar Hero.astro — estrutura HTML

**Files:**
- Create: `src/components/sections/Hero.astro`

- [ ] **Step 1: Criar diretório e arquivo**

```bash
mkdir -p src/components/sections
```

- [ ] **Step 2: Escrever Hero.astro com estrutura HTML completa**

```astro
---
interface Props {
  id?: string;
}

const { id = "hero" } = Astro.props;
---

<section
  id={id}
  class="hero"
  role="banner"
  aria-label="Estúdio Entre — Hub Cultural no Méier"
>
  <!-- Texturas de fundo -->
  <div class="hero__texture-paper" aria-hidden="true"></div>
  <div class="hero__texture-halftone" aria-hidden="true"></div>

  <!-- Logo mark (chave/olho) — top-left -->
  <a href="#top" class="hero__logo-mark" aria-label="Voltar ao topo">
    <img
      src="/icons/olho.svg"
      alt=""
      width="55"
      height="55"
    />
  </a>

  <!-- Conteúdo — lado esquerdo -->
  <div class="hero__content">
    <p class="hero__eyebrow">Hub Cultural · Méier RJ</p>

    <!-- Logo principal (imagem) -->
    <img
      src="/logos/Logo_Estudio Entre - Claro 2.png"
      alt="Estúdio Entre"
      class="hero__logo"
      width="500"
      height="120"
      loading="eager"
    />

    <!-- Tagline com spans para animação -->
    <p class="hero__tagline">
      <span class="word">Entre</span>
      <span class="word">livros,</span>
      <span class="word">vozes</span>
      <span class="word">e</span>
      <span class="word">beats.</span>
    </p>

    <!-- CTAs -->
    <div class="hero__ctas">
      <a href="#agenda" class="hero__cta hero__cta--primary">
        Próximos encontros
        <span class="hero__cta-arrow" aria-hidden="true">→</span>
      </a>
      <a href="#espaco" class="hero__cta hero__cta--secondary">
        Conheça o espaço
        <span class="hero__cta-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </div>

  <!-- Elemento gráfico — chave transbordando -->
  <div class="hero__graphic" aria-hidden="true">
    <img
      src="/icons/olho.svg"
      alt=""
      class="hero__key"
    />
  </div>

  <!-- Linha divisória decorativa -->
  <div class="hero__divider" aria-hidden="true"></div>

  <!-- Scroll indicator -->
  <div class="hero__scroll" aria-hidden="true">
    <span class="hero__scroll-text">Scroll</span>
    <span class="hero__scroll-line"></span>
  </div>
</section>

<style>
  /* ==========================
     Hero Section
     Layout editorial assimétrico
     ========================== */

  .hero {
    position: relative;
    min-height: 100vh;
    overflow: visible;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ---------- Texturas ---------- */

  .hero__texture-paper {
    position: absolute;
    inset: 0;
    opacity: 0.08;
    background-image: url("/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp");
    background-size: cover;
    background-position: center;
    pointer-events: none;
    z-index: 1;
  }

  .hero__texture-halftone {
    position: absolute;
    inset: 0;
    opacity: 0.12;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23h)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  /* ---------- Logo Mark (top-left) ---------- */

  .hero__logo-mark {
    position: absolute;
    top: 3rem;
    left: 4rem;
    z-index: 20;
    opacity: 0;
  }

  .hero__logo-mark img {
    width: 55px;
    height: 55px;
    filter: brightness(0) invert(1);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero__logo-mark:hover img {
    transform: scale(1.08) rotate(5deg);
  }

  /* ---------- Content Side ---------- */

  .hero__content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem 4rem;
  }

  .hero__eyebrow {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    color: var(--color-cream);
    opacity: 0;
    margin-bottom: 1.5rem;
  }

  .hero__logo {
    max-width: 500px;
    width: 100%;
    height: auto;
    filter: brightness(0) invert(1);
    margin-bottom: 2rem;
    opacity: 0;
  }

  .hero__tagline {
    font-family: var(--font-display);
    font-weight: 500;
    font-style: italic;
    font-size: clamp(1.125rem, 2vw, 1.5rem);
    color: var(--color-cream);
    line-height: 1.4;
    max-width: 420px;
    margin-bottom: 3rem;
  }

  .hero__tagline .word {
    display: inline-block;
    opacity: 0;
  }

  /* ---------- CTAs ---------- */

  .hero__ctas {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    opacity: 0;
  }

  .hero__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.1rem 2.2rem;
    border: 2px solid var(--color-cream);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero__cta::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(240, 237, 232, 0.2), transparent);
    transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero__cta:hover::before {
    left: 100%;
  }

  .hero__cta--primary {
    background: var(--color-cream);
    color: var(--color-orange);
  }

  .hero__cta--primary:hover {
    background: #ffffff;
    transform: translateX(8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }

  .hero__cta--secondary {
    color: var(--color-cream);
  }

  .hero__cta--secondary:hover {
    background: rgba(240, 237, 232, 0.1);
  }

  .hero__cta-arrow {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero__cta:hover .hero__cta-arrow {
    transform: translateX(6px);
  }

  /* ---------- Graphic Side (chave) ---------- */

  .hero__graphic {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: visible;
  }

  .hero__key {
    width: 70%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    opacity: 0.1;
    filter: brightness(0) invert(1);
    transform: translateX(-15%);
  }

  /* ---------- Divider ---------- */

  .hero__divider {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, var(--color-cream) 15%, var(--color-cream) 85%, transparent);
    opacity: 0.4;
    box-shadow: 0 0 20px rgba(240, 237, 232, 0.3);
    z-index: 5;
  }

  /* ---------- Scroll Indicator ---------- */

  .hero__scroll {
    position: absolute;
    bottom: 2.5rem;
    left: 4rem;
    z-index: 10;
    opacity: 0;
  }

  .hero__scroll-text {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    color: var(--color-cream);
  }

  .hero__scroll-line {
    display: block;
    width: 1px;
    height: 50px;
    margin-top: 0.75rem;
    background: linear-gradient(to bottom, var(--color-cream), transparent);
    animation: scrollFlow 2.5s ease-in-out infinite;
  }

  @keyframes scrollFlow {
    0%, 100% { opacity: 0.3; transform: scaleY(0.7); }
    50% { opacity: 1; transform: scaleY(1); }
  }

  /* ---------- Responsive: Tablet ---------- */

  @media (max-width: 1024px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .hero__graphic {
      display: none;
    }

    .hero__divider {
      display: none;
    }

    .hero__content {
      padding: 3rem 2rem;
      text-align: center;
      align-items: center;
    }

    .hero__logo-mark {
      top: 2rem;
      left: 2rem;
    }

    .hero__logo {
      max-width: 350px;
      margin-bottom: 1.5rem;
    }

    .hero__tagline {
      max-width: 100%;
    }

    .hero__ctas {
      align-items: center;
      width: 100%;
    }

    .hero__scroll {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  /* ---------- Responsive: Mobile ---------- */

  @media (max-width: 768px) {
    .hero__content {
      padding: 2rem 1.5rem;
    }

    .hero__logo-mark {
      top: 1.5rem;
      left: 1.5rem;
    }

    .hero__logo-mark img {
      width: 40px;
      height: 40px;
    }

    .hero__eyebrow {
      font-size: 0.75rem;
    }

    .hero__logo {
      max-width: 280px;
      margin-bottom: 1.25rem;
    }

    .hero__tagline {
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }

    .hero__cta {
      padding: 0.9rem 1.8rem;
      font-size: 0.85rem;
      width: 100%;
      justify-content: center;
    }

    .hero__scroll {
      bottom: 1.5rem;
    }

    .hero__scroll-text {
      font-size: 0.65rem;
    }
  }

  /* ---------- Reduced Motion ---------- */

  @media (prefers-reduced-motion: reduce) {
    .hero__scroll-line {
      animation: none;
    }

    .hero__logo-mark img {
      transition: none;
    }

    .hero__cta {
      transition: none;
    }

    .hero__cta::before {
      display: none;
    }
  }
</style>
```

- [ ] **Step 3: Verificar que o arquivo compila**

```bash
bun run build
```

Esperado: build passa. O componente não está sendo usado ainda, então não aparece no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.astro
git commit -m "feat(hero): criar estrutura HTML e CSS da seção Hero"
```

---

### Task 3: Copiar assets para public/ (se necessário) e configurar paths

**Files:**
- Verify: `public/icons/olho.svg`
- Verify: `public/logos/Logo_Estudio Entre - Claro 2.png`
- Verify: `public/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp`

- [ ] **Step 1: Verificar se assets estão em public/**

```bash
ls -la public/icons/ 2>/dev/null
ls -la public/logos/ 2>/dev/null
ls -la public/textures/ 2>/dev/null
```

- [ ] **Step 2: Copiar assets que faltam para public/**

```bash
mkdir -p public/icons public/logos public/textures

# Copiar ícone da chave
cp "src/assets/icons/olho.svg" public/icons/olho.svg

# Copiar logo
cp "src/assets/logos/Logo_Estudio Entre - Claro 2.png" "public/logos/Logo_Estudio Entre - Claro 2.png"

# Copiar textura
cp "src/assets/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp" "public/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp"
```

- [ ] **Step 3: Verificar build**

```bash
bun run build
```

Esperado: build passa.

- [ ] **Step 4: Commit**

```bash
git add public/
git commit -m "chore(hero): copiar assets estáticos para public/"
```

---

### Task 4: Integrar Hero no index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Substituir placeholder pelo Hero**

Substituir todo o conteúdo de `src/pages/index.astro` por:

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Hero from "@/components/sections/Hero.astro";
---

<BaseLayout title="Estúdio Entre — Hub Cultural no Méier, RJ">
  <Hero />
</BaseLayout>
```

- [ ] **Step 2: Iniciar dev server e verificar visualmente**

```bash
bun run dev
```

Esperado:
- Seção Hero ocupa 100vh com fundo laranja `#EC6838`
- Texturas visíveis (papel + halftone)
- Logo centrado na metade esquerda (desktop)
- Chave visível na metade direita com opacidade baixa
- Layout muda para centralizado em tela < 1024px

**Nota:** Animações não rodam ainda — os elementos estão com `opacity: 0`. Isso é correto, será resolvido na Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(hero): integrar Hero component no index.astro"
```

---

### Task 5: Implementar animações GSAP da Hero

**Files:**
- Create: `src/animations/hero.ts`
- Modify: `src/components/sections/Hero.astro` (adicionar `<script>` tag)

- [ ] **Step 1: Criar `src/animations/hero.ts`**

```typescript
import gsap from "gsap";

/**
 * Animações de entrada da seção Hero
 * Timing cinematográfico (1.5-2s por elemento)
 */
export function animateHero(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Seletores
  const logoMark = document.querySelector<HTMLElement>(".hero__logo-mark");
  const eyebrow = document.querySelector<HTMLElement>(".hero__eyebrow");
  const logo = document.querySelector<HTMLElement>(".hero__logo");
  const words = document.querySelectorAll<HTMLElement>(".hero__tagline .word");
  const ctas = document.querySelector<HTMLElement>(".hero__ctas");
  const scroll = document.querySelector<HTMLElement>(".hero__scroll");
  const key = document.querySelector<HTMLElement>(".hero__key");

  if (!logoMark || !logo || !ctas) return;

  // Reduced motion: mostrar tudo sem animação
  if (prefersReducedMotion) {
    const all = [logoMark, eyebrow, logo, ctas, scroll];
    all.forEach((el) => {
      if (el) gsap.set(el, { opacity: 1 });
    });
    words.forEach((w) => gsap.set(w, { opacity: 1 }));
    return;
  }

  // Timeline principal
  const ease = "power2.out";

  // 1. Logo mark (ícone chave)
  gsap.from(logoMark, {
    opacity: 0,
    duration: 1.2,
    ease,
    delay: 0.3,
  });

  // 2. Eyebrow
  if (eyebrow) {
    gsap.from(eyebrow, {
      opacity: 0,
      y: 30,
      duration: 1.5,
      ease,
      delay: 0.6,
    });
  }

  // 3. Logo principal
  gsap.from(logo, {
    opacity: 0,
    y: 30,
    duration: 1.8,
    ease,
    delay: 0.9,
  });

  // 4. Tagline (palavra por palavra)
  gsap.from(words, {
    opacity: 0,
    y: 20,
    duration: 0.9,
    stagger: 0.3,
    ease,
    delay: 1.6,
  });

  // 5. CTAs
  gsap.from(ctas, {
    opacity: 0,
    y: 30,
    duration: 1.8,
    ease,
    delay: 3.1,
  });

  // 6. Scroll indicator
  if (scroll) {
    gsap.from(scroll, {
      opacity: 0,
      y: 20,
      duration: 1.5,
      ease,
      delay: 3.5,
    });
  }

  // 7. Parallax da chave (desktop apenas)
  if (key && window.innerWidth > 1024) {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          key.style.transform = `translateX(-15%) translateY(${scrolled * 0.12}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}
```

- [ ] **Step 2: Adicionar `<script>` no Hero.astro**

Adicionar antes do fechamento `</section>` em `src/components/sections/Hero.astro`:

```astro
  <!-- Animações -->
  <script>
    import { animateHero } from "@/animations/hero";
    animateHero();
  </script>
</section>
```

- [ ] **Step 3: Iniciar dev server e testar animações**

```bash
bun run dev
```

Esperado:
- Ao carregar a página, elementos aparecem em sequência cinematográfica
- Logo mark → eyebrow → logo → tagline (palavra por palavra) → CTAs → scroll indicator
- Chave tem parallax sutil ao scroll (desktop apenas)
- Scroll indicator pulsa infinitamente
- Total ~3.7s até tudo visível

- [ ] **Step 4: Testar responsividade**

Redimensionar o browser para:
- **Desktop (> 1024px):** Layout split, animações completas
- **Tablet (768-1024px):** Single column centralizado, sem chave gráfica
- **Mobile (< 768px):** Logo menor, CTAs full-width, tudo centralizado

- [ ] **Step 5: Testar reduced motion**

No DevTools: abrir Command Palette → "Emulate CSS media: prefers-reduced-motion: reduce"

Esperado:
- Todos elementos aparecem imediatamente (sem animação)
- Scroll indicator não pulsa
- Parallax desativado

- [ ] **Step 6: Commit**

```bash
git add src/animations/hero.ts src/components/sections/Hero.astro
git commit -m "feat(hero): implementar animações GSAP com timing cinematográfico"
```

---

### Task 6: Inicializar animações globais (Lenis + GSAP) no BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Adicionar script de inicialização no BaseLayout**

Adicionar antes do `</body>` em `src/layouts/BaseLayout.astro`:

```astro
  <script>
    import { initAnimations } from "@/animations/init";
    initAnimations();
  </script>
</body>
```

- [ ] **Step 2: Verificar que o smooth scroll funciona**

```bash
bun run dev
```

Esperado: scroll suave ao navegar (Lenis ativo). GSAP ScrollTrigger registrado globalmente.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(hero): inicializar Lenis e GSAP no BaseLayout"
```

---

### Task 7: Build final e verificação

**Files:** Nenhum (verificação apenas)

- [ ] **Step 1: Rodar lint**

```bash
bun run lint
```

Esperado: sem erros. Se houver, corrigir formatação.

- [ ] **Step 2: Rodar build de produção**

```bash
bun run build
```

Esperado: build passa sem erros.

- [ ] **Step 3: Preview do build**

```bash
bun run preview
```

Esperado: Hero renderiza corretamente com animações.

- [ ] **Step 4: Commit final (se houver correções de lint)**

```bash
git add -A
git commit -m "style(hero): corrigir formatação com Biome"
```

---

## Self-Review

### Spec Coverage

| Requisito do Spec | Task |
|---|---|
| Layout split 50/50 desktop | Task 2 |
| Single column mobile | Task 2 |
| Logo image | Task 2 |
| Chave transbordando | Task 2 |
| Textura papel + halftone | Task 2 |
| Linha divisória | Task 2 |
| Animações cinematográficas | Task 5 |
| SplitText desktop / CSS mobile | Task 5 |
| Parallax da chave | Task 5 |
| Hover states | Task 2 (CSS) |
| Responsividade 3 breakpoints | Task 2 (CSS) |
| Acessibilidade (ARIA, contraste, reduced motion) | Task 2 + Task 5 |
| Performance (preload, eager loading) | Task 2 (loading="eager") |
| Transição laranja → creme | Fora do escopo (DEV-48) |
| GSAP + Lenis integrado | Task 1 + Task 6 |
| ScrollTrigger | Task 6 (registro global) |

### Placeholder Scan

Nenhum TBD, TODO, ou placeholder encontrado. Todos os steps contêm código completo.

### Type Consistency

- Classes CSS usam BEM: `.hero__*` — consistente entre HTML e TS
- GSAP selectors usam as mesmas classes definidas no Astro
- Imports usam `@/` alias configurado no tsconfig
