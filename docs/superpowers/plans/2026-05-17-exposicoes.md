# Exposições — Plano de Implementação

> **Para agentes:** Use **superpowers:subagent-driven-development** (recomendado) ou **superpowers:executing-plans** para implementar este plano tarefa por tarefa. Steps usam checkbox (`- [ ]`) para tracking.

**Goal:** Criar sistema de exposições com schema Sanity, seção na home, listagem com filtro e página de detalhe editorial.

**Architecture:** Schema `exposicao` com Portable Text, status manual e referência opcional a `albumGaleria`. Seção na home + página de listagem server-side Astro. Detalhe com capa full-width + ficha técnica + texto curatorial + galeria masonry (island React).

**Tech Stack:** Astro, React, Sanity, GSAP/ScrollTrigger, Tailwind CSS

---

### Task 1: Schema `exposicao` e Tipos TypeScript

**Files:**
- Create: `src/sanity/schemas/exposicao.ts`
- Modify: `src/sanity/schemas/index.ts`
- Modify: `src/sanity/schema/index.ts`
- Create: `src/types/exposicao.ts`

- [ ] **Step 1: Criar o schema**

```typescript
// src/sanity/schemas/exposicao.ts
import { defineField, defineType } from "sanity";

export const exposicao = defineType({
  name: "exposicao",
  title: "Exposição",
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
      options: { source: "titulo", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitulo",
      title: "Subtítulo (opcional)",
      type: "string",
    }),
    defineField({
      name: "textoCuratorial",
      title: "Texto Curatorial",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "artista",
      title: "Artista(s)",
      type: "string",
    }),
    defineField({
      name: "curadoria",
      title: "Curadoria",
      type: "string",
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
      name: "local",
      title: "Local / Sala",
      type: "string",
    }),
    defineField({
      name: "tecnica",
      title: "Técnica / Mídia",
      type: "string",
    }),
    defineField({
      name: "apoio",
      title: "Apoio / Parceria",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "imagemCapa",
      title: "Imagem de capa",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imagens",
      title: "Galeria de imagens",
      type: "array",
      of: [defineField({ name: "imagem", title: "Imagem", type: "image", options: { hotspot: true } })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "albumRelacionado",
      title: "Álbum da galeria (opcional)",
      type: "reference",
      to: [{ type: "albumGaleria" }],
      weak: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Em cartaz", value: "em-cartaz" },
          { title: "Futura", value: "futura" },
          { title: "Passada", value: "passada" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ativo",
      title: "Ativo",
      type: "boolean",
      initialValue: true,
      description: "Desmarque para ocultar do site",
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "artista", media: "imagemCapa" },
  },
  orderings: [
    { title: "Data de início", name: "data", by: [{ field: "dataInicio", direction: "desc" }] },
  ],
});
```

- [ ] **Step 2: Registrar nos índices**

Editar `src/sanity/schemas/index.ts`:

```typescript
import { albumGaleria } from "./albumGaleria";
import { configuracao } from "./configuracao";
import { evento } from "./evento";
import { exposicao } from "./exposicao";

export const schemaTypes = [evento, configuracao, albumGaleria, exposicao];
```

Editar `src/sanity/schema/index.ts`:

```typescript
import { albumGaleria } from "../schemas/albumGaleria";
import { configuracao } from "../schemas/configuracao";
import { evento } from "../schemas/evento";
import { exposicao } from "../schemas/exposicao";

export const schemaTypes = [evento, configuracao, albumGaleria, exposicao];
```

- [ ] **Step 3: Criar tipos TypeScript**

