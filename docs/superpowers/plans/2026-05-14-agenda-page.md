# Agenda Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated `/agenda` page with future Sanity events, month navigation, search, category filters, date grouping, secure data normalization, and a simplified home preview.

**Architecture:** Astro fetches Sanity data at build/deploy time and passes normalized event objects to focused React islands. Data validation and date/link helpers live in a small utility module so the home preview and full agenda use the same safe inputs. The full agenda is client-interactive only for filtering, month selection, and card expansion; it never fetches Sanity from the browser.

**Tech Stack:** Astro 6, React 19 islands, Sanity GROQ via `sanity:client`, TypeScript, Tailwind utility classes, existing brand components (`BaseLayout`, `HalftoneTexture`, `Decorative`), Bun scripts (`bun run check`, `bun run build`).

---

## File Structure

- Modify `src/types/evento.ts`: keep `CategoriaEvento` aligned with the Sanity schema and add a stricter normalized event type.
- Modify `src/utils/categorias.ts`: remove keys not present in `CategoriaEvento` or the Sanity schema.
- Create `src/utils/eventos.ts`: centralize category validation, date validation, URL validation, event normalization, future filtering, and month helpers.
- Modify `src/sanity/queries/evento.ts`: add a query for active future events.
- Modify `src/pages/index.astro`: fetch future events, normalize them, pass only the first 3 to the home `Agenda` section.
- Modify `src/components/sections/Agenda.astro`: make the existing home section a preview and add CTA to `/agenda`.
- Create `src/components/islands/AgendaPageFilter.tsx`: full interactive agenda experience.
- Create `src/pages/agenda.astro`: full route with SEO, Sanity fetch, error fallback, decorative shell, and `AgendaPageFilter` island.
- Verify `src/components/islands/AgendaFilter.tsx`: keep it working with the normalized event shape used by the home preview.

---

### Task 1: Align Event Types and Category Map

**Files:**
- Modify: `src/types/evento.ts`
- Modify: `src/utils/categorias.ts`

- [ ] **Step 1: Update event types**

Replace `src/types/evento.ts` with:

```ts
export type CategoriaEvento =
  | "show"
  | "oficina"
  | "roda-de-conversa"
  | "lancamento"
  | "sarau"
  | "exposicao"
  | "biblioterapia"
  | "dj-session";

export interface EventoCard {
  _id: string;
  titulo: string;
  slug: string;
  categoria: CategoriaEvento;
  dataHora: string;
  local: string | null;
  descricao: string | null;
  valor: string | null;
  linkCompra: string | null;
  imagens: SanityImageRef[] | null;
}

export interface EventoNormalizado extends EventoCard {
  timestamp: number;
  mesKey: string;
  buscaTexto: string;
}

export interface SanityImageRef {
  _type: string;
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}
```

- [ ] **Step 2: Align category map with the type/schema**

Replace `src/utils/categorias.ts` with:

```ts
import type { CategoriaEvento } from "@/types/evento";

export const CATEGORIAS: Record<
  CategoriaEvento,
  { label: string; color: string; textColor: string }
> = {
  show: { label: "Show", color: "#EC6838", textColor: "#F0EDE8" },
  oficina: { label: "Oficina", color: "#BDB2DD", textColor: "#1A1612" },
  "roda-de-conversa": {
    label: "Roda de Conversa",
    color: "#777BDE",
    textColor: "#F0EDE8",
  },
  lancamento: { label: "Lançamento", color: "#E08D3D", textColor: "#1A1612" },
  sarau: { label: "Sarau", color: "#8E8100", textColor: "#F0EDE8" },
  exposicao: { label: "Exposição", color: "#B9E4EB", textColor: "#1A1612" },
  biblioterapia: { label: "Biblioterapia", color: "#9E4B2D", textColor: "#F0EDE8" },
  "dj-session": { label: "DJ Session", color: "#1D432C", textColor: "#F0EDE8" },
};
```

- [ ] **Step 3: Run type/lint validation**

Run: `bun run check`

Expected: no `CATEGORIAS` type errors from extra keys like `palestras`, `estudio`, or `encontros`.

- [ ] **Step 4: Commit**

```bash
git add src/types/evento.ts src/utils/categorias.ts
git commit -m "fix(agenda): align event categories with schema"
```

---

### Task 2: Add Safe Event Normalization Utilities

**Files:**
- Create: `src/utils/eventos.ts`

- [ ] **Step 1: Create utility module**

Create `src/utils/eventos.ts`:

