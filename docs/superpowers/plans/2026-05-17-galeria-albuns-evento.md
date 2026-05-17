# Galeria com Álbuns por Evento — Plano de Implementação

> **Para agentes:** Use **superpowers:subagent-driven-development** (recomendado) ou **superpowers:executing-plans** para implementar este plano tarefa por tarefa. Steps usam checkbox (`- [ ]`) para tracking.

**Goal:** Substituir a galeria estática por álbuns gerenciados via Sanity (`albumGaleria`), com listagem de cards e página de detalhe com masonry + lightbox.

**Architecture:** Schema Sanity `albumGaleria` com referência opcional a `evento`. Página de listagem (`/galeria`) server-side Astro + página de detalhe (`/galeria/[slug]/`) com island React para masonry/lightbox.

**Tech Stack:** Astro, React, Sanity, GSAP/ScrollTrigger, Tailwind CSS

---

### Task 1: Schema `albumGaleria` e Tipos TypeScript

**Files:**
- Create: `src/sanity/schemas/albumGaleria.ts`
- Modify: `src/sanity/schemas/index.ts:3-4`
- Modify: `src/sanity/schema/index.ts:3-4`
- Create: `src/types/galeria.ts`

- [ ] **Step 1: Criar o schema do álbum**

```typescript
// src/sanity/schemas/albumGaleria.ts
import { defineField, defineType } from "sanity";

export const albumGaleria = defineType({
  name: "albumGaleria",
  title: "Álbum da Galeria",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "titulo",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "dataInicio",
      title: "Data de início",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dataFim",
      title: "Data de término (opcional)",
      type: "date",
    }),
    defineField({
      name: "imagens",
      title: "Fotos",
      type: "array",
      of: [
        defineField({
          name: "imagem",
          title: "Imagem",
          type: "image",
          options: {
            hotspot: true,
          },
        }),
      ],
      options: { layout: "grid" },
      validation: (rule) => rule.min(1).error("Adicione pelo menos uma foto"),
    }),
    defineField({
      name: "eventoRelacionado",
      title: "Evento relacionado (opcional)",
      type: "reference",
      to: [{ type: "evento" }],
      weak: true,
    }),
    defineField({
      name: "ativo",
      title: "Ativo",
      type: "boolean",
      initialValue: true,
      description: "Desmarque para ocultar o álbum da galeria",
    }),
  ],
  preview: {
    select: {
      title: "titulo",
      subtitle: "dataInicio",
      media: "imagens.0",
    },
  },
  orderings: [
    {
      title: "Data",
      name: "data",
      by: [{ field: "dataInicio", direction: "desc" }],
    },
  ],
});
```

- [ ] **Step 2: Registrar o schema nos índices do Sanity**

Editar `src/sanity/schemas/index.ts`:

```typescript
import { albumGaleria } from "./albumGaleria";
import { configuracao } from "./configuracao";
import { evento } from "./evento";

export const schemaTypes = [evento, configuracao, albumGaleria];
```

Editar `src/sanity/schema/index.ts`:

```typescript
import { albumGaleria } from "../schemas/albumGaleria";
import { configuracao } from "../schemas/configuracao";
import { evento } from "../schemas/evento";

export const schemaTypes = [evento, configuracao, albumGaleria];
```

- [ ] **Step 3: Criar tipos TypeScript para a galeria**

```typescript
// src/types/galeria.ts
export interface AlbumGaleriaCard {
  _id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string | null;
  capaUrl: string | null;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/albumGaleria.ts src/sanity/schemas/index.ts \
        src/sanity/schema/index.ts src/types/galeria.ts
git commit -m "feat(sanity): criar schema albumGaleria e tipos TypeScript"
```

---

### Task 2: Queries GROQ e deploy do schema

**Files:**
- Create: `src/sanity/queries/galeria.ts`
- Modify: `src/sanity/queries/index.ts:2`

- [ ] **Step 1: Criar queries GROQ para a galeria**

