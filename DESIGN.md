---
name: Estúdio Entre
description: Identidade visual e sistema de design para hub cultural independente
status: active
version: "3.0"
created: 2024-04-23
updated: 2026-04-23

colors:
  # Cores Primárias
  primary-orange: "#ec6838"
  primary-orange-dark: "#c2420e"
  primary-burgundy: "#3d1020"
  primary-cream: "#f0ede8"

  # Cores Secundárias — Expressão e Contexto
  secondary-terracotta: "#9e4b2d"
  secondary-terracotta-light: "#c86440"
  secondary-lilac: "#777bde"
  secondary-lilac-light: "#d2bcfa"
  secondary-lilac-mid: "#bdb2dd"
  secondary-olive: "#8e8100"
  secondary-forest: "#1d432c"
  secondary-mustard: "#dec72c"
  secondary-cyan: "#b9e4eb"
  secondary-amber: "#e08d3d"
  secondary-gold: "#c4a54b"
  secondary-beige: "#f0dcb4"

  # Cores de Seção
  section-purple: "#6b5fbf"
  section-purple-dark: "#5548a5"

  # Cores Base e Utilidade
  base-near-black: "#1a1612"
  base-text-muted: "#7a6e62"
  base-black: "#000000"
  base-white: "#ffffff"

typography:
  # Famílias de fonte
  font-display: '"Buvera", sans-serif'
  font-body: '"Buvera", "Space Grotesk", sans-serif'
  font-sans: '"Space Grotesk", sans-serif'
  font-serif: '"DM Serif Display", serif'

  # Escala de tamanho (px)
  size-display-xl: 120
  size-display-lg: 72
  size-h1: 64
  size-h2: 40
  size-h3: 28
  size-body: 18
  size-body-sm: 16
  size-caption: 14
  size-caption-xs: 12

  # Pesos (weights)
  weight-regular: 400
  weight-medium: 500
  weight-semibold: 600
  weight-bold: 700
  weight-extrabold: 800
  weight-black: 900

  # Line Heights
  line-height-tight: 1.1
  line-height-normal: 1.5
  line-height-relaxed: 1.75
  line-height-loose: 2

  # Letter Spacing
  letter-spacing-tight: "-0.01em"
  letter-spacing-normal: "0em"
  letter-spacing-wide: "0.025em"

spacing:
  # Escala de espaço (px)
  space-0: 0
  space-1: 4
  space-2: 8
  space-3: 12
  space-4: 16
  space-5: 20
  space-6: 24
  space-8: 32
  space-10: 40
  space-12: 48
  space-16: 64
  space-20: 80
  space-24: 96
  space-32: 128

motion:
  # Durações (ms)
  duration-short: 150
  duration-base: 300
  duration-medium: 500
  duration-long: 800
  duration-hero: 1500
  duration-entrance: 1800
  duration-sequence: 3100

  # Easings
  easing-expo: "cubic-bezier(0.87, 0, 0.13, 1)"
  easing-circ: "cubic-bezier(0.55, 0, 0.1, 1)"
  easing-power2-out: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  easing-smooth-scroll: "cubic-bezier(0.87, 0, 0.13, 1)"

  # Smooth scroll config
  smooth-scroll-duration: 1.2
  smooth-scroll-multiplier-mouse: 1
  smooth-scroll-multiplier-touch: 2

elevation:
  # Shadows
  shadow-sm: "0 1px 2px rgba(0, 0, 0, 0.05)"
  shadow-base: "0 1px 3px rgba(0, 0, 0, 0.1)"
  shadow-md: "0 4px 6px rgba(0, 0, 0, 0.1)"
  shadow-lg: "0 10px 15px rgba(0, 0, 0, 0.1)"
  shadow-xl: "0 20px 25px rgba(0, 0, 0, 0.1)"

borders:
  # Border Radius
  radius-none: 0
  radius-sm: 4
  radius-base: 8
  radius-md: 12
  radius-lg: 16
  radius-full: 9999

  # Border Width
  border-width-thin: 1
  border-width-base: 2
  border-width-thick: 4

breakpoints:
  # Responsive breakpoints
  mobile: 320
  tablet: 768
  desktop: 1024
  wide: 1440
  ultrawide: 1920