```typescript
// src/types/exposicao.ts
export type ExposicaoStatus = "em-cartaz" | "futura" | "passada";

export interface ExposicaoCard {
  _id: string;
  titulo: string;
  slug: string;
  artista: string | null;
  dataInicio: string;
  dataFim: string | null;
  status: ExposicaoStatus;
  capaUrl: string | null;
}

export interface ExposicaoDetalhe {
  _id: string;
  titulo: string;
  slug: string;
  subtitulo: string | null;
  textoCuratorial: unknown[] | null;
  artista: string | null;
  curadoria: string | null;
  dataInicio: string;
  dataFim: string | null;
  local: string | null;
  tecnica: string | null;
  apoio: string | null;
  capaUrl: string | null;
  imagens: { _key: string; url: string; alt: string | null }[];
  albumRelacionado: { _id: string; titulo: string; slug: string } | null;
  status: ExposicaoStatus;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/exposicao.ts src/sanity/schemas/index.ts \
        src/sanity/schema/index.ts src/types/exposicao.ts
git commit -m "feat(sanity): criar schema exposicao e tipos"
```

---

### Task 2: Queries GROQ

**Files:**
- Create: `src/sanity/queries/exposicao.ts`
- Modify: `src/sanity/queries/index.ts`

- [ ] **Step 1: Criar queries**

```typescript
// src/sanity/queries/exposicao.ts
import { defineQuery } from "groq";

export const exposicoesEmCartazQuery = defineQuery(
  `*[_type == "exposicao" && ativo == true && status == "em-cartaz"]
    | order(dataInicio desc)[0...3]{
    _id, titulo, "slug": slug.current, artista, dataInicio, dataFim, status,
    "capaUrl": imagemCapa.asset->url
  }`,
);

export const exposicoesFuturasQuery = defineQuery(
  `*[_type == "exposicao" && ativo == true && status == "futura"]
    | order(dataInicio asc)[0...3]{
    _id, titulo, "slug": slug.current, artista, dataInicio, dataFim, status,
    "capaUrl": imagemCapa.asset->url
  }`,
);

export const exposicoesByStatusQuery = defineQuery(
  `*[_type == "exposicao" && ativo == true && status == $status]
    | order(dataInicio desc){
    _id, titulo, "slug": slug.current, artista, dataInicio, dataFim, status,
    "capaUrl": imagemCapa.asset->url
  }`,
);

export const exposicaoBySlugQuery = defineQuery(
  `*[_type == "exposicao" && slug.current == $slug && ativo == true][0]{
    _id, titulo, "slug": slug.current, subtitulo, textoCuratorial,
    artista, curadoria, dataInicio, dataFim, local, tecnica, apoio, status,
    "capaUrl": imagemCapa.asset->url,
    imagens[]{ _key, "url": asset->url, alt },
    albumRelacionado->{ _id, titulo, "slug": slug.current }
  }`,
);

export const todasExposicoesSlugsQuery = defineQuery(
  `*[_type == "exposicao" && defined(slug.current) && ativo == true]{
    "slug": slug.current
  }`,
);
```

- [ ] **Step 2: Registrar no índice**

Editar `src/sanity/queries/index.ts`:

```typescript
export { eventosQuery, eventoBySlugQuery, todosEventosSlugsQuery } from "./evento";
export { configuracaoQuery } from "./configuracao";
export { albunsQuery, albumBySlugQuery, todosAlbunsSlugsQuery } from "./galeria";
export {
  exposicoesEmCartazQuery,
  exposicoesFuturasQuery,
  exposicoesByStatusQuery,
  exposicaoBySlugQuery,
  todasExposicoesSlugsQuery,
} from "./exposicao";
```

- [ ] **Step 3: Commit**

```bash
git add src/sanity/queries/exposicao.ts src/sanity/queries/index.ts
git commit -m "feat(sanity): queries GROQ para exposicoes"
```

---

### Task 3: Seção na Home

**Files:**
- Create: `src/components/sections/ExposicoesHome.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Criar componente da seção**

```astro
---
// src/components/sections/ExposicoesHome.astro
import { sanityClient } from "sanity:client";
import { exposicoesEmCartazQuery, exposicoesFuturasQuery } from "@/sanity/queries/exposicao";
import type { ExposicaoCard } from "@/types/exposicao";

let exposicoes: ExposicaoCard[] = await sanityClient.fetch(exposicoesEmCartazQuery);
const fallback = exposicoes.length === 0;
if (fallback) {
  exposicoes = await sanityClient.fetch(exposicoesFuturasQuery);
}
if (exposicoes.length === 0) return new Response(null, { status: 200 });

