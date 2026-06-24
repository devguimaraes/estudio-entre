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
    displayedLivros,
    hasMore,
    remaining,
    loadMore,
    clearFilters,
  } = useSeboFilter(livros);

  const [isGeneroOpen, setIsGeneroOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const prevIsGeneroOpen = useRef(isGeneroOpen);
  const prevCardCountRef = useRef(0);

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  // biome-ignore lint/correctness/useExhaustiveDependencies: reage a mudanças de filtro e load-more
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>(".sebo-card");
    if (cards.length === 0) {
      prevCardCountRef.current = 0;
      return;
    }

    const currentCount = cards.length;
    const prevCount = prevCardCountRef.current;
    const isLoadMore = currentCount > prevCount && prevCount > 0;

    if (isLoadMore) {
      const newCards = Array.from(cards).slice(prevCount);
      gsap.fromTo(
        newCards,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out", clearProps: "all" },
      );
    } else {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power4.out", clearProps: "all" },
      );
    }

    prevCardCountRef.current = currentCount;
  }, [displayedLivros, prefersReducedMotion]);

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
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {displayedLivros.map((livro, i) => (
                <SeboBookCard key={`${livro.titulo}-${livro.autor}-${i}`} livro={livro} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex flex-col items-center">
                <div className="mb-6 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-bordo/10 to-transparent" />
                <button
                  type="button"
                  onClick={loadMore}
                  className="group relative rounded-full border border-bordo/20 px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] text-bordo/60 transition-[transform,border-color,color] duration-200 ease-out hover:border-bordo hover:text-bordo active:scale-[0.97] md:px-10 md:py-4 md:text-[10px]"
                >
                  Ver mais
                  <span className="ml-2 text-bordo/25 transition-colors duration-200 group-hover:text-bordo/50">
                    ({remaining})
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <SeboEmptyState variant="no-results" onClear={clearFilters} />
        )}
      </div>
    </div>
  );
}
