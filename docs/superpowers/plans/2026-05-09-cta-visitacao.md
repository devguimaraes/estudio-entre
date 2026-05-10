# CTA de Visitação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a seção `VooLiterario` por uma nova seção de CTA informativa e acionável para agendamento de visitas, seguindo o design "Mural Informativo".

**Architecture:** Criação de um novo componente Astro autônomo com animações GSAP dedicadas. Integração direta com link externo do Google Calendar.

**Tech Stack:** Astro 6, Tailwind CSS 4, GSAP (ScrollTrigger), TypeScript.

---

### Task 1: Criar o Componente VisitacaoCTA

**Files:**
- Create: `src/components/sections/VisitacaoCTA.astro`

- [ ] **Step 1: Implementar a estrutura base do componente com Tailwind**

```astro
---
import Decorative from "@/components/ui/Decorative.astro";
---

<section
  class="visitacao-cta relative py-24 md:py-32 bg-cream overflow-hidden"
  id="agendar-visita"
>
  <!-- Decorative Frame -->
  <div class="visitacao__frame absolute inset-8 md:inset-12 border-2 border-bordo/10 pointer-events-none z-0"></div>

  <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
    <div class="visitacao__content opacity-0 translate-y-8">
      <p class="font-display font-bold text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-orange mb-6">
        Quarta a Sábado // 10h às 17h30
      </p>
      
      <h2 class="font-display font-black text-4xl md:text-7xl lg:text-8xl text-bordo uppercase leading-[0.9] mb-12">
        Visitação <br /> Estúdio Entre
      </h2>

      <div class="flex flex-col items-center gap-8">
        <a
          href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Bz-jHECZ5xwuy54rjp7tWskG334TA1hZ2nhVdiHEF95oiUmFYkbJXeirsKMVFsNBxH7drQg4t"
          target="_blank"
          rel="noopener noreferrer"
          class="visitacao__button group relative bg-bordo text-cream font-display font-bold uppercase tracking-widest text-[11px] px-12 py-6 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl"
        >
          <span class="relative z-10">Agendar minha visita</span>
          <div class="absolute inset-0 bg-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
        </a>

        <div class="visitacao__icon opacity-40">
           <Decorative variant="key" size={40} color="#3D1020" />
        </div>
      </div>
    </div>
  </div>

  <script>
    import { animateVisitacao } from "@/animations/visitacao";
    animateVisitacao();
  </script>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/VisitacaoCTA.astro
git commit -m "feat(components): add VisitacaoCTA section structure"
```

---

### Task 2: Implementar Animações GSAP

**Files:**
- Create: `src/animations/visitacao.ts`

- [ ] **Step 1: Criar a lógica de animação de entrada**

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateVisitacao(): void {
  const section = document.querySelector(".visitacao-cta");
  const content = document.querySelector(".visitacao__content");
  const frame = document.querySelector(".visitacao__frame");

  if (!section || !content || !frame) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  // Reveal frame first
  tl.fromTo(
    frame,
    { opacity: 0, scale: 0.98 },
    { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
  );

  // Fade up content
  tl.to(
    content,
    { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
    "-=0.8"
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/animations/visitacao.ts
git commit -m "feat(animations): add entry animations for VisitacaoCTA"
```

---

### Task 3: Integrar no Layout Principal

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Substituir VooLiterario por VisitacaoCTA**

```astro
// ... trocar imports
import VisitacaoCTA from "@/components/sections/VisitacaoCTA.astro";

// ... no template
<BaseLayout ...>
  <Hero />
  <Sobre />
  <Pilares />
  <Agenda eventos={eventos} />
  <Galeria />
  <VisitacaoCTA /> <!-- Nova seção aqui -->
  <Contato />
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Verificar no navegador**
Confirmar se o link do calendário funciona e se as animações disparam corretamente.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(pages): replace VooLiterario with VisitacaoCTA"
```

---

### Task 4: Limpeza

**Files:**
- Delete: `src/components/sections/VooLiterario.astro`
- Delete: `src/animations/vooLiterario.ts` (se existir)

- [ ] **Step 1: Remover arquivos órfãos**

- [ ] **Step 2: Commit final**

```bash
git rm src/components/sections/VooLiterario.astro
git commit -m "cleanup: remove unused VooLiterario component"
```