function formatarPeriodo(inicio: string, fim: string | null): string {
  const formato = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: "America/Sao_Paulo" });
  if (!fim) return formato.format(new Date(inicio + "T12:00:00-03:00"));
  const d1 = new Date(inicio + "T12:00:00-03:00");
  const d2 = new Date(fim + "T12:00:00-03:00");
  if (d1.getMonth() === d2.getMonth()) {
    return `${d1.getDate()}–${d2.getDate()} ${new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "America/Sao_Paulo" }).format(d1)}`;
  }
  return `${formato.format(d1)} – ${formato.format(d2)}`;
}

const TORN = ["polygon(1% 2%, 99% 1%, 98% 97%, 2% 99%)", "polygon(2% 1%, 98% 2%, 99% 98%, 1% 97%)", "polygon(1% 1%, 97% 2%, 100% 99%, 2% 98%)"];
const ROT = ["-1deg", "0.8deg", "-0.5deg"];
---

<section class="exposicoes-home relative py-24 md:py-32 overflow-hidden" style="background-color: var(--color-cream);">
  <div class="max-w-[1400px] mx-auto px-6 md:px-16">
    <p class="font-display font-bold text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-bordo/40 mb-4">
      {fallback ? "EM BREVE" : "EM CARTAZ"}
    </p>
    <h2 class="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-bordo leading-[0.9] uppercase mb-12">
      Exposições
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      {exposicoes.map((exp, i) => (
        <a href={`/exposicoes/${exp.slug}/`} class="group block">
          <div
            class="relative p-2 bg-white shadow-lg transition-transform duration-500 group-hover:scale-[1.02] mb-4"
            style={{ clipPath: TORN[i], transform: `rotate(${ROT[i]})` }}
          >
            <img
              src={exp.capaUrl ?? ""}
              alt={exp.titulo}
              loading="lazy"
              class="w-full aspect-[3/4] object-cover"
            />
          </div>
          <h3 class="font-display font-bold text-xl text-bordo leading-tight">{exp.titulo}</h3>
          {exp.artista && <p class="text-sm text-bordo/60 mt-1">{exp.artista}</p>}
          <p class="text-xs text-bordo/40 uppercase tracking-wider mt-1">
            {formatarPeriodo(exp.dataInicio, exp.dataFim)}
          </p>
        </a>
      ))}
    </div>

    <div class="mt-12 text-center">
      <a
        href="/exposicoes"
        class="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-widest text-orange hover:text-orange-dark transition-colors"
      >
        Ver todas as exposições &#8594;
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Adicionar seção no index.astro**

Editar `src/pages/index.astro` — adicionar o import e a seção logo após o `<Hero />`:

```astro
---
import ExposicoesHome from "@/components/sections/ExposicoesHome.astro";
// ... outros imports existentes
---

<BaseLayout ...>
  <Hero />
  <ExposicoesHome />
  <!-- resto das seções existentes -->
</BaseLayout>
```

- [ ] **Step 3: Build e commit**

```bash
bun run check && bun run build
git add src/components/sections/ExposicoesHome.astro src/pages/index.astro
git commit -m "feat(exposicoes): adicionar seção de exposições na home"
```

---

### Task 4: Página de Listagem (`/exposicoes/`)

**Files:**
- Create: `src/pages/exposicoes.astro`
- Create: `src/components/sections/ExposicoesListagem.astro`

- [ ] **Step 1: Criar grid de listagem**

