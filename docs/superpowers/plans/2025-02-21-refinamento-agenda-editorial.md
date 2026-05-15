# Refinamento Editorial da Agenda Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refinar a página de agenda com uma estética editorial sofisticada, formas orgânicas (rounded), sombras suaves e navegação por timeline minimalista.

**Architecture:** Astro + React (Islands). Uso de Tailwind CSS para o estilo "Magazine" (arredondamento 40px, sombras profundas e suaves) e GSAP para animações de entrada elegantes.

**Tech Stack:** React, Astro, Tailwind CSS, GSAP.

---

### Task 1: Background e Textura Ultra-Sutil

**Files:**
- Create: `src/components/ui/NoiseTexture.astro`
- Modify: `src/pages/agenda.astro`

- [ ] **Step 1: Criar o componente NoiseTexture**

```astro
---
interface Props {
  opacity?: number;
}
const { opacity = 0.05 } = Astro.props;
---
<div 
  class="pointer-events-none absolute inset-0 z-0 h-full w-full"
  style={`opacity: ${opacity}; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");`}
></div>
```

- [ ] **Step 2: Aplicar NoiseTexture e ajustar o header em agenda.astro**

```astro
---
// ... imports
import NoiseTexture from "@/components/ui/NoiseTexture.astro";
// ...
---
<BaseLayout ...>
  <main class="relative min-h-screen overflow-hidden bg-cream px-6 pb-24 pt-32 text-forest md:px-16 md:pt-40">
    <HalftoneTexture density={12} dotSize={1} color="29,67,44" opacity={0.03} class="z-0" />
    <NoiseTexture opacity={0.08} />
    
    <!-- ... decorative assets ... -->

    <div class="relative z-10 mx-auto max-w-[1300px]">
      <header class="mb-12 max-w-4xl md:mb-20">
        <p class="font-display text-[11px] font-black uppercase tracking-[0.4em] text-forest/40">
          Encontros & Vivências
        </p>
        <h1 class="mt-6 font-display text-[clamp(3.5rem,10vw,8.5rem)] font-black uppercase leading-[0.8] text-forest">
          Agenda<br />
          <span class="text-orange">cultural</span>
        </h1>
        <p class="mt-8 max-w-xl text-base leading-relaxed text-forest/60 md:text-lg">
          Explore os próximos encontros do Estúdio Entre por mês, categoria ou palavra-chave.
        </p>
      </header>
      <!-- ... -->
    </div>
  </main>
</BaseLayout>
```

---

### Task 2: Timeline de Meses Minimalista

**Files:**
- Modify: `src/components/islands/AgendaPageFilter.tsx`

- [ ] **Step 1: Implementar o slider horizontal de meses**

Remover o `select` e botões antigos. Criar a pílula de navegação minimalista.

```tsx
// No retorno do AgendaPageFilter
<div className="mb-12 flex items-center justify-between border-b border-forest/10 pb-6 overflow-x-auto no-scrollbar scroll-smooth">
  <div className="flex gap-10 md:gap-16 px-2">
    {monthKeys.map((month) => (
      <button
        key={month}
        type="button"
        onClick={() => setSelectedMonth(month)}
        className={`group relative pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap
          ${selectedMonth === month ? "text-forest" : "text-forest/25 hover:text-forest/50"}`}
      >
        {formatMonthLabel(month)}
        <div 
          className={`absolute bottom-[-1px] left-0 h-[2px] w-full bg-orange transition-transform duration-500
            ${selectedMonth === month ? "scale-x-100" : "scale-x-0 group-hover:scale-x-30"}`} 
        />
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Refinar o layout dos filtros (Search e Category)**

Usar bordas finas e sombras suaves nos filtros.

```tsx
<div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
  <div className="relative max-w-md">
    <input
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Pesquisar..."
      className="w-full border-b border-forest/20 bg-transparent py-3 text-sm text-forest outline-none transition-colors focus:border-orange placeholder:text-forest/30"
    />
  </div>
  <nav className="flex flex-wrap gap-2">
    {/* Botões de categoria com rounded-full, border sutil e cores suaves */}
  </nav>
</div>
```

---

### Task 3: Redesign do Event Card (Estilo Editorial)

**Files:**
- Modify: `src/components/islands/AgendaPageFilter.tsx`

- [ ] **Step 1: Ajustar o indicador de data (Tipografia Focada)**

Remover o bloco sólido de cor. Usar hierarquia tipográfica.

```tsx
<div className="md:sticky md:top-32 md:self-start py-4">
  <div className="flex flex-col items-center md:items-start">
    <span className="font-display text-7xl font-black leading-none text-forest">
      {formatDay(date)}
    </span>
    <span className="mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-forest/40">
      {formatWeekday(date)}
    </span>
  </div>
</div>
```

- [ ] **Step 2: Aplicar o estilo orgânico e Premium no card**

```tsx
<article
  key={evento._id}
  className="event-card group relative overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-forest/5 transition-all duration-500 hover:shadow-forest/10 hover:-translate-y-1 md:flex"
>
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] md:aspect-auto md:w-[320px] lg:w-[380px]">
    {/* Imagem com zoom sutil no hover */}
    <img src={...} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
    {/* Badge flutuante elegante */}
  </div>
  
  <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
    <div className="flex items-center gap-3">
       {/* Badge de categoria minimalista */}
       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-forest/40">
         {formatHour(getEventoDate(evento))}
       </span>
    </div>
    <h2 className="mt-6 font-display text-4xl font-black uppercase leading-[0.9] text-forest lg:text-5xl">
      {evento.titulo}
    </h2>
    {/* ... descrição expansível e botões ... */}
  </div>
</article>
```

---

### Task 4: Animações GSAP (Reveal Suave)

**Files:**
- Modify: `src/components/islands/AgendaPageFilter.tsx`
- Modify: `src/pages/agenda.astro`

- [ ] **Step 1: Implementar entrada em cascata com GSAP**

```tsx
useLayoutEffect(() => {
  if (!containerRef.current) return;
  const cards = containerRef.current.querySelectorAll(".event-card");
  
  gsap.fromTo(cards, 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power4.out", clearProps: "all" }
  );
}, [selectedMonth, activeCategory, search]);
```

- [ ] **Step 2: Animar assets decorativos em agenda.astro**

```javascript
gsap.to(".decorative-asset", {
  y: "random(-10, 10)",
  duration: "random(4, 6)",
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});
```

---

### Task 5: Validação e Ajustes Finais

- [ ] **Step 1: Verificar responsividade em telas muito pequenas (mobile)**
- [ ] **Step 2: Garantir que o scroll do slider de meses seja suave**
- [ ] **Step 3: Build final e verificação de performance**

Run: `npm run build`
Expected: Sucesso sem erros.