```ts
import type { CategoriaEvento, EventoCard, EventoNormalizado } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";

const COLLATOR_LOCALE = "pt-BR";

export function isCategoriaEvento(value: unknown): value is CategoriaEvento {
  return typeof value === "string" && value in CATEGORIAS;
}

export function getMesKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function isSafeExternalUrl(value: string | null): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeEvento(evento: EventoCard): EventoNormalizado | null {
  if (!evento._id || !evento.titulo || !isCategoriaEvento(evento.categoria)) {
    return null;
  }

  const data = new Date(evento.dataHora);
  if (Number.isNaN(data.getTime())) {
    return null;
  }

  const local = evento.local?.trim() || null;
  const descricao = evento.descricao?.trim() || null;
  const valor = evento.valor?.trim() || null;
  const linkCompra = isSafeExternalUrl(evento.linkCompra) ? evento.linkCompra : null;
  const buscaTexto = [evento.titulo, local, descricao]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase(COLLATOR_LOCALE);

  return {
    ...evento,
    local,
    descricao,
    valor,
    linkCompra,
    timestamp: data.getTime(),
    mesKey: getMesKey(data),
    buscaTexto,
  };
}

export function normalizeEventos(eventos: EventoCard[]): EventoNormalizado[] {
  return eventos
    .map(normalizeEvento)
    .filter((evento): evento is EventoNormalizado => evento !== null)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function getFutureEventos(eventos: EventoNormalizado[], referenceDate = new Date()) {
  return eventos.filter((evento) => evento.timestamp >= referenceDate.getTime());
}

export function getAvailableMonthKeys(eventos: EventoNormalizado[]): string[] {
  return Array.from(new Set(eventos.map((evento) => evento.mesKey)));
}

export function formatMonthLabel(mesKey: string): string {
  const [year, month] = mesKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase(COLLATOR_LOCALE);
}
```

- [ ] **Step 2: Run validation**

Run: `bun run check`

Expected: no TypeScript/Biome errors in `src/utils/eventos.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/utils/eventos.ts
git commit -m "feat(agenda): normalize Sanity event data"
```

---

### Task 3: Add Future Events Query and Use It on Home

**Files:**
- Modify: `src/sanity/queries/evento.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add query for active future events**

Update `src/sanity/queries/evento.ts` to include:

```ts
export const eventosFuturosQuery = defineQuery(
  `*[_type == "evento" && ativo == true && dataHora >= now()]
    | order(dataHora asc){
    _id,
    titulo,
    "slug": slug.current,
    categoria,
    dataHora,
    local,
    descricao,
    valor,
    linkCompra,
    imagens
  }`,
);
```

Keep the existing `eventosQuery`, `eventoBySlugQuery`, and `todosEventosSlugsQuery` exports unchanged.

- [ ] **Step 2: Update home fetch and preview limit**

Replace the frontmatter in `src/pages/index.astro` with:

```astro
---
import { sanityClient } from "sanity:client";
import Agenda from "@/components/sections/Agenda.astro";
import Contato from "@/components/sections/Contato.astro";
import Footer from "@/components/sections/Footer.astro";
import Galeria from "@/components/sections/Galeria.astro";
import Hero from "@/components/sections/Hero.astro";
import Pilares from "@/components/sections/Pilares.astro";
import Sobre from "@/components/sections/Sobre.astro";
import VisitacaoCTA from "@/components/sections/VisitacaoCTA.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { eventosFuturosQuery } from "@/sanity/queries/evento";
import type { EventoCard } from "@/types/evento";
import { normalizeEventos } from "@/utils/eventos";

let eventos: EventoCard[] = [];
try {
  const eventosSanity = await sanityClient.fetch<EventoCard[]>(eventosFuturosQuery);
  eventos = normalizeEventos(eventosSanity).slice(0, 3);
} catch {
  console.error("Falha ao buscar eventos futuros do Sanity");
}
---
```

Keep the template body unchanged for now:

```astro
<BaseLayout title="Estúdio Entre — Hub Cultural no Méier, RJ">
  <Hero />
  <Sobre />
  <Pilares />
  <Agenda eventos={eventos} />
  <Galeria />
  <VisitacaoCTA />
  <Contato />
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Run validation**

Run: `bun run check`

