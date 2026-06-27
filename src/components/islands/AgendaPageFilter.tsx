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
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getInitialMonth(eventos: EventoNormalizado[]): string {
  const currentMesKey = getCurrentMesKey();
  const availableMonths = getAvailableMonthKeys(eventos);
  if (availableMonths.includes(currentMesKey)) return currentMesKey;
  return availableMonths[0] ?? currentMesKey;
}

export default function AgendaPageFilter({ eventos }: AgendaPageFilterProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => getInitialMonth(eventos));
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const monthNavRef = useRef<HTMLDivElement>(null);

  const currentMonthKey = useMemo(() => getCurrentMesKey(), []);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run card entrance animation when month, category or search changes
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll only on mount
  useEffect(() => {
    if (!monthNavRef.current) return;
    const btn = monthNavRef.current.querySelector(`[data-month="${selectedMonth}"]`);
    if (btn instanceof HTMLElement) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

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
    <div className="space-y-12">
      <section className="bg-white/50 p-5 rounded-[2rem] shadow-2xl shadow-forest/5 backdrop-blur-sm md:p-10 md:rounded-[2.5rem] border border-white/40">
        <div
          ref={monthNavRef}
          className="flex items-center border-b border-forest/10 pb-5 overflow-x-auto no-scrollbar scroll-smooth mb-8 md:mb-10 md:pb-6"
        >
          <div className="flex gap-6 md:gap-14 min-w-max px-1 md:px-2">
            {monthKeys.map((month) => {
              const isSelected = selectedMonth === month;
              const isCurrentNotSelected = month === currentMonthKey && !isSelected;

              return (
                <button
                  key={month}
                  type="button"
                  data-month={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`group relative pb-4 text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all
                    ${
                      isSelected
                        ? "text-forest scale-110"
                        : isCurrentNotSelected
                          ? "text-forest/60 border border-orange/40 rounded-full px-4 py-1 bg-orange/5"
                          : "text-forest/40 hover:text-forest/60"
                    }
                  `}
                >
                  {formatMonthLabel(month)}
                  {isSelected && (
                    <div className="absolute bottom-[-1px] left-0 h-[3px] w-full bg-orange" />
                  )}
                  {isCurrentNotSelected && (
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-[0.3em] text-orange/70 whitespace-nowrap">
                      atual
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end md:gap-14">
          <div className="relative w-full max-w-xl">
            <label
              htmlFor="search-agenda"
              className="mb-3 block text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-forest/50"
            >
              Buscar na agenda
            </label>
            <div className="relative group">
              <input
                id="search-agenda"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Encontro, local ou detalhes..."
                className="w-full border-b-2 border-forest/10 bg-forest/[0.03] px-5 py-4 text-base font-medium text-forest outline-none transition-all placeholder:text-forest/30 focus:border-orange focus:bg-white md:py-5 rounded-t-xl"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="block text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-forest/50">
              Categorias
            </span>
            <nav className="flex flex-wrap gap-3" aria-label="Filtrar eventos por categoria">
              <button
                type="button"
                aria-pressed={activeCategory === "todos"}
                onClick={() => setActiveCategory("todos")}
                className={`rounded-full border-2 px-6 py-3 text-[10px] md:px-8 md:py-3.5 md:text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${
                  activeCategory === "todos"
                    ? "border-forest bg-forest text-cream shadow-forest/20"
                    : "border-forest/10 text-forest/60 hover:border-forest/30 hover:text-forest bg-white"
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
                  className="rounded-full border-2 px-6 py-3 text-[10px] md:px-8 md:py-3.5 md:text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 shadow-sm"
                  style={
                    activeCategory === category.value
                      ? {
                          backgroundColor: category.color,
                          borderColor: category.color,
                          color: category.textColor,
                          boxShadow: `0 12px 24px -8px ${category.color}66`,
                        }
                      : {
                          borderColor: "rgb(29 67 44 / 0.1)",
                          color: "rgb(29 67 44 / 0.6)",
                          backgroundColor: "white",
                        }
                  }
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <div ref={containerRef}>
        {groupedEvents.length > 0 ? (
          <div className="space-y-12 md:space-y-20">
            {groupedEvents.map(({ key, eventos: dayEvents }) => {
              const date = getEventoDate(dayEvents[0]);

              return (
                <section key={key} className="grid gap-6 md:grid-cols-[140px_1fr] md:gap-10">
                  <div className="md:sticky md:top-32 md:self-start md:py-4">
                    <div className="flex items-end gap-3 md:flex-col md:items-start md:gap-0">
                      <span className="font-display text-6xl md:text-7xl font-black leading-none text-forest">
                        {formatDay(date)}
                      </span>
                      <span className="mb-1 md:mb-0 md:mt-3 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-forest/35">
                        {formatWeekday(date)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    {dayEvents.map((evento) => {
                      const category = CATEGORIAS[evento.categoria];
                      const imagemPrincipal =
                        (evento.imagens?.[0] as SanityImageRef | undefined) ?? null;
                      const isExpanded = expandedCards.has(evento._id);

                      return (
                        <article
                          key={evento._id}
                          className="event-card group relative overflow-hidden rounded-[2rem] bg-white p-2 shadow-2xl shadow-forest/[0.04] transition-all duration-700 hover:shadow-forest/[0.08] hover:-translate-y-1 md:flex md:rounded-[2.5rem] md:p-3"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] md:aspect-auto md:w-[280px] lg:w-[420px] md:rounded-[2rem] shrink-0">
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
                              className="absolute left-4 top-4 md:left-6 md:top-6 rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md"
                              style={{
                                backgroundColor: `${category.color}ee`,
                                color: category.textColor,
                              }}
                            >
                              {category.label}
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col justify-center p-5 md:p-8 lg:p-14">
                            <div className="flex items-center gap-3 md:gap-4">
                              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-forest/40">
                                {formatHour(getEventoDate(evento))}
                              </span>
                              <div className="h-px w-6 md:w-8 bg-forest/10" />
                            </div>

                            <h2 className="mt-4 md:mt-6 font-display text-3xl font-black uppercase leading-[0.95] text-forest md:text-5xl lg:text-6xl">
                              {evento.titulo}
                            </h2>

                            {evento.local && (
                              <p className="mt-3 md:mt-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-forest/50">
                                {evento.local}
                              </p>
                            )}

                            <div
                              className={`overflow-hidden transition-all duration-700 ease-in-out ${
                                isExpanded
                                  ? "mt-8 md:mt-10 max-h-[1200px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="rounded-3xl bg-forest/[0.03] p-6 md:p-10 border border-forest/[0.05]">
                                {evento.descricao && (
                                  <p className="whitespace-pre-line text-base md:text-lg leading-relaxed text-forest/80 max-w-2xl">
                                    {evento.descricao}
                                  </p>
                                )}

                                <div className="mt-10 flex flex-wrap items-center justify-between gap-8 border-t border-forest/10 pt-8">
                                  {evento.valor && (
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-forest/40">
                                        Investimento
                                      </span>
                                      <span className="font-display text-2xl md:text-3xl font-black uppercase tracking-[0.05em] text-orange">
                                        {evento.valor}
                                      </span>
                                    </div>
                                  )}
                                  {evento.linkCompra && (
                                    <a
                                      href={evento.linkCompra}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/btn relative inline-flex items-center gap-4 rounded-full bg-forest px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-cream transition-all hover:bg-orange hover:shadow-2xl hover:shadow-orange/30"
                                    >
                                      <span className="relative z-10">Garantir vaga</span>
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
                                        aria-hidden="true"
                                        focusable="false"
                                      >
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              onClick={() => toggleCard(evento._id)}
                              className={`group mt-8 flex items-center justify-center gap-4 rounded-full border-2 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all
                                ${
                                  isExpanded
                                    ? "border-forest bg-forest text-cream"
                                    : "border-forest/10 text-forest/50 hover:border-forest/40 hover:text-forest hover:bg-white shadow-sm"
                                }`}
                            >
                              {isExpanded ? "Fechar detalhes" : "Ver mais detalhes"}
                              <svg
                                width="12"
                                height="12"
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
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/30 rounded-[2.5rem] px-5 py-16 text-center text-forest backdrop-blur-sm border border-white/20 md:rounded-[3rem] md:px-6 md:py-24">
            <p className="font-display text-3xl md:text-4xl font-black uppercase leading-none opacity-80">
              Nenhum encontro <br />
              <span className="text-orange opacity-100">por enquanto.</span>
            </p>
            <p className="mx-auto mt-6 md:mt-8 max-w-xl text-sm font-medium leading-relaxed text-forest/50">
              Tente ajustar seus filtros ou explorar outros meses na linha do tempo acima.
            </p>
            <div className="mt-10 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("todos");
                }}
                className="rounded-full border border-forest/20 px-8 py-3.5 text-[9px] md:px-10 md:py-4 md:text-[10px] font-black uppercase tracking-[0.3em] text-forest/60 hover:border-forest hover:text-forest transition-all"
              >
                Limpar filtros
              </button>
              {firstResultInAnotherMonth && (
                <button
                  type="button"
                  onClick={() => setSelectedMonth(firstResultInAnotherMonth.mesKey)}
                  className="rounded-full bg-forest/5 px-8 py-3.5 text-[9px] md:px-10 md:py-4 md:text-[10px] font-black uppercase tracking-[0.3em] text-forest/60 hover:bg-forest/10 hover:text-forest transition-all"
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
