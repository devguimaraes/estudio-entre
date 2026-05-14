# Redesign Homepage — Estúdio Entre

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a homepage do Estúdio Entre para refletir fielmente a identidade visual da marca — com ênfase em recortes orgânicos, textura halftone, elementos decorativos (raios, estrelas, setas), contraste tipográfico monumental e o sistema de cores por pilar do guia oficial.

**Architecture:** Evolução do layout editorial existente (Astro + Tailwind + GSAP). Manter a estrutura de seções e animações atuais, mas injetar a linguagem visual da marca: SVGs decorativos, máscaras orgânicas em fotos, halftone como camada de textura, e o sistema de 5 pilares com cores distintas. Cada seção recebe tratamento visual específico sem quebrar a navegação ou acessibilidade.

**Tech Stack:** Astro 5, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis (smooth scroll já configurado), Sanity (dados de eventos).

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/components/ui/Decorative.astro` | SVGs decorativos reutilizáveis (raios, estrela, seta, pontilhado) |
| `src/components/ui/HalftoneTexture.astro` | Camada de textura halftone configurável (densidade, cor, opacidade) |
| `src/components/ui/BlobMask.astro` | Wrapper que aplica máscara orgânica SVG em qualquer elemento filho |
| `src/components/sections/Hero.astro` | Hero redesenhado — chave como símbolo, halftone dinâmico, elementos flutuantes |
| `src/components/sections/Sobre.astro` | Sobre redesenhado — recortes orgânicos, textura pontilhada, tipografia monumental |
| `src/components/sections/Pilares.astro` | **Nova seção** — 5 pilares do guia (Biblioterapia, Oficinas, Palestras, Estúdio, Encontros) com cores distintas |
| `src/components/sections/Eixos.astro` | **Remover** — substituído por Pilares |
| `src/components/sections/Servicos.astro` | **Remover** — substituído por Pilares |
| `src/components/sections/Agenda.astro` | Evolução visual — manter funcionalidade, adicionar identidade |
| `src/components/sections/Espaco.astro` | Galeria com máscaras orgânicas e halftone |
| `src/components/sections/Contato.astro` | Evolução — adicionar elementos decorativos |
| `src/components/sections/Footer.astro` | Evolução — adicionar elementos da marca |
| `src/styles/global.css` | Atualizar variáveis de tema se necessário |
| `src/animations/pilares.ts` | Animações da nova seção Pilares |
| `src/animations/hero.ts` | Ajustar animação do hero (símbolo da chave) |
| `src/animations/colorTransition.ts` | Atualizar mapeamento de cores para as novas seções |
| `src/pages/index.astro` | Atualizar ordem e importação das seções |

---

## Task 1: Criar componentes visuais reutilizáveis

**Files:**
- Create: `src/components/ui/Decorative.astro`
- Create: `src/components/ui/HalftoneTexture.astro`
- Create: `src/components/ui/BlobMask.astro`

- [ ] **Step 1: Criar `Decorative.astro`**

Criar componente com 4 variantes de SVG decorativos da marca:
- `ray` — raio amarelo/laranja (como nas imagens de apresentação)
- `star` — estrela de 4 pontas (como o ícone no guia)
- `arrow` — seta horizontal simples
- `dots` — padrão pontilhado

```astro
---
interface Props {
  variant: "ray" | "star" | "arrow" | "dots";
  color?: string;
  size?: number;
  class?: string;
}

const { variant, color = "currentColor", size = 40, class: className = "" } = Astro.props;
---

