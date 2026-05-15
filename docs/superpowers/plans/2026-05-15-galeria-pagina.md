# Página de Galeria (/galeria) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar uma página dedicada `/galeria` que exiba todas as fotos do espaço físico do Estúdio Entre em um grid masonry com lightbox, preservando a identidade visual do site.

**Architecture:** Reaproveitamos o componente `Lightbox.tsx` existente (já funcional, acessível, com navegação por teclado). Criamos uma nova island React `GaleriaMasonry.tsx` que renderiza o grid masonry com CSS columns, estilo "papel rasgado" (TornPaperFrame), e integra com o Lightbox. A página `galeria.astro` orquestra layout, texturas e SEO. Dados estáticos em `src/data/galeriaImagens.ts`.

**Tech Stack:** Astro, React (islands), TypeScript, Tailwind CSS, GSAP, existing UI components (TornPaperFrame pattern, Decorative, HalftoneTexture).

---

## File Structure

```
src/
  data/
    galeriaImagens.ts                    # NEW - Array estático de imagens
  components/
    islands/
      GaleriaMasonry.tsx                 # NEW - Grid masonry + Lightbox integration
      Lightbox.tsx                       # MODIFY - Adapt for local image paths
  pages/
    galeria.astro                        # NEW - Página principal
  components/
    ui/
      Navbar.astro                       # MODIFY - Add "Galeria" link
  components/
    islands/
      MobileNav.tsx                      # MODIFY - Add "Galeria" link
```

---

### Task 1: Criar data source das imagens

**Files:**
- Create: `src/data/galeriaImagens.ts`

- [ ] **Step 1: Criar o arquivo com todas as imagens do espaço**

```typescript
export interface GaleriaImagem {
  id: string;
  src: string;
  alt: string;
  categoria?: string;
}

export const galeriaImagens: GaleriaImagem[] = [
  { id: "1", src: "/images/espaco/v2-meier-02.webp", alt: "Acesso e Acolhimento do Estúdio Entre" },
  { id: "2", src: "/images/espaco/v2-meier-03.webp", alt: "Nossa Estrutura" },
  { id: "3", src: "/images/espaco/v2-meier-04.webp", alt: "Arte no Méier" },
  { id: "4", src: "/images/espaco/estudio-entre-salao.webp", alt: "O Hub - Salão Principal" },
  { id: "5", src: "/images/espaco/salao-estudio-entre.webp", alt: "Salão do Estúdio" },
  { id: "6", src: "/images/espaco/sala-estudio-entre.webp", alt: "Sala do Estúdio Entre" },
  { id: "7", src: "/images/espaco/som-estudio-entre.webp", alt: "Equipamento de Som" },
  { id: "8", src: "/images/espaco/exposicao-estudio-entre.webp", alt: "Exposição no Estúdio" },
  { id: "9", src: "/images/espaco/exposicao2-estudio-entre.webp", alt: "Exposição de Arte" },
  { id: "10", src: "/images/espaco/exposicao-tapecaria-estudio-entre.webp", alt: "Exposição de Tapeçaria" },
  { id: "11", src: "/images/espaco/tapecaria-logo-estudio-entre.webp", alt: "Logo da Tapeçaria" },
  { id: "12", src: "/images/espaco/tapecaria-logo-vertical-estudio-entre.webp", alt: "Logo Vertical da Tapeçaria" },
  { id: "13", src: "/images/espaco/art-logo-estudio-entre.webp", alt: "Arte e Logo" },
  { id: "14", src: "/images/espaco/apresentacao-estudio-entre.webp", alt: "Apresentação no Estúdio" },
  { id: "15", src: "/images/espaco/apresentacao-no-estudio-entre.webp", alt: "Apresentação no Espaço" },
  { id: "16", src: "/images/espaco/entre-palavras-e-afeto-estudio-entre.webp", alt: "Entre Palavras e Afeto" },
  { id: "17", src: "/images/espaco/img_0811.webp", alt: "Detalhe do Espaço" },
  { id: "18", src: "/images/espaco/img_0876.webp", alt: "Momento no Estúdio" },
  { id: "19", src: "/images/espaco/2.webp", alt: "Vista do Espaço" },
  { id: "20", src: "/images/espaco/4.webp", alt: "Ambiente do Estúdio" },
  { id: "21", src: "/images/espaco/5.webp", alt: "Espaço Cultural" },
  { id: "22", src: "/images/espaco/6.webp", alt: "Detalhes do Salão" },
  { id: "23", src: "/images/espaco/7.webp", alt: "Canto do Estúdio" },
  { id: "24", src: "/images/espaco/8.webp", alt: "Perspectiva do Espaço" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/galeriaImagens.ts
git commit -m "feat(galeria): add static image data source"
```

