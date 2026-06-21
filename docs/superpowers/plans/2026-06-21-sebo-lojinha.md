# Sebo & Lojinha — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar duas páginas de catálogo (Sebo e Lojinha), seções na homepage e links de navegação, seguindo o padrão visual da Agenda.

**Architecture:** Duas páginas Astro com React Islands para filtros interativos. Sebo usa JSON estático (snapshot Google Sheets). Lojinha faz fetch da API pública do InfinitePay no build. Ambas seguem a estrutura AgendaPageFilter existente. Componentes compartilham padrões visuais (cards arredondados, texturas, tipografia Buvera).

**Tech Stack:** Astro 6, React 19, TypeScript, Tailwind CSS 4, GSAP 3, InfinitePay API (fetch no build)

---

## Estrutura de Arquivos

```
src/
├── data/
│   └── sebo.json                          # NOVO: 44 livros estáticos
├── types/
│   ├── sebo.ts                            # NOVO: interface LivroSebo
│   └── loja.ts                            # NOVO: interface ProdutoLoja
├── pages/
│   ├── sebo.astro                         # NOVO: página /sebo
│   ├── lojinha.astro                      # NOVO: página /lojinha
│   └── index.astro                        # MODIFICAR: adicionar seções home
├── components/
│   ├── islands/
│   │   ├── SeboFilter.tsx                 # NOVO: filtro interativo Sebo
│   │   └── LojaFilter.tsx                 # NOVO: filtro interativo Lojinha
│   ├── sections/
│   │   ├── SeboHome.astro                 # NOVO: teaser Sebo na home
│   │   └── LojaHome.astro                 # NOVO: teaser Lojinha na home
│   └── ui/
│       ├── Navbar.astro                   # MODIFICAR: links Sebo + Loja
│       └── ... (MobileNav.tsx)            # MODIFICAR: links Sebo + Loja
├── animations/
│   ├── sebo.ts                            # NOVO: GSAP cards Sebo
│   └── loja.ts                            # NOVO: GSAP cards Lojinha
└── components/islands/
    └── MobileNav.tsx                      # MODIFICAR: links Sebo + Loja
```

---

### Task 1: Tipos TypeScript

**Files:**
- Create: `src/types/sebo.ts`
- Create: `src/types/loja.ts`

- [ ] **Step 1: Criar interface LivroSebo**

```typescript
// src/types/sebo.ts
export interface LivroSebo {
  autor: string;
  titulo: string;
  editora: string;
  genero: string;
  valor: string;
}

/** Gêneros disponíveis no acervo (extraídos da planilha) */
export const GENEROS_SEBO = [
  "Romance",
  "Poesia",
  "Teatro",
  "Biografia",
  "Auto Ajuda",
  "Crítica",
  "Crônica",
  "Contos",
  "Feminismo",
  "Tecnologia",
  "Religioso",
  "Cristianismo",
  "Meditação",
  "Entrevista",
  "Literatura Juvenil",
  "Literatura Inglesa",
  "Infantil/Paradidático",
] as const;

export type GeneroSebo = (typeof GENEROS_SEBO)[number];

/** Mapeia cada gênero a uma cor (bolinha + badge) */
export const CORES_GENERO: Record<string, string> = {
  Romance: "#EC6838",
  Poesia: "#777BDE",
  "Teatro Brasileiro": "#9E4B2D",
  Teatro: "#9E4B2D",
  Biografia: "#DEC72C",
  "Auto Ajuda": "#8E8100",
  Crítica: "#C4A54B",
  Crônica: "#E08D3D",
  Contos: "#6B5FBF",
  Feminismo: "#D2BCFA",
  Tecnologia: "#1D432C",
  Religioso: "#5548A5",
  Cristianismo: "#5548A5",
  Meditação: "#BDB2DD",
  Entrevista: "#C86440",
  "Literatura Juvenil": "#F0DCB4",
  "Literatura Inglesa": "#3D1020",
  "Infantil/Paradidático": "#B9E4EB",
};
```

- [ ] **Step 2: Criar interface ProdutoLoja**

```typescript
// src/types/loja.ts
export interface ProdutoLoja {
  slug: string;
  titulo: string;
  descricao: string;
  preco: string;
  imagemUrl: string | null;
  categoria: string;
  productUrl: string;
  variationId: number | null;
}

/** Categorias da loja InfinitePay */
export const CATEGORIAS_LOJA = ["Livros", "Leitura e Criação"] as const;
export type CategoriaLoja = (typeof CATEGORIAS_LOJA)[number];

export const CORES_CATEGORIA_LOJA: Record<string, string> = {
  Livros: "#1D432C",
  "Leitura e Criação": "#777BDE",
};
```

- [ ] **Step 3: Rodar typecheck e commit**

```bash
bun run check && git add src/types/sebo.ts src/types/loja.ts && git commit -m "feat(sebo-lojinha): adicionar tipos TypeScript para Sebo e Lojinha"
```

---

### Task 2: Dados estáticos do Sebo

**Files:**
- Create: `src/data/sebo.json`

- [ ] **Step 1: Criar arquivo JSON com os 44 livros**

