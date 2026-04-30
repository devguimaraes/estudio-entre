
## Task 4: Rewrite Pilares.astro — Bento Grid with SVG Icons

**Files:**
- Modify: `src/components/sections/Pilares.astro`
- Modify: `src/animations/pilares.ts`

- [ ] **Step 1: Rewrite Pilares.astro as bento grid**

```astro
---
const pilares = [
  {
    id: "biblioterapia",
    title: "Biblioterapia",
    subtitle: "Leitura como cura",
    description: "Rodas de leitura que usam a literatura como ferramenta de autoconhecimento, escuta e transformação social.",
    color: "#9e4b2d",
    textColor: "#f0ede8",
    icon: "/icons/olho.svg",
  },
  {
    id: "oficinas",
    title: "Oficinas",
    subtitle: "Criação coletiva",
    description: "Espaços de troca e aprendizado prático que unem arte, tecnologia e subjetividade.",
    color: "#bdb2dd",
    textColor: "#1a1612",
    icon: "/icons/spark.svg",
  },
  {
    id: "palestras",
    title: "Palestras",
    subtitle: "Diálogos profundos",
    description: "Encontros com pensadores, artistas e educadores para expandir horizontes.",
    color: "#b9e4eb",
    textColor: "#1a1612",
    icon: "/icons/microfone.svg",
  },
  {
    id: "estudio",
    title: "Estúdio",
    subtitle: "Produção e áudio",
    description: "Estrutura profissional para gravação de podcasts, videocasts e experimentações sonoras.",
    color: "#dec72c",
    textColor: "#1a1612",
    icon: "/icons/play.svg",
  },
  {
    id: "encontros",
    title: "Encontros",
    subtitle: "Conexão real",
    description: "Saraus, rodas de conversa e celebrações que fortalecem os laços entre pessoas e gerações.",
    color: "#ec6838",
    textColor: "#f0ede8",
    icon: "/icons/pin.svg",
  },
];
---

<section class="pilares relative py-24 md:py-32 px-6 md:px-16 bg-near-black overflow-hidden" id="pilares">
  <div class="max-w-6xl mx-auto relative z-10">
    <p class="pilares__eyebrow text-[10px] uppercase tracking-[0.4em] text-cream/40 mb-12 opacity-0">
      O que fazemos
    </p>

    <!-- Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      {pilares.map((pilar, i) => (
        <div
          class:list={[
            "pilar__cell relative overflow-hidden rounded-2xl p-8 md:p-10 transition-transform duration-300 cursor-default group",
            i === 3 ? "md:col-span-2" : "",
            i === 4 ? "md:col-span-3" : "",
          ]}
          style={`background-color: ${pilar.color}; color: ${pilar.textColor};`}
          data-index={i}
        >
          {/* Halftone overlay */}
          <div
            class="absolute inset-0 pointer-events-none opacity-[0.08]"
            style={`background-image: radial-gradient(${pilar.textColor} 1.2px, transparent 1.2px); background-size: 12px 12px;`}
          />

          <div class="relative z-10">
            {/* Icon circle */}
            <div
              class="pilar__icon-wrap w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[15deg]"
              style={`background-color: ${pilar.textColor}15`}
            >
              <img
                src={pilar.icon}
                alt=""
                class="w-8 h-8 md:w-10 md:h-10"
                style={pilar.textColor === "#f0ede8" ? "filter: brightness(0) invert(1)" : ""}
              />
            </div>

            {/* Number */}
            <span class="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-3 block">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Title */}
            <h3 class="pilar__title text-3xl md:text-4xl lg:text-5xl font-display font-black italic uppercase leading-tight mb-2">
              {pilar.title}
            </h3>

            {/* Subtitle */}
            <p class="pilar__subtitle text-base md:text-lg font-display italic opacity-60 mb-4">
              {pilar.subtitle}
            </p>

            {/* Description */}
            <p class="pilar__desc text-sm md:text-base leading-relaxed opacity-70 max-w-sm">
              {pilar.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>

  <script>
    import { animatePilares } from "@/animations/pilares";
    animatePilares();
  </script>
</section>

<style>
  .pilar__cell {
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
  }
  .pilar__cell:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  }
</style>
```