accessibility:
  # Reduced motion
  prefers-reduced-motion: true
  # Focus indicator
  focus-outline-width: 2
  focus-outline-color: "#777bde"
  focus-outline-offset: 2
  # Custom cursor (desktop only)
  cursor-style: "none"
  cursor-pointer-style: "none"

---

# Estúdio Entre — Design System

O Estúdio Entre é um hub cultural independente no Méier, Rio de Janeiro. Sua identidade visual é **plural, quente e em movimento** — não tem um único rosto fixo, mas um conjunto de elementos que se combinam de formas diferentes, mantendo sempre um DNA reconhecível e acolhedor.

## Visão

**Palavras que guiam as decisões visuais:**  
Acolhimento · Pluralidade · Movimento · Artesanal · Cultura brasileira independente

A marca não segue uma abordagem corporativa tradicional. Ela é viva, contextual e se expressa através de:
- Um símbolo central (a chave) que significa acesso, abertura e novas possibilidades
- Uma paleta quente que reflete o encontro entre pessoas e ideias
- Tipografia única e expressiva (Buvera) que é assinatura visual
- Composições que priorizam movimento e narrativa sobre simetria

## Arquitetura de Cores

### Hierarquia Cromática

A paleta é organizada em camadas intencionais:

**Cores Primárias** — Identidade núcleo  
O trio `Laranja Vibrante (#ec6838)`, `Creme (#f0ede8)` e `Bordô (#3d1020)` forma a assinatura mínima da marca. Usado em logo, fachada, e peças de alta visibilidade.