```astro
---
// src/components/sections/ExposicoesListagem.astro
import type { ExposicaoCard, ExposicaoStatus } from "@/types/exposicao";

interface Props {
  exposicoes: ExposicaoCard[];
  filtroAtivo: ExposicaoStatus;
}

const { exposicoes, filtroAtivo } = Astro.props;

function formatarPeriodo(inicio: string, fim: string | null): string {
  const formato = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: "America/Sao_Paulo" });
  if (!fim) return formato.format(new Date(inicio + "T12:00:00-03:00"));
  const d1 = new Date(inicio + "T12:00:00-03:00");
  const d2 = new Date(fim + "T12:00:00-03:00");
  if (d1.getMonth() === d2.getMonth()) {
    return `${d1.getDate()}–${d2.getDate()} ${new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "America/Sao_Paulo" }).format(d1)}`;
  }
  return `${formato.format(d1)} – ${formato.format(d2)}`;
}

const filtros: { label: string; value: ExposicaoStatus }[] = [
  { label: "Em cartaz", value: "em-cartaz" },
  { label: "Futuras", value: "futura" },
  { label: "Passadas", value: "passada" },
];

const TORN = ["polygon(1% 2%, 99% 1%, 98% 97%, 2% 99%)", "polygon(2% 1%, 98% 2%, 99% 98%, 1% 97%)", "polygon(1% 1%, 97% 2%, 100% 99%, 2% 98%)", "polygon(0% 2%, 98% 0%, 99% 98%, 1% 100%)"];
const ROT = ["-1deg", "0.8deg", "-0.5deg", "1.2deg"];
---

<!-- Filtros -->
<div class="flex flex-wrap gap-3 mb-12 px-6 md:px-8">
  {filtros.map((f) => (
    <a
      href={`/exposicoes/${f.value}`}
      class={`font-display font-bold text-sm uppercase tracking-widest px-5 py-2 rounded-full border transition-all ${
        filtroAtivo === f.value
          ? "bg-bordo text-cream border-bordo"
          : "bg-transparent text-bordo/40 border-bordo/20 hover:text-bordo hover:border-bordo/50"
      }`}
    >
      {f.label}
    </a>
  ))}
</div>

<!-- Grid -->
{
  exposicoes.length === 0 ? (
    <div class="text-center py-24 px-6">
      <p class="font-display italic text-2xl text-bordo/60">Nenhuma exposição no momento.</p>
    </div>
  ) : (
    <div class="columns-2 gap-6 px-6 md:columns-3 md:gap-8 md:px-8 lg:gap-10 lg:px-12">
      {exposicoes.map((exp, i) => (
        <a
          href={`/exposicoes/${exp.slug}/`}
          class="block mb-8 group break-inside-avoid"
          style={{ breakInside: "avoid" }}
        >
          <div
            class="relative p-2 bg-white shadow-lg transition-transform duration-500 group-hover:scale-[1.02] mb-4"
            style={{ clipPath: TORN[i % TORN.length], transform: `rotate(${ROT[i % ROT.length]})` }}
          >
            <img src={exp.capaUrl ?? ""} alt={exp.titulo} loading="lazy" class="w-full aspect-[3/4] object-cover" />
          </div>
          <h3 class="font-display font-bold text-xl text-bordo leading-tight">{exp.titulo}</h3>
          {exp.artista && <p class="text-sm text-bordo/60 mt-1">{exp.artista}</p>}
          <p class="text-xs text-bordo/40 uppercase tracking-wider mt-1">{formatarPeriodo(exp.dataInicio, exp.dataFim)}</p>
        </a>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Criar página de listagem com redirect do filtro**

```astro
---
// src/pages/exposicoes.astro
import { sanityClient } from "sanity:client";
import Footer from "@/components/sections/Footer.astro";
import ExposicoesListagem from "@/components/sections/ExposicoesListagem.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { exposicoesByStatusQuery } from "@/sanity/queries/exposicao";
import type { ExposicaoCard, ExposicaoStatus } from "@/types/exposicao";

const statusParam = Astro.url.searchParams.get("status");
const filtroAtivo: ExposicaoStatus =
  statusParam === "futura" || statusParam === "passada" || statusParam === "em-cartaz"
    ? statusParam
    : "em-cartaz";

const exposicoes: ExposicaoCard[] = await sanityClient.fetch(exposicoesByStatusQuery, { status: filtroAtivo });

