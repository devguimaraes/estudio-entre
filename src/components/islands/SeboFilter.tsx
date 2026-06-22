import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSeboFilter } from "@/hooks/useSeboFilter";
import type { LivroSebo } from "@/types/sebo";
import { fetchSeboCSV, parseSeboCSV } from "@/utils/sebo-sheets";
import { gsap } from "gsap";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import SeboBookCard from "./sebo/SeboBookCard";
import SeboEmptyState from "./sebo/SeboEmptyState";
import SeboGenreFilter from "./sebo/SeboGenreFilter";
import SeboGenrePopover from "./sebo/SeboGenrePopover";
import SeboSearch from "./sebo/SeboSearch";

type Status = "loading" | "ready" | "error";

export default function SeboFilter() {
  const [livros, setLivros] = useState<LivroSebo[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  const fetchData = useCallback(() => {
    setStatus("loading");
    fetchSeboCSV()
      .then(parseSeboCSV)
      .then((data) => {
        setLivros(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    activeGenero,
    setActiveGenero,
    search,
    setSearch,
    counts,
    generos,
    filteredLivros,
    clearFilters,
  } = useSeboFilter(livros);

  const [isGeneroOpen, setIsGeneroOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const prevIsGeneroOpen = useRef(isGeneroOpen);

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run card entrance animation when filter changes
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".sebo-card");
    if (cards.length === 0) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power4.out", clearProps: "all" },
    );
  }, [activeGenero, search, prefersReducedMotion]);

  useEffect(() => {
    if (prevIsGeneroOpen.current && !isGeneroOpen) {
      triggerRef.current?.focus();
    }
    prevIsGeneroOpen.current = isGeneroOpen;
  }, [isGeneroOpen]);

  if (status === "error") {
    return (
      <div className="rounded-[2.5rem] border border-bordo/10 bg-cream/70 px-6 py-16 text-center">
        <p className="font-display text-3xl font-black italic uppercase text-bordo">
          Não foi possível carregar o acervo.
        </p>
        <p className="mt-4 text-sm text-bordo/60">Verifique sua conexão e tente novamente.</p>
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={fetchData}
            className="rounded-full border border-bordo/20 px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] text-bordo/60 transition-all hover:border-bordo hover:text-bordo md:px-10 md:py-4 md:text-[10px]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="space-y-10">
        <section className="-mt-10 rounded-[2.5rem] border border-white/40 bg-white/50 p-5 shadow-2xl shadow-bordo/5 backdrop-blur-sm md:p-10">
          <div className="animate-pulse space-y-8">
            <div className="h-14 w-full max-w-xl rounded-xl bg-bordo/[0.04]" />
            <div className="flex gap-3">
              <div className="h-11 w-24 rounded-full bg-bordo/[0.06]" />
              <div className="h-11 w-20 rounded-full bg-bordo/[0.04]" />
              <div className="h-11 w-16 rounded-full bg-bordo/[0.03]" />
            </div>
          </div>
        </section>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders estáticos
              key={`skeleton-${i}`}
              className="animate-pulse rounded-[2rem] bg-white p-8 shadow-lg"
            >
              <div className="mb-5 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-bordo/10" />
                <div className="h-3 w-20 rounded bg-bordo/8" />
              </div>
              <div className="mb-2 h-7 w-3/4 rounded bg-bordo/10" />
              <div className="h-4 w-1/2 rounded bg-bordo/5" />
              <div className="mt-7 border-t border-bordo/[0.04] pt-6">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-24 rounded bg-bordo/10" />
                  <div className="h-11 w-11 rounded-full bg-bordo/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (livros.length === 0) {
    return <SeboEmptyState variant="empty" />;
  }

  return (
    <div className="space-y-10">
      <section className="-mt-10 rounded-[2.5rem] border border-white/40 bg-white/50 p-5 shadow-2xl shadow-bordo/5 backdrop-blur-sm md:p-10">
        <div className="space-y-8">
          <SeboSearch value={search} onChange={setSearch} />
          <SeboGenreFilter
            activeGenero={activeGenero}
            generos={generos}
            total={livros.length}
            onSelect={(genero) => setActiveGenero(genero)}
            onClear={clearFilters}
            onOpenPopover={() => setIsGeneroOpen((prev) => !prev)}
            isPopoverOpen={isGeneroOpen}
            ref={triggerRef}
          >
            <SeboGenrePopover
              isOpen={isGeneroOpen}
              onClose={() => setIsGeneroOpen(false)}
              onSelect={(genero) => {
                setActiveGenero(genero);
                setIsGeneroOpen(false);
              }}
              activeGenero={activeGenero}
              generos={generos}
              total={livros.length}
              isMobile={isMobile}
              popoverRef={popoverRef}
            />
          </SeboGenreFilter>
        </div>
      </section>

      <div ref={containerRef}>
        {filteredLivros.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredLivros.map((livro, i) => (
              <SeboBookCard key={`${livro.titulo}-${livro.autor}-${i}`} livro={livro} />
            ))}
          </div>
        ) : (
          <SeboEmptyState variant="no-results" onClear={clearFilters} />
        )}
      </div>
    </div>
  );
}