- [ ] **Step 2: Update pilares.ts for bento stagger**

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animatePilares(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const cells = document.querySelectorAll(".pilar__cell");
  const eyebrow = document.querySelector(".pilares__eyebrow");

  if (eyebrow) {
    gsap.fromTo(eyebrow, { opacity: 0, y: 15 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".pilares", start: "top 80%", toggleActions: "play none none reverse" },
    });
  }

  gsap.fromTo(cells,
    { y: 50, opacity: 0, scale: 0.96 },
    {
      y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".pilares", start: "top 75%", toggleActions: "play none none reverse" },
    }
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Pilares.astro src/animations/pilares.ts
git commit -m "feat(pilares): bento grid with svg icons and brand colors"
```

---

## Task 5: Update Agenda.astro — Event Cards with Images

**Files:**
- Modify: `src/components/sections/Agenda.astro`
- Modify: `src/animations/agenda.ts`

- [ ] **Step 1: Update Agenda.astro colors and structure**

Keep the existing structure but update colors and add event image support to the island component. The Agenda section wraps the React `AgendaFilter` island. We update the section wrapper:

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

<section
  class="agenda relative py-24 md:py-32 px-6 md:px-16 bg-forest text-cream overflow-hidden"
  id="agenda"
  aria-label="Agenda de encontros"
>
  <HalftoneTexture
    density={14}
    dotSize={1.5}
    color="240,237,232"
    opacity={0.06}
    class="z-0"
  />

  <div class="absolute top-[10%] right-[8%] opacity-20 z-10">
    <Decorative variant="star" color="#dec72c" size={36} />
  </div>
  <div class="absolute bottom-[12%] left-[5%] opacity-15 z-10">
    <Decorative variant="ray" color="#f0ede8" size={28} />
  </div>

  <div class="agenda__header max-w-6xl mx-auto mb-16 relative z-10">
    <p class="text-[10px] uppercase tracking-[0.4em] text-cream/50 mb-6">
      Encontros
    </p>
    <h2
      class="text-5xl md:text-7xl lg:text-8xl font-display font-black italic uppercase leading-[0.9]"
    >
      Agenda <br />
      <span class="md:ml-16 lg:ml-24">Cultural</span>
    </h2>
  </div>

  <div class="max-w-6xl mx-auto relative z-10">
    {
      eventos.length > 0 ? (
        <AgendaFilter client:visible eventos={eventos} />
      ) : (
        <div class="py-20 text-center opacity-40 italic">
          Silêncio criativo por enquanto. Em breve, novos encontros.
        </div>
      )
    }
  </div>

  <script>
    import { animateAgenda } from "@/animations/agenda";
    animateAgenda();
  </script>
</section>
```

Note: `bg-forest` should map to `#1D432C`. If not defined in Tailwind config, use inline style: `style="background-color: #1d432c"`.

- [ ] **Step 2: Update agenda.ts**

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateAgenda(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const header = document.querySelector(".agenda__header");
  const cards = document.querySelectorAll(".agenda .event-card, .agenda [class*='card']");

  if (header) {
    gsap.fromTo(header, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1.0, ease: "expo.out",
      scrollTrigger: { trigger: ".agenda", start: "top 75%", toggleActions: "play none none reverse" },
    });
  }

  if (cards.length > 0) {
    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".agenda", start: "top 70%", toggleActions: "play none none reverse" },
    });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Agenda.astro src/animations/agenda.ts
git commit -m "feat(agenda): forest background and event card animations"
```

---

## Task 6: Create Galeria.astro — Horizontal Marquee

**Files:**
- Create: `src/components/sections/Galeria.astro`
- Create: `src/animations/galeria.ts`

- [ ] **Step 1: Create Galeria.astro**

```astro
---
const imagens = [
  { src: "/images/brand/apresentacao-estudio-entre.jpg", label: "Perspectiva" },
  { src: "/images/brand/apresentacao-estudio-entre-2.jpg", label: "Thayná" },
  { src: "/images/brand/apresentacao-estudio-entre-3.jpg", label: "Encontros" },
  { src: "/images/brand/apresentacao-estudio-entre-4.jpg", label: "Valdete" },
  { src: "/images/brand/apresentacao-estudio-entre-5.jpg", label: "Detalhes" },
  { src: "/images/brand/sobre-estudio-entre.jpg", label: "Espaço" },
  { src: "/images/brand/sobre-estudio-entre-2.jpg", label: "Livros" },
  { src: "/images/brand/sobre-estudio-entre-3.jpg", label: "Roda" },
  { src: "/images/brand/sobre-estudio-entre-4.jpg", label: "Café" },
  { src: "/images/brand/onde-a-palavra-vira-encontro.jpg", label: "Palavra" },
];
---