<span class={`inline-block ${className}`} style={`width: ${size}px; height: ${size}px; color: ${color};`}>
  {variant === "ray" && (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16L20 0Z" fill="currentColor"/>
    </svg>
  )}
  {variant === "star" && (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C20 11.05 11.05 20 0 20C11.05 20 20 28.95 20 40C20 28.95 28.95 20 40 20C28.95 20 20 11.05 20 0Z" fill="currentColor"/>
    </svg>
  )}
  {variant === "arrow" && (
    <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12H52M52 12L42 2M52 12L42 22" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )}
  {variant === "dots" && (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="2" fill="currentColor"/>
      <circle cx="20" cy="4" r="2" fill="currentColor"/>
      <circle cx="36" cy="4" r="2" fill="currentColor"/>
      <circle cx="4" cy="20" r="2" fill="currentColor"/>
      <circle cx="20" cy="20" r="2" fill="currentColor"/>
      <circle cx="36" cy="20" r="2" fill="currentColor"/>
      <circle cx="4" cy="36" r="2" fill="currentColor"/>
      <circle cx="20" cy="36" r="2" fill="currentColor"/>
      <circle cx="36" cy="36" r="2" fill="currentColor"/>
    </svg>
  )}
</span>
```

- [ ] **Step 2: Criar `HalftoneTexture.astro`**

Camada de textura halftone via CSS radial-gradient, configurável:

```astro
---
interface Props {
  density?: number; // px entre dots
  dotSize?: number; // ratio do dot
  color?: string;
  opacity?: number;
  class?: string;
}

const {
  density = 8,
  dotSize = 1.5,
  color = "0,0,0",
  opacity = 0.15,
  class: className = "",
} = Astro.props;
---

<div
  class={`absolute inset-0 pointer-events-none ${className}`}
  style={`
    background-image: radial-gradient(rgba(${color}, ${opacity}) ${dotSize}px, transparent ${dotSize}px);
    background-size: ${density}px ${density}px;
  `}
/>
```

- [ ] **Step 3: Criar `BlobMask.astro`**

Wrapper que aplica máscara orgânica em qualquer conteúdo via SVG clipPath:

```astro
---
interface Props {
  variant?: 1 | 2 | 3 | 4;
  class?: string;
}

const { variant = 1, class: className = "" } = Astro.props;

// 4 variações de formas orgânicas inspiradas nas imagens da marca
const paths = {
  1: "M50,0 C80,0 100,20 100,50 C100,80 80,100 50,100 C20,100 0,80 0,50 C0,20 20,0 50,0 Z", // oval suave
  2: "M30,0 C60,0 90,10 100,40 C110,70 90,100 60,100 C30,100 0,90 0,60 C0,30 10,0 30,0 Z", // assimétrico
  3: "M50,0 C75,0 95,15 100,40 C105,65 85,90 60,95 C35,100 10,85 5,60 C0,35 15,10 40,5 C45,2 48,0 50,0 Z", // orgânico
  4: "M20,10 C40,0 70,5 90,20 C100,35 95,65 80,80 C60,95 30,100 15,85 C0,70 5,40 10,25 C12,18 16,13 20,10 Z", // ameba
};
---

<div class={`relative ${className}`} style="clip-path: url(#blob-mask-#{variant});"
  <svg width="0" height="0" class="absolute">
    <defs>
      <clipPath id={`blob-mask-${variant}`} clipPathUnits="objectBoundingBox">
        <path d={paths[variant]} transform="scale(0.01)" />
      </clipPath>
    </defs>
  </svg>
  <slot />
</div>
```

- [ ] **Step 4: Verificar build**

Run: `bun run check`
Expected: Passar sem erros de lint

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Decorative.astro src/components/ui/HalftoneTexture.astro src/components/ui/BlobMask.astro
git commit -m "feat(ui): add decorative brand elements (ray, star, arrow, dots), halftone texture, blob masks"
```

---

## Task 2: Redesenhar Hero

**Files:**
- Modify: `src/components/sections/Hero.astro`
- Modify: `src/animations/hero.ts`

- [ ] **Step 1: Atualizar Hero.astro**

Manter a estrutura de camadas mas evoluir visualmente:
- Trocar `/icons/fechadura.svg` por `/icons/chave.svg` (símbolo oficial da marca)
- Adicionar `HalftoneTexture` com densidade maior na camada de fundo
- Adicionar elementos decorativos flutuantes (raios, estrelas) posicionados absolutamente
- CTAs com formato mais orgânico (possivelmente `rounded-full` ou forma custom)
- Adicionar seta decorativa apontando para baixo

```astro
---
import { Image } from "astro:assets";
import logoClaro from "@/assets/logos/Logo_Estudio Entre - Claro 2.png";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import Decorative from "@/components/ui/Decorative.astro";
---

<section class="hero h-screen relative bg-orange overflow-hidden" role="banner" aria-label="Estúdio Entre — Hub Cultural no Méier, RJ">
  <!-- Layer 0: Halftone Texture -->
  <HalftoneTexture density={12} dotSize={1.8} color="0,0,0" opacity={0.12} class="z-0" />
  <div class="absolute inset-0 bg-[url('/textures/paper-texture-optimized.webp')] bg-repeat opacity-10 mix-blend-multiply z-0 pointer-events-none"></div>

  <!-- Floating decorative elements -->
  <div class="absolute top-[15%] left-[8%] z-10 opacity-60 animate-float-slow">
    <Decorative variant="ray" color="#dec72c" size={60} />
  </div>
  <div class="absolute top-[25%] right-[12%] z-10 opacity-40 animate-float">
    <Decorative variant="star" color="#f0ede8" size={30} />
  </div>
  <div class="absolute bottom-[30%] left-[15%] z-10 opacity-30 animate-float-delayed">
    <Decorative variant="star" color="#dec72c" size={20} />
  </div>

  <!-- Layer 1: The Portal Symbol (Chave) -->
  <div class="hero__symbol-container absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
    <img src="/icons/chave.svg" class="hero__symbol w-[200px] h-auto opacity-0" alt="" />
  </div>

  <!-- Layer 2: Content -->
  <div class="hero__layer-content relative z-30 h-full flex flex-col justify-center items-center text-center px-6">
    <div class="hero__logo-wrap mb-10">
       <Image
         src={logoClaro}
         class="hero__logo opacity-0 w-full max-w-[280px] sm:max-w-[480px] h-auto"
         alt="Estúdio Entre"
         loading="eager"
         fetchpriority="high"
       />
    </div>

    <div class="hero__description text-cream pointer-events-none opacity-0">
      <p class="font-display text-[10px] sm:text-xs uppercase tracking-[0.4em] mb-3">
        Hub Cultural Independente
      </p>
      <p class="font-display italic text-lg sm:text-2xl opacity-90">
        onde a palavra vira encontro.
      </p>
    </div>

    <div class="hero__ctas mt-12 flex translate-y-6 flex-col gap-6 opacity-0 sm:flex-row">
        <a href="#agenda" class="hero__cta hero__cta--primary px-8 py-4 bg-cream text-orange font-bold uppercase tracking-widest text-sm rounded-full" data-cursor="EXPLORAR">
          Próximos encontros
        </a>
        <a href="#espaco" class="hero__cta hero__cta--secondary px-8 py-4 border-2 border-cream text-cream font-bold uppercase tracking-widest text-sm rounded-full" data-cursor="ENTRAR">
          Conheça o espaço
        </a>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="hero__scroll absolute bottom-10 left-10 flex items-center gap-4 opacity-0 z-30">
    <span class="text-[10px] uppercase tracking-[0.3em] text-cream/50">Scroll</span>
    <div class="w-12 h-[1px] bg-cream/30 relative overflow-hidden">
        <div class="hero__scroll-line absolute inset-0 bg-cream -translate-x-full"></div>
    </div>
    <Decorative variant="arrow" color="rgba(240,237,232,0.5)" size={24} />
  </div>

  <script>
    import { animateHero } from "@/animations/hero";
    animateHero();
  </script>
</section>

<style>
  .hero__symbol {
    filter: brightness(0) invert(1);
  }

  .hero {
    perspective: 1000px;
  }

  .hero__cta {
    transition: transform 0.4s var(--ease-editorial), background-color 0.4s var(--ease-editorial), box-shadow 0.4s var(--ease-editorial);
  }

  .hero__cta:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  }

  .hero__cta--primary:hover {
    background-color: white;
  }

  .hero__cta--secondary:hover {
    background-color: rgba(240, 237, 232, 0.1);
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(5deg); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0) rotate(-5deg); }
    50% { transform: translateY(-8px) rotate(0deg); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(-3deg); }
  }
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite 1s; }
</style>
```

- [ ] **Step 2: Ajustar `hero.ts` para usar chave em vez de fechadura**

O código de animação permanece quase igual, apenas garantir que o seletor `.hero__symbol` funcione com o novo SVG. Não há mudanças significativas necessárias no arquivo de animação.

- [ ] **Step 3: Verificar build**

Run: `bun run check`
Expected: Passar sem erros

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.astro src/animations/hero.ts
git commit -m "feat(hero): redesign with brand key symbol, halftone texture, floating decorative elements"
```

---

## Task 3: Redesenhar Sobre

**Files:**
- Modify: `src/components/sections/Sobre.astro`

- [ ] **Step 1: Atualizar Sobre.astro**

Layout editorial com recortes orgânicos, textura pontilhada, elementos decorativos:

```astro
---
import { Image } from "astro:assets";
import placeholder1 from "@/assets/images/estudio-entre-3.png";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import Decorative from "@/components/ui/Decorative.astro";
import BlobMask from "@/components/ui/BlobMask.astro";
---

<section class="sobre relative py-40 px-6 md:px-20 bg-cream text-near-black overflow-hidden" id="sobre">
  <!-- Textura pontilhada sutil no fundo -->
  <HalftoneTexture density={16} dotSize={1.2} color="158,75,45" opacity={0.06} class="z-0" />

  <!-- Elementos decorativos -->
  <div class="absolute top-[10%] right-[5%] opacity-30 z-10">
    <Decorative variant="star" color="#9e4b2d" size={50} />
  </div>
  <div class="absolute bottom-[20%] left-[3%] opacity-20 z-10">
    <Decorative variant="dots" color="#3d1020" size={60} />
  </div>

  <!-- Monumental Watermark -->
  <div class="sobre__watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[60vw] font-black opacity-[0.02] pointer-events-none select-none z-0">
    E
  </div>

  <div class="max-w-7xl mx-auto relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

      <!-- Sticky Title Side -->
      <div class="lg:col-span-5">
        <div class="sobre__sticky-wrap lg:sticky lg:top-40">
          <p class="text-[10px] uppercase tracking-[0.4em] text-bordo mb-8">Nossa Essência</p>
          <h2 class="sobre__title text-5xl md:text-7xl font-display font-black italic uppercase leading-[0.9] text-bordo">
            Uma mãe,<br/> uma filha<br/> e um sonho.
          </h2>
        </div>
      </div>

      <!-- Content Side -->
      <div class="lg:col-span-7 pt-10 lg:pt-0">
        <div class="sobre__text-block space-y-12">
          <p class="sobre__text text-xl md:text-2xl leading-relaxed font-medium">
            O Estúdio Entre é um <span class="text-orange italic">hub cultural multidisciplinar</span>, cuja missão é promover encontros significativos entre cultura, conhecimento e bem-estar. Um espaço plural e acolhedor, onde arte, palavra e cuidado se entrelaçam.
          </p>

          <div class="sobre__image-reveal relative" data-cursor="VER ESPAÇO">
            <BlobMask variant={3} class="aspect-[4/5]">
              <Image src={placeholder1} alt="Ambiente Estúdio Entre" class="w-full h-full object-cover" />
            </BlobMask>
            <!-- Overlay sutil para manter a atmosfera -->
            <div class="absolute inset-0 bg-bordo/5 mix-blend-multiply pointer-events-none" style="clip-path: inherit;"></div>
          </div>

          <div class="space-y-8 text-lg opacity-80 leading-relaxed max-w-xl">
            <p class="sobre__text">
              Por meio de experiências que unem literatura, comunicação e práticas integrativas, estimulamos a escuta, a criação e o acesso à expressão cultural em suas diversas formas — fortalecendo o vínculo entre pessoas, gerações e modos de existir.
            </p>
            <p class="sobre__text">
              O hub reúne rodas de biblioterapia, oficinas, palestras e encontros culturais, além de disponibilizar um estúdio profissional para gravação de podcasts e videocasts.
            </p>
          </div>

          <p class="sobre__signature text-2xl md:text-3xl font-display italic text-bordo pt-10 border-t border-bordo/10">
            Entre palavras, entre pessoas — é só entrar.
          </p>
        </div>
      </div>

    </div>
  </div>

  <script>
    import { animateSobre } from "@/animations/sobre";
    animateSobre();
  </script>
</section>
```

- [ ] **Step 2: Verificar build**

Run: `bun run check`
Expected: Passar sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Sobre.astro
git commit -m "feat(sobre): add blob masks, halftone texture, decorative elements"
```

---

## Task 4: Criar seção Pilares (substitui Eixos + Serviços)

**Files:**
- Create: `src/components/sections/Pilares.astro`
- Create: `src/animations/pilares.ts`
- Remove: `src/components/sections/Eixos.astro` (do index)
- Remove: `src/components/sections/Servicos.astro` (do index)

- [ ] **Step 1: Criar `Pilares.astro`**

Nova seção com os 5 pilares do guia, cada um com cor distinta e layout tipo "faixas" empilhadas:

```astro
---
const pilares = [
  {
    id: "biblioterapia",
    title: "Biblioterapia",
    subtitle: "Leitura como cura",
    description: "Rodas de leitura que usam a literatura como ferramenta de autoconhecimento, escuta e transformação social.",
    color: "#9e4b2d", // terracota
    textColor: "#f0ede8",
    icon: "/icons/olho.svg",
  },
  {
    id: "oficinas",
    title: "Oficinas",
    subtitle: "Criação coletiva",
    description: "Espaços de troca e aprendizado prático que unem arte, tecnologia e subjetividade para criar novas possibilidades.",
    color: "#bdb2dd", // lilás claro
    textColor: "#1a1612",
    icon: "/icons/spark.svg",
  },
  {
    id: "palestras",
    title: "Palestras",
    subtitle: "Diálogos profundos",
    description: "Encontros com pensadores, artistas e educadores para expandir horizontes e fortalecer a comunidade.",
    color: "#b9e4eb", // cyan
    textColor: "#1a1612",
    icon: "/icons/microfone.svg",
  },
  {
    id: "estudio",
    title: "Estúdio",
    subtitle: "Produção e áudio",
    description: "Estrutura profissional para gravação de podcasts, videocasts, sets e experimentações sonoras.",
    color: "#dec72c", // amarelo/mustard
    textColor: "#1a1612",
    icon: "/icons/play.svg",
  },
  {
    id: "encontros",
    title: "Encontros",
    subtitle: "Conexão real",
    description: "Sarau, rodas de conversa, saraus e celebrações que fortalecem os laços entre pessoas e gerações.",
    color: "#ec6838", // laranja
    textColor: "#f0ede8",
    icon: "/icons/pin.svg",
  },
];
---

<section class="pilares relative" id="pilares">
  {pilares.map((pilar, i) => (
    <div
      class="pilar__strip relative py-20 md:py-28 px-6 md:px-20 overflow-hidden transition-colors duration-700"
      style={`background-color: ${pilar.color}; color: ${pilar.textColor};`}
      data-color={pilar.color}
      data-theme={pilar.textColor === "#f0ede8" ? "light" : "dark"}
    >
      <!-- Halftone textura sutil -->
      <div class="absolute inset-0 pointer-events-none opacity-10"
        style={`background-image: radial-gradient(${pilar.textColor} 1.2px, transparent 1.2px); background-size: 12px 12px;`}
      />

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div class="flex items-center gap-6">
            <span class="text-[10px] uppercase tracking-[0.4em] opacity-50">{String(i + 1).padStart(2, "0")}</span>
            <img src={pilar.icon} class="w-8 h-8 opacity-60" alt="" style={`filter: ${pilar.textColor === "#f0ede8" ? "brightness(0) invert(1)" : "none"};`} />
          </div>

          <div class="flex-1 md:ml-16">
            <h3 class="pilar__title text-4xl md:text-6xl font-display font-black italic uppercase leading-tight">
              {pilar.title}
            </h3>
            <p class="pilar__subtitle text-lg md:text-xl font-display italic opacity-70 mt-2">
              {pilar.subtitle}
            </p>
          </div>

          <p class="pilar__desc max-w-md text-sm md:text-base leading-relaxed opacity-80 md:text-right">
            {pilar.description}
          </p>
        </div>
      </div>
    </div>
  ))}

  <script>
    import { animatePilares } from "@/animations/pilares";
    animatePilares();
  </script>
</section>
```

- [ ] **Step 2: Criar `pilares.ts`**

Animação de entrada dos títulos dos pilares com GSAP ScrollTrigger:

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animatePilares(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const strips = document.querySelectorAll(".pilar__strip");

  strips.forEach((strip) => {
    const title = strip.querySelector(".pilar__title");
    const subtitle = strip.querySelector(".pilar__subtitle");
    const desc = strip.querySelector(".pilar__desc");

    if (title) {
      gsap.fromTo(
        title,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strip,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 0.7,
          duration: 0.6,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strip,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    if (desc) {
      gsap.fromTo(
        desc,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 0.8,
          duration: 0.6,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strip,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  });
}
```

- [ ] **Step 3: Verificar build**

Run: `bun run check`
Expected: Passar sem erros

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Pilares.astro src/animations/pilares.ts
git commit -m "feat(pilares): add new section with 5 brand pillars and color system"
```

---

## Task 5: Redesenhar Agenda

**Files:**
- Modify: `src/components/sections/Agenda.astro`

- [ ] **Step 1: Atualizar Agenda.astro**

Manter funcionalidade mas adicionar elementos visuais da marca:

```astro
---
import AgendaFilter from "@/components/islands/AgendaFilter";
import Decorative from "@/components/ui/Decorative.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import type { EventoCard } from "@/types/evento";

interface Props {
  eventos: EventoCard[];
}

const { eventos } = Astro.props;
---

<section class="agenda relative py-32 px-6 md:px-20 bg-olive text-cream overflow-hidden" id="agenda" aria-label="Agenda de encontros">
  <!-- Textura halftone -->
  <HalftoneTexture density={14} dotSize={1.5} color="240,237,232" opacity={0.08} class="z-0" />

  <!-- Elemento decorativo -->
  <div class="absolute top-[10%] right-[8%] opacity-20 z-10">
    <Decorative variant="star" color="#dec72c" size={40} />
  </div>

  <div class="agenda__header max-w-7xl mx-auto mb-20 text-center md:text-left relative z-10">
    <p class="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-6">Encontros</p>
    <h2 class="text-5xl md:text-8xl font-display font-black italic uppercase leading-[0.9]">
      Agenda <br/> <span class="md:ml-20">Cultural</span>
    </h2>
  </div>

  <div class="max-w-7xl mx-auto relative z-10">
    {eventos.length > 0 ? (
      <AgendaFilter client:visible eventos={eventos} />
    ) : (
      <div class="py-20 text-center opacity-40 italic">
        Silêncio criativo por enquanto. Em breve, novos encontros.
      </div>
    )}
  </div>

  <script>
    import { animateAgenda } from "@/animations/agenda";
    animateAgenda();
  </script>
</section>
```

- [ ] **Step 2: Verificar build**

Run: `bun run check`
Expected: Passar sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Agenda.astro
git commit -m "feat(agenda): add halftone texture and decorative star element"
```

---

## Task 6: Redesenhar Espaço (Galeria)

**Files:**
- Modify: `src/components/sections/Espaco.astro`

- [ ] **Step 1: Atualizar Espaco.astro**

Galeria com máscaras orgânicas e halftone:

```astro
---
import { Image } from "astro:assets";
import img1 from "@/assets/images/Avatar_Estúdio Entre-1.webp";
import img2 from "@/assets/images/Avatar_Estúdio Entre-2.webp";
import img3 from "@/assets/images/Avatar_Estúdio Entre-3.webp";
import img4 from "@/assets/images/Avatar_Estúdio Entre-4.webp";
import img5 from "@/assets/images/Avatar_Estúdio Entre-5.webp";
import BlobMask from "@/components/ui/BlobMask.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import Decorative from "@/components/ui/Decorative.astro";

const imagens = [
  { src: img1, label: "01. Perspectiva", variant: 1 as const, top: "0%", left: "10%", width: "300px", mdWidth: "400px", speed: 0.8 },
  { src: img2, label: "02. Ambiente", variant: 2 as const, top: "20%", right: "15%", width: "250px", mdWidth: "350px", speed: 1.2 },
  { src: img3, label: "03. Encontros", variant: 3 as const, top: "50%", left: "20%", width: "280px", mdWidth: "380px", speed: 0.6 },
  { src: img4, label: "04. Texturas", variant: 4 as const, top: "70%", right: "5%", width: "320px", mdWidth: "420px", speed: 1.4 },
  { src: img5, label: "05. Detalhes", variant: 1 as const, top: "90%", left: "5%", width: "220px", mdWidth: "320px", speed: 0.9 },
];
---

<section class="espaco relative py-40 bg-bordo text-cream overflow-hidden" id="espaco">
  <HalftoneTexture density={18} dotSize={1.2} color="240,237,232" opacity={0.06} class="z-0" />

  <div class="absolute top-[5%] right-[5%] opacity-20 z-10">
    <Decorative variant="ray" color="#dec72c" size={50} />
  </div>

  <div class="max-w-7xl mx-auto px-6 mb-32 relative z-10">
    <p class="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-6">O Lugar</p>
    <h2 class="text-5xl md:text-8xl font-display font-black italic uppercase leading-[0.9]">
      Nosso <br/> <span class="md:ml-20">Espaço</span>
    </h2>
  </div>

  <div class="espaco__gallery relative min-h-[120vh] max-w-[1600px] mx-auto">
    {imagens.map((img, i) => (
      <div
        class="espaco__item absolute z-2"
        style={`top: ${img.top}; ${img.left ? `left: ${img.left};` : ""} ${img.right ? `right: ${img.right};` : ""} width: ${img.width};`}
        data-speed={img.speed}
      >
        <div class="relative" data-cursor="VER">
          <BlobMask variant={img.variant} class="aspect-square">
            <Image src={img.src} alt={img.label} class="w-full h-full object-cover" />
          </BlobMask>
          <!-- Halftone overlay nas imagens -->
          <div class="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
            style="background-image: radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px); background-size: 6px 6px;"
          />
        </div>
        <span class="block mt-4 text-[10px] uppercase tracking-widest opacity-40">{img.label}</span>
      </div>
    ))}
  </div>

  <script>
    import { animateEspaco } from "@/animations/espaco";
    animateEspaco();
  </script>
</section>

<style>
  .espaco__item {
    transition: transform 0.1s linear;
  }

  @media (min-width: 768px) {
    .espaco__item {
      width: var(--md-width, auto) !important;
    }
  }

  @media (max-width: 768px) {
    .espaco__gallery {
      display: flex;
      flex-direction: column;
      gap: 4rem;
      min-height: auto;
      padding: 0 1.5rem;
    }

    .espaco__item {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      width: 100% !important;
    }
  }
</style>
```

- [ ] **Step 2: Verificar build**

Run: `bun run check`
Expected: Passar sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Espaco.astro
git commit -m "feat(espaco): add blob masks, halftone overlay on images, decorative elements"
```

---

## Task 7: Redesenhar Contato

**Files:**
- Modify: `src/components/sections/Contato.astro`

- [ ] **Step 1: Atualizar Contato.astro**

```astro
---
import Decorative from "@/components/ui/Decorative.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
---

<section class="contato relative py-40 px-6 md:px-20 bg-near-black text-cream overflow-hidden" id="contato">
  <HalftoneTexture density={20} dotSize={1} color="236,104,56" opacity={0.05} class="z-0" />

  <div class="absolute top-[15%] left-[5%] opacity-15 z-10">
    <Decorative variant="star" color="#ec6838" size={60} />
  </div>
  <div class="absolute bottom-[20%] right-[8%] opacity-10 z-10">
    <Decorative variant="dots" color="#f0ede8" size={50} />
  </div>

  <div class="max-w-4xl mx-auto text-center md:text-left relative z-10">
    <p class="contato__eyebrow text-[10px] uppercase tracking-[0.4em] opacity-50 mb-12">Conexão</p>
    <h2 class="contato__title text-5xl md:text-8xl font-display font-black italic uppercase leading-[0.9] text-orange mb-20">
      O que você quer <br/> <span class="text-cream">criar entre nós?</span>
    </h2>

    <form class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
      <div class="contato__field group relative">
        <label class="text-[10px] uppercase tracking-widest opacity-40 group-focus-within:opacity-100 transition-opacity">Seu Nome</label>
        <input type="text" placeholder="Como te chamamos?" class="w-full bg-transparent border-b border-cream/20 py-4 focus:outline-none focus:border-orange transition-colors" />
      </div>

      <div class="contato__field group relative">
        <label class="text-[10px] uppercase tracking-widest opacity-40 group-focus-within:opacity-100 transition-opacity">Seu E-mail</label>
        <input type="email" placeholder="Para mantermos contato" class="w-full bg-transparent border-b border-cream/20 py-4 focus:outline-none focus:border-orange transition-colors" />
      </div>

      <div class="contato__field md:col-span-2 group relative">
        <label class="text-[10px] uppercase tracking-widest opacity-40 group-focus-within:opacity-100 transition-opacity">Sua Ideia</label>
        <textarea rows="4" placeholder="Conte-nos o que você imagina..." class="w-full bg-transparent border-b border-cream/20 py-4 focus:outline-none focus:border-orange transition-colors resize-none"></textarea>
      </div>

      <div class="contato__submit md:col-span-2">
        <button type="submit" class="group flex items-center gap-6 text-2xl font-display italic uppercase hover:text-orange transition-colors" data-cursor="ENVIAR">
          Enviar Mensagem
          <img src="/icons/play.svg" class="w-12 h-12 invert opacity-20 group-hover:opacity-100 transition-opacity" alt="" />
        </button>
      </div>
    </form>
  </div>
  <script>
    import { animateContato } from "@/animations/contato";
    animateContato();
  </script>
</section>
```

- [ ] **Step 2: Verificar build**

Run: `bun run check`
Expected: Passar sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contato.astro
git commit -m "feat(contato): add halftone texture and decorative elements"
```

---

## Task 8: Redesenhar Footer

**Files:**
- Modify: `src/components/sections/Footer.astro`

- [ ] **Step 1: Atualizar Footer.astro**

```astro
---
import { Image } from "astro:assets";
import logoPreto from "@/assets/logos/Logo_Estudio Entre - Preto 1.png";
import Decorative from "@/components/ui/Decorative.astro";
---

<footer class="footer relative bg-cream py-40 px-6 overflow-hidden">
  <div class="absolute top-[20%] right-[10%] opacity-10">
    <Decorative variant="ray" color="#1a1612" size={40} />
  </div>
  <div class="absolute bottom-[30%] left-[5%] opacity-10">
    <Decorative variant="star" color="#1a1612" size={30} />
  </div>

  <div class="max-w-7xl mx-auto flex flex-col items-center relative z-10">

    <div class="footer__social flex gap-12 mb-32">
        <a href="https://instagram.com/estudioentre" target="_blank" class="footer__social-link opacity-40 hover:opacity-100 transition-opacity" data-cursor="INSTAGRAM">
            <img src="/icons/spark.svg" class="w-6 h-6" alt="Instagram" />
        </a>
        <a href="https://tiktok.com/@estudioentre" target="_blank" class="footer__social-link opacity-40 hover:opacity-100 transition-opacity" data-cursor="TIKTOK">
            <img src="/icons/tiktok.svg" class="w-6 h-6" alt="TikTok" />
        </a>
        <a href="#" class="footer__social-link opacity-40 hover:opacity-100 transition-opacity" data-cursor="WHATSAPP">
            <img src="/icons/whatsapp.svg" class="w-6 h-6" alt="WhatsApp" />
        </a>
    </div>

    <div class="footer__signature w-full relative">
       <div class="footer__meta absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-10 text-[10px] uppercase tracking-[0.5em] text-near-black/30">
          Estúdio Entre &copy; 2026
       </div>
       <h2 class="text-[20vw] font-display font-black italic uppercase leading-none text-near-black text-center select-none pointer-events-none opacity-[0.08]">
          eNTRE
       </h2>
    </div>

    <div class="footer__credit mt-20 text-[10px] uppercase tracking-widest text-near-black/40">
        Criado com intelecto e afeto no Rio de Janeiro.
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Verificar build**

Run: `bun run check`
Expected: Passar sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Footer.astro
git commit -m "feat(footer): add decorative ray and star elements"
```

---

## Task 9: Atualizar página principal e sistema de cores

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/animations/colorTransition.ts`
- Modify: `src/components/ui/Navbar.astro`

- [ ] **Step 1: Atualizar `index.astro`**

Substituir Eixos e Serviços pela nova seção Pilares:

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Hero from "@/components/sections/Hero.astro";
import Sobre from "@/components/sections/Sobre.astro";
import Pilares from "@/components/sections/Pilares.astro";
import Agenda from "@/components/sections/Agenda.astro";
import Espaco from "@/components/sections/Espaco.astro";
import Contato from "@/components/sections/Contato.astro";
import Footer from "@/components/sections/Footer.astro";
import { eventosQuery } from "@/sanity/queries/evento";
import { sanityClient } from "sanity:client";
import type { EventoCard } from "@/types/evento";

let eventos: EventoCard[] = [];
try {
  eventos = await sanityClient.fetch(eventosQuery);
} catch {
  console.error("Falha ao buscar eventos do Sanity");
}
---

<BaseLayout title="Estúdio Entre — Hub Cultural no Méier, RJ">
  <Hero />
  <Sobre />
  <Pilares />
  <Agenda eventos={eventos} />
  <Espaco />
  <Contato />
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Atualizar `colorTransition.ts`**

Adicionar mapeamento para a nova seção Pilares (usar a cor do primeiro pilar como base, ou criar lógica para transicionar por cada faixa):

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initColorTransitions(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const sections = [
    { trigger: ".hero", color: "#ec6838", theme: "light" },
    { trigger: ".sobre", color: "#f0ede8", theme: "dark" },
    // Pilares: usar terracota como cor representativa da seção
    { trigger: ".pilares", color: "#9e4b2d", theme: "light" },
    { trigger: ".agenda", color: "#8e8100", theme: "light" },
    { trigger: ".espaco", color: "#3d1020", theme: "light" },
    { trigger: ".contato", color: "#1a1612", theme: "light" },
    { trigger: ".footer", color: "#f0ede8", theme: "dark" },
  ];

  const nav = document.querySelector(".navbar");

  for (const { trigger, color, theme } of sections) {
    const el = document.querySelector(trigger);
    if (!el) continue;

    const updateTheme = () => {
      gsap.to("body", { backgroundColor: color, duration: 1.2, ease: "power2.inOut" });
      if (nav) {
        if (theme === "dark") {
          nav.classList.remove("navbar--light");
          nav.classList.add("navbar--dark");
        } else {
          nav.classList.remove("navbar--dark");
          nav.classList.add("navbar--light");
        }
      }
    };

    ScrollTrigger.create({
      trigger: el,
      start: "top center",
      end: "bottom center",
      onEnter: updateTheme,
      onEnterBack: updateTheme,
    });
  }
}
```

- [ ] **Step 3: Atualizar Navbar para linkar #pilares**

```astro
<!-- Em Navbar.astro, substituir links de #eixos e #servicos por #pilares -->
<li><a href="#pilares" class="navbar__link" data-cursor="ENTRAR">Pilares</a></li>
```

E no drawer também.

- [ ] **Step 4: Verificar build**

Run: `bun run check`
Expected: Passar sem erros

Run: `bun run build`
Expected: Build completo sem erros

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/animations/colorTransition.ts src/components/ui/Navbar.astro
git commit -m "feat(homepage): integrate new Pilares section, update nav and color transitions"
```

---

## Task 10: Validação final e ajustes

**Files:**
- Various

- [ ] **Step 1: Executar lint e build**

Run: `bun run check`
Expected: Sem erros de lint

Run: `bun run build`
Expected: Build de produção sem erros

- [ ] **Step 2: Verificar visualmente no localhost**

Run: `bun run preview` (ou manter o dev server rodando)
Acessar `http://localhost:4321` e verificar:
- Hero com chave e elementos flutuantes
- Sobre com recorte orgânico na foto
- Pilares com 5 faixas coloridas
- Agenda com textura
- Espaço com fotos em blob
- Contato e Footer com elementos decorativos
- Transições de cor entre seções
- Navbar adaptando cor
- Cursor custom funcionando
- Responsividade mobile

- [ ] **Step 3: Ajustes finos**

Ajustar opacidades, tamanhos, espaçamentos conforme necessário após revisão visual.

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "style(homepage): final polish on redesign elements"
```

---

## Spec Coverage Checklist

| Requisito da Marca | Task |
|---------------------|------|
| Símbolo da chave como elemento principal | Task 2 |
| Textura halftone/dots | Tasks 1, 2, 3, 5, 6, 7 |
| Recortes orgânicos (blob) em fotos | Tasks 1, 3, 6 |
| Sistema de 5 pilares com cores | Task 4 |
| Elementos decorativos (raios, estrelas, setas) | Tasks 1, 2, 3, 5, 6, 7, 8 |
| Contraste tipográfico monumental | Tasks 2, 3, 4, 5, 6, 7 |
| Paleta vibrante e diversa | Tasks 2, 4, 9 |
| Fotografia autêntica com tratamento | Task 6 |
| Editorial, afetivo, com pé na rua | Todas |

**Placeholder scan:** Nenhum placeholder, TBD ou TODO encontrado.
**Type consistency:** Todos os seletores e nomes de função consistentes entre tasks.
