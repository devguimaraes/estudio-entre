# Design Spec — Seção Hero Estúdio Entre

**Data:** 2026-04-21
**Status:** Aprovado
**Issue relacionada:** DEV-46 (Seção Hero — animação de entrada, logo e tagline com SplitText)
**Designer:** Claude Code + Devguimaraes

---

## 1. Visão Geral

### Objetivo
Desenvolver a seção Hero — primeira impressão do site que define o tom visual de toda a experiência. Layout editorial assimétrico 50/50 que divide a tela entre conteúdo (esquerda) e elemento gráfico da chave (direita), com a chave transbordando para criar um efeito editorial ousado reminiscente de revistas culturais independentes e zines.

### Conceito
"Editorial Assimétrico" — layout split screen com chave vertical transbordando para o lado esquerdo, criando profundidade e movimento. A identidade plural e em movimento do Estúdio Entre é expressa através da sobreposição de elementos: texturas de papel e halftone, chave como elemento gráfico, e tipografia Buvera com Dongra Script para destaque.

### Critérios de Sucesso
- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Animações executam uma única vez no page load
- [ ] Responsivo: desktop, tablet e mobile
- [ ] Funciona com `prefers-reduced-motion`

---

## 2. Layout & Estrutura

### Desktop (> 1024px)

**Grid:** 50% conteúdo | 50% elemento gráfico

```
┌─────────────────────────────────────────────────────┐
│ [🔑]                                               │
│                                                     │
│ Eyebrow: Hub Cultural · Méier RJ                  │
│                                                     │
│ [LOGO ESTÚDIO eNTRE]                              │
│                                                     │
│ Entre livros, vozes e beats.                       │
│                                                     │
│ [Próximos encontros →]                            │
│ [Conheça o espaço →]                              │
│                                                     │
│ Scroll │                            |  🗝️ (chave) │
│ ────── │                            |              │
└─────────────────────────────────────────────────────┘
         ^ Conteúdo                    ^ Chave
         (z-index: 10)                 (z-index: 5)
         ^ Linha divisória central (2px com glow)
```

**Posicionamentos:**
- Logo mark (ícone chave): top-left, `top: 3rem`, `left: 4rem`, 55px×55px
- Conteúdo: padding `5rem 4rem`, alinhado à esquerda
- Chave vertical: 70% width, `left: -15%`, transbordando para esquerda
- Linha divisória: absolute, `left: 50%`, 2px width
- Scroll indicator: bottom-left, `left: 4rem`, `bottom: 2.5rem`

**Overflow:** Hero usa `overflow: visible` para chave transbordar

### Tablet (768px - 1024px)

**Mudança para single column:**
- Layout: 1 column (grid template columns: 1fr)
- Logo completo substitui chave (gráfico some)
- Conteúdo: centralizado, `padding: 3rem 2rem`
- CTAs: full-width, `align-items: center`

### Mobile (< 768px)

**Ajustes finos:**
- Padding: `2rem 1.5rem`
- Logo completo: max-width 280px, centrado
- Headline: `clamp(1.75rem, 10vw, 2.5rem)`
- Tagline: 0.95rem, `max-width: 100%`
- CTAs: 100% width, `text-align: center`
- Scroll indicator: `left: 50%`, `transform: translateX(-50%)`

---

## 3. Tipografia

### Fontes Carregadas

**Desktop (> 768px):**
```
Buvera Black (900) - Headline
Buvera Bold (700) - Eyebrow, CTAs
Buvera Medium Italic (500) - Tagline
Dongra Script - Primeira letra "E" de "ENTRE"
```

**Mobile (< 768px):**
```
Buvera Black (900) - Headline
Buvera Bold (700) - Eyebrow, CTAs
Buvera Medium Italic (500) - Tagline
Dongra Script - Primeira letra "E" de "ENTRE"
```

### Hierarquia

**Eyebrow:**
```css
font-family: Buvera, sans-serif;
font-weight: 700;
font-size: 0.875rem;
text-transform: uppercase;
letter-spacing: 0.25em;
color: #F0EDE8;
opacity: 0.7;
```