Expected: no import/type errors from `eventosFuturosQuery` or `normalizeEventos`.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/queries/evento.ts src/pages/index.astro
git commit -m "feat(agenda): fetch future events for home preview"
```

---

### Task 4: Convert Home Agenda Into a Preview With CTA

**Files:**
- Modify: `src/components/sections/Agenda.astro`
- Modify: `src/components/islands/AgendaFilter.tsx`

- [ ] **Step 1: Add CTA below the home agenda list**

In `src/components/sections/Agenda.astro`, replace the conditional block at lines 55-66 with:

```astro
    {
      eventos.length > 0 ? (
        <>
          <AgendaFilter client:visible eventos={eventos} />
          <div class="mt-16 flex justify-center">
            <a
              href="/agenda"
              class="group inline-flex items-center gap-3 rounded-full border border-cream/30 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-cream transition-all duration-500 hover:bg-cream hover:text-forest"
            >
              Ver agenda completa
              <img
                src="/icons/play.svg"
                class="h-3.5 w-3.5 invert opacity-60 transition-transform group-hover:translate-x-1 group-hover:invert-0"
                alt=""
              />
            </a>
          </div>
        </>
      ) : (
        <div class="py-32 text-center">
          <p class="font-display italic text-2xl opacity-40">
            Silêncio criativo por enquanto.<br />
            Em breve, novos mundos se abrem.
          </p>
          <a
            href="/agenda"
            class="mt-8 inline-flex rounded-full border border-cream/30 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-cream"
          >
            Abrir agenda
          </a>
        </div>
      )
    }
```

- [ ] **Step 2: Keep home filter behavior minimal**

Do not add month/search logic to `AgendaFilter.tsx`. It should remain a category filter for the 3-event preview.

If `bun run check` reports type issues because `EventoNormalizado[]` is passed where `EventoCard[]` is expected, no code change is needed: `EventoNormalizado` extends `EventoCard`, so the assignment in `index.astro` is structurally compatible.

- [ ] **Step 3: Run validation**

Run: `bun run check`

Expected: no Astro syntax errors in `Agenda.astro`.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Agenda.astro src/components/islands/AgendaFilter.tsx
git commit -m "feat(agenda): add full agenda CTA to home preview"
```

---

### Task 5: Build Full Agenda React Island

**Files:**
- Create: `src/components/islands/AgendaPageFilter.tsx`

- [ ] **Step 1: Create the full agenda island**

Create `src/components/islands/AgendaPageFilter.tsx`:

```tsx
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

  return months.includes(currentKey) ? currentKey : months[0] ?? currentKey;
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

  const firstResultInAnotherMonth = matchingEvents.find((evento) => evento.mesKey !== selectedMonth);
  const selectedMonthIndex = monthKeys.indexOf(selectedMonth);
  const previousMonth = selectedMonthIndex > 0 ? monthKeys[selectedMonthIndex - 1] : null;
  const nextMonth =
    selectedMonthIndex >= 0 && selectedMonthIndex < monthKeys.length - 1
      ? monthKeys[selectedMonthIndex + 1]
      : null;

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
        <p className="font-display text-3xl font-black italic uppercase">Silêncio criativo por enquanto.</p>
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
                    const imagemPrincipal = (evento.imagens?.[0] as SanityImageRef | undefined) ?? null;
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
```

- [ ] **Step 2: Run validation**

Run: `bun run check`

Expected: no React/TypeScript errors in `AgendaPageFilter.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/islands/AgendaPageFilter.tsx
git commit -m "feat(agenda): add interactive agenda filters"
```

---

### Task 6: Create `/agenda` Route

**Files:**
- Create: `src/pages/agenda.astro`

- [ ] **Step 1: Create route**

Create `src/pages/agenda.astro`:

```astro
---
import { sanityClient } from "sanity:client";
import AgendaPageFilter from "@/components/islands/AgendaPageFilter";
import Decorative from "@/components/ui/Decorative.astro";
import HalftoneTexture from "@/components/ui/HalftoneTexture.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { eventosFuturosQuery } from "@/sanity/queries/evento";
import type { EventoCard, EventoNormalizado } from "@/types/evento";
import { normalizeEventos } from "@/utils/eventos";

let eventos: EventoNormalizado[] = [];

try {
  const eventosSanity = await sanityClient.fetch<EventoCard[]>(eventosFuturosQuery);
  eventos = normalizeEventos(eventosSanity);
} catch {
  console.error("Falha ao buscar eventos futuros do Sanity para /agenda");
}
---

<BaseLayout
  title="Agenda — Estúdio Entre"
  description="Confira os próximos encontros, oficinas, shows, saraus e vivências do Estúdio Entre no Méier, Rio de Janeiro."
>
  <main class="relative min-h-screen overflow-hidden bg-cream px-6 pb-24 pt-32 text-forest md:px-16 md:pt-40">
    <HalftoneTexture density={18} dotSize={1.2} color="29,67,44" opacity={0.05} class="z-0" />

    <div class="absolute right-[8%] top-36 opacity-25">
      <Decorative type="star" color="#EC6838" size={48} />
    </div>
    <div class="absolute bottom-24 left-[6%] opacity-20">
      <Decorative type="dots" color="#3D1020" size={54} />
    </div>

    <div class="relative z-10 mx-auto max-w-[1300px]">
      <header class="mb-12 max-w-4xl md:mb-16">
        <p class="font-display text-[10px] font-bold uppercase tracking-[0.4em] text-forest/45">
          Encontros & Vivências
        </p>
        <h1 class="mt-5 font-display text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.85] text-forest">
          Agenda<br />
          <span class="italic text-orange">cultural</span>
        </h1>
        <p class="mt-6 max-w-2xl text-base leading-relaxed text-forest/70 md:text-lg">
          Explore os próximos encontros do Estúdio Entre por mês, categoria ou palavra-chave.
        </p>
      </header>

      <AgendaPageFilter client:visible eventos={eventos} />
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Run validation**

Run: `bun run check`

Expected: no Astro errors for `src/pages/agenda.astro`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/agenda.astro
git commit -m "feat(agenda): add full agenda page"
```

