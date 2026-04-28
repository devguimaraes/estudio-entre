import { urlFor } from "@/sanity/image";
import type { CategoriaEvento, EventoCard } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

const TODOS_STYLE = { "--pill-color": "#f0ede8", "--pill-text": "#8e8100" };

interface AgendaFilterProps {
  eventos: EventoCard[];
}

export default function AgendaFilter({ eventos }: AgendaFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string>("todos");
  const [hoveredEvent, setHoveredEvent] = useState<EventoCard | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);

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

  // Inicializar otimizações GSAP
  useEffect(() => {
    if (previewRef.current) {
      gsap.set(previewRef.current, { xPercent: -50, yPercent: -50 });
      xTo.current = gsap.quickTo(previewRef.current, "x", { duration: 0.6, ease: "power3.out" });
      yTo.current = gsap.quickTo(previewRef.current, "y", { duration: 0.6, ease: "power3.out" });
    }
  }, []);

  // Mouse tracking para o preview flutuante
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (hoveredEvent && xTo.current && yTo.current) {
        xTo.current(e.clientX);
        yTo.current(e.clientY);
      }
    };

    if (hoveredEvent) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredEvent]);

  // Animação de entrada da lista
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("li");

    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.05, ease: "power4.out", overwrite: "auto" },
    );
  }, []); // list depends on filteredEvents, but we re-animate on change via activeFilter if we want, Biome says activeFilter is not needed here if it's already triggered by filter change.

  return (
    <div className="agenda__content relative">
      {/* Filtros */}
      <nav className="agenda__filters flex justify-center gap-4 mb-16" aria-label="Filtrar eventos">
        <button
          type="button"
          className={`agenda__pill px-6 py-2 rounded-full border border-cream/20 text-xs uppercase tracking-widest transition-all ${activeFilter === "todos" ? "bg-cream text-olive border-cream" : "hover:border-cream/50"}`}
          onClick={() => setActiveFilter("todos")}
        >
          Todos
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`agenda__pill px-6 py-2 rounded-full border border-cream/20 text-xs uppercase tracking-widest transition-all ${activeFilter === cat.value ? "agenda__pill--active" : "hover:border-cream/50"}`}
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

      {/* Lista Editorial */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 opacity-50">Nenhum evento encontrado.</div>
      ) : (
        <ul ref={listRef} className="agenda__list border-t border-cream/10">
          {filteredEvents.map((evento) => (
            <li
              key={evento._id}
              className="agenda__item group relative flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-cream/10 cursor-none"
              onMouseEnter={() => setHoveredEvent(evento)}
              onMouseLeave={() => setHoveredEvent(null)}
              data-cursor="VER"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">
                  {new Date(evento.dataInicio)
                    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
                    .replace(".", "")}{" "}
                  — {new Date(evento.dataInicio).getHours()}h
                </span>
                <h3 className="text-3xl md:text-5xl font-display italic leading-none group-hover:translate-x-4 transition-transform duration-500">
                  {evento.titulo}
                </h3>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-6">
                <span className="text-[10px] uppercase tracking-widest opacity-60 border border-cream/20 px-3 py-1 rounded-sm">
                  {CATEGORIAS[evento.categoria as CategoriaEvento]?.label}
                </span>
                <a
                  href={`/eventos/${evento.slug.current}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
                >
                  <img
                    src="/icons/play.svg"
                    className="w-8 h-8 invert opacity-50 hover:opacity-100 transition-opacity"
                    alt="Ver detalhes"
                  />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Preview Flutuante */}
      <div
        ref={previewRef}
        className={`fixed top-0 left-0 w-64 aspect-square pointer-events-none z-50 overflow-hidden rounded-sm transition-all duration-500 ${hoveredEvent ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        {hoveredEvent?.imagem && (
          <img
            src={urlFor(hoveredEvent.imagem).width(400).height(400).url()}
            className="w-full h-full object-cover"
            alt=""
          />
        )}
      </div>
    </div>
  );
}