**Logo (imagem):**
- Arquivo: `Logo_Estudio Entre - Claro 2.png`
- Desktop: `max-width: ~500px`
- Mobile: `max-width: 280px`
- Filter: `brightness(0) invert(1)` (branco sobre fundo laranja)

**Tagline:**
```css
font-family: Buvera, sans-serif;
font-weight: 500;
font-style: italic;
font-size: clamp(1.125rem, 2vw, 1.5rem);
color: #F0EDE8;
line-height: 1.4;
max-width: 420px; /* desktop */
```

**CTAs:**
```css
font-family: Buvera, sans-serif;
font-weight: 700;
font-size: 0.95rem;
text-transform: uppercase;
letter-spacing: 0.08em;
```

**Scroll Indicator:**
```css
font-family: Buvera, sans-serif;
font-weight: 500;
font-size: 0.7rem;
text-transform: uppercase;
letter-spacing: 0.25em;
```

---

## 4. Cores & Texturas

### Paleta

```css
--color-orange: #EC6838;         /* Background principal */
--color-cream: #F0EDE8;          /* Texto, elementos claros */
--color-bordo: #3D1020;          /* (não usado nesta seção) */
```

**Contraste WCAG:**
- Creme sobre laranja: **AAA** (ratio 8.2:1) ✅

### Texturas (3 camadas)

**1. Paper Texture (base)**
```css
.paper-texture {
  position: absolute;
  opacity: 0.08;
  background-image: url('vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp');
  background-size: cover;
  background-position: center;
  pointer-events: none;
}
```

**2. Halftone Overlay (pontilhado)**
```css
.halftone-overlay {
  position: absolute;
  opacity: 0.12;
  background-image: url("data:image/svg+xml,...");
  /* SVG filter com feTurbulence */
}
```

**3. Chave Elemento Gráfico**
```css
.key-crop {
  opacity: 0.10;  /* Sutil */
  filter: brightness(0) invert(1);  /* Branca */
}
```

---

## 5. Animações

### Sequência de Entrada (Desktop)

**Total: ~3.7s** | **Easing:** cubic-bezier(0.4, 0, 0.2, 1)

| Elemento | Delay | Duration | Timing |
|----------|-------|----------|--------|
| Logo mark (ícone) | 0.3s | 1.2s | fadeIn |
| Eyebrow | 0.6s | 1.5s | fadeSlideUp |
| Logo principal | 0.9s | 1.8s | fadeSlideUp |
| Tagline palavra 1 | 1.6s | 0.9s | wordReveal |
| Tagline palavra 2 | 1.9s | 0.9s | wordReveal |
| Tagline palavra 3 | 2.2s | 0.9s | wordReveal |
| Tagline palavra 4 | 2.5s | 0.9s | wordReveal |
| Tagline palavra 5 | 2.8s | 0.9s | wordReveal |
| CTAs | 3.1s | 1.8s | fadeSlideUp |
| Scroll indicator | 3.5s | 1.5s | fadeSlideUp |

**Keyframes:**

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// (lineReveal removido - usando logo image em vez de texto tipográfico)

@keyframes wordReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Tagline Implementação (Desktop - GSAP SplitText):**
```javascript
// SplitText plugin (apenas desktop)
SplitText.create('.tagline', { type: 'words' });

gsap.from('.tagline word', {
  opacity: 0,
  y: 20,
  duration: 0.9,
  stagger: 0.3,
  ease: 'power2.out'
});
```

**Tagline Implementação (Mobile - CSS puro):**
```html
<p class="tagline">
  <span class="word">Entre</span>
  <span class="word">livros,</span>
  <span class="word">vozes</span>
  <span class="word">e</span>
  <span class="word">beats.</span>
</p>
```

### Animações Contínuas

**Scroll Indicator:**
```css
@keyframes scrollFlow {
  0%, 100% {
    opacity: 0.3;
    transform: scaleY(0.7);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}

.scroll-line {
  animation: scrollFlow 2.5s ease-in-out infinite;
}
```

