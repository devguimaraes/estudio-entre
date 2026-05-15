import { urlFor } from "@/sanity/image";
import type { CategoriaEvento, EventoNormalizado, SanityImageRef } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";
import {
  EVENT_TIME_ZONE,
  formatMonthLabel,
  getAvailableMonthKeys,
  normalizeSearch,
} from "@/utils/eventos";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface AgendaPageFilterProps {
  eventos: EventoNormalizado[];
}

function getEventoDate(evento: EventoNormalizado) {
  return new Date(evento.dataHora);
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: EVENT_TIME_ZONE, day: "2-digit" }).format(
    date,
  );
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: EVENT_TIME_ZONE, weekday: "long" }).format(
    date,
  );
}

function formatHour(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: EVENT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getEventoDayKey(evento: EventoNormalizado): string {
  const date = getEventoDate(evento);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getCurrentMesKey(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;

  return `${year}-${month}`;
}

function getInitialMonth(eventos: EventoNormalizado[]) {
  const currentKey = getCurrentMesKey();
  const months = getAvailableMonthKeys(eventos);

  return months.includes(currentKey) ? currentKey : (months[0] ?? currentKey);
}

export default function AgendaPageFilter({ eventos }: AgendaPageFilterProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => getInitialMonth(eventos));
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const monthKeys = useMemo(() => getAvailableMonthKeys(eventos), [eventos]);
  const searchTerm = normalizeSearch(search);

  const availableCategories = useMemo(() => {
    const categories = new Set(eventos.map((evento) => evento.categoria));

    return Object.entries(CATEGORIAS)
      .filter(([key]) => categories.has(key as CategoriaEvento))
      .map(([value, category]) => ({ value, ...category }));
  }, [eventos]);

  const matchingEvents = useMemo(
    () =>
      eventos.filter((evento) => {
        const matchesCategory = activeCategory === "todos" || evento.categoria === activeCategory;
        const matchesSearch = !searchTerm || evento.buscaTexto.includes(searchTerm);

        return matchesCategory && matchesSearch;
      }),
    [eventos, activeCategory, searchTerm],
  );

  const visibleEvents = useMemo(
    () => matchingEvents.filter((evento) => evento.mesKey === selectedMonth),
    [matchingEvents, selectedMonth],
  );

  const groupedEvents = useMemo(() => {
    const groups = new Map<string, EventoNormalizado[]>();

    for (const evento of visibleEvents) {
      const key = getEventoDayKey(evento);
      const group = groups.get(key) ?? [];
      group.push(evento);
      groups.set(key, group);
    }

    return Array.from(groups.entries()).map(([key, group]) => ({ key, eventos: group }));
  }, [visibleEvents]);

  const firstResultInAnotherMonth = useMemo(
    () => matchingEvents.find((evento) => evento.mesKey !== selectedMonth),
    [matchingEvents, selectedMonth],
  );
  const selectedMonthIndex = monthKeys.indexOf(selectedMonth);
  const previousMonth = selectedMonthIndex > 0 ? monthKeys[selectedMonthIndex - 1] : null;
  const nextMonth =
    selectedMonthIndex >= 0 && selectedMonthIndex < monthKeys.length - 1
      ? monthKeys[selectedMonthIndex + 1]
      : null;

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".event-card");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        clearProps: "all",
      },
    );
  }, [selectedMonth, activeCategory, search]);

  useEffect(() => {
    setExpandedCards(new Set());
    // Referenced for dependency tracking — reset expanded state on filter change
    void selectedMonth;
    void activeCategory;
    void search;
  }, [selectedMonth, activeCategory, search]);

  function toggleCard(id: string) {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (eventos.length === 0) {
    return (
      <div className="rounded-[2rem] border border-forest/10 bg-cream/70 px-6 py-16 text-center text-forest md:px-12">
        <p className="font-display text-3xl font-black italic uppercase">
          Silêncio criativo por enquanto.
        </p>
        <p className="mt-4 text-sm text-forest/70">Em breve, novos encontros entram na agenda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <section className="bg-white/50 p-6 rounded-[2.5rem] shadow-2xl shadow-forest/5 backdrop-blur-sm md:p-10 border border-white/40">
        <div className="flex items-center border-b border-forest/10 pb-6 overflow-x-auto no-scrollbar mb-10">
          <div className="flex gap-10 md:gap-14 min-w-max px-2">
            {monthKeys.map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => setSelectedMonth(month)}
                className={`group relative pb-4 text-[11px] font-black uppercase tracking-[0.25em] transition-all
                  ${selectedMonth === month ? "text-forest" : "text-forest/25 hover:text-forest/50"}`}
              >
                {formatMonthLabel(month)}
                <div
                  className={`absolute bottom-[-1px] left-0 h-[2px] w-full bg-orange transition-transform duration-500
                    ${selectedMonth === month ? "scale-x-100" : "scale-x-0 group-hover:scale-x-30"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative max-w-md">
            <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.3em] text-forest/40">
              Buscar na agenda
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Encontro, local ou detalhes..."
              className="w-full border-b border-forest/20 bg-transparent py-3 text-sm text-forest outline-none transition-colors placeholder:text-forest/25 focus:border-orange"
            />
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Filtrar eventos por categoria">
            <button
              type="button"
              aria-pressed={activeCategory === "todos"}
              onClick={() => setActiveCategory("todos")}
              className={`rounded-full border px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeCategory === "todos"
                  ? "border-forest bg-forest text-cream"
                  : "border-forest/10 text-forest/40 hover:border-forest/30 hover:text-forest bg-white/50"
              }`}
            >
              Todos
            </button>
            {availableCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                aria-pressed={activeCategory === category.value}
                onClick={() => setActiveCategory(category.value)}
                className="rounded-full border px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5"
                style={
                  activeCategory === category.value
                    ? {
                        backgroundColor: category.color,
                        borderColor: category.color,
                        color: category.textColor,
                        boxShadow: `0 10px 20px -5px ${category.color}44`,
                      }
                    : {
                        borderColor: "rgb(29 67 44 / 0.08)",
                        color: "rgb(29 67 44 / 0.4)",
                        backgroundColor: "rgba(255,255,255,0.5)",
                      }
                }
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <div ref={containerRef}>
        {groupedEvents.length > 0 ? (
          <div className="space-y-20">
            {groupedEvents.map(({ key, eventos: dayEvents }) => {
              const date = getEventoDate(dayEvents[0]);

              return (
                <section key={key} className="grid gap-10 md:grid-cols-[140px_1fr]">
                  <div className="md:sticky md:top-32 md:self-start py-4">
                    <div className="flex flex-col items-center md:items-start">
                      <span className="font-display text-7xl font-black leading-none text-forest">
                        {formatDay(date)}
                      </span>
                      <span className="mt-3 text-[11px] font-black uppercase tracking-[0.4em] text-forest/35">
                        {formatWeekday(date)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {dayEvents.map((evento) => {
                      const category = CATEGORIAS[evento.categoria];
                      const imagemPrincipal =
                        (evento.imagens?.[0] as SanityImageRef | undefined) ?? null;
                      const isExpanded = expandedCards.has(evento._id);

                      return (
                        <article
                          key={evento._id}
                          className="event-card group relative overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-2xl shadow-forest/[0.04] transition-all duration-700 hover:shadow-forest/[0.08] hover:-translate-y-1 md:flex"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] md:aspect-auto md:w-[320px] lg:w-[420px] shrink-0">
                            {imagemPrincipal ? (
                              <img
                                src={urlFor(imagemPrincipal).width(800).height(600).url()}
                                alt={evento.titulo}
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-cream/50">
                                <img src="/icons/chave.svg" className="w-16 opacity-10" alt="" />
                              </div>
                            )}
                            <div
                              className="absolute left-6 top-6 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md"
                              style={{
                                backgroundColor: `${category.color}ee`,
                                color: category.textColor,
                              }}
                            >
                              {category.label}
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col justify-center p-6 md:p-10 lg:p-14">
                            <div className="flex items-center gap-4">
                              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-forest/40">
                                {formatHour(getEventoDate(evento))}
                              </span>
                              <div className="h-px w-8 bg-forest/10" />
                            </div>

                            <h2 className="mt-6 font-display text-4xl font-black uppercase leading-[0.9] text-forest md:text-5xl lg:text-6xl">
                              {evento.titulo}
                            </h2>

                            {evento.local && (
                              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-forest/50">
                                {evento.local}
                              </p>
                            )}

                            <div
                              className={`overflow-hidden transition-all duration-700 ease-in-out ${
                                isExpanded
                                  ? "mt-10 max-h-[1200px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="h-px w-full bg-forest/5 mb-8" />
                              {evento.descricao && (
                                <p className="whitespace-pre-line text-sm leading-relaxed text-forest/70 max-w-xl">
                                  {evento.descricao}
                                </p>
                              )}
                              <div className="mt-10 flex flex-wrap items-center justify-between gap-8">
                                {evento.valor && (
                                  <span className="font-display text-xl font-black uppercase tracking-[0.1em] text-orange">
                                    {evento.valor}
                                  </span>
                                )}
                                {evento.linkCompra && (
                                  <a
                                    href={evento.linkCompra}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-forest px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-cream transition-all hover:bg-orange hover:shadow-2xl hover:shadow-orange/20"
                                  >
                                    Garantir vaga
                                  </a>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              onClick={() => toggleCard(evento._id)}
                              className="group mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-forest/40 transition-colors hover:text-forest"
                            >
                              <span className="h-px w-6 bg-forest/15 transition-all group-hover:w-12 group-hover:bg-forest" />
                              {isExpanded ? "Ver menos" : "Ver mais detalhes"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/30 rounded-[3rem] px-6 py-24 text-center text-forest backdrop-blur-sm border border-white/20">
            <p className="font-display text-4xl font-black uppercase leading-none opacity-80">
              Nenhum encontro <br />
              <span className="text-orange opacity-100">por enquanto.</span>
            </p>
            <p className="mx-auto mt-8 max-w-xl text-sm font-medium leading-relaxed text-forest/50">
              Tente ajustar seus filtros ou explorar outros meses na linha do tempo acima.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("todos");
                }}
                className="rounded-full border border-forest/20 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-forest/60 hover:border-forest hover:text-forest transition-all"
              >
                Limpar filtros
              </button>
              {firstResultInAnotherMonth && (
                <button
                  type="button"
                  onClick={() => setSelectedMonth(firstResultInAnotherMonth.mesKey)}
                  className="rounded-full bg-forest/5 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-forest/60 hover:bg-forest/10 hover:text-forest transition-all"
                >
                  Ir para {formatMonthLabel(firstResultInAnotherMonth.mesKey)}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