**Cores Secundárias** — Expressão contextual  
Cada cor secundária tem uma personalidade semântica:
- **Terracota (#9e4b2d)** = Calor, encontro, cultura brasileira  
- **Lilás (#777bde)** = Misticismo, arte, espiritualidade  
- **Oliva (#8e8100)** = Intelectual, vintage, pensamento crítico  
- **Verde-floresta (#1d432c)** = Natureza, equilíbrio, cuidado  
- **Amarelo-mostarda (#dec72c)** = Criatividade, alegria, movimento  
- **Ciano (#b9e4eb)** = Frescor, contemporaneidade, comunicado  

**Cores de Apoio** — Utilidade e acessibilidade  
Near-black (`#1a1612`), text-muted (`#7a6e62`), cream (`#f0ede8`) garantem contraste e legibilidade em qualquer contexto.

### Combinações Cromáticas Validadas

A marca opera através de **pares de cores intencionais**, não aplicações isoladas:

| Contexto | Fundo | Elemento | Intenção |
|----------|-------|----------|----------|
| Identidade Principal | `#000000` preto | `#f0ede8` creme | Logo oficial, máximo contraste |
| Fachada | `#b9e4eb` ciano | `#3d1020` bordô | Comunicado público, energético |
| Encontro/Evento | `#9e4b2d` terracota | `#c4a54b` dourado | Quente, acolhedor, convite |
| Cuidado/Biblioterapia | `#3d1020` bordô | `#d2bcfa` lilás | Profundo, reflexivo, seguro |
| Criatividade/Cultura | `#777bde` lilás | `#ec6838` laranja | Vibração, pluralidade, energia |
| Comunicado Editorial | `#b9e4eb` ciano | `#3d1020` bordô | Claro, direto, acessível |

### Transparência e Overlay

- **Texturas halftone/pontilhado:** 20–40% opacidade sobre fotografia  
- **Overlays cromáticos:** nunca ultrapassar 50% opacidade para não perder leitura de conteúdo  
- **Seleção de texto:** fundo lilás-claro `#d2bcfa`, texto bordô `#3d1020`

## Tipografia

### Filosofia

A marca usa **apenas uma família tipográfica: Buvera** em variados pesos. Isso cria coesão extrema e força a criatividade através da composição, não da pluralidade de fontes.

Buvera é uma typeface moderna, amigável e expressiva. Seus pesos (Regular até Black) permitem criar hierarquias visuais vívidas, de body text delicado até headlines impactantes.

### Hierarquia de Tamanhos

| Nível | Peso | Tamanho | Uso | Exemplo |
|-------|------|--------|-----|---------|
| Display / Hero | Black | 72–120px | Tagline, manchete | "Entre livros, vozes e beats." |
| H1 | Extrabold | 48–64px | Título de página, seção hero | Título principal da página |
| H2 | Bold | 32–40px | Título de seção | "Próximos encontros", "Sobre" |
| H3 | Semibold | 24–28px | Subtítulo, destaque | "Tema do evento", "Local" |
| Body | Regular | 16–18px | Corpo de texto | Descrição de evento |
| Caption | Medium | 12–14px | Metadados, legendas | Data, horário, categoria |

### Line Heights e Spacing

- **Display:** line-height 1.1 (compacto, impactante)  
- **Headlines (H1–H3):** line-height 1.3 (clara, respirável)  
- **Body:** line-height 1.5 (confortável para leitura contínua)  
- **Caption:** line-height 1.4 (compacta, mas legível)

**Letter spacing:** Mantido natural. Aumentar apenas em ALL CAPS (0.025em).

### Tipografia como Elemento Gráfico

A letra "E" maiúscula e o "e" cursivo são usados como **elementos visuais autônomos** — não apenas utilitários. Aparecem em backgrounds, em destaque de stories, em composições editoriais. É parte intencional do vocabulário visual.

## Sistema de Espaçamento

Baseado em escala modular de **4px**, permitindo flexibilidade e precisão:

```
4px (0.25rem)   → Fine adjustments
8px (0.5rem)    → Elementos muito próximos
16px (1rem)     → Espaço padrão entre elementos
24px (1.5rem)   → Separação clara entre blocos
32px (2rem)     → Respiro entre seções
64px (4rem)     → Grande separação (mobile)
128px (8rem)    → Separação heroica (desktop)
```

### Aplicação

- **Component padding:** 16px–24px (mantém proporcionalidade)  
- **Margin entre blocos:** 32px (mobile), 64px (desktop)  
- **Line gaps:** 8px–12px (entre elementos em seção)  
- **Text-to-image:** 24px–32px (respiração visual)

## Sistema de Movimento

### Filosofia de Animação

O site segue uma **estética de travessia** — a narrativa é contada através de scroll, transições suaves e revealations cinemáticas. Sem movimentos abruptos, sem desnorteio.

Princípios:
1. **Movement serves intent** — Toda animação comunica ou facilita navegação  
2. **Smooth over snappy** — Easing curve suave (power2.out, expo)  
3. **Respect prefers-reduced-motion** — Acessibilidade primeira  
4. **Parallax with purpose** — Elementos se movem para criar profundidade narrativa  

### Durations (Timings)

| Duração | Uso |
|---------|-----|
| 150ms | Micro-interactions (hover, focus) |
| 300ms | State changes rápidas (toggle) |
| 500ms | Transição entre estados visíveis |
| 800ms | Entrada de elemento isolado |
| 1500–1800ms | Hero entrance, reveal cinematográfico |
| 3100ms+ | Sequência de múltiplos elementos (stagger) |

**Smooth scroll (Lenis):** 1.2s de duração base com easing expo. Respeita `prefers-reduced-motion: reduce`.

### Easing Curves

- **power2.out** (default) — Natural, desaceleração suave: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`  
- **expo** (smooth scroll) — Mais dramática, suave: `cubic-bezier(0.87, 0, 0.13, 1)`  
- **circ** (effects) — Arredondada, lúdica: `cubic-bezier(0.55, 0, 0.1, 1)`

### Padrões de Animação

**Hero Entrance (SplitText)**  
Eyebrow → Logo → Words (stagger) → CTAs → Scroll indicator  
Duração total: ~3.5s, com delays progressivos.

**Parallax Scroll**  
Elemento se move em Y baseado em scroll offset, criando profundidade. Afeta principalmente a chave (key visual) e backgrounds coloridos.

**Color Transition (Section to Section)**  
Background muda suavemente de cor quando scroll cruza trigger point. Sem corte brusco.

**Focus / Hover**  
- Links: 300ms scale + opacity  
- Botões: 300ms background-color change  
- Custom cursor: immediate position update + 150ms icon swap  

### Accessibility (prefers-reduced-motion)

Quando `prefers-reduced-motion: reduce` está ativo:
- Todos os `animation-duration` → 0.01ms  
- Todos os `transition-duration` → 0.01ms  
- `scroll-behavior: smooth` → `scroll-behavior: auto`  
- Elementos aparecem com `opacity: 1` (sem fade-in)

## Símbolo e Logo

### A Chave

A chave é símbolo único da marca, presente em praticamente todos os touchpoints. Representa:
- **Acesso** — abertura de portas (físicas e mentais)  
- **Novas possibilidades** — chave que abre caminhos  
- **"Ver além"** — enxergar o que está entre as coisas  
- **Marca tipográfica** — o "E" de Estúdio e o conceito "Entre" embutidos no design

**Anatomia:** Cabeça (com bússola/olho de 4 pontas) + Cabo (com 3 dentes = Ensino · Coletividade · Acolhimento).

### Variações de Uso

| Contexto | Variação | Aplicação |
|----------|----------|-----------|
| Logo principal | Chave completa horizontal | Cabeçalho, assinatura oficial |
| Stories / Social | Chave crop vertical | Saindo do frame, criando movimento |
| Padrão / Textura | Chave repetida em grade | Background, overlay subtil |
| Avatar / Destaque | Símbolo isolado (cabeça) | Ícone simplificado, favicon |
| Detalhe funcional | Fechadura (keyhole) | Ícone de "unlock", info oculta |

### Regras de Uso

✅ **Permitido:**  
- Aplicar qualquer cor primária ou secundária da paleta  
- Variar tamanho mantendo proporções  
- Usar em padrão repetido (grade)  
- Rotacionar para composições editoriais  
- Combinar com logotipo tipográfico ou isolada  

❌ **Proibido:**  
- Deformar proporções  
- Aplicar cores fora da paleta oficial  
- Rotacionar excessivamente (comprometer leitura)  
- Inverter horizontalmente (perde significado direcional)

### Logotipo

**Versão principal:** "ESTÚDIO eNTRE" (tipografia + símbolo)  
Note: o "e" minúsculo é **intencional**, não é erro. É assinatura da marca.

**Variações de layout:**  
- Horizontal completo (símbolo + texto lado a lado)  
- Stacked (símbolo acima, texto abaixo)  
- Tipográfico apenas ("ESTÚDIO eNTRE" sem símbolo)  

**Tamanho mínimo:**  
- Digital: 120px de largura  
- Impresso: 30mm de largura  
- Abaixo disso: usar apenas o símbolo isolado

**Versões de cor validadas:**  
- Claro: Creme `#f0ede8` em preto `#000000`  
- Fachada: Bordô `#3d1020` em ciano `#b9e4eb`  
- Kraft: Marrom escuro `#2a1a10` em kraft natural  
- Terracota: Terracota claro `#c86440` em creme `#f0ede8`  

## Componentes e Padrões

### UI Components (Astro + React)

#### Button / CTA

**States:**  
- Default: background primário, text cream  
- Hover: background-color transição 300ms, scale 1.02  
- Active: background-color mais escuro  
- Focus: outline lilás `#777bde` 2px offset 2px  
- Disabled: opacity 0.5, cursor not-allowed  

**Variants:**  
- Primary: filled background  
- Secondary: outline border  
- Ghost: text only, underline on hover  

#### Form Input

**Base:**  
- Border 1px solid `#7a6e62` (text-muted)  
- Padding 12px 16px  
- Font-size 16px (prevents zoom on iOS)  
- Focus: outline lilás `#777bde`  

**Validation:**  
- Error: border red, text hint em red  
- Success: border green, check icon  

#### Navigation / Header

**Desktop:** Logo + Navbar horizontal, fixed top  
**Mobile:** Logo + Hamburger toggle, responsive drawer  

Hover: transition suave 300ms em color/opacity  
Active link: indicator visual (underline, background)

### Sections (Page Blocks)

#### Hero

Background laranja `#ec6838`, layout grid 2 cols (desktop).  
Conteúdo esquerda, key visual (chave) direita com parallax.  
Typography em display scale (120px), staggered entrance 3.5s.  
CTA destaque em creme ou contraste.

#### About (Sobre)

Background creme `#f0ede8`, text near-black `#1a1612`.  
Tipografia warm, com elementos gráficos (letras "E" + texturas).  
Composição: lado texto, lado imagem com overlay padrão de chave.

#### Sections (Eixos)

Background near-black `#1a1612`, cards coloridas (terracota, lilás, oliva, mustard).  
Card format: title (bold), description (body), icon ou elemento gráfico.  
Hover: card escala 1.02, shadow increase, transition 300ms.

#### Events (Agenda)

Background cream/white com accent color (terracota para Agenda).  
Event card: imagem, título, data/hora, categoria badge, CTA.  
Filter buttons: toggle states, active underline em cor de seção.  
Lightbox modal: overlay escuro 80%, imagem centered, close button.

#### Contact (Contato)

Background purple `#6b5fbf`, form com inputs contrastados.  
Label + input layout stack mobile, 2 cols desktop.  
Submit button em creme, hover state com transição.  
Validation feedback inline, cores semânticas (success green, error red).

### Spacing & Rhythm

- **Section gaps:** 32px (mobile), 64px (desktop)  
- **Card internal padding:** 24px  
- **Text to next element:** 16px–24px  
- **Grid gap:** 16px–24px (depends on breakpoint)

### Icons & Graphics

**Icon set:**  
- Chave (múltiplas variações)  
- Calendário, Microfone, Fone, Play, Olho, Spark  
- All monochrome, scalable, consistent stroke width (1.5–2px)

**Organic shapes (Blobs):**  
Used as containers for hero, image overlays, or graphic elements.  
Accept free color variation within palette.  
Add visual movement without sacrificing clarity.

**Halftone/Pointillist texture:**  
Applied as SVG filter overlay on photography.  
20–40% opacity. Never over text.  
Reinforces indie, print, editorial aesthetic.

## Responsive Behavior

### Breakpoints

- **Mobile:** 320–767px (stack, single column)  
- **Tablet:** 768–1023px (1–2 columns, adapt)  
- **Desktop:** 1024–1439px (full layouts)  
- **Wide:** 1440px+ (expanded margins, larger type)

### Scaling Rules

- **Type:** Scales from 14px (caption mobile) to 120px (hero desktop)  
- **Spacing:** 16px base (mobile) → 24–32px base (desktop)  
- **Images:** 100% width on mobile, constrained on desktop  
- **Columns:** 1 col mobile, adapt tablets, 2+ cols desktop  

### Touch Targets

Minimum 44px × 44px for touch (buttons, links, interactive elements).  
Maintain padding in dense layouts.

## Accessibility Principles

### Color Contrast

- Text on colored backgrounds: minimum 4.5:1 WCAG AA  
- Large text (18pt+): minimum 3:1 WCAG AA  
- Primary near-black `#1a1612` on cream `#f0ede8`: 10.8:1 ✅

### Motion

- Respect `prefers-reduced-motion: reduce` — no animations, instant transitions  
- Provide text alternative for all visual-only content  
- Test with screen readers for semantic HTML  

### Focus Management

- Visible focus indicator: lilás outline 2px, 2px offset  
- Focus order: logical, left-to-right, top-to-bottom  
- Skip links for keyboard navigation  

### Keyboard Navigation

- All interactive elements accessible via Tab  
- Buttons trigger on Space/Enter  
- Escape closes modals/drawers  
- Arrow keys in carousels (if used)

## Implementation Notes

### CSS Variables

All tokens available as CSS custom properties:

```css
:root {
  --color-orange: #ec6838;
  --color-cream: #f0ede8;
  --font-display: "Buvera", sans-serif;
  --ease-expo: cubic-bezier(0.87, 0, 0.13, 1);
  /* ... full token set ... */
}
```

### Tailwind Configuration

Design tokens are mapped to Tailwind utilities:

```js
// Colors, spacing, etc. in tailwind.config.ts
extend: {
  colors: {
    orange: '#ec6838',
    // ... full palette
  },
  spacing: {
    // Modular scale
  }
}
```

### GSAP Animations

Global easing defaults and ScrollTrigger setup in `src/animations/init.ts`.  
Respect `prefers-reduced-motion` before animating.  
Test smooth scroll (Lenis) on iOS, Android for performance.

### Images & Performance

- WebP format for modern browsers, JPEG fallback  
- Lazy loading on below-fold images  
- Responsive `srcset` for device density  
- Optimize halftone filters for render performance  

## Design Evolution & Versioning

**Version 3.0** (April 2026):  
- Paleta validada com mockups reais (fachada, sacola, stories, feed)  
- Logo e símbolo consolidados em todas as variações  
- Tipografia unifocal (Buvera only)  
- Animações em GSAP + Lenis definidas  
- Sistema de cores com semântica clara  

**Next iterations:**
- Dark mode variant (if needed)  
- Expanded component library  
- Comprehensive pattern library  

---

**Last updated:** April 2026  
**Maintained by:** Estúdio Entre Design + Development Team  
**License:** © Estúdio Entre. All rights reserved.