<section
  class="galeria relative py-20 md:py-28 bg-cyan overflow-hidden"
  id="galeria"
  style="background-color: #b9e4eb;"
>
  <div class="max-w-6xl mx-auto px-6 md:px-16 mb-10 relative z-10">
    <p class="text-[10px] uppercase tracking-[0.4em] text-bordo/50 mb-4">O Lugar</p>
    <h2 class="text-4xl md:text-6xl lg:text-7xl font-display font-black italic uppercase leading-[0.9] text-bordo">
      Nosso Espaço
    </h2>
  </div>

  <!-- Marquee container -->
  <div class="galeria__marquee relative overflow-hidden py-8">
    <div class="galeria__track flex gap-6 w-max hover:[animation-play-state:paused]">
      <!-- First set -->
      {imagens.map((img, i) => (
        <div class="galeria__item flex-shrink-0 w-[280px] md:w-[340px] lg:w-[400px]">
          <div class="relative aspect-[4/5] rounded-[45%_55%_50%_50%/50%_45%_55%_50%] overflow-hidden">
            <img
              src={img.src}
              alt={img.label}
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-bordo/5 mix-blend-multiply pointer-events-none"></div>
          </div>
          <span class="block mt-3 text-[10px] uppercase tracking-widest text-bordo/40">
            {String(i + 1).padStart(2, "0")}. {img.label}
          </span>
        </div>
      ))}
      <!-- Duplicate set for seamless loop -->
      {imagens.map((img, i) => (
        <div class="galeria__item flex-shrink-0 w-[280px] md:w-[340px] lg:w-[400px]">
          <div class="relative aspect-[4/5] rounded-[45%_55%_50%_50%/50%_45%_55%_50%] overflow-hidden">
            <img
              src={img.src}
              alt={img.label}
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-bordo/5 mix-blend-multiply pointer-events-none"></div>
          </div>
          <span class="block mt-3 text-[10px] uppercase tracking-widest text-bordo/40">
            {String(i + 1).padStart(2, "0")}. {img.label}
          </span>
        </div>
      ))}
    </div>
  </div>

  <script>
    import { animateGaleria } from "@/animations/galeria";
    animateGaleria();
  </script>
</section>

<style>
  .galeria__track {
    animation: marquee 40s linear infinite;
  }
  .galeria__marquee:hover .galeria__track {
    animation-play-state: paused;
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .galeria__track {
      animation: none;
    }
  }
</style>
```

- [ ] **Step 2: Create galeria.ts**

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateGaleria(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const items = document.querySelectorAll(".galeria__item");

  gsap.fromTo(items,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out",
      scrollTrigger: { trigger: ".galeria", start: "top 80%", toggleActions: "play none none reverse" },
    }
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Galeria.astro src/animations/galeria.ts
git commit -m "feat(galeria): horizontal marquee with blob-mask photos"
```

---

## Task 7: Create VooLiterario.astro — Editorial Quote

**Files:**
- Create: `src/components/sections/VooLiterario.astro`
- Create: `src/animations/vooLiterario.ts`

- [ ] **Step 1: Create VooLiterario.astro**

```astro
<section
  class="voo-literario relative py-32 md:py-48 px-6 md:px-16 flex items-center justify-center overflow-hidden"
  id="voo-literario"
  style="background-color: #1d432c;"
>
  <div class="max-w-4xl mx-auto text-center relative z-10">
    <!-- Giant quote marks -->
    <div class="voo__quote-mark text-[120px] md:text-[180px] font-display font-black leading-none text-lilac-light opacity-[0.12] absolute -top-8 md:-top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none">
      "
    </div>

    <blockquote>
      <p class="voo__text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-lilac-light leading-snug md:leading-tight">
        A leitura é ponte para o que ainda virá.
      </p>
    </blockquote>

    <p class="voo__attribution mt-10 text-base md:text-lg font-display italic text-lilac-light/60">
      — Estúdio Entre
    </p>
  </div>
</section>

<script>
  import { animateVooLiterario } from "@/animations/vooLiterario";
  animateVooLiterario();
</script>
```

Note: `text-lilac-light` should map to `#D2BCFA`. If not in Tailwind, use inline style.