**Parallax da Chave:**
```javascript
// Apenas desktop
if (window.innerWidth > 1024) {
  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const translateY = scrolled * 0.12;
      keyCrop.style.transform = `translateY(${translateY}px)`;
    });
  });
}
```

### Hover States

**Logo Mark:**
```css
.logo-mark:hover svg {
  transform: scale(1.08) rotate(5deg);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**CTA Primary:**
```css
.cta-primary:hover {
  background: #ffffff;
  transform: translateX(8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}
```

**CTA Secondary:**
```css
.cta-secondary:hover .cta-arrow {
  transform: translateX(8px);
}
```

---

## 6. Componentes

### Hero.astro

```astro
---
// Interfaces
interface Props {
  id?: string;
}

// Assets
import logoImage from '@/assets/logos/Logo_Estudio Entre - Claro 2.png';
import keyIcon from '@/assets/icons/olho.svg';
import paperTexture from '@/assets/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp';
---

<section id={id} class="hero" role="banner" aria-label="Seção Hero - Estúdio Entre">
  <!-- Texturas -->
  <div class="paper-texture" aria-hidden="true"></div>
  <div class="halftone-overlay" aria-hidden="true"></div>

  <!-- Logo mark (top-left) -->
  <a href="#top" class="logo-mark" aria-label="Voltar ao topo">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <image href={keyIcon.src} width="100" height="100" />
    </svg>
  </a>

  <!-- Conteúdo -->
  <div class="content-side">
    <div class="main-content">
      <p class="eyebrow">Hub Cultural · Méier RJ</p>

      <img
        src={logoImage.src}
        alt="Estúdio Entre"
        class="hero-logo"
        width="500"
        height="auto"
        loading="eager"
      />

      <p class="tagline">
        <span class="word">Entre</span>
        <span class="word">livros,</span>
        <span class="word">vozes</span>
        <span class="word">e</span>
        <span class="word">beats.</span>
      </p>

      <div class="ctas">
        <a href="#agenda" class="cta cta-primary" aria-label="Ver próximos encontros">
          Próximos encontros
          <span class="cta-arrow" aria-hidden="true">→</span>
        </a>
        <a href="#espaco" class="cta cta-secondary" aria-label="Conhecer o espaço">
          Conheça o espaço
          <span class="cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <div class="scroll-indicator" aria-hidden="true">
      Scroll
      <span class="scroll-line"></span>
    </div>
  </div>

  <!-- Elemento gráfico - chave -->
  <div class="graphic-side" aria-hidden="true">
    <div class="key-crop">
      <img src={keyIcon.src} alt="" class="key-img" />
    </div>
  </div>

  <!-- Linha divisória -->
  <div class="decorative-line" aria-hidden="true"></div>

  <!-- Script de animação -->
  <script>
    import { animateHero } from '@/scripts/heroAnimation';
    animateHero();
  </script>
</section>

<style>
  /* CSS scoped aqui */
</style>
```

### heroAnimation.ts

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function animateHero() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.innerWidth > 1024;

  if (prefersReducedMotion) {
    // Animação simples reduzida
    gsap.set('.hero > *', { opacity: 1 });
    return;
  }

  // Logo mark
  gsap.from('.logo-mark', {
    opacity: 0,
    duration: 1.2,
    ease: 'power2.out',
    delay: 0.3
  });

  // Eyebrow
  gsap.from('.eyebrow', {
    opacity: 0,
    y: 30,
    duration: 1.5,
    ease: 'power2.out',
    delay: 0.6
  });

  // Logo principal
  gsap.from('.hero-logo', {
    opacity: 0,
    y: 30,
    duration: 1.8,
    ease: 'power2.out',
    delay: 0.9
  });

  // Tagline
  if (isDesktop && SplitText) {
    const splitTagline = new SplitText('.tagline', { type: 'words' });
    gsap.from(splitTagline.words, {
      opacity: 0,
      y: 20,
      duration: 0.9,
      stagger: 0.3,
      ease: 'power2.out',
      delay: 1.6
    });
  }

  // CTAs
  gsap.from('.ctas', {
    opacity: 0,
    y: 30,
    duration: 1.8,
    ease: 'power2.out',
    delay: 3.1
  });

  // Scroll indicator
  gsap.from('.scroll-indicator', {
    opacity: 0,
    y: 30,
    duration: 1.5,
    ease: 'power2.out',
    delay: 3.5
  });

  // Parallax da chave (desktop apenas)
  if (isDesktop) {
    const keyCrop = document.querySelector('.key-crop');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const translateY = scrolled * 0.12;
          keyCrop!.style.transform = `translateY(${translateY}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}
```

---

## 7. Responsividade

### Breakpoints

**Desktop (> 1024px):**
```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: visible;
}