```typescript
// src/sanity/queries/galeria.ts
import { defineQuery } from "groq";

export const albunsQuery = defineQuery(
  `*[_type == "albumGaleria" && ativo == true]
    | order(dataInicio desc){
    _id,
    titulo,
    "slug": slug.current,
    descricao,
    dataInicio,
    dataFim,
    "capaUrl": imagens[0].asset->url
  }`,
);

export const albumBySlugQuery = defineQuery(
  `*[_type == "albumGaleria" && slug.current == $slug && ativo == true][0]{
    _id,
    titulo,
    "slug": slug.current,
    descricao,
    dataInicio,
    dataFim,
    imagens[]{
      _key,
      asset->{
        _id,
        url,
        metadata { dimensions { width, height } }
      },
      alt
    },
    eventoRelacionado->{
      _id,
      titulo,
      "slug": slug.current,
      dataHora
    }
  }`,
);

export const todosAlbunsSlugsQuery = defineQuery(
  `*[_type == "albumGaleria" && defined(slug.current) && ativo == true]{
    "slug": slug.current
  }`,
);
```

- [ ] **Step 2: Registrar queries no índice**

Editar `src/sanity/queries/index.ts`:

```typescript
export { eventosQuery, eventoBySlugQuery, todosEventosSlugsQuery } from "./evento";
export { configuracaoQuery } from "./configuracao";
export { albunsQuery, albumBySlugQuery, todosAlbunsSlugsQuery } from "./galeria";
```

- [ ] **Step 3: Deploy do schema para o Sanity**

```bash
npx sanity@latest schema deploy
```

Verificar se o tipo `albumGaleria` aparece no Studio.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/queries/galeria.ts src/sanity/queries/index.ts
git commit -m "feat(sanity): adicionar queries GROQ para álbuns da galeria"
```

---

### Task 3: Página de Listagem (`/galeria`)

**Files:**
- Rewrite: `src/pages/galeria.astro`
- Create: `src/components/sections/GaleriaListagem.astro`

- [ ] **Step 1: Criar o componente de grid de cards**

```astro
---
// src/components/sections/GaleriaListagem.astro
import type { AlbumGaleriaCard } from "@/types/galeria";

interface Props {
  albuns: AlbumGaleriaCard[];
}

const { albuns } = Astro.props;

function formatarData(inicio: string, fim: string | null): string {
  const d1 = new Date(inicio + "T12:00:00-03:00");
  const formato = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });

  if (!fim) return formato.format(d1);

  const d2 = new Date(fim + "T12:00:00-03:00");
  // Mesmo mês: "25 e 26 de abril"
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    return `${d1.getDate()} e ${d2.getDate()} de ${new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "America/Sao_Paulo" }).format(d1)}`;
  }
  // Meses diferentes: "30 de abril a 2 de maio"
  const formatoCurto = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });
  return `${formatoCurto.format(d1)} a ${formatoCurto.format(d2)}`;
}

const TORN_PAPER = [
  "polygon(1% 2%, 99% 1%, 98% 97%, 2% 99%)",
  "polygon(2% 1%, 98% 2%, 99% 98%, 1% 97%)",
  "polygon(1% 1%, 97% 2%, 100% 99%, 2% 98%)",
  "polygon(0% 2%, 98% 0%, 99% 98%, 1% 100%)",
];
const ROTATIONS = ["-1.5deg", "1.2deg", "-0.8deg", "2deg"];
---

