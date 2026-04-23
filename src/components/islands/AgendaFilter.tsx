import { useState, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import type { EventoCard, CategoriaEvento } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";
import EventCard from "./EventCard";

const TODOS_STYLE = { "--pill-color": "#f0ede8", "--pill-text": "#8e8100" };

interface AgendaFilterProps {
  eventos: EventoCard[];
}

export default function AgendaFilter({ eventos }: AgendaFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string>("todos");
  const gridRef = useRef<HTMLDivElement>(null);

  const availableCategories = useMemo(() => {
    const cats = new Set(eventos.map((e) => e.categoria));
    return Object.entries(CATEGORIAS)
      .filter(([key]) => cats.has(key as CategoriaEvento))
      .map(([key, val]) => ({ value: key, ...val }));
  }, [eventos]);

  const filteredEvents = useMemo(
    () =>
      activeFilter === "todos"
        ? eventos
        : eventos.filter((e) => e.categoria === activeFilter),
    [eventos, activeFilter],
  );

  const destaque =
    activeFilter === "todos" && filteredEvents.length > 0
      ? filteredEvents[0]
      : null;

  const gridEvents = destaque ? filteredEvents.slice(1) : filteredEvents;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("agenda:hydrated"));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: activeFilter é o trigger intencional para re-animar cards ao trocar filtro
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-event-card]");
    if (!cards.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    gsap.killTweensOf(cards);
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  }, [activeFilter]);

  return (
    <div className="agenda__content">
      <nav className="agenda__filters" aria-label="Filtrar eventos por categoria">
        <button
          type="button"
          className={`agenda__pill ${activeFilter === "todos" ? "agenda__pill--active" : ""}`}
          style={activeFilter === "todos" ? TODOS_STYLE : undefined}
          onClick={() => setActiveFilter("todos")}
        >
          Todos
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`agenda__pill ${activeFilter === cat.value ? "agenda__pill--active" : ""}`}
            style={
              activeFilter === cat.value
                ? { "--pill-color": cat.color, "--pill-text": cat.textColor }
                : undefined
            }
            onClick={() => setActiveFilter(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {filteredEvents.length === 0 ? (
        <div className="agenda__empty">
          <p className="agenda__empty-text">
            Nenhum evento nesta categoria por enquanto — mas tem coisa vindo por
            aí.
          </p>
          <a
            href="https://instagram.com/estudioentre"
            target="_blank"
            rel="noopener noreferrer"
            className="agenda__empty-cta"
            data-cursor="SEGUIR"
          >
            Acompanhe no Instagram
          </a>
        </div>
      ) : (
        <div ref={gridRef} className="agenda__grid">
          {destaque && <EventCard evento={destaque} destaque />}
          {gridEvents.map((evento) => (
            <EventCard key={evento._id} evento={evento} />
          ))}
        </div>
      )}
    </div>
  );
}