```json
[
  { "autor": "Adriana Benevides Soares, Luciana Mourão", "titulo": "100 Mestres Em Psicologia", "editora": "Appris", "genero": "Psicologia", "valor": "R$ 10,00" },
  { "autor": "Alexandre Dumas", "titulo": "Les Mousquetaires", "editora": "Credit Mutuel", "genero": "Romance", "valor": "R$ 5,00" },
  { "autor": "Ana Martins Marques", "titulo": "O Livro das semelhanças", "editora": "Companhia das Letras", "genero": "Poesia", "valor": "R$ 8,00" },
  { "autor": "Ariano Suassuna", "titulo": "Teatro Moderno: O Auto da Compadecida", "editora": "Agir", "genero": "Teatro Brasileiro", "valor": "R$ 5,00" },
  { "autor": "Arthur Dapieve", "titulo": "De cada amor tu herdarás só o cinismo", "editora": "Objetiva", "genero": "Romance", "valor": "R$ 10,00" },
  { "autor": "Carlos Calado", "titulo": "Coleção Folha Soul&Blues: Stivie Wonder", "editora": "Folha de São Paulo", "genero": "Bibliografia", "valor": "R$ 5,00" },
  { "autor": "Carlos Calado", "titulo": "Coleção Folha Soul&Blues: Marvin Gaye", "editora": "Folha de São Paulo", "genero": "Bibliografia", "valor": "R$ 5,00" },
  { "autor": "Carlos Eduardo Novaes", "titulo": "O Menino Sem Imaginação", "editora": "Ática", "genero": "Romance", "valor": "R$ 5,00" },
  { "autor": "Caroline Criado Perez", "titulo": "Mulheres Invisíveis: O viés dos dados em um mundo projetado para homens", "editora": "Instrinseca", "genero": "Feminismo", "valor": "R$ 15,00" },
  { "autor": "Celio Montenegro", "titulo": "Uma Vida Emprestada", "editora": "Leituras Educativas", "genero": "Romance", "valor": "R$ 10,00" },
  { "autor": "Cherry Hartman", "titulo": "Terapia do Bem-Estar", "editora": "Paulus", "genero": "Auto Ajuda", "valor": "R$ 5,00" },
  { "autor": "Chrus Fuscaldo, Marcelo Bortoloti", "titulo": "Viver é melhor que sonhar: os últimos caminhos de belchior", "editora": "Sonora", "genero": "Biografia", "valor": "R$ 20,00" },
  { "autor": "Conceição Evaristo", "titulo": "Becos da Memória", "editora": "Pallas", "genero": "Romance", "valor": "R$ 15,00" },
  { "autor": "Délia María De Césaris", "titulo": "Iván, el Terrible", "editora": "Santilla", "genero": "Infantil/Paradidático", "valor": "R$ 5,00" },
  { "autor": "Eurípedes Rodrigues dos Reis", "titulo": "Pais e Filhos: Uma relação delicada", "editora": "Mundo Maior", "genero": "Auto Ajuda", "valor": "R$ 5,00" },
  { "autor": "Fenimor Cooper", "titulo": "O Último dos Moicanos", "editora": "Ediouro", "genero": "Literatura Juvenil", "valor": "R$ 5,00" },
  { "autor": "Gayle Forman", "titulo": "Se eu ficar", "editora": "Novo Conceito", "genero": "Romance", "valor": "R$ 15,00" },
  { "autor": "Gayle Forman", "titulo": "Para onde ela foi", "editora": "Novo Conceito", "genero": "Romance", "valor": "R$ 15,00" },
  { "autor": "Gerry Maguire Thompson", "titulo": "Meditação Palabra Básica: Uma introdução à antiga arte da meditação", "editora": "Vitória Regia", "genero": "Meditação", "valor": "R$ 5,00" },
  { "autor": "Hernest Hemingway", "titulo": "O Velho e o Mar", "editora": "Bertrand", "genero": "Romance", "valor": "R$ 15,00" },
  { "autor": "Hidelberto Aleluia", "titulo": "O futuro da internet: o mundo da dúvida", "editora": "Topbooks", "genero": "Tecnologia", "valor": "R$ 10,00" },
  { "autor": "Ingrid Betancourt", "titulo": "Não há silêncio que não termine", "editora": "Companhia das Letras", "genero": "Biografia", "valor": "R$ 20,00" },
  { "autor": "Isabel Alende", "titulo": "A ilha sob o mar", "editora": "Bertrand", "genero": "Romance", "valor": "R$ 15,00" },
  { "autor": "João Pedro Roriz", "titulo": "A poesia teatral", "editora": "Ibis Libris", "genero": "Teatro", "valor": "R$ 10,00" },
  { "autor": "Jorge Amado", "titulo": "Mar Morto", "editora": "Record", "genero": "Romance", "valor": "R$ 10,00" },
  { "autor": "Leon Uris", "titulo": "Exodus", "editora": "BestBolso", "genero": "Romance", "valor": "R$ 15,00" },
  { "autor": "Lisa Beth Kovetz", "titulo": "O clube do conto erótico", "editora": "Bertrand", "genero": "Romance", "valor": "R$ 20,00" },
  { "autor": "Machado de Assis", "titulo": "O Jornal e o Livro", "editora": "Penguin & Companhia das Letras", "genero": "Crítica", "valor": "R$ 5,00" },
  { "autor": "Mark Finley", "titulo": "Esperança: Além da Crise", "editora": "Casa Publicadora Brasileira", "genero": "Religioso", "valor": "R$ 5,00" },
  { "autor": "Markus Zusak", "titulo": "A menina que roubava livros", "editora": "Intrínseca", "genero": "Romance", "valor": "R$ 20,00" },
  { "autor": "Martha Medeiros", "titulo": "Doidas e Santas", "editora": "L&PM", "genero": "Crônica", "valor": "R$ 10,00" },
  { "autor": "Milan Kundera", "titulo": "Risíveis Amores", "editora": "Nova Fronteira", "genero": "Romance", "valor": "R$ 5,00" },
  { "autor": "Milan Kundera", "titulo": "A Insustentável Leveza do ser", "editora": "Nova Fronteira", "genero": "Romance", "valor": "R$ 5,00" },
  { "autor": "Osmar Barbosa", "titulo": "Antologia: Os mais belos poemas de amor da literatura brasileira", "editora": "Ediouro", "genero": "Poesia", "valor": "R$ 5,00" },
  { "autor": "Osvalino Monteiro", "titulo": "Conhecer para crer: O conhecimento que traz liberdade", "editora": "Livre Expansão", "genero": "Cristianismo", "valor": "R$ 5,00" },
  { "autor": "Paulo Flávio Ledur", "titulo": "Os Pecados da Lingua", "editora": "AGE", "genero": "Religioso", "valor": "R$ 20,00" },
  { "autor": "Roger Chartier", "titulo": "A Aventura do livro: do leitor ou navegador", "editora": "Unesp", "genero": "Entrevista", "valor": "R$ 15,00" },
  { "autor": "Sylvia Day", "titulo": "Toda Sua", "editora": "Paralela", "genero": "Romance", "valor": "R$ 15,00" },
  { "autor": "Tatiana Levy", "titulo": "A chave de casa", "editora": "Record", "genero": "Romance", "valor": "R$ 15,00" },
  { "autor": "Theo Coster", "titulo": "Os colegas de Anne Frank", "editora": "Objetiva", "genero": "Biografia", "valor": "R$ 10,00" },
  { "autor": "Tom Mc Grath", "titulo": "Terapia do Stress", "editora": "Paulus", "genero": "Auto Ajuda", "valor": "R$ 5,00" },
  { "autor": "Umberto Eco, Jean-Claude Carrière", "titulo": "Não contem com o fim do livro", "editora": "Record", "genero": "Entrevista", "valor": "R$ 10,00" },
  { "autor": "Vários", "titulo": "20 Contos sobre a pandemia de 2020", "editora": "Autêntica", "genero": "Contos", "valor": "R$ 15,00" },
  { "autor": "Virgínia Wolf", "titulo": "As Ondas", "editora": "Nova Fronteira", "genero": "Literatura Inglesa", "valor": "R$ 10,00" },
  { "autor": "William Shakespeare", "titulo": "Antônio e Cleóptra", "editora": "Topbooks", "genero": "Teatro", "valor": "R$ 15,00" }
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/sebo.json && git commit -m "feat(sebo): adicionar dados estáticos do acervo do sebo (44 livros)"
```