{
  albuns.length === 0 ? (
    <div class="col-span-full text-center py-24">
      <p class="font-display italic text-2xl text-bordo/60">
        Nenhum álbum ainda.<br />Em breve novas memórias!
      </p>
    </div>
  ) : (
    <div class="columns-2 gap-6 px-6 md:columns-3 md:gap-8 md:px-8 lg:gap-10 lg:px-12">
      {albuns.map((album, i) => (
        <a
          href={`/galeria/${album.slug}/`}
          class="block mb-8 group cursor-pointer break-inside-avoid"
          style={{ breakInside: "avoid" }}
        >
          {/* Foto capa com clip-path */}
          <div
            class="relative p-2 md:p-3 bg-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            style={{
              clipPath: TORN_PAPER[i % TORN_PAPER.length],
              transform: `rotate(${ROTATIONS[i % ROTATIONS.length]})`,
            }}
          >
            <div
              class="relative w-full aspect-[4/3] overflow-hidden"
              style={{ clipPath: "polygon(0.5% 0.5%, 99.5% 0.5%, 99.5% 99.5%, 0.5% 99.5%)" }}
            >
              <img
                src={album.capaUrl ?? ""}
                alt={album.titulo}
                loading={i < 4 ? "eager" : "lazy"}
                class="w-full h-full object-cover transition-transform duration-500 scale-[1.05] group-hover:scale-[1.1]"
              />
            </div>
          </div>

          {/* Info do álbum */}
          <div class="mt-3 px-1">
            <h3 class="font-display font-bold text-lg md:text-xl text-bordo leading-tight">
              {album.titulo}
            </h3>
            <p class="text-xs text-bordo/40 uppercase tracking-wider mt-1">
              {formatarData(album.dataInicio, album.dataFim)}
            </p>
            {album.descricao && (
              <p class="text-sm text-bordo/60 mt-2 line-clamp-2 leading-relaxed">
                {album.descricao}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Reescrever a página `/galeria`**

```astro
---
// src/pages/galeria.astro
import { sanityClient } from "sanity:client";
import Footer from "@/components/sections/Footer.astro";
import GaleriaListagem from "@/components/sections/GaleriaListagem.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { albunsQuery } from "@/sanity/queries/galeria";
import type { AlbumGaleriaCard } from "@/types/galeria";

const albuns: AlbumGaleriaCard[] = await sanityClient.fetch(albunsQuery);

const title = "Galeria — Estúdio Entre";
const description = "Momentos do Estúdio Entre: inaugurações, exposições e eventos em imagem.";
const ogImage = albuns.length > 0 && albuns[0].capaUrl ? albuns[0].capaUrl + "?w=1200&h=630&fit=crop" : undefined;
---

<BaseLayout
  title={title}
  description={description}
  navTheme="dark"
  ogImage={ogImage}
>
  <main
    class="galeria-pagina relative pt-32 md:pt-40 pb-24 md:pb-40 overflow-hidden"
    style="background-color: #b9e4eb;"
  >
    {/* Background textures — manter os mesmos da página atual */}
    <div class="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-multiply">
      <div class="w-full h-full bg-[#d4c9b8]" />
    </div>

    {/* Header */}
    <div class="max-w-[1400px] mx-auto px-6 md:px-16 mb-16 md:mb-24 relative z-10">
      <div class="overflow-hidden">
        <p class="galeria-pagina__eyebrow font-display font-bold text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-bordo/40">
          Galeria
        </p>
      </div>
      <h1 class="galeria-pagina__title font-display font-black text-[clamp(3rem,10vw,8rem)] text-bordo leading-[0.85] uppercase mt-6 md:mt-8">
        Momentos<br />
        <span class="italic text-orange md:ml-32">do Estúdio</span>
      </h1>
    </div>

    {/* Grid de álbuns */}
    <div class="relative z-10 max-w-[1400px] mx-auto">
      <GaleriaListagem albuns={albuns} />
    </div>
  </main>

  <Footer />

  {/* Animação GSAP — manter estrutura existente, ajustar targets */}
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

- [ ] **Step 3: Verificar build**

```bash
bun run build
```

Se houver erro de tipo na query (por causa de `capaUrl` vs `SanityImageRef`), ajustar a interface `AlbumGaleriaCard` para aceitar o que vem do Sanity.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/GaleriaListagem.astro src/pages/galeria.astro
git commit -m "feat(galeria): reescrever página de listagem com cards de álbuns via Sanity"
```

---

### Task 4: Página de Detalhe (`/galeria/[slug]/`)

**Files:**
- Create: `src/pages/galeria/[slug].astro`
- Create: `src/components/islands/GaleriaDetalhe.tsx` (island React)

- [ ] **Step 1: Criar o componente island do detalhe com masonry + lightbox**

```tsx
// src/components/islands/GaleriaDetalhe.tsx
import type { FotoEspaco } from "@/types/foto";
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

export interface FotoAlbum {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface GaleriaDetalheProps {
  fotos: FotoAlbum[];
  titulo: string;
}

export default function GaleriaDetalhe({ fotos, titulo }: GaleriaDetalheProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const fotosForLightbox: FotoEspaco[] = fotos.map((f) => ({
    id: f.id,
    titulo: null,
    legenda: f.alt,
    imagem: f.src,
  }));

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const changeIndex = useCallback((index: number) => setLightboxIndex(index), []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = grid.querySelectorAll<HTMLElement>("[data-masonry-item]");

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => { tween.kill(); };
  }, []);

  return (
    <>
      <div
        ref={gridRef}
        className="galeria-masonry columns-2 gap-6 px-6 md:columns-3 md:gap-8 md:px-8 lg:columns-4 lg:gap-10 lg:px-12"
      >
        {fotos.map((foto, i) => (
          <button
            key={foto.id}
            data-masonry-item
            type="button"
            onClick={() => openLightbox(i)}
            aria-label={`Abrir ${foto.alt}`}
            className="group relative w-full mb-6 cursor-pointer bg-transparent border-none p-0"
            style={{ breakInside: "avoid" }}
          >
            <div
              className="relative p-2 md:p-3 bg-cream shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              style={{
                clipPath: TORN_PAPER_VARIANTS[i % TORN_PAPER_VARIANTS.length],
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]})`,
                filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.12))",
              }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ clipPath: "polygon(0.5% 0.5%, 99.5% 0.5%, 99.5% 99.5%, 0.5% 99.5%)" }}
              >
                <img
                  src={foto.src}
                  alt={foto.alt}
                  loading={i < 4 ? "eager" : "lazy"}
                  className="w-full h-auto object-cover transition-transform duration-500 scale-[1.05] group-hover:scale-[1.1]"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

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

