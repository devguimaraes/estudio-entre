import { urlFor } from "@/sanity/image";
import type { CategoriaEvento, EventoNormalizado, SanityImageRef } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";
import { formatMonthLabel, getAvailableMonthKeys, normalizeSearch } from "@/utils/eventos";
import { useEffect, useMemo, useState } from "react";

interface AgendaPageFilterProps {
  eventos: EventoNormalizado[];
}

function getEventoDate(evento: EventoNormalizado) {
  return new Date(evento.dataHora);
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);
}

function formatHour(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function getInitialMonth(eventos: EventoNormalizado[]) {
  const currentMonth = new Date();
  const currentKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
  const months = getAvailableMonthKeys(eventos);

  return months.includes(currentKey) ? currentKey : (months[0] ?? currentKey);
}

export default function AgendaPageFilter({ eventos }: AgendaPageFilterProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => getInitialMonth(eventos));
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

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
      const key = evento.dataHora.slice(0, 10);
      const group = groups.get(key) ?? [];
      group.push(evento);
      groups.set(key, group);
    }

    return Array.from(groups.entries()).map(([key, group]) => ({ key, eventos: group }));
  }, [visibleEvents]);

  const firstResultInAnotherMonth = matchingEvents.find(
    (evento) => evento.mesKey !== selectedMonth,
  );
  const selectedMonthIndex = monthKeys.indexOf(selectedMonth);
  const previousMonth = selectedMonthIndex > 0 ? monthKeys[selectedMonthIndex - 1] : null;
  const nextMonth =
    selectedMonthIndex >= 0 && selectedMonthIndex < monthKeys.length - 1
      ? monthKeys[selectedMonthIndex + 1]
      : null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset expanded cards when filters change
  useEffect(() => {
    setExpandedCards(new Set());
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
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-forest/10 bg-cream/80 p-5 shadow-2xl shadow-forest/5 md:p-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-forest/60">
              Buscar na agenda
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, local ou descrição..."
              className="w-full rounded-full border border-forest/15 bg-white px-5 py-4 text-sm text-forest outline-none transition-colors placeholder:text-forest/35 focus:border-orange"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!previousMonth}
              onClick={() => previousMonth && setSelectedMonth(previousMonth)}
              className="rounded-full border border-forest/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-forest transition-colors enabled:hover:bg-forest enabled:hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
            >
              Mês anterior
            </button>
            <label className="sr-only" htmlFor="agenda-month">
              Selecionar mês da agenda
            </label>
            <select
              id="agenda-month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="rounded-full border border-forest/15 bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-forest outline-none focus:border-orange"
            >
              {monthKeys.map((month) => (
                <option key={month} value={month}>
                  {formatMonthLabel(month)}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!nextMonth}
              onClick={() => nextMonth && setSelectedMonth(nextMonth)}
              className="rounded-full border border-forest/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-forest transition-colors enabled:hover:bg-forest enabled:hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
            >
              Próximo mês
            </button>
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-3" aria-label="Filtrar eventos por categoria">
          <button
            type="button"
            onClick={() => setActiveCategory("todos")}
            className={`rounded-full border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] transition-all ${
              activeCategory === "todos"
                ? "border-forest bg-forest text-cream"
                : "border-forest/15 text-forest/60 hover:border-forest/40 hover:text-forest"
            }`}
          >
            Todos
          </button>
          {availableCategories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className="rounded-full border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5"
              style={
                activeCategory === category.value
                  ? {
                      backgroundColor: category.color,
                      borderColor: category.color,
                      color: category.textColor,
                    }
                  : { borderColor: "rgb(29 67 44 / 0.15)", color: "rgb(29 67 44 / 0.65)" }
              }
            >
              {category.label}
            </button>
          ))}
        </nav>
      </section>

      {groupedEvents.length > 0 ? (
        <div className="space-y-8">
          {groupedEvents.map(({ key, eventos: dayEvents }) => {
            const date = getEventoDate(dayEvents[0]);

            return (
              <section key={key} className="grid gap-5 md:grid-cols-[120px_1fr]">
                <div className="md:sticky md:top-24 md:self-start">
                  <div className="rounded-3xl bg-forest px-5 py-6 text-center text-cream">
                    <span className="block font-display text-5xl font-black leading-none">
                      {formatDay(date)}
                    </span>
                    <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-cream/65">
                      {formatWeekday(date)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {dayEvents.map((evento) => {
                    const category = CATEGORIAS[evento.categoria];
                    const imagemPrincipal =
                      (evento.imagens?.[0] as SanityImageRef | undefined) ?? null;
                    const isExpanded = expandedCards.has(evento._id);

                    return (
                      <article
                        key={evento._id}
                        className="overflow-hidden rounded-[1.5rem] border border-forest/10 bg-white text-forest shadow-xl shadow-forest/5 md:grid md:grid-cols-[220px_1fr]"
                      >
                        <div className="relative aspect-[4/3] bg-forest/10 md:aspect-auto">
                          {imagemPrincipal ? (
                            <img
                              src={urlFor(imagemPrincipal).width(520).height(390).url()}
                              alt={evento.titulo}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <img src="/icons/chave.svg" className="w-16 opacity-10" alt="" />
                            </div>
                          )}
                        </div>

                        <div className="p-5 md:p-7">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em]"
                              style={{ backgroundColor: category.color, color: category.textColor }}
                            >
                              {category.label}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest/45">
                              {formatHour(getEventoDate(evento))}
                            </span>
                          </div>

                          <h2 className="mt-4 font-display text-3xl font-black italic uppercase leading-none md:text-4xl">
                            {evento.titulo}
                          </h2>

                          {evento.local && (
                            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-forest/50">
                              {evento.local}
                            </p>
                          )}

                          <div
                            className={`overflow-hidden transition-all duration-500 ${
                              isExpanded ? "mt-5 max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            {evento.descricao && (
                              <p className="whitespace-pre-line text-sm leading-relaxed text-forest/70">
                                {evento.descricao}
                              </p>
                            )}
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                              {evento.valor && (
                                <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-orange">
                                  {evento.valor}
                                </span>
                              )}
                              {evento.linkCompra && (
                                <a
                                  href={evento.linkCompra}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-forest px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cream transition-colors hover:bg-orange"
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
                            className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-forest/60 transition-colors hover:text-forest"
                          >
                            {isExpanded ? "Ver menos" : "Ver mais"}
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
        <div className="rounded-[2rem] border border-forest/10 bg-cream/70 px-6 py-14 text-center text-forest">
          <p className="font-display text-2xl font-black italic uppercase">
            Nenhum encontro encontrado neste mês.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-forest/65">
            Tente limpar a busca, trocar a categoria ou navegar para outro mês da agenda.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("todos");
              }}
              className="rounded-full bg-forest px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cream"
            >
              Limpar filtros
            </button>
            {firstResultInAnotherMonth && (
              <button
                type="button"
                onClick={() => setSelectedMonth(firstResultInAnotherMonth.mesKey)}
                className="rounded-full border border-forest/20 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-forest"
              >
                Ir para {formatMonthLabel(firstResultInAnotherMonth.mesKey)}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