---

### Task 3: Página Sebo

**Files:**
- Create: `src/pages/sebo.astro`

- [ ] **Step 1: Criar a página Astro do Sebo**

```astro
---
// src/pages/sebo.astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import Footer from "@/components/sections/Footer.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import NoiseTexture from "@/components/ui/NoiseTexture.astro";
import Decorative from "@/components/ui/Decorative.astro";
import SeboFilter from "@/components/islands/SeboFilter";
import seboData from "@/data/sebo.json";
import type { LivroSebo } from "@/types/sebo";

const livros: LivroSebo[] = seboData;
---

<BaseLayout
  title="Sebo — Estúdio Entre"
  description="Catálogo de livros usados do Estúdio Entre. Garimpe por gênero, autor ou título."
  navTheme="dark"
>
  <main class="relative min-h-screen overflow-hidden bg-cream pb-24 pt-32 text-bordo md:pb-40 md:pt-40">
    <!-- Texturas -->
    <HalftoneTexture density={14} dotSize={1.5} color="61,16,32" opacity={0.03} class="z-0" />
    <NoiseTexture opacity={0.06} />

    <!-- Header -->
    <div class="relative z-10 bg-cyan px-4 pb-20 pt-16 md:px-16 md:pb-28 md:pt-20" style="background-color: #b9e4eb;">
      <!-- Dot grid -->
      <div class="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style="background-image: radial-gradient(rgba(61,16,32,0.7) 1.2px, transparent 1.2px); background-size: 50px 50px;">
      </div>
      <!-- Watermark -->
      <div class="absolute -bottom-[10%] -right-[5%] z-0 pointer-events-none opacity-[0.03] select-none"
        aria-hidden="true">
        <span class="font-display font-black text-[50vw] leading-none text-bordo italic">e</span>
      </div>

      <div class="relative z-10 mx-auto max-w-[1300px]">
        <p class="font-display text-[11px] font-black uppercase tracking-[0.4em] text-bordo/30">
          Catálogo de Livros Usados
        </p>
        <h1 class="mt-6 font-display text-[clamp(3.5rem,10vw,8.5rem)] font-black uppercase leading-[0.8] text-bordo">
          SEBO<br />
          <span class="text-orange italic">Entre</span>
        </h1>
        <p class="mt-8 max-w-xl text-base leading-relaxed text-bordo/45 md:text-lg">
          Livros que já viveram outras histórias, prontos para encontrar novas mãos.
        </p>
      </div>

      <!-- Decorativos -->
      <div class="absolute right-[8%] top-24 z-0 opacity-15">
        <Decorative variant="star" color="#3D1020" size={48} />
      </div>
      <div class="absolute bottom-16 left-[6%] z-0 opacity-10">
        <Decorative variant="dots" color="#3D1020" size={40} />
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="relative z-10 mx-auto max-w-[1300px] px-4 md:px-16">
      <SeboFilter client:load livros={livros} />
    </div>
  </main>

  <Footer />
</BaseLayout>

<script>
  import { gsap } from "gsap";

  gsap.to(".decorative-asset", {
    y: "random(-15, 15)",
    x: "random(-10, 10)",
    rotation: "random(-5, 5)",
    duration: "random(3, 5)",
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: { amount: 2, from: "random" }
  });
</script>
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/sebo.astro && git commit -m "feat(sebo): criar página /sebo com header editorial"
```

---

### Task 4: React Island — SeboFilter

**Files:**
- Create: `src/components/islands/SeboFilter.tsx`

- [ ] **Step 1: Criar o componente React de filtro do Sebo**

