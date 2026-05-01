import { urlFor } from "@/sanity/image";
import type { CategoriaEvento, EventoCard, SanityImageRef } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

interface AgendaFilterProps {
  eventos: EventoCard[];
}

const CLIPS = {
  1: "ellipse(45% 48% at 50% 50%)",
  2: "polygon(20% 0%, 80% 5%, 100% 40%, 95% 80%, 60% 100%, 10% 90%, 0% 50%)",
  3: "polygon(15% 10%, 60% 0%, 90% 20%, 100% 60%, 85% 95%, 40% 100%, 5% 80%, 0% 40%)",
  4: "polygon(25% 5%, 70% 0%, 95% 30%, 90% 75%, 60% 100%, 15% 90%, 0% 55%, 10% 20%)",
};

export default function AgendaFilter({ eventos }: AgendaFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string>("todos");
  const listRef = useRef<HTMLDivElement>(null);

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

  // Animação ao trocar filtro e no mount inicial
  useEffect(() => {
    if (!listRef.current) return;
    const cards = listRef.current.querySelectorAll(".agenda__card");

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
      {/* Filtros Editoriais */}
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

      {/* Grid de Cards Editoriais */}
      <div
        ref={listRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
      >
        {filteredEvents.map((evento, i) => {
          const cat = CATEGORIAS[evento.categoria as CategoriaEvento];
          const clipVariant = ((i % 4) + 1) as 1 | 2 | 3 | 4;
          const imagemPrincipal = (evento.imagens?.[0] as SanityImageRef | undefined) ?? null;

          return (
            <div key={evento._id} className="agenda__card group flex flex-col">
              {/* Image Container with BlobMask */}
              <div className="relative mb-8 aspect-[4/5] overflow-hidden group-hover:scale-[1.02] transition-transform duration-700 ease-editorial">
                <a
                  href={`/eventos/${evento.slug.current}`}
                  className="block w-full h-full"
                  style={{ clipPath: CLIPS[clipVariant] }}
                >
                  {imagemPrincipal ? (
                    <img
                      src={urlFor(imagemPrincipal).width(600).height(750).url()}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt={evento.titulo}
                    />
                  ) : (
                    <div className="w-full h-full bg-cream/10 flex items-center justify-center">
                      <img src="/icons/chave.svg" className="w-20 opacity-10" alt="" />
                    </div>
                  )}
                </a>

                {/* Category Tag */}
                <div
                  className="absolute top-6 left-6 px-4 py-1.5 rounded-sm text-[9px] uppercase tracking-widest font-bold shadow-xl"
                  style={{ backgroundColor: cat.color, color: cat.textColor }}
                >
                  {cat.label}
                </div>
              </div>

              {/* Info Container */}
              <div className="flex flex-col flex-1 px-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-3">
                  {new Date(evento.dataHora).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  <span className="mx-2">·</span>
                  {new Date(evento.dataHora).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <h3 className="text-3xl font-display font-black italic uppercase leading-none mb-6 group-hover:text-orange transition-colors duration-500">
                  <a href={`/eventos/${evento.slug.current}`}>{evento.titulo}</a>
                </h3>

                <div className="mt-auto">
                  <a
                    href={`/eventos/${evento.slug.current}`}
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-cream/60 hover:text-cream transition-colors group/btn"
                  >
                    Ver detalhes
                    <img
                      src="/icons/play.svg"
                      className="w-4 h-4 invert opacity-40 group-hover/btn:translate-x-1 transition-transform"
                      alt=""
                    />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