- [ ] **Step 2: Criar a página de rota dinâmica**

```astro
---
// src/pages/galeria/[slug].astro
import { sanityClient } from "sanity:client";
import Footer from "@/components/sections/Footer.astro";
import GaleriaDetalhe from "@/components/islands/GaleriaDetalhe";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { albumBySlugQuery, todosAlbunsSlugsQuery } from "@/sanity/queries/galeria";
import type { FotoAlbum } from "@/components/islands/GaleriaDetalhe";

export async function getStaticPaths() {
  const slugs: { slug: string }[] = await sanityClient.fetch(todosAlbunsSlugsQuery);
  return slugs.map((s) => ({ params: { slug: s.slug } }));
}

interface SanityImageRaw {
  _key: string;
  asset: {
    _id: string;
    url: string;
    metadata: { dimensions: { width: number; height: number } } | null;
  } | null;
  alt: string | null;
}

interface AlbumDetalheRaw {
  _id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string | null;
  imagens: SanityImageRaw[] | null;
  eventoRelacionado: {
    _id: string;
    titulo: string;
    slug: string;
    dataHora: string;
  } | null;
}

const { slug } = Astro.params;
const album: AlbumDetalheRaw | null = await sanityClient.fetch(albumBySlugQuery, { slug });

if (!album) {
  return Astro.redirect("/galeria");
}

function formatarData(inicio: string, fim: string | null): string {
  const d1 = new Date(inicio + "T12:00:00-03:00");
  const formato = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
  if (!fim) return formato.format(d1);

  const d2 = new Date(fim + "T12:00:00-03:00");
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    return `${d1.getDate()} e ${d2.getDate()} de ${new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "America/Sao_Paulo" }).format(d1)}`;
  }
  return `${formato.format(d1)} a ${formato.format(d2)}`;
}

const fotos: FotoAlbum[] = (album.imagens ?? [])
  .filter((img) => img.asset?.url)
  .map((img) => {
    // Sanity image URL: adiciona ?auto=format para WebP
    const baseUrl = img.asset!.url;
    const params = new URLSearchParams();
    params.set("auto", "format");
    params.set("w", "1600");
    return {
      id: img._key,
      src: `${baseUrl}?${params.toString()}`,
      alt: img.alt ?? album.titulo,
      width: img.asset!.metadata?.dimensions?.width ?? 800,
      height: img.asset!.metadata?.dimensions?.height ?? 600,
    };
  });

const capaUrl = fotos.length > 0 ? fotos[0].src : undefined;
const pageTitle = `${album.titulo} | Galeria — Estúdio Entre`;
const data = formatarData(album.dataInicio, album.dataFim);
---

<BaseLayout
  title={pageTitle}
  description={album.descricao ?? `Fotos de ${album.titulo}`}
  navTheme="dark"
  ogImage={capaUrl}
>
  <main
    class="album-detalhe relative pt-32 md:pt-40 pb-24 md:pb-40 overflow-hidden"
    style="background-color: #b9e4eb;"
  >
    <div class="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
      <!-- Voltar -->
      <a
        href="/galeria"
        class="inline-flex items-center gap-2 text-sm text-bordo/40 hover:text-bordo transition-colors mb-8 font-display uppercase tracking-widest"
      >
        &#8592; Voltar para Galeria
      </a>

      <!-- Header -->
      <h1 class="font-display font-black text-[clamp(2rem,6vw,5rem)] text-bordo leading-[0.9] uppercase mb-4">
        {album.titulo}
      </h1>
      <p class="text-sm text-bordo/40 uppercase tracking-widest mb-8">
        {data} · {fotos.length} {fotos.length === 1 ? "foto" : "fotos"}
      </p>

      <!-- Descrição + evento relacionado -->
      <div class="max-w-2xl">
        {album.descricao && (
          <p class="text-base text-bordo/80 leading-relaxed mb-6 font-body">
            {album.descricao}
          </p>
        )}
        {album.eventoRelacionado && (
          <a
            href={`/agenda#${album.eventoRelacionado.slug}`}
            class="inline-flex items-center gap-1 text-sm text-orange hover:text-orange-dark transition-colors font-display"
          >
            Ver detalhes do evento &#8594;
          </a>
        )}
      </div>
    </div>

    <!-- Grid masonry -->
    <div class="relative z-10 mt-16">
      <GaleriaDetalhe fotos={fotos} titulo={album.titulo} client:visible />
    </div>
  </main>

  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Verificar build e tipos**