const title = "Exposições — Estúdio Entre";
const description = "Exposições em cartaz e acervo do Estúdio Entre — hub cultural no Méier, RJ.";
---

<BaseLayout title={title} description={description} navTheme="dark">
  <main class="exposicoes-pagina relative pt-32 md:pt-40 pb-24 md:pb-40 overflow-hidden" style="background-color: #f0ede8;">
    <div class="max-w-[1400px] mx-auto relative z-10">
      <div class="px-6 md:px-16 mb-12">
        <p class="font-display font-bold text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-bordo/40 mb-4">Exposições</p>
        <h1 class="font-display font-black text-[clamp(3rem,10vw,8rem)] text-bordo leading-[0.85] uppercase">
          Em cartaz<br /><span class="italic text-orange md:ml-32">e acervo</span>
        </h1>
      </div>
      <ExposicoesListagem exposicoes={exposicoes} filtroAtivo={filtroAtivo} />
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Build e commit**

```bash
bun run check && bun run build
git add src/pages/exposicoes.astro src/components/sections/ExposicoesListagem.astro
git commit -m "feat(exposicoes): página de listagem com filtro por status"
```

---

### Task 5: Página de Detalhe (`/exposicoes/[slug]/`)

**Files:**
- Create: `src/pages/exposicoes/[slug].astro`

- [ ] **Step 1: Criar página de detalhe**