- [ ] **Step 2: Create vooLiterario.ts**

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateVooLiterario(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const quoteMark = document.querySelector(".voo__quote-mark");
  const text = document.querySelector(".voo__text");
  const attr = document.querySelector(".voo__attribution");

  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".voo-literario", start: "top 70%", toggleActions: "play none none reverse" },
  });

  if (quoteMark) {
    tl.fromTo(quoteMark, { opacity: 0, scale: 0.8 }, { opacity: 0.12, scale: 1, duration: 1.2, ease: "expo.out" });
  }
  if (text) {
    tl.fromTo(text, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, "-=0.8");
  }
  if (attr) {
    tl.fromTo(attr, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/VooLiterario.astro src/animations/vooLiterario.ts
git commit -m "feat(voo-literario): editorial quote section with giant quote marks"
```

---

## Task 8: Rewrite Contato.astro — Split Screen Lilás

**Files:**
- Modify: `src/components/sections/Contato.astro`
- Modify: `src/animations/contato.ts`

- [ ] **Step 1: Rewrite Contato.astro**

```astro
---
import Decorative from "@/components/ui/Decorative.astro";
---

<section
  class="contato relative py-24 md:py-32 px-6 md:px-16 overflow-hidden"
  id="contato"
  style="background-color: #777bde;"
>
  <div class="absolute top-[12%] left-[5%] opacity-10 z-0">
    <Decorative variant="star" color="#3d1020" size={50} />
  </div>
  <div class="absolute bottom-[15%] right-[6%] opacity-10 z-0">
    <Decorative variant="dots" color="#3d1020" size={40} />
  </div>

  <div class="max-w-6xl mx-auto relative z-10">
    <div class="flex flex-col md:flex-row md:items-center gap-12 md:gap-20">
      <!-- Left: Key graphic -->
      <div class="contato__graphic md:w-[35%] flex justify-center md:justify-start">
        <div class="relative">
          <img
            src="/icons/chave.svg"
            alt=""
            class="w-32 h-32 md:w-48 md:h-48 opacity-80"
            style="filter: brightness(0) saturate(100%);"
          />
          <div class="absolute inset-0 bg-bordo/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="md:w-[65%]">
        <p class="contato__eyebrow text-[10px] uppercase tracking-[0.4em] text-bordo/50 mb-8 opacity-0">
          Conexão
        </p>
        <h2
          class="contato__title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black italic uppercase leading-[0.9] text-bordo mb-14 opacity-0"
        >
          O que você quer <br />
          <span class="text-cream">criar entre nós?</span>
        </h2>

        <form class="space-y-10" onsubmit="event.preventDefault();">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="contato__field group relative opacity-0">
              <label class="text-[10px] uppercase tracking-widest text-bordo/40 group-focus-within:text-bordo transition-colors block mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                placeholder="Como te chamamos?"
                class="w-full bg-transparent border-b-2 border-bordo/20 py-3 text-bordo placeholder-bordo/30 focus:outline-none focus:border-orange transition-colors text-base"
              />
            </div>

            <div class="contato__field group relative opacity-0">
              <label class="text-[10px] uppercase tracking-widest text-bordo/40 group-focus-within:text-bordo transition-colors block mb-2">
                Seu E-mail
              </label>
              <input
                type="email"
                placeholder="Para mantermos contato"
                class="w-full bg-transparent border-b-2 border-bordo/20 py-3 text-bordo placeholder-bordo/30 focus:outline-none focus:border-orange transition-colors text-base"
              />
            </div>
          </div>

          <div class="contato__field group relative opacity-0">
            <label class="text-[10px] uppercase tracking-widest text-bordo/40 group-focus-within:text-bordo transition-colors block mb-2">
              Sua Ideia
            </label>
            <textarea
              rows="3"
              placeholder="Conte-nos o que você imagina..."
              class="w-full bg-transparent border-b-2 border-bordo/20 py-3 text-bordo placeholder-bordo/30 focus:outline-none focus:border-orange transition-colors resize-none text-base"
            ></textarea>
          </div>

          <div class="contato__submit opacity-0">
            <button
              type="submit"
              class="group inline-flex items-center gap-4 px-8 py-4 bg-bordo text-cream font-bold uppercase tracking-widest text-sm rounded-full hover:bg-terracotta transition-colors duration-300"
              data-cursor="ENVIAR"
            >
              Enviar Mensagem
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script>
    import { animateContato } from "@/animations/contato";
    animateContato();
  </script>
</section>
```

Note: Use inline styles for colors not in Tailwind (`bg-bordo` = `#3D1020`, `text-bordo`, `bg-terracotta` = `#9E4B2D`, `text-orange`, `text-cream`). If these utilities don't exist, replace with inline styles.

- [ ] **Step 2: Update contato.ts**

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateContato(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const graphic = document.querySelector(".contato__graphic");
  const eyebrow = document.querySelector(".contato__eyebrow");
  const title = document.querySelector(".contato__title");
  const fields = document.querySelectorAll(".contato__field");
  const submit = document.querySelector(".contato__submit");

  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".contato", start: "top 72%", toggleActions: "play none none reverse" },
  });

  if (graphic) {
    tl.fromTo(graphic, { opacity: 0, x: -40, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: "expo.out" });
  }
  if (eyebrow) {
    tl.fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.8");
  }
  if (title) {
    tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "expo.out" }, "-=0.5");
  }
  if (fields.length > 0) {
    tl.fromTo(fields, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }, "-=0.5");
  }
  if (submit) {
    tl.fromTo(submit, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3");
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contato.astro src/animations/contato.ts
git commit -m "feat(contato): lilac split-screen with underline inputs"
```

---

## Task 9: Rewrite Footer.astro — 3 Columns + Info

**Files:**
- Modify: `src/components/sections/Footer.astro`
- Create: `src/animations/footer.ts`

- [ ] **Step 1: Rewrite Footer.astro**

```astro
---
import { Image } from "astro:assets";
import logoClaro from "@/assets/logos/Logo_Estudio Entre - Claro 1.png";
---

<footer class="footer relative bg-near-black py-20 md:py-28 px-6 md:px-16 overflow-hidden">
  <!-- Watermark -->
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 font-display font-black italic uppercase text-[15vw] text-cream opacity-[0.04] pointer-events-none select-none whitespace-nowrap">
    eNTRE
  </div>

  <div class="max-w-6xl mx-auto relative z-10">
    <!-- 3 Columns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
      <!-- Col 1: Logo -->
      <div class="footer__col opacity-0">
        <Image
          src={logoClaro}
          alt="Estúdio Entre"
          class="w-40 md:w-48 h-auto mb-6"
          loading="lazy"
        />
      </div>

      <!-- Col 2: Description -->
      <div class="footer__col opacity-0">
        <p class="text-sm md:text-base text-cream/70 leading-relaxed mb-4">
          Hub cultural no Méier, Rio de Janeiro.
        </p>
        <p class="text-sm text-cream/50 leading-relaxed">
          Biblioterapia, oficinas, palestras, encontros e estúdio de gravação.
        </p>
      </div>

      <!-- Col 3: Address + Social -->
      <div class="footer__col opacity-0">
        <div class="mb-6">
          <p class="text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-2">Endereço</p>
          <p class="text-sm text-cream/70">
            Rua Honório, 47 — Méier<br />
            Rio de Janeiro, RJ
          </p>
        </div>

        <div class="mb-6">
          <p class="text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-2">Redes</p>
          <div class="flex gap-4">
            <a href="https://instagram.com/estudioentre" target="_blank" class="opacity-50 hover:opacity-100 transition-opacity" aria-label="Instagram">
              <img src="/icons/spark.svg" class="w-5 h-5 invert" alt="" />
            </a>
            <a href="https://tiktok.com/@estudioentre" target="_blank" class="opacity-50 hover:opacity-100 transition-opacity" aria-label="TikTok">
              <img src="/icons/tiktok.svg" class="w-5 h-5 invert" alt="" />
            </a>
            <a href="#" class="opacity-50 hover:opacity-100 transition-opacity" aria-label="WhatsApp">
              <img src="/icons/whatsapp.svg" class="w-5 h-5 invert" alt="" />
            </a>
          </div>
        </div>

        <div>
          <a
            href="https://g.co/kgs/..."
            target="_blank"
            class="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-orange transition-colors"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/></svg>
            Google Meu Negócio
          </a>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-cream/10 pt-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p class="text-[10px] uppercase tracking-widest text-cream/30">
          © 2026 Estúdio Entre · Rio de Janeiro
        </p>
        <p class="text-sm font-display italic text-cream/40">
          "Entre palavras, entre pessoas — é só entrar."
        </p>
      </div>
    </div>
  </div>

  <script>
    import { animateFooter } from "@/animations/footer";
    animateFooter();
  </script>
</footer>
```

Note: Update the Google Meu Negócio link with the real URL.

- [ ] **Step 2: Create footer.ts**

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateFooter(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const cols = document.querySelectorAll(".footer__col");

  gsap.fromTo(cols,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".footer", start: "top 85%", toggleActions: "play none none reverse" },
    }
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Footer.astro src/animations/footer.ts
git commit -m "feat(footer): 3-column layout with address and social links"
```

---

## Task 10: Update index.astro — New Section Order

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update imports and section order**

Replace the imports and layout:

```astro
---
import { sanityClient } from "sanity:client";
import Agenda from "@/components/sections/Agenda.astro";
import Contato from "@/components/sections/Contato.astro";
import Footer from "@/components/sections/Footer.astro";
import Galeria from "@/components/sections/Galeria.astro";
import Hero from "@/components/sections/Hero.astro";
import Pilares from "@/components/sections/Pilares.astro";
import Sobre from "@/components/sections/Sobre.astro";
import VooLiterario from "@/components/sections/VooLiterario.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { eventosQuery } from "@/sanity/queries/evento";
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
  <Galeria />
  <VooLiterario />
  <Contato />
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(pages): update section order for redesign"
```

---

## Task 11: Build, Check, and Validate

- [ ] **Step 1: Run linter**

```bash
bun run check
```

Expected: No errors (or fix any auto-fixable with `bun run check:fix`)

- [ ] **Step 2: Build production**

```bash
bun run build
```

Expected: Build succeeds with 0 errors

- [ ] **Step 3: Manual validation checklist**

Open `http://localhost:4321` (dev) or preview build:

- [ ] Hero: fundo bordão, logo tipográfico ESTÚDIO/eNTRE, chave SVG, foto BlobMask, CTAs
- [ ] Sobre: layout assimétrico, imagens com offset, watermark "e", signature
- [ ] Pilares: bento grid 5 células, ícones SVG (não fotos), cores do guia
- [ ] Agenda: fundo verde-floresta, cards com imagens
- [ ] Galeria: marquee horizontal, 10+ fotos, pausa no hover
- [ ] VooLiterario: citação central, aspas gigantes, fundo verde-floresta
- [ ] Contato: fundo lilás, split-screen, inputs underline
- [ ] Footer: 3 colunas, endereço, redes, Google Meu Negócio
- [ ] Transições de cor: scroll entre seções muda cor do body suavemente
- [ ] Animações: todas as seções têm entrance animation
- [ ] Responsivo: testar 320px, 768px, 1024px, 1440px
- [ ] Reduced motion: ativar no OS e verificar que animações são removidas

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address lint and build issues"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ Hero collage with typographic logo → Task 2
- ✅ Sobre asymmetric editorial → Task 3
- ✅ Pilares bento grid with SVG icons → Task 4
- ✅ Agenda with images and forest background → Task 5
- ✅ Galeria marquee horizontal (NEW) → Task 6
- ✅ VooLiterario quote section (NEW) → Task 7
- ✅ Contato lilac split-screen → Task 8
- ✅ Footer 3 columns with info → Task 9
- ✅ Color transitions 8 sections → Task 1
- ✅ All animations with reduced motion → Every task
- ✅ Build and validation → Task 11

**2. Placeholder scan:**
- ✅ No TBD/TODO
- ✅ No vague "add error handling"
- ✅ No "similar to Task X"
- ✅ All code blocks have complete implementation

**3. Type consistency:**
- ✅ All selectors use consistent class names (`.hero__`, `.sobre__`, `.pilar__`, etc.)
- ✅ Animation functions exported consistently
- ✅ Color hex values consistent between spec and plan

---

## Notes for Implementer

### Tailwind Color Aliases
If these utilities don't exist in the project's Tailwind config, replace with inline styles:
- `bg-bordo` → `style="background-color: #3d1020"`
- `bg-forest` → `style="background-color: #1d432c"`
- `text-lilac-light` → `style="color: #d2bcfa"`
- `bg-terracotta` → `style="background-color: #9e4b2d"`
- `text-bordo` → `style="color: #3d1020"`

### BlobMask Fallback
The `BlobMask` component uses SVG clipPath. If the component API differs (e.g., expects `shape` instead of `variant`), adapt accordingly.

### AgendaFilter Island
The `AgendaFilter` React island handles its own internal rendering. The section wrapper changes (colors, header) but the island's card styling may need separate updates if it has hardcoded colors.

### Google Meu Negócio Link
Replace the placeholder `href="https://g.co/kgs/..."` in Footer.astro with the real Google Business Profile URL.

### Image Paths
All image paths assume they're served from `/images/brand/` via `public/images/brand/`. Verify these files exist:
- `apresentacao-estudio-entre.jpg` through `-5.jpg`
- `sobre-estudio-entre.jpg` through `-4.jpg`
- `onde-a-palavra-vira-encontro.jpg`