```bash
bun run build
```

Verificar que as rotas dinâmicas são geradas (para cada slug existente no Sanity) e que não há erros de tipo.

- [ ] **Step 4: Commit**

```bash
git add src/pages/galeria/\[slug\].astro src/components/islands/GaleriaDetalhe.tsx
git commit -m "feat(galeria): criar página de detalhe do álbum com masonry + lightbox"
```

---

### Task 5: Limpeza de código e assets obsoletos

**Files:**
- Delete: `src/data/galeriaImagens.ts`
- Delete: `src/components/islands/GaleriaMasonry.tsx`
- Delete: `public/images/espaco/` (toda a pasta)

- [ ] **Step 1: Remover dados estáticos e componente antigo**

```bash
rm src/data/galeriaImagens.ts
rm src/components/islands/GaleriaMasonry.tsx
```

- [ ] **Step 2: Verificar se nada mais referencia esses arquivos**

```bash
rg "galeriaImagens" src/ --files-with-matches
rg "GaleriaMasonry" src/ --files-with-matches
```

Esperado: nenhum resultado (a página `galeria.astro` foi reescrita e não usa mais essas importações).

- [ ] **Step 3: Remover imagens estáticas antigas**

```bash
rm -rf public/images/espaco/
```

- [ ] **Step 4: Build de verificação pós-limpeza**

```bash
bun run build
```

Esperado: build limpo, sem erros.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(galeria): remover dados estáticos e componentes obsoletos da galeria antiga"
```

---

### Task 6: Upload das imagens de inauguração no Sanity

**Contexto:** As 16 fotos otimizadas em `public/images/geral/fotos-do-estudio/` (.webp) precisam ser enviadas para o Sanity via Studio.

- [ ] **Step 1: Iniciar o Studio local**

```bash
bun run dev
```

Acessar `http://localhost:4321/studio` e verificar se o tipo `albumGaleria` aparece no menu.

- [ ] **Step 2: Criar o álbum "Inauguração do Estúdio Entre"**

No Studio:
1. Criar novo documento `albumGaleria`
2. Título: `Inauguração do Estúdio Entre`
3. Slug: (gerado automaticamente)
4. Descrição: `Celebração de abertura do Estúdio Entre — hub cultural no Méier. Dois dias de encontros, arte, música e memória afetiva.`
5. Data de início: `2026-04-25`
6. Data de término: `2026-04-26`
7. Fotos: upload das 16 imagens da pasta `public/images/geral/fotos-do-estudio/`
8. Ativo: ✅

- [ ] **Step 3: Publicar o documento**

Clicar "Publish" no Studio para tornar o álbum visível.

- [ ] **Step 4: Verificar no frontend**

Acessar `http://localhost:4321/galeria` — o card da inauguração deve aparecer.
Clicar — página de detalhe deve carregar com as 16 fotos no masonry.

---

### Task 7: Verificação final e SEO

- [ ] **Step 1: Rodar build completo**

```bash
bun run build
```

- [ ] **Step 2: Rodar check de lint**

```bash
bun run check
```

- [ ] **Step 3: Verificar visualmente no preview**

```bash
bun run preview
```

Validar:
- [ ] `/galeria` — lista os álbuns com cards
- [ ] `/galeria/inauguracao-do-estudio-entre/` — masonry + lightbox funcionando
- [ ] Lightbox: navegação por teclado e mouse
- [ ] Responsividade: mobile (2 cols), tablet (3), desktop (4)
- [ ] SEO: title, description, og:image em cada página
- [ ] Empty state: remover álbum ativo e verificar mensagem

- [ ] **Step 4: Commit final se houver ajustes**

```bash
git add -A
git commit -m "chore(galeria): ajustes finais de SEO e verificação"
```
