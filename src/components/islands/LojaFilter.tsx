// src/components/islands/LojaFilter.tsx
import type { ProdutoLoja } from "@/types/loja";
import { CORES_CATEGORIA_LOJA } from "@/types/loja";
import { gsap } from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

interface LojaFilterProps {
  produtos: ProdutoLoja[];
}

function normalizeText(text: string): string {
  return (
    text
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: padrão canônico para remover diacríticos
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  );
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
        const matchesCategoria =
          activeCategoria === "todos" || produto.categoria === activeCategoria;
        const matchesSearch =
          !searchTerm ||
          normalizeText(produto.titulo).includes(searchTerm) ||
          normalizeText(produto.descricao).includes(searchTerm);
        return matchesCategoria && matchesSearch;
      }),
    [produtos, activeCategoria, searchTerm],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: animação deve refazer ao trocar filtro
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
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
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  {/* Category badge */}
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-cream shadow-lg backdrop-blur-sm"
                    style={{
                      backgroundColor: `${CORES_CATEGORIA_LOJA[produto.categoria] ?? "#1D432C"}ee`,
                    }}
                  >
                    {produto.categoria}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7">
                  <a href={`/lojinha/${encodeURIComponent(produto.slug)}`} className="block">
                    <h2 className="font-display text-lg font-black uppercase leading-[1.1] text-near-black transition-colors hover:text-orange md:text-xl">
                      {produto.titulo}
                    </h2>
                  </a>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-forest/60">
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
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
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
