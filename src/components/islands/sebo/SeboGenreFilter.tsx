import { CORES_GENERO, type GeneroSebo } from "@/types/sebo";
import { getContrastColor } from "@/utils/sebo";
import { type RefObject, forwardRef } from "react";

interface SeboGenreFilterProps {
  activeGenero: "todos" | GeneroSebo;
  generos: [GeneroSebo, number][];
  total: number;
  onSelect: (genero: GeneroSebo) => void;
  onClear: () => void;
  onOpenPopover: () => void;
  isPopoverOpen: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const SeboGenreFilter = forwardRef<HTMLButtonElement, SeboGenreFilterProps>(
  ({ activeGenero, generos, total, onSelect, onClear, onOpenPopover, isPopoverOpen }, ref) => {
    return (
      <div className="space-y-4">
        <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-bordo/50 md:text-[11px]">
          Gêneros
        </span>
        <nav className="flex flex-wrap items-center gap-3" aria-label="Filtrar por gênero">
          {activeGenero === "todos" ? (
            <>
              <button
                type="button"
                aria-pressed={true}
                className="rounded-full border-2 border-bordo bg-bordo px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-cream shadow-sm shadow-bordo/20 transition-all md:px-8 md:py-3.5 md:text-[11px]"
              >
                Todos · {total}
              </button>
              {generos.slice(0, 4).map(([genero, count]) => (
                <button
                  key={genero}
                  type="button"
                  aria-pressed={false}
                  onClick={() => onSelect(genero)}
                  className="rounded-full border-2 border-bordo/10 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-bordo/60 transition-all hover:-translate-y-0.5 hover:border-bordo/30 hover:text-bordo md:px-8 md:py-3.5 md:text-[11px]"
                >
                  {genero} · {count}
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                type="button"
                aria-pressed={true}
                className="rounded-full border-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm md:px-8 md:py-3.5 md:text-[11px]"
                style={{
                  backgroundColor: CORES_GENERO[activeGenero] ?? "#EC6838",
                  borderColor: CORES_GENERO[activeGenero] ?? "#EC6838",
                  color: getContrastColor(activeGenero),
                }}
              >
                {activeGenero} · {total}
              </button>
              <button
                type="button"
                onClick={onClear}
                className="rounded-full border border-bordo/20 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-bordo/60 transition-all hover:border-bordo hover:text-bordo md:px-7 md:py-3.5 md:text-[11px]"
              >
                Limpar
              </button>
            </>
          )}

          {/* Popover trigger */}
          <div className="relative">
            <button
              ref={ref}
              type="button"
              onClick={onOpenPopover}
              aria-expanded={isPopoverOpen}
              aria-controls="genero-popover"
              className="rounded-full border-2 border-bordo/10 bg-bordo/[0.06] px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-bordo/70 transition-all hover:border-bordo/30 hover:bg-bordo/10 md:px-7 md:py-3.5 md:text-[11px]"
            >
              Todos os gêneros
              <span
                className="ml-2 inline-block transition-transform"
                style={{ transform: isPopoverOpen ? "rotate(180deg)" : undefined }}
              >
                ▾
              </span>
            </button>
          </div>
        </nav>
      </div>
    );
  },
);

SeboGenreFilter.displayName = "SeboGenreFilter";

export default SeboGenreFilter;