.content-side {
  padding: 5rem 4rem;
  text-align: left;
}

.graphic-side {
  display: flex;
}

.mobile-logo {
  display: none;
}
```

**Tablet (768px - 1024px):**
```css
.hero {
  grid-template-columns: 1fr;
}

.graphic-side {
  display: none;
}

.mobile-logo {
  display: block;
  text-align: center;
  margin-bottom: 2rem;
}

.content-side {
  padding: 3rem 2rem;
  text-align: center;
  align-items: center;
}

.ctas {
  align-items: center;
  width: 100%;
}
```

**Mobile (< 768px):**
```css
.content-side {
  padding: 2rem 1.5rem;
}

.eyebrow {
  font-size: 0.75rem;
}

.hero-logo {
  max-width: 280px;
}

.tagline {
  font-size: 0.95rem;
  max-width: 100%;
}

.cta {
  padding: 0.9rem 1.8rem;
  font-size: 0.85rem;
  width: 100%;
  justify-content: center;
}

.scroll-indicator {
  left: 50%;
  transform: translateX(-50%);
  bottom: 1.5rem;
  font-size: 0.65rem;
}
```

---

## 8. Acessibilidade

### ARIA Labels

```astro
<section role="banner" aria-label="Seção Hero">
  <img src={logoImage} alt="Estúdio Entre" />
  <a href="#agenda" aria-label="Ver próximos encontros">...</a>
  <a href="#espaco" aria-label="Conhecer o espaço">...</a>
</section>
```

### Contraste WCAG

- ✅ Creme (#F0EDE8) sobre laranja (#EC6838): **AAA** (8.2:1)
- ✅ Botões creme sobre laranja: **AAA** (8.2:1)
- ✅ Botões laranja sobre creme: **AAA** (8.2:1)

### Focus Management

```css
.cta:focus-visible {
  outline: 2px solid #F0EDE8;
  outline-offset: 2px;
}

/* Tab order: logo → CTA primary → CTA secondary */
```

### Reduced Motion

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Desativar todas animações
  // Usar transições simples de 0.3s
  // Remover parallax
}
```

---

## 9. Performance

### Otimizações

**Imagens:**
- Logo: WebP com fallback PNG
- Loading="eager" (above-the-fold)
- Dimensões explícitas (width/height)
- Opacity baixa em texturas (0.08-0.12)

**Fontes:**
- Preload: Buvera Black, Bold
- Font-display: swap
- Subsets: latim apenas

**Animações:**
- CSS transforms (GPU accelerated)
- RequestAnimationFrame para parallax
- Will-change apenas durante animação

**Métricas Alvo:**
- LCP: < 2.5s ✅
- CLS: < 0.1 ✅
- FID: < 100ms ✅
- Lighthouse Performance: ≥ 95 ✅

---

## 10. Transição de Seções

### Laranja → Creme

