import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSeboFilter } from "@/hooks/useSeboFilter";
import type { LivroSebo } from "@/types/sebo";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SeboBookCard from "./sebo/SeboBookCard";
import SeboEmptyState from "./sebo/SeboEmptyState";
import SeboGenreFilter from "./sebo/SeboGenreFilter";
import SeboGenrePopover from "./sebo/SeboGenrePopover";
import SeboSearch from "./sebo/SeboSearch";

interface SeboFilterProps {
  livros: LivroSebo[];
}

export default function SeboFilter({ livros }: SeboFilterProps) {
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

  // GSAP card entrance animation
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

  // Return focus to trigger when popover closes
  useEffect(() => {
    if (prevIsGeneroOpen.current && !isGeneroOpen) {
      triggerRef.current?.focus();
    }
    prevIsGeneroOpen.current = isGeneroOpen;
  }, [isGeneroOpen]);

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
          />
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
