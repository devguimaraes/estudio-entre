import { CORES_GENERO, type GeneroSebo } from "@/types/sebo";
import { getContrastColor } from "@/utils/sebo";
import { type RefObject, useEffect } from "react";
import "./sebo-filter.css";

interface SeboGenrePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (genero: "todos" | GeneroSebo) => void;
  activeGenero: "todos" | GeneroSebo;
  generos: [GeneroSebo, number][];
  total: number;
  isMobile: boolean;
  popoverRef: RefObject<HTMLDialogElement | null>;
}

export default function SeboGenrePopover({
  isOpen,
  onClose,
  onSelect,
  activeGenero,
  generos,
  total,
  isMobile,
  popoverRef,
}: SeboGenrePopoverProps) {
  // Click outside and ESC handling
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, popoverRef]);

  // Focus trap
  useEffect(() => {
    const popover = popoverRef.current;
    if (!isOpen || !popover) return;

    const focusableButtons = popover.querySelectorAll<HTMLButtonElement>("button");
    if (focusableButtons.length === 0) return;

    const firstButton = focusableButtons[0];
    const lastButton = focusableButtons[focusableButtons.length - 1];

    function handleTabTrap(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        if (document.activeElement === firstButton) {
          event.preventDefault();
          lastButton.focus();
        }
      } else {
        if (document.activeElement === lastButton) {
          event.preventDefault();
          firstButton.focus();
        }
      }
    }

    popover.addEventListener("keydown", handleTabTrap);
    // Focus the first genre button ("Todos") when popover opens, not the close button
    const firstGenreButton = popover.querySelector<HTMLButtonElement>("[aria-pressed]");
    (firstGenreButton ?? firstButton).focus();

    return () => {
      popover.removeEventListener("keydown", handleTabTrap);
    };
  }, [isOpen, popoverRef]);

  if (!isOpen) return null;

  return (
    <dialog
      id="genero-popover"
      ref={popoverRef}
      aria-label="Escolha um gênero"
      className={
        isMobile
          ? "fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] border-t border-white/60 bg-white/90 p-6 pb-8 shadow-[0_-20px_60px_rgba(61,16,32,0.15)] backdrop-blur-md"
          : "absolute left-0 top-full z-50 mt-3 w-[min(90vw,520px)] rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-2xl shadow-bordo/10 backdrop-blur-md popover-enter md:p-6"
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-bordo/50 md:text-[11px]">
          Escolha um gênero
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-bordo/40 transition-colors hover:bg-bordo/10 hover:text-bordo"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
      <div
        className={
          isMobile
            ? "grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto pb-6 sm:grid-cols-3"
            : "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3"
        }
      >
        <button
          type="button"
          aria-pressed={activeGenero === "todos"}
          onClick={() => {
            onSelect("todos");
            onClose();
          }}
          className="rounded-full border-2 px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.12em] transition-all md:text-[10px]"
          style={
            activeGenero === "todos"
              ? {
                  backgroundColor: "#3D1020",
                  borderColor: "#3D1020",
                  color: "#F0EDE8",
                }
              : {
                  backgroundColor: "white",
                  borderColor: "rgb(61,16,32,0.1)",
                  color: "rgb(61,16,32,0.6)",
                }
          }
        >
          Todos · {total}
        </button>
        {generos.map(([genero, count]) => (
          <button
            key={genero}
            type="button"
            aria-pressed={activeGenero === genero}
            onClick={() => {
              onSelect(genero);
              onClose();
            }}
            className="rounded-full border-2 px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.12em] transition-all hover:scale-105 md:text-[10px]"
            style={
              activeGenero === genero
                ? {
                    backgroundColor: CORES_GENERO[genero] ?? "#EC6838",
                    borderColor: CORES_GENERO[genero] ?? "#EC6838",
                    color: getContrastColor(genero),
                    boxShadow: "0 0 0 2px rgba(61,16,32,0.15)",
                  }
                : {
                    backgroundColor: "white",
                    borderColor: "rgb(61,16,32,0.1)",
                    color: "rgb(61,16,32,0.6)",
                  }
            }
          >
            {genero} · {count}
          </button>
        ))}
      </div>
    </dialog>
  );
}