---

### Task 7: Add Navigation Entry for Agenda Page

**Files:**
- Modify: `src/components/ui/Navbar.astro`
- Modify: `src/components/islands/MobileNav.tsx`

- [ ] **Step 1: Update desktop agenda link**

In `src/components/ui/Navbar.astro`, change the Agenda link from:

```astro
<li><a href="#agenda" class="navbar__link" data-cursor="ENTRAR">Agenda</a></li>
```

to:

```astro
<li><a href="/agenda" class="navbar__link" data-cursor="ENTRAR">Agenda</a></li>
```

- [ ] **Step 2: Update mobile agenda link**

In `src/components/islands/MobileNav.tsx`, change:

```tsx
const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#pilares", label: "Pilares" },
  { href: "#agenda", label: "Agenda" },
  { href: "#galeria", label: "Espaço" },
  { href: "#agendar-visita", label: "Agendar Visita" },
];
```

to:

```tsx
const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#pilares", label: "Pilares" },
  { href: "/agenda", label: "Agenda" },
  { href: "#galeria", label: "Espaço" },
  { href: "#agendar-visita", label: "Agendar Visita" },
];
```

- [ ] **Step 3: Run validation**

Run: `bun run check`

Expected: no lint/type errors from navigation changes.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Navbar.astro src/components/islands/MobileNav.tsx
git commit -m "feat(agenda): link navigation to agenda page"
```

---

### Task 8: Build and Manual Verification

**Files:**
- No code files unless verification reveals an issue.

- [ ] **Step 1: Run full check**

Run: `bun run check`

Expected: exits successfully.

- [ ] **Step 2: Run production build**

Run: `bun run build`

Expected: exits successfully and includes `/agenda` in generated routes.

- [ ] **Step 3: Run local preview for manual QA**

Run: `bun run preview`

Expected: preview server starts successfully.

- [ ] **Step 4: Verify home route**

Open `/` and confirm:

- Agenda section displays at most 3 future events.
- CTA “Ver agenda completa” links to `/agenda`.
- Empty state still renders if no events exist.
- Existing sections after agenda still render.

- [ ] **Step 5: Verify agenda route**

Open `/agenda` and confirm:

- Hero renders with page title and explanatory text.
- Search filters by title, local, and description.
- Category filters combine with search.
- Month previous/next buttons work and disable at boundaries.
- Month selector only lists months with future events.
- Events are grouped by day.
- “Ver mais/Ver menos” expands and collapses details.
- External event links open in a new tab.

- [ ] **Step 6: Verify responsive behavior**

Use browser responsive mode and confirm:

- `/agenda` controls stack cleanly on mobile.
- Cards remain readable.
- Tap targets are large enough.
- No horizontal overflow appears.

- [ ] **Step 7: Record verification result**

If all checks pass without code changes, do not create an empty commit. If a concrete QA issue is found, fix the exact affected file, rerun `bun run check` and `bun run build`, then commit only that file with a specific message such as `fix(agenda): correct mobile agenda spacing`.

---

## Self-Review

- Spec coverage: the plan covers `/agenda`, home preview, future-only data, month navigation, month selector, search, category filters, grouping by date, expandable cards, safe link handling, no client-side Sanity fetch, no raw HTML, no new calendar dependency, and validation via `bun run check`/`bun run build`.
- Placeholder scan: the plan contains no unresolved placeholders. The mobile navigation step now includes the exact current `links` block and replacement.
- Type consistency: `EventoNormalizado` extends `EventoCard`, `AgendaPageFilter` receives `EventoNormalizado[]`, the Sanity query returns `EventoCard[]` before normalization, and only JSON-safe strings/numbers cross the Astro-to-React hydration boundary.