```astro
---
// src/pages/exposicoes/[slug].astro
import { sanityClient } from "sanity:client";
import { PortableText } from "@portabletext/astro";
import Footer from "@/components/sections/Footer.astro";
import GaleriaDetalhe from "@/components/islands/GaleriaDetalhe";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { exposicaoBySlugQuery, todasExposicoesSlugsQuery } from "@/sanity/queries/exposicao";
import type { FotoAlbum } from "@/components/islands/GaleriaDetalhe";

export async function getStaticPaths() {
  const slugs: { slug: string }[] = await sanityClient.fetch(todasExposicoesSlugsQuery);
  return slugs.map((s) => ({ params: { slug: s.slug } }));
}

interface ExposicaoRaw {
  _id: string; titulo: string; slug: string; subtitulo: string | null;
  textoCuratorial: unknown[] | null; artista: string | null; curadoria: string | null;
  dataInicio: string; dataFim: string | null; local: string | null;
  tecnica: string | null; apoio: string | null; status: string;
  capaUrl: string | null;
  imagens: { _key: string; url: string; alt: string | null }[] | null;
  albumRelacionado: { _id: string; titulo: string; slug: string } | null;
}

const { slug } = Astro.params;
const exp: ExposicaoRaw | null = await sanityClient.fetch(exposicaoBySlugQuery, { slug });
if (!exp) return Astro.redirect("/exposicoes");

function formatarData(d: string | null): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date(d + "T12:00:00-03:00"));
}

const periodo = exp.dataFim
  ? `${formatarData(exp.dataInicio)} – ${formatarData(exp.dataFim)}`
  : formatarData(exp.dataInicio);

const fotos: FotoAlbum[] = (exp.imagens ?? []).map((img) => ({
  id: img._key,
  src: `${img.url}?auto=format&w=1600`,
  alt: img.alt ?? exp.titulo,
  width: 800,
  height: 600,
}));

const fichaTecnica = [
  { label: "Artista", value: exp.artista },
  { label: "Curadoria", value: exp.curadoria },
  { label: "Período", value: periodo },
  { label: "Local", value: exp.local },
  { label: "Técnica", value: exp.tecnica },
].filter((f) => f.value);

const pageTitle = `${exp.titulo} | Exposições — Estúdio Entre`;
---

<BaseLayout title={pageTitle} description={exp.subtitulo ?? `Exposição: ${exp.titulo}`} navTheme="dark" ogImage={exp.capaUrl ?? undefined}>
  <main class="exposicao-detalhe relative overflow-hidden" style="background-color: #f0ede8;">
    <!-- Capa full-width -->
    {exp.capaUrl && (
      <div class="w-full h-[50vh] md:h-[70vh] overflow-hidden">
        <img src={`${exp.capaUrl}?auto=format&w=1800`} alt={exp.titulo} class="w-full h-full object-cover" />
      </div>
    )}

    <div class="max-w-[1200px] mx-auto px-6 md:px-16 py-16 md:py-24 relative z-10">
      <!-- Voltar -->
      <a href="/exposicoes" class="inline-flex items-center gap-2 text-sm text-bordo/40 hover:text-bordo transition-colors mb-8 font-display uppercase tracking-widest">
        &#8592; Voltar para Exposições
      </a>

      <!-- Título -->
      <h1 class="font-display font-black text-[clamp(2rem,6vw,5rem)] text-bordo leading-[0.9] uppercase mb-2">{exp.titulo}</h1>
      {exp.subtitulo && <p class="font-display italic text-xl text-bordo/60 mb-12">{exp.subtitulo}</p>}

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        <!-- Texto curatorial -->
        <div>
          {exp.textoCuratorial && (
            <div class="prose prose-lg prose-bordo max-w-none font-body text-bordo/80">
              <PortableText value={exp.textoCuratorial} />
            </div>
          )}

          {/* Álbum relacionado */}
          {exp.albumRelacionado && (
            <div class="mt-10 p-6 bg-cream border border-bordo/10 rounded-sm">
              <a href={`/galeria/${exp.albumRelacionado.slug}/`} class="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wider text-orange hover:text-orange-dark transition-colors">
                📸 Ver fotos do evento &#8594;
              </a>
            </div>
          )}
        </div>

        <!-- Ficha técnica -->
        <aside class="lg:sticky lg:top-32 self-start">
          <div class="border-t-2 border-bordo pt-6">
            <h2 class="font-display font-bold text-xs uppercase tracking-[0.3em] text-bordo/40 mb-6">Ficha Técnica</h2>
            <dl class="space-y-4">
              {fichaTecnica.map((f) => (
                <div>
                  <dt class="font-body font-bold text-xs uppercase tracking-wider text-bordo/40">{f.label}</dt>
                  <dd class="font-body text-sm text-bordo mt-1">{f.value}</dd>
                </div>
              ))}
            </dl>
            {exp.apoio && (
              <div class="mt-6 pt-6 border-t border-bordo/10">
                <p class="font-body font-bold text-xs uppercase tracking-wider text-bordo/40 mb-1">Apoio</p>
                <p class="font-body text-sm text-bordo/60 whitespace-pre-line">{exp.apoio}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>

    <!-- Galeria de imagens -->
    {fotos.length > 0 && (
      <div class="relative z-10 pb-24 md:pb-40" style="background-color: #b9e4eb;">
        <div class="max-w-[1400px] mx-auto pt-16">
          <h2 class="font-display font-black text-3xl text-bordo uppercase px-6 md:px-16 mb-10">Galeria</h2>
          <GaleriaDetalhe fotos={fotos} client:visible />
        </div>
      </div>
    )}
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Build e commit**

```bash
bun run check && bun run build
git add src/pages/exposicoes/\[slug\].astro
git commit -m "feat(exposicoes): página de detalhe editorial com ficha técnica e galeria"
```

---

### Task 6: Verificação Final

- [ ] **Step 1: Rodar build completo**

```bash
bun run check && bun run build
```

- [ ] **Step 2: Validar visualmente**

```bash
bun run preview
```

Verificar:
- [ ] Seção de exposições na home aparece após a Hero
- [ ] `/exposicoes/` lista com filtro funcionando
- [ ] `/exposicoes/[slug]/` — capa, ficha técnica, texto curatorial, galeria, link para álbum
- [ ] Empty states (sem exposições em cartaz)
- [ ] Responsividade

- [ ] **Step 3: Criar conteúdo de teste no Sanity Studio**

Acessar `/studio`, criar documento `exposicao` com dados de teste e verificar no frontend.

- [ ] **Step 4: Commit final**

```bash
git add -A && git commit -m "chore(exposicoes): ajustes finais e verificação"
```