```tsx
// src/components/islands/SeboFilter.tsx
import type { LivroSebo } from "@/types/sebo";
import { CORES_GENERO } from "@/types/sebo";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface SeboFilterProps {
  livros: LivroSebo[];
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function SeboFilter({ livros }: SeboFilterProps) {
  const [activeGenero, setActiveGenero] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const generos = useMemo(() => {
    const counts = new Map<string, number>();
    for (const livro of livros) {
      counts.set(livro.genero, (counts.get(livro.genero) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1]);
  }, [livros]);

  const searchTerm = normalizeText(search);

  const filteredLivros = useMemo(
    () =>
      livros.filter((livro) => {
        const matchesGenero = activeGenero === "todos" || livro.genero === activeGenero;
        const matchesSearch =
          !searchTerm ||
          normalizeText(livro.titulo).includes(searchTerm) ||
          normalizeText(livro.autor).includes(searchTerm) ||
          normalizeText(livro.editora).includes(searchTerm);
        return matchesGenero && matchesSearch;
      }),
    [livros, activeGenero, searchTerm],
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".sebo-card");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power4.out",
        clearProps: "all",
      },
    );
  }, [activeGenero, search]);

  if (livros.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-bordo/10 bg-cream/70 px-6 py-16 text-center">
        <p className="font-display text-3xl font-black italic uppercase text-bordo">
          Acervo vazio no momento.
        </p>
        <p className="mt-4 text-sm text-bordo/60">Em breve, novos livros entram no catálogo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Filter Panel */}
      <section className="-mt-10 rounded-[2.5rem] border border-white/40 bg-white/50 p-5 shadow-2xl shadow-bordo/5 backdrop-blur-sm md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          {/* Search */}
          <div className="relative w-full max-w-xl">
            <label
              htmlFor="search-sebo"
              className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-bordo/50 md:text-[11px]"
            >
              Garimpar no acervo
            </label>
            <div className="relative group">
              <input
                id="search-sebo"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Título, autor ou editora..."
                className="w-full rounded-t-xl border-b-2 border-bordo/10 bg-bordo/[0.03] px-5 py-4 text-base font-medium text-bordo outline-none transition-all placeholder:text-bordo/30 focus:border-orange focus:bg-white md:py-5"
              />
              <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within:opacity-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="space-y-4">
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-bordo/50 md:text-[11px]">
              Gêneros
            </span>
            <nav className="flex flex-wrap gap-3" aria-label="Filtrar por gênero">
              <button
                type="button"
                aria-pressed={activeGenero === "todos"}
                onClick={() => setActiveGenero("todos")}
                className={`rounded-full border-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm md:px-8 md:py-3.5 md:text-[11px] ${
                  activeGenero === "todos"
                    ? "border-bordo bg-bordo text-cream shadow-bordo/20"
                    : "border-bordo/10 bg-white text-bordo/60 hover:border-bordo/30 hover:text-bordo"
                }`}
              >
                Todos · {livros.length}
              </button>
              {generos.map(([genero, count]) => (
                <button
                  key={genero}
                  type="button"
                  aria-pressed={activeGenero === genero}
                  onClick={() => setActiveGenero(genero)}
                  className="rounded-full border-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 md:px-8 md:py-3.5 md:text-[11px]"
                  style={
                    activeGenero === genero
                      ? {
                          backgroundColor: CORES_GENERO[genero] ?? "#EC6838",
                          borderColor: CORES_GENERO[genero] ?? "#EC6838",
                          color: ["Biografia", "Literatura Juvenil", "Infantil/Paradidático"].includes(genero) ? "#1A1612" : "#F0EDE8",
                        }
                      : {
                          borderColor: "rgb(61,16,32,0.1)",
                          color: "rgb(61,16,32,0.6)",
                          backgroundColor: "white",
                        }
                  }
                >
                  {genero} · {count}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Book grid */}
      <div ref={containerRef}>
        {filteredLivros.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredLivros.map((livro, i) => (
              <article
                key={`${livro.titulo}-${livro.autor}-${i}`}
                className="sebo-card group rounded-[2rem] bg-white p-8 shadow-lg shadow-bordo/[0.03] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-bordo/[0.06]"
              >
                {/* Genre dot + label */}
                <div className="mb-5 flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CORES_GENERO[livro.genero] ?? "#EC6838" }}
                  />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-bordo/30">
                    {livro.genero}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display text-xl font-black uppercase leading-[1.05] text-near-black md:text-2xl">
                  {livro.titulo}
                </h2>

                {/* Author · Publisher */}
                <p className="mt-2 text-sm text-bordo/40">
                  {livro.autor}
                  <span className="mx-2 opacity-20">·</span>
                  {livro.editora}
                </p>

                {/* Price + WhatsApp */}
                <div className="mt-7 flex items-center justify-between border-t border-bordo/[0.04] pt-6">
                  <span className="font-display text-2xl font-black text-orange">
                    {livro.valor}
                  </span>
                  <a
                    href={`https://wa.me/5521973101451?text=${encodeURIComponent(`Olá! Tenho interesse no livro: ${livro.titulo}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] transition-transform duration-300 hover:scale-110"
                    aria-label={`Comprar ${livro.titulo} via WhatsApp`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-white/20 bg-white/30 px-5 py-16 text-center backdrop-blur-sm md:rounded-[3rem] md:px-6 md:py-24">
            <p className="font-display text-3xl font-black uppercase leading-none text-bordo/80 md:text-4xl">
              Nenhum livro <br />
              <span className="text-orange opacity-100">encontrado.</span>
            </p>
            <p className="mx-auto mt-6 max-w-xl text-sm font-medium leading-relaxed text-bordo/50 md:mt-8">
              Tente ajustar seus filtros ou buscar por outro termo.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12 md:gap-4">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveGenero("todos");
                }}
                className="rounded-full border border-bordo/20 px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] text-bordo/60 transition-all hover:border-bordo hover:text-bordo md:px-10 md:py-4 md:text-[10px]"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/islands/SeboFilter.tsx && git commit -m "feat(sebo): adicionar filtro interativo com React Island"