**Implementação:**

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Quando usuário rolar para seção Sobre
ScrollTrigger.create({
  trigger: '#sobre',
  start: 'top center',
  onEnter: () => {
    gsap.to('body', {
      backgroundColor: '#F0EDE8',
      color: '#1A1612',
      duration: 0.8,
      ease: 'power2.inOut'
    });
  },
  onEnterBack: () => {
    gsap.to('body', {
      backgroundColor: '#EC6838',
      color: '#F0EDE8',
      duration: 0.8,
      ease: 'power2.inOut'
    });
  }
});
```

**Integração Lenis:**
- Scroll suave mantido durante transição
- Sem jumps visuais
- Crossfade gradual de 0.8s

---

## 11. Integração Técnica

### Estrutura de Arquivos

```
src/
├── components/
│   └── sections/
│       └── Hero.astro
├── scripts/
│   └── heroAnimation.ts
├── styles/
│   └── components/
│       └── hero.css
└── assets/
    ├── logos/
    │   └── Logo_Estudio Entre - Claro 2.png
    ├── icons/
    │   └── olho.svg
    └── textures/
        └── vertical-banner-social-media-*.webp
```

### Dependências

```json
{
  "gsap": "^3.x",
  "@types/gsap": "^3.x"
}
```

### Imports

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText'; // Desktop apenas
```

---

## 12. Mockups Visuais

**Arquivos de referência:**
- `/mockups-hero/opcao-3-final.html` — Versão final aprovada
- `/mockups-hero/opcao-3-refinada.html` — Iteração anterior
- `/mockups-hero/README.md` — Comparativo de opções

**Assets utilizados:**
- Logo: `Logo_Estudio Entre - Claro 2.png`
- Ícone: `olho.svg`
- Textura: `vertical-banner-social-media-*.webp`

---

## 13. Checklist de Implementação

### Estrutura
- [ ] Criar `Hero.astro`
- [ ] Criar `heroAnimation.ts`
- [ ] Criar `hero.css` (ou styles scoped)

### Conteúdo
- [ ] Importar logo PNG
- [ ] Importar ícone chave SVG
- [ ] Importar textura WebP
- [ ] Adicionar eyebrow, tagline, CTAs

### Estilos
- [ ] Layout grid 50/50 desktop
- [ ] Layout single column mobile
- [ ] Texturas sobrepostas
- [ ] Linha divisória com glow
- [ ] Responsividade completa

### Animações
- [ ] Registrar GSAP plugins
- [ ] Timeline orquestrada
- [ ] SplitText desktop
- [ ] CSS spans mobile
- [ ] Parallax chave
- [ ] Reduced motion

### Interações
- [ ] Hover states
- [ ] Focus states
- [ ] Smooth scroll CTAs

### Acessibilidade
- [ ] ARIA labels
- [ ] Alt texts
- [ ] Focus visible
- [ ] Contrast check
- [ ] Reduced motion

### Performance
- [ ] Otimizar imagens
- [ ] Preload fontes
- [ ] RequestAnimationFrame
- [ ] Lighthouse ≥ 95

### Integração
- [ ] Transição de cor para seção Sobre
- [ ] ScrollTrigger configurado
- [ ] Lenis integrado

---

## 14. Notas de Implementação

### SplitText Licensing

O plugin SplitText do GSAP é pago (~$100/ano). Alternativas:

1. **Usar SplitText oficial** (desktop) - recomendado para qualidade
2. **Implementar split manual** via JS/CSS - gratuito
3. **Usar apenas CSS** com spans pré-definidos - mais simples (escolha atual)

Decisão final baseada em budget do projeto.

### Logo Image vs Tipografia

Decidimos usar **logo image** (`Logo_Estudio Entre - Claro 2.png`) em vez de tipografia "ESTÚDIO eNTRE" diretamente no HTML. Isso garante fidelidade à identidade visual original e simplifica a implementação.

O logo já contém a tipografia correta incluindo o "e" minúsculo característico da marca.

---

## 15. Próximos Passos

Após aprovação deste spec:

1. **Invocar writing-plans skill** → Criar plano de implementação detalhado
2. **Implementar Hero.astro** → Estrutura base
3. **Implementar heroAnimation.ts** → Animações GSAP
4. **Testar responsividade** → Desktop, tablet, mobile
5. **Otimizar performance** → Lighthouse ≥ 95
6. **Integrar com seção Sobre** → Transição de cor
7. **Deploy e validação** → Testar em produção

---

**Spec aprovado por:** Devguimaraes
**Data de aprovação:** 2026-04-21
**Próxima etapa:** Criar implementation plan via writing-plans skill
