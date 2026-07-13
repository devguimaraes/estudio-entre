import EventoExpandedPanel from "@/components/islands/agenda/EventoExpandedPanel";
import type { CategoriaEvento, EventoNormalizado } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";
import gsap from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface AgendaPreviewGridProps {
  eventos: EventoNormalizado[];
}

export default function AgendaPreviewGrid({ eventos }: AgendaPreviewGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("todos");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  const toggleCard = useCallback((id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const availableCategories = useMemo(() => {
    const cats = new Set(eventos.map((e) => e.categoria));
    return Object.entries(CATEGORIAS)
      .filter(([key]) => cats.has(key as CategoriaEvento))
      .map(([key, val]) => ({ value: key, ...val }));
  }, [eventos]);

  const filteredEvents = useMemo(
    () =>
      activeFilter === "todos" ? eventos : eventos.filter((e) => e.categoria === activeFilter),
    [eventos, activeFilter],
  );

  useEffect(() => {
    if (!listRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void filteredEvents;
    const cards = listRef.current.querySelectorAll(".agenda__card");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        overwrite: "auto",
        clearProps: "opacity,y,scale",
      },
    );
  }, [filteredEvents]);

  return (
    <div className="agenda__content relative">
      <nav
        className="agenda__filters flex flex-wrap justify-center gap-3 mb-6"
        aria-label="Filtrar eventos"
      >
        <button
          type="button"
          className={`px-8 py-3 rounded-full border text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
            activeFilter === "todos"
              ? "bg-cream text-forest border-cream font-bold"
              : "border-cream/20 text-cream/60 hover:border-cream/50"
          }`}
          onClick={() => setActiveFilter("todos")}
        >
          Todos
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`px-8 py-3 rounded-full border text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
              activeFilter === cat.value
                ? "font-bold"
                : "border-cream/20 text-cream/60 hover:border-cream/50"
            }`}
            style={
              activeFilter === cat.value
                ? { backgroundColor: cat.color, color: cat.textColor, borderColor: cat.color }
                : undefined
            }
            onClick={() => setActiveFilter(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <div
        ref={listRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
      >
        {filteredEvents.map((evento) => {
          const cat = CATEGORIAS[evento.categoria];
          const isExpanded = expandedCards.has(evento._id);

          return (
            <div key={evento._id} className="agenda__card group flex flex-col">
              <div className="relative mb-8 overflow-hidden rounded-2xl border border-cream/10 group-hover:scale-[1.02] transition-transform duration-700 ease-editorial">
                {evento.imagemUrl ? (
                  <img
                    src={evento.imagemUrl}
                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt={evento.titulo}
                  />
                ) : (
                  <div className="aspect-[4/3] w-full bg-cream/10 flex items-center justify-center">
                    <img src="/icons/chave.svg" className="w-20 opacity-10" alt="" />
                  </div>
                )}

                <div
                  className="absolute top-6 left-6 px-4 py-1.5 rounded-sm text-[9px] uppercase tracking-widest font-bold shadow-xl"
                  style={{ backgroundColor: cat.color, color: cat.textColor }}
                >
                  {cat.label}
                </div>
              </div>

              <div className="flex flex-col flex-1 px-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-3">
                  {evento.dataFormatada}
                  <span className="mx-2">·</span>
                  {evento.horaFormatada}
                </span>

                <h3 className="text-3xl font-display font-black italic uppercase leading-none mb-4 text-cream">
                  {evento.titulo}
                </h3>

                <div
                  className={`overflow-hidden transition-all duration-700 ease-editorial ${
                    isExpanded ? "max-h-[2000px] opacity-100 mb-8 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <EventoExpandedPanel evento={evento} variant="preview" />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => toggleCard(evento._id)}
                    className={`inline-flex items-center gap-3 text-[10px] uppercase tracking-widest font-black px-6 py-3.5 rounded-full border-2 transition-all duration-500 group/btn
                      ${
                        isExpanded
                          ? "bg-cream text-forest border-cream"
                          : "border-cream/10 text-cream/50 hover:border-cream/30 hover:text-cream"
                      }`}
                  >
                    {isExpanded ? "Fechar detalhes" : "Ver detalhes"}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}
                      aria-hidden="true"
                      focusable="false"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