---

### Task 2: Adaptar Lightbox existente para imagens locais

**Files:**
- Modify: `src/components/islands/Lightbox.tsx`

O Lightbox existente adiciona query params de transformação (`?w=1200...`) às URLs, o que funciona para imagens externas (picsum) mas quebra caminhos locais (`/images/espaco/...`). Precisamos detectar URLs externas vs locais.

- [ ] **Step 1: Adicionar helper `getImageSrc` e aplicar nas duas ocorrências de `<img>`**

No topo do arquivo, após os imports, adicione:

```typescript
function getImageSrc(imagem: string, width?: number, height?: number): string {
  if (imagem.startsWith("http")) {
    const params = new URLSearchParams();
    if (width) params.set("w", String(width));
    if (height) params.set("h", String(height));
    params.set("fit", "crop");
    params.set("auto", "format");
    return `${imagem}?${params.toString()}`;
  }
  return imagem;
}
```

Substitua a primeira ocorrência de `src={`${foto.imagem}?w=1200...` (linha ~143) por:

```tsx
src={getImageSrc(foto.imagem, 1200, 900)}
```

Substitua a segunda ocorrência no `GaleriaEspaco.tsx`? Não, vamos deixar o GaleriaEspaco como está (ele é outra seção). O Lightbox é usado por quem o importar. Vamos garantir que o Lightbox funcione para qualquer consumidor.

Na verdade, o Lightbox.tsx só é usado por `GaleriaEspaco.tsx` hoje. Vamos adaptar o Lightbox para aceitar um tipo mais genérico ou manter `FotoEspaco` e adaptar `getImageSrc`.

Mantenha o tipo `FotoEspaco` e adicione o helper. As alterações no Lightbox.tsx:

```typescript
// Adicionar após os imports
function getImageSrc(imagem: string, width?: number, height?: number): string {
  if (imagem.startsWith("http")) {
    const params = new URLSearchParams();
    if (width) params.set("w", String(width));
    if (height) params.set("h", String(height));
    params.set("fit", "crop");
    params.set("auto", "format");
    return `${imagem}?${params.toString()}`;
  }
  return imagem;
}
```

E na linha do `<img>` dentro do Lightbox:

```tsx
src={getImageSrc(foto.imagem, 1200, 900)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/islands/Lightbox.tsx
git commit -m "fix(lightbox): support local image paths without transform params"
```

---

### Task 3: Criar componente GaleriaMasonry

**Files:**
- Create: `src/components/islands/GaleriaMasonry.tsx`

Este componente renderiza o grid masonry, aplica o estilo TornPaperFrame, gerencia o estado do lightbox, e anima a entrada com GSAP.

- [ ] **Step 1: Criar o arquivo completo**

```tsx
import type { GaleriaImagem } from "@/data/galeriaImagens";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import Lightbox from "./Lightbox";

gsap.registerPlugin(ScrollTrigger);

const TORN_PAPER_VARIANTS = [
  "polygon(1% 2%, 99% 1%, 98% 97%, 2% 99%)",
  "polygon(2% 1%, 98% 2%, 99% 98%, 1% 97%)",
  "polygon(1% 1%, 97% 2%, 100% 99%, 2% 98%)",
  "polygon(0% 2%, 98% 0%, 99% 98%, 1% 100%)",
];

const ROTATIONS = ["-1.5deg", "1.2deg", "-0.8deg", "2deg", "0.5deg", "-1.2deg", "1.5deg", "-2deg"];

function getRotation(i: number): string {
  return ROTATIONS[i % ROTATIONS.length];
}

function getVariant(i: number): string {
  return TORN_PAPER_VARIANTS[i % TORN_PAPER_VARIANTS.length];
}

interface GaleriaMasonryProps {
  imagens: GaleriaImagem[];
}

export default function GaleriaMasonry({ imagens }: GaleriaMasonryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const fotosForLightbox = imagens.map((img) => ({
    id: img.id,
    titulo: null,
    legenda: img.alt,
    imagem: img.src,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const changeIndex = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  useEffect(() => {
    if (hasAnimated.current) return;
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = grid.querySelectorAll<HTMLElement>("[data-masonry-item]");

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      hasAnimated.current = true;
      return;
    }

    gsap.fromTo(
      items,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        onComplete: () => {
          hasAnimated.current = true;
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === grid) st.kill();
      });
    };
  }, []);

  return (
    <>
      <div
        ref={gridRef}
        className="galeria-masonry"
        style={{
          columns: "2",
          columnGap: "1.5rem",
          padding: "0 1.5rem",
        }}
      >
        {imagens.map((img, i) => (
          <button
            key={img.id}
            data-masonry-item
            type="button"
            onClick={() => openLightbox(i)}
            aria-label={`Abrir ${img.alt}`}
            className="group relative w-full mb-6 cursor-pointer bg-transparent border-none p-0"
            style={{ breakInside: "avoid" }}
          >
            <div
              className="relative p-2 md:p-3 bg-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              style={{
                clipPath: getVariant(i),
                transform: `rotate(${getRotation(i)})`,
                filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.12))",
              }}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                style={{
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/felt.png')",
                }}
              />
              <div
                className="relative w-full overflow-hidden"
                style={{ clipPath: "polygon(0.5% 0.5%, 99.5% 0.5%, 99.5% 99.5%, 0.5% 99.5%)" }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading={i < 4 ? "eager" : "lazy"}
                  className="w-full h-auto object-cover transition-transform duration-500 scale-[1.05] group-hover:scale-[1.1]"
                  style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/3" }}
                />
              </div>
            </div>

            {/* Hover label */}
            <div className="absolute inset-x-0 -bottom-2 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 translate-y-2 group-hover:translate-y-0 pointer-events-none">
              <span className="inline-block font-display italic text-[11px] uppercase tracking-widest text-bordo bg-cream/95 px-6 py-3 rounded-full shadow-xl border border-bordo/5">
                {img.alt}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Responsive column overrides */}
      <style>{`
        @media (min-width: 768px) {
          .galeria-masonry { columns: 3 !important; column-gap: 2rem !important; padding: 0 2rem !important; }
        }
        @media (min-width: 1024px) {
          .galeria-masonry { columns: 4 !important; column-gap: 2.5rem !important; padding: 0 3rem !important; }
        }
      `}</style>

      {lightboxIndex !== null && (
        <Lightbox
          fotos={fotosForLightbox}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onChangeIndex={changeIndex}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/islands/GaleriaMasonry.tsx
git commit -m "feat(galeria): add masonry grid component with lightbox integration"
```

---

### Task 4: Criar página galeria.astro

**Files:**
- Create: `src/pages/galeria.astro`

- [ ] **Step 1: Criar o arquivo da página**

```astro
---
import { Image } from "astro:assets";
import texturePaper from "@/assets/textures/old-paper-vintage-texture-surface-background-recycle-pale-brown-paper-crumpled-texture.webp";
import Decorative from "@/components/ui/Decorative.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import GaleriaMasonry from "@/components/islands/GaleriaMasonry";
import Footer from "@/components/sections/Footer.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { galeriaImagens } from "@/data/galeriaImagens";

const title = "Galeria — Estúdio Entre — Hub Cultural no Méier, RJ";
const description = "Conheça nosso espaço físico no Méier: salão, tapeçaria, exposições e detalhes do Estúdio Entre.";
---

<BaseLayout title={title} description={description} navTheme="dark">
  <section
    class="galeria-pagina relative pt-32 md:pt-40 pb-24 md:pb-40 overflow-hidden"
    style="background-color: #b9e4eb;"
  >
    {/* Background Assets */}
    <div class="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-multiply">
      <Image src={texturePaper} alt="" class="w-full h-full object-cover" />
    </div>

    <HalftoneTexture
      density={20}
      dotSize={1.2}
      color="61,16,32"
      opacity={0.06}
      class="z-[1]"
    />

    {/* Floating Decor */}
    <div class="absolute top-[8%] right-[8%] opacity-20 z-10 hidden md:block">
      <Decorative variant="star" color="#3D1020" size={100} />
    </div>
    <div class="absolute bottom-[12%] left-[5%] opacity-15 z-10">
      <Decorative variant="dots" color="#3D1020" size={60} />
    </div>

    {/* Header */}
    <div class="max-w-[1400px] mx-auto px-6 md:px-16 mb-16 md:mb-24 relative z-10">
      <div class="overflow-hidden">
        <p class="galeria-pagina__eyebrow font-display font-bold text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-bordo/40">
          O Lugar
        </p>
      </div>
      <h1 class="galeria-pagina__title font-display font-black text-[clamp(3rem,10vw,8rem)] text-bordo leading-[0.85] uppercase mt-6 md:mt-8">
        Nosso <br />
        <span class="italic text-orange md:ml-32">Espaço</span>
      </h1>
    </div>

    {/* Masonry Grid */}
    <div class="relative z-10">
      <GaleriaMasonry imagens={galeriaImagens} client:visible />
    </div>
  </section>

  <Footer />

  {/* Schema.org ImageGallery */}
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Galeria do Estúdio Entre",
    "description": description,
    "url": "https://estudioentre.com.br/galeria",
    "image": galeriaImagens.map((img) => ({
      "@type": "ImageObject",
      "contentUrl": `https://estudioentre.com.br${img.src}`,
      "description": img.alt,
    })),
  })} />

  <script>
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      gsap.fromTo(
        ".galeria-pagina__eyebrow",
        { opacity: 0, y: 15 },
        {
          opacity: 0.5,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: ".galeria-pagina",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".galeria-pagina__title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".galeria-pagina",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    } else {
      gsap.set([".galeria-pagina__eyebrow", ".galeria-pagina__title"], { opacity: 1, y: 0 });
    }
  </script>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/galeria.astro
git commit -m "feat(galeria): create dedicated gallery page"
```

---

### Task 5: Adicionar link na navegação desktop

**Files:**
- Modify: `src/components/ui/Navbar.astro`

- [ ] **Step 1: Adicionar link "Galeria" antes de "O Lugar"**

Substitua a lista de links (`<ul class="navbar__links">`) por:

```astro
<ul class="navbar__links" role="list">
  <li><a href="/galeria" class="navbar__link" data-cursor="ENTRAR">Galeria</a></li>
  <li><a href="/#galeria" class="navbar__link" data-cursor="ENTRAR">O Lugar</a></li>
  <li><a href="/#pilares" class="navbar__link" data-cursor="ENTRAR">Atividades</a></li>
  <li><a href="/agenda" class="navbar__link" data-cursor="ENTRAR">Programação</a></li>
  <li><a href="/#sobre" class="navbar__link" data-cursor="ENTRAR">O Estúdio</a></li>
  <li><a href="/#agendar-visita" class="navbar__link" data-cursor="ENTRAR">Visitação</a></li>
</ul>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Navbar.astro
git commit -m "feat(nav): add Galeria link to desktop navbar"
```

---

### Task 6: Adicionar link na navegação mobile

**Files:**
- Modify: `src/components/islands/MobileNav.tsx`

- [ ] **Step 1: Adicionar link "Galeria" no array de links**

Substitua o array `links` por:

```typescript
const links = [
  { href: "/galeria", label: "Galeria" },
  { href: "/#galeria", label: "O Lugar" },
  { href: "/#pilares", label: "Atividades" },
  { href: "/agenda", label: "Programação" },
  { href: "/#sobre", label: "O Estúdio" },
  { href: "/#agendar-visita", label: "Visitação" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/islands/MobileNav.tsx
git commit -m "feat(nav): add Galeria link to mobile navigation"
```

---

### Task 7: Build e verificação

- [ ] **Step 1: Rodar lint/check**

```bash
bun run check
```

Expected: Sem erros de lint/formatação. Se houver, rode `bun run check:fix`.

- [ ] **Step 2: Rodar build**

```bash
bun run build
```

Expected: Build completa sem erros. Verifique que `dist/galeria/index.html` foi gerado.

- [ ] **Step 3: Verificação manual local (opcional mas recomendado)**

```bash
bun run preview
```

Acesse `http://localhost:4321/galeria` e verifique:
1. Header "Nosso Espaço" renderiza corretamente
2. Grid masonry aparece com imagens do espaço
3. Clique em imagem abre o lightbox
4. Navegação por setas e teclado funciona no lightbox
5. Link "Galeria" aparece no menu desktop e mobile
6. Animações de entrada funcionam ao scrollar
7. Layout responsivo (2/3/4 colunas)
8. Footer aparece no final

- [ ] **Step 4: Commit final (se houver ajustes)**

```bash
git add -A
git commit -m "chore(galeria): final adjustments and build verification"
```

---

## Self-Review

**1. Spec coverage:**
- ✅ Página `/galeria` dedicada — Task 4
- ✅ Grid masonry com CSS columns — Task 3
- ✅ TornPaperFrame estilo replicado — Task 3 (clip-path inline)
- ✅ Lightbox com navegação — Task 3 (reusa Lightbox.tsx) + Task 2 (adaptação)
- ✅ Paleta e texturas (teal, papel, halftone, decorações) — Task 4
- ✅ Animações GSAP de entrada — Task 4 (header) + Task 3 (grid stagger)
- ✅ SEO (title, description, schema.org) — Task 4
- ✅ Acessibilidade (alt, aria-label, focus trap no Lightbox existente) — Task 3 + reusa Lightbox
- ✅ Lazy loading — Task 3 (`loading={i < 4 ? "eager" : "lazy"}`)
- ✅ Navegação desktop/mobile — Tasks 5 e 6
- ✅ Imagens do espaço (`public/images/espaco/`) — Task 1
- ✅ `prefers-reduced-motion` — Task 3 e Task 4

**2. Placeholder scan:**
- Nenhum "TBD", "TODO", ou "implement later" encontrado.
- Todos os steps contêm código completo ou comandos exatos.

**3. Type consistency:**
- `GaleriaImagem` interface definida em Task 1 e usada em Task 3.
- `FotoEspaco` tipo existente preservado; adaptação do Lightbox mantém compatibilidade.
- Props de `GaleriaMasonry` e `Lightbox` consistentes.

**Gap identificado e corrigido:** O design doc original propunha `Lightbox.astro` e `GaleriaGrid.astro`, mas o codebase já possui um `Lightbox.tsx` funcional e robusto. O plano foi ajustado para reaproveitar esse componente existente, criando uma island React `GaleriaMasonry.tsx` que é consistente com o padrão do projeto (outras islands como `MobileNav.tsx`, `SobreCarousel.tsx`). Isso reduz código duplicado e aproveita acessibilidade já testada.
