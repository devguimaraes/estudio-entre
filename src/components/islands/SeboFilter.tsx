import type { LivroSebo } from "@/types/sebo";
import { CORES_GENERO } from "@/types/sebo";
import { gsap } from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

interface SeboFilterProps {
  livros: LivroSebo[];
}

function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
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
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run card entrance animation when filter changes
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
                  focusable="false"
                >
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
                          color: [
                            "Biografia",
                            "Literatura Juvenil",
                            "Infantil/Paradidático",
                          ].includes(genero)
                            ? "#1A1612"
                            : "#F0EDE8",
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" role="img">
                      <title>WhatsApp</title>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