```

---

### Task 5: Animação GSAP — Sebo

**Files:**
- Create: `src/animations/sebo.ts`

- [ ] **Step 1: Criar módulo de animação para o Sebo (home section)**

```typescript
// src/animations/sebo.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateSeboHome(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  gsap.fromTo(
    ".sebo-home__eyebrow",
    { opacity: 0, y: 15 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".sebo-home",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );

  gsap.fromTo(
    ".sebo-home__title",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".sebo-home",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/animations/sebo.ts && git commit -m "feat(sebo): adicionar animação GSAP para seção home"
```

---

### Task 6: Seção Sebo na Home

**Files:**
- Create: `src/components/sections/SeboHome.astro`

- [ ] **Step 1: Criar seção teaser do Sebo para a homepage**

```astro
---
// src/components/sections/SeboHome.astro
import Decorative from "@/components/ui/Decorative.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import seboData from "@/data/sebo.json";
import type { LivroSebo } from "@/types/sebo";
import { CORES_GENERO } from "@/types/sebo";

const destaques: LivroSebo[] = seboData.slice(0, 4);
---

<section
  class="sebo-home relative overflow-hidden px-6 py-20 md:px-16 md:py-28"
  style="background-color: #b9e4eb; color: #3d1020;"
  id="sebo"
  aria-label="Sebo Entre"
>
  <HalftoneTexture density={14} dotSize={1.5} color="61,16,32" opacity={0.04} class="z-0" />

  <div class="absolute right-[10%] top-[15%] z-0 opacity-15">
    <Decorative variant="star" color="#3D1020" size={40} />
  </div>
  <div class="absolute bottom-[20%] left-[5%] z-0 opacity-10">
    <Decorative variant="dots" color="#3D1020" size={50} />
  </div>

  <div class="relative z-10 mx-auto max-w-[1300px]">
    <div class="sebo-home__header mb-6 md:mb-12">
      <div class="mb-6 overflow-hidden">
        <p class="sebo-home__eyebrow font-display text-[10px] font-bold uppercase tracking-[0.4em] text-bordo/30">
          Catálogo de Livros Usados
        </p>
      </div>
      <h2 class="sebo-home__title flex flex-col md:flex-row md:flex-wrap md:items-end gap-x-8 gap-y-2">
        <span class="sebo-home__title-line block font-display text-[clamp(2rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-bordo">
          Garimpe no
        </span>
        <span class="sebo-home__title-line block font-display text-[clamp(2rem,5.5vw,5rem)] font-black italic uppercase leading-[0.9] text-orange">
          Sebo
        </span>
      </h2>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {destaques.map((livro) => (
        <article class="group rounded-[1.5rem] bg-white p-6 shadow-lg shadow-bordo/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
          <div class="mb-4 flex items-center gap-2">
            <span
              class="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: CORES_GENERO[livro.genero] ?? "#EC6838" }}
            />
            <span class="text-[8px] font-black uppercase tracking-[0.25em] text-bordo/25">
              {livro.genero}
            </span>
          </div>
          <h3 class="font-display text-base font-black uppercase leading-[1.05] text-near-black md:text-lg">
            {livro.titulo}
          </h3>
          <p class="mt-1.5 text-xs text-bordo/35">
            {livro.autor}
          </p>
          <p class="mt-4 font-display text-lg font-black text-orange md:text-xl">
            {livro.valor}
          </p>
        </article>
      ))}
    </div>

    <div class="mt-12 flex justify-center md:mt-16">
      <a
        href="/sebo"
        class="group inline-flex items-center gap-3 rounded-full border border-bordo/30 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-bordo transition-all duration-500 hover:bg-bordo hover:text-cream"
      >
        Ver acervo completo
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          class="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </div>
  </div>
</section>

<script>
  import { animateSeboHome } from "@/animations/sebo";
  animateSeboHome();
</script>

<style>
  .sebo-home__title-line {
    will-change: transform, opacity;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/SeboHome.astro && git commit -m "feat(sebo): adicionar seção teaser na homepage"
```

---

### Task 7: Página Lojinha + Fetch InfinitePay

**Files:**
- Create: `src/pages/lojinha.astro`

- [ ] **Step 1: Criar a página Astro da Lojinha com fetch da API InfinitePay**

```astro
---
// src/pages/lojinha.astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import Footer from "@/components/sections/Footer.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import NoiseTexture from "@/components/ui/NoiseTexture.astro";
import Decorative from "@/components/ui/Decorative.astro";
import LojaFilter from "@/components/islands/LojaFilter";
import type { ProdutoLoja } from "@/types/loja";

interface InfinitePayCatalogItem {
  title: string;
  price: string;
  available: boolean;
  category?: string;
  detailUrl: string;
}

interface InfinitePayDetail {
  description: string;
  imageUrl: string | null;
  variationId: number | null;
}

const INFINITE_PAY_CATALOG = "https://loja.infinitepay.io/llms/thaynawho.txt";
const INFINITE_PAY_PRODUCT_BASE = "https://loja.infinitepay.io/thaynawho";

let produtos: ProdutoLoja[] = [];
let fetchError: string | null = null;

try {
  // 1. Fetch catalog
  const catalogResponse = await fetch(INFINITE_PAY_CATALOG);
  if (!catalogResponse.ok) {
    throw new Error(`Catalog fetch failed: ${catalogResponse.status}`);
  }
  const catalogText = await catalogResponse.text();

  // 2. Parse catalog (extract product links and basic info)
  const productLinks: { slug: string; title: string; price: string; category: string; detailUrl: string }[] = [];
  const lines = catalogText.split("\n");

  let currentCategory = "";
  for (const line of lines) {
    // Detect category headers
    if (line.startsWith("- ") && (line.includes("leitura-e-criacao") || line.includes("livros"))) {
      currentCategory = line.includes("Livros") ? "Livros" : "Leitura e Criação";
    }

    // Detect product lines: "- Product Name - R$ XX,00 - available - detailUrl"
    const productMatch = line.match(/^- (.+?) - (R\$\s?[\d,.]+) - (available|unavailable) - (.+)$/);
    if (productMatch) {
      const [, title, price, , detailUrl] = productMatch;
      const slug = detailUrl.split("/").pop()?.replace(".txt", "") ?? "";

      productLinks.push({
        slug,
        title: title.trim(),
        price: price.trim(),
        category: currentCategory || "Livros",
        detailUrl: detailUrl.trim(),
      });
    }
  }

  // 3. Fetch product details in parallel
  const detailFetches = productLinks
    .filter((p) => p.slug)
    .map(async (product) => {
      try {
        const detailResponse = await fetch(product.detailUrl);
        if (!detailResponse.ok) return null;

        const detailText = await detailResponse.text();

        // Extract description (after "## Description" until next "##")
        const descMatch = detailText.match(/## Description\n+(.+?)(?=\n##|\n\Z)/s);
        const descricao = descMatch?.[1]?.trim() ?? "";

        // Extract image URL
        const imgMatch = detailText.match(/https:\/\/infinitepay-sales[^\s)]+/);
        const imagemUrl = imgMatch?.[0] ?? null;

        // Extract variation_id
        const varMatch = detailText.match(/variation_id\s+(\d+)/);
        const variationId = varMatch ? Number.parseInt(varMatch[1]) : null;

        return {
          ...product,
          descricao: descricao.replace(/^Autora?:.+?\n?/gm, "").trim(),
          imagemUrl,
          variationId,
        } satisfies ProdutoLoja & { detailUrl?: string };
      } catch {
        return null;
      }
    });

  const results = await Promise.all(detailFetches);
  produtos = results
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => ({
      slug: p.slug,
      titulo: p.title,
      descricao: p.descricao,
      preco: p.price,
      imagemUrl: p.imagemUrl,
      categoria: p.category,
      productUrl: `${INFINITE_PAY_PRODUCT_BASE}/${p.slug}`,
      variationId: p.variationId,
    }));
} catch (error) {
  console.error("Falha ao buscar produtos da loja InfinitePay:", error);
  fetchError = "Loja indisponível no momento. Tente novamente mais tarde.";
}
---

<BaseLayout
  title="Loja — Estúdio Entre"
  description="Produtos autorais, publicações independentes e objetos que carregam a essência do Estúdio Entre."
  navTheme="dark"
>
  <main class="relative min-h-screen overflow-hidden bg-cream pb-24 pt-32 text-forest md:pb-40 md:pt-40">
    <!-- Texturas -->
    <HalftoneTexture density={12} dotSize={1} color="29,67,44" opacity={0.03} class="z-0" />
    <NoiseTexture opacity={0.06} />

    <!-- Header -->
    <div class="relative z-10 mx-auto max-w-[1300px] px-4 md:px-16">
      <header class="mb-12 max-w-4xl md:mb-20">
        <p class="font-display text-[11px] font-black uppercase tracking-[0.4em] text-forest/40">
          Produtos & Publicações
        </p>
        <h1 class="mt-6 font-display text-[clamp(3.5rem,10vw,8.5rem)] font-black uppercase leading-[0.8] text-forest">
          LOJA<br />
          <span class="text-orange italic">Entre</span>
        </h1>
        <p class="mt-8 max-w-xl text-base leading-relaxed text-forest/60 md:text-lg">
          Produtos autorais, publicações independentes e objetos que carregam a essência do Estúdio.
        </p>
      </header>

      <!-- Decorativos -->
      <div class="absolute right-[8%] top-24 z-0 opacity-15">
        <Decorative variant="star" color="#EC6838" size={40} />
      </div>
      <div class="absolute bottom-24 left-[6%] z-0 opacity-10">
        <Decorative variant="dots" color="#3D1020" size={40} />
      </div>

      {fetchError ? (
        <div class="rounded-[2.5rem] border border-forest/10 bg-cream/70 px-6 py-16 text-center">
          <p class="font-display text-3xl font-black italic uppercase text-forest">{fetchError}</p>
        </div>
      ) : (
        <LojaFilter client:load produtos={produtos} />
      )}
    </div>
  </main>

  <Footer />
</BaseLayout>

<script>
  import { gsap } from "gsap";

  gsap.to(".decorative-asset", {
    y: "random(-15, 15)",
    x: "random(-10, 10)",
    rotation: "random(-5, 5)",
    duration: "random(3, 5)",
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: { amount: 2, from: "random" }
  });
</script>
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/lojinha.astro && git commit -m "feat(lojinha): criar página /lojinha com fetch da API InfinitePay"
```

---

### Task 8: React Island — LojaFilter

**Files:**
- Create: `src/components/islands/LojaFilter.tsx`

- [ ] **Step 1: Criar o componente React de filtro da Lojinha**

```tsx
// src/components/islands/LojaFilter.tsx
import type { ProdutoLoja } from "@/types/loja";
import { CORES_CATEGORIA_LOJA } from "@/types/loja";
import { gsap } from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

interface LojaFilterProps {
  produtos: ProdutoLoja[];
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function LojaFilter({ produtos }: LojaFilterProps) {
  const [activeCategoria, setActiveCategoria] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const categorias = useMemo(() => {
    const counts = new Map<string, number>();
    for (const produto of produtos) {
      counts.set(produto.categoria, (counts.get(produto.categoria) ?? 0) + 1);
    }
    return Array.from(counts.entries());
  }, [produtos]);

  const searchTerm = normalizeText(search);

  const filteredProdutos = useMemo(
    () =>
      produtos.filter((produto) => {
        const matchesCategoria = activeCategoria === "todos" || produto.categoria === activeCategoria;
        const matchesSearch =
          !searchTerm ||
          normalizeText(produto.titulo).includes(searchTerm) ||
          normalizeText(produto.descricao).includes(searchTerm);
        return matchesCategoria && matchesSearch;
      }),
    [produtos, activeCategoria, searchTerm],
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".loja-card");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power4.out",
        clearProps: "all",
      },
    );
  }, [activeCategoria, search]);

  if (produtos.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-forest/10 bg-cream/70 px-6 py-16 text-center">
        <p className="font-display text-3xl font-black italic uppercase text-forest">
          Nenhum produto disponível no momento.
        </p>
        <p className="mt-4 text-sm text-forest/60">Volte em breve para conferir as novidades.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Filter Panel */}
      <section className="rounded-[2.5rem] border border-white/40 bg-white/50 p-5 shadow-2xl shadow-forest/5 backdrop-blur-sm md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="relative w-full max-w-xl">
            <label
              htmlFor="search-loja"
              className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-forest/50 md:text-[11px]"
            >
              Buscar na loja
            </label>
            <div className="relative group">
              <input
                id="search-loja"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome do produto..."
                className="w-full rounded-t-xl border-b-2 border-forest/10 bg-forest/[0.03] px-5 py-4 text-base font-medium text-forest outline-none transition-all placeholder:text-forest/30 focus:border-orange focus:bg-white md:py-5"
              />
              <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within:opacity-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-forest/50 md:text-[11px]">
              Categorias
            </span>
            <nav className="flex flex-wrap gap-3" aria-label="Filtrar por categoria">
              <button
                type="button"
                aria-pressed={activeCategoria === "todos"}
                onClick={() => setActiveCategoria("todos")}
                className={`rounded-full border-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm md:px-8 md:py-3.5 md:text-[11px] ${
                  activeCategoria === "todos"
                    ? "border-forest bg-forest text-cream shadow-forest/20"
                    : "border-forest/10 bg-white text-forest/60 hover:border-forest/30 hover:text-forest"
                }`}
              >
                Todos · {produtos.length}
              </button>
              {categorias.map(([categoria, count]) => (
                <button
                  key={categoria}
                  type="button"
                  aria-pressed={activeCategoria === categoria}
                  onClick={() => setActiveCategoria(categoria)}
                  className="rounded-full border-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 md:px-8 md:py-3.5 md:text-[11px]"
                  style={
                    activeCategoria === categoria
                      ? {
                          backgroundColor: CORES_CATEGORIA_LOJA[categoria] ?? "#1D432C",
                          borderColor: CORES_CATEGORIA_LOJA[categoria] ?? "#1D432C",
                          color: "#F0EDE8",
                        }
                      : {
                          borderColor: "rgb(29,67,44,0.1)",
                          color: "rgb(29,67,44,0.6)",
                          backgroundColor: "white",
                        }
                  }
                >
                  {categoria} · {count}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <div ref={containerRef}>
        {filteredProdutos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProdutos.map((produto) => (
              <article
                key={produto.slug}
                className="loja-card group overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-forest/[0.03] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/[0.06]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-cream to-[#e8e0d4]">
                  {produto.imagemUrl ? (
                    <img
                      src={produto.imagemUrl}
                      alt={produto.titulo}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center opacity-20">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  {/* Category badge */}
                  <span
                    class="absolute left-4 top-4 rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-cream shadow-lg backdrop-blur-sm"
                    style={{ backgroundColor: (CORES_CATEGORIA_LOJA[produto.categoria] ?? "#1D432C") + "ee" }}
                  >
                    {produto.categoria}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7">
                  <h2 className="font-display text-lg font-black uppercase leading-[1.1] text-near-black md:text-xl">
                    {produto.titulo}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-forest/45">
                    {produto.descricao}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-forest/[0.04] pt-5">
                    <span className="font-display text-xl font-black text-orange md:text-2xl">
                      {produto.preco}
                    </span>
                    <a
                      href={produto.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-bordo px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-cream transition-all hover:bg-orange hover:shadow-lg hover:shadow-orange/20"
                    >
                      Comprar
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-white/20 bg-white/30 px-5 py-16 text-center backdrop-blur-sm md:rounded-[3rem] md:px-6 md:py-24">
            <p className="font-display text-3xl font-black uppercase leading-none text-forest/80 md:text-4xl">
              Nenhum produto <br />
              <span className="text-orange opacity-100">encontrado.</span>
            </p>
            <p className="mx-auto mt-6 max-w-xl text-sm font-medium leading-relaxed text-forest/50 md:mt-8">
              Tente ajustar seus filtros ou buscar por outro termo.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12 md:gap-4">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategoria("todos");
                }}
                className="rounded-full border border-forest/20 px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] text-forest/60 transition-all hover:border-forest hover:text-forest md:px-10 md:py-4 md:text-[10px]"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/islands/LojaFilter.tsx && git commit -m "feat(lojinha): adicionar filtro interativo para Lojinha"
```

---

### Task 9: Animação GSAP — Lojinha Home

**Files:**
- Create: `src/animations/loja.ts`

- [ ] **Step 1: Criar módulo de animação para Loja Home**

```typescript
// src/animations/loja.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateLojaHome(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  gsap.fromTo(
    ".loja-home__eyebrow",
    { opacity: 0, y: 15 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".loja-home",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );

  gsap.fromTo(
    ".loja-home__title",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".loja-home",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/animations/loja.ts && git commit -m "feat(lojinha): adicionar animação GSAP para seção home da loja"
```

---

### Task 10: Seção Lojinha na Home

**Files:**
- Create: `src/components/sections/LojaHome.astro`

- [ ] **Step 1: Criar seção teaser da Lojinha para homepage**

```astro
---
// src/components/sections/LojaHome.astro
import Decorative from "@/components/ui/Decorative.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import type { ProdutoLoja } from "@/types/loja";
import { CORES_CATEGORIA_LOJA } from "@/types/loja";

// Dados estáticos de fallback (caso a API esteja offline no build da home)
const destaquesFallback: Pick<ProdutoLoja, "titulo" | "preco" | "categoria" | "slug" | "imagemUrl">[] = [
  { titulo: "A delicada composição dos dias", preco: "R$ 60,00", categoria: "Livros", slug: "rte9908-a-delicada-composicao-dos-dias", imagemUrl: null },
  { titulo: "Biblioterapia Clínica", preco: "R$ 50,00", categoria: "Livros", slug: "nkb3196-biblioterapia-clinica", imagemUrl: null },
  { titulo: "Envelope para Colorir", preco: "R$ 20,00", categoria: "Leitura e Criação", slug: "mci3163-envelope-para-colorir-meus-desenhos-de-col", imagemUrl: null },
];

// Tenta obter produtos da API; usa fallback se falhar
let destaques = destaquesFallback;
// Nota: em produção, este fetch pode ser custoso para a homepage.
// Usamos dados estáticos de 3 produtos como fallback para não penalizar o LCP.
// A página /lojinha faz o fetch completo.
---

<section
  class="loja-home relative overflow-hidden px-6 py-20 md:px-16 md:py-28"
  style="background-color: #f0ede8; color: #1d432c;"
  id="loja"
  aria-label="Loja Entre"
>
  <HalftoneTexture density={12} dotSize={1} color="29,67,44" opacity={0.03} class="z-0" />

  <div class="absolute right-[10%] top-[15%] z-0 opacity-10">
    <Decorative variant="star" color="#EC6838" size={40} />
  </div>
  <div class="absolute bottom-[20%] left-[5%] z-0 opacity-8">
    <Decorative variant="dots" color="#3D1020" size={40} />
  </div>

  <div class="relative z-10 mx-auto max-w-[1300px]">
    <div class="loja-home__header mb-6 md:mb-12">
      <div class="mb-6 overflow-hidden">
        <p class="loja-home__eyebrow font-display text-[10px] font-bold uppercase tracking-[0.4em] text-forest/30">
          Produtos & Publicações
        </p>
      </div>
      <h2 class="loja-home__title flex flex-col md:flex-row md:flex-wrap md:items-end gap-x-8 gap-y-2">
        <span class="loja-home__title-line block font-display text-[clamp(2rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-forest">
          Loja
        </span>
        <span class="loja-home__title-line block font-display text-[clamp(2rem,5.5vw,5rem)] font-black italic uppercase leading-[0.9] text-orange">
          Entre
        </span>
      </h2>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      {destaques.map((produto) => (
        <article class="group overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-forest/[0.03] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
          <div class="relative aspect-[4/3] bg-gradient-to-br from-cream to-[#e8e0d4] flex items-center justify-center">
            <div class="opacity-15">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <span
              class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.15em] text-cream"
              style={{ backgroundColor: CORES_CATEGORIA_LOJA[produto.categoria] ?? "#1D432C" }}
            >
              {produto.categoria}
            </span>
          </div>
          <div class="p-5 md:p-6">
            <h3 class="font-display text-base font-black uppercase leading-[1.1] text-near-black">{produto.titulo}</h3>
            <p class="mt-3 font-display text-lg font-black text-orange">{produto.preco}</p>
          </div>
        </article>
      ))}
    </div>

    <div class="mt-12 flex justify-center md:mt-16">
      <a
        href="/lojinha"
        class="group inline-flex items-center gap-3 rounded-full border border-forest/30 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-forest transition-all duration-500 hover:bg-forest hover:text-cream"
      >
        Ver todos os produtos
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          class="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </div>
  </div>
</section>

<script>
  import { animateLojaHome } from "@/animations/loja";
  animateLojaHome();
</script>

<style>
  .loja-home__title-line {
    will-change: transform, opacity;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/LojaHome.astro && git commit -m "feat(lojinha): adicionar seção teaser na homepage"
```

---

### Task 11: Adicionar seções na Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Adicionar imports no frontmatter**

No arquivo `src/pages/index.astro`, adicionar após a linha 10 (`import VisitacaoCTA from ...`):

```astro
import SeboHome from "@/components/sections/SeboHome.astro";
import LojaHome from "@/components/sections/LojaHome.astro";
```

- [ ] **Step 2: Adicionar seções no template (após Sobre, antes de VisitacaoCTA)**

No corpo do template, modificar a ordem das seções. O resultado final será:

```astro
<BaseLayout title="Estúdio Entre — Hub Cultural no Méier, RJ">
  <Hero />
  <Galeria />
  <Pilares />
  <Agenda eventos={eventos} />
  <Sobre />
  <SeboHome />        <!-- NOVO -->
  <LojaHome />        <!-- NOVO -->
  <VisitacaoCTA />
  <Contato />
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro && git commit -m "feat(sebo-lojinha): adicionar seções SeboHome e LojaHome na homepage"
```

---

### Task 12: Atualizar Navbar (desktop)

**Files:**
- Modify: `src/components/ui/Navbar.astro`

- [ ] **Step 1: Adicionar links Sebo e Loja na navbar desktop**

No array de links da navbar (linha 17-24), adicionar após o link da Galeria e antes de Visitação:

```astro
<li><a href="/sebo" class="navbar__link" data-cursor="GARIMPAR">Sebo</a></li>
<li><a href="/lojinha" class="navbar__link" data-cursor="COMPRAR">Loja</a></li>
```

Posição final dos links:
```
Início → O Lugar → O Estúdio → Exposições → Programação → Galeria → Sebo → Loja → Visitação
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Navbar.astro && git commit -m "feat(sebo-lojinha): adicionar links Sebo e Loja na navbar desktop"
```

---

### Task 13: Atualizar MobileNav

**Files:**
- Modify: `src/components/islands/MobileNav.tsx`

- [ ] **Step 1: Adicionar links no array do MobileNav**

No arquivo `src/components/islands/MobileNav.tsx`, adicionar ao array `links` (após Galeria):

```tsx
const links = [
  { href: "/#galeria", label: "O Lugar" },
  { href: "/#sobre", label: "O Estúdio" },
  { href: "/exposicoes", label: "Exposições" },
  { href: "/agenda", label: "Programação" },
  { href: "/galeria", label: "Galeria" },
  { href: "/sebo", label: "Sebo" },        // NOVO
  { href: "/lojinha", label: "Loja" },      // NOVO
  { href: "/#agendar-visita", label: "Visitação" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/islands/MobileNav.tsx && git commit -m "feat(sebo-lojinha): adicionar links Sebo e Loja no menu mobile"
```

---

### Task 14: Atualizar Footer

**Files:**
- Modify: `src/components/sections/Footer.astro` (linha 92-96, bottom bar)

- [ ] **Step 1: Adicionar links Sebo e Loja na bottom bar do Footer**

No arquivo `src/components/sections/Footer.astro`, modificar o `<div class="flex items-center gap-8">` na bottom bar (linha 92) para incluir os links Sebo e Loja entre Privacidade e o span final:

```astro
<div class="flex items-center gap-8">
   <a href="/sebo" class="text-[9px] uppercase tracking-[0.3em] text-cream/20 hover:text-cream transition-colors">Sebo</a>
   <a href="/lojinha" class="text-[9px] uppercase tracking-[0.3em] text-cream/20 hover:text-cream transition-colors">Loja</a>
   <a href="#" class="text-[9px] uppercase tracking-[0.3em] text-cream/20 hover:text-cream transition-colors">Privacidade</a>
   <a href="#" class="text-[9px] uppercase tracking-[0.3em] text-cream/20 hover:text-cream transition-colors">Termos</a>
   <span class="text-[9px] uppercase tracking-[0.3em] text-cream/10">Desenvolvido com 🗝️</span>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Footer.astro && git commit -m "feat(sebo-lojinha): adicionar links Sebo e Loja na bottom bar do footer"
```

---

### Task 15: Build final e verificação

- [ ] **Step 1: Rodar lint + check**

```bash
bun run check
```

- [ ] **Step 2: Rodar build completo**

```bash
bun run build
```

- [ ] **Step 3: Verificar páginas geradas**

```bash
ls dist/sebo/index.html dist/lojinha/index.html
```

- [ ] **Step 4: Commit final (se houver ajustes)**

```bash
git add -A && git commit -m "chore(sebo-lojinha): ajustes finais de build e lint"
```
