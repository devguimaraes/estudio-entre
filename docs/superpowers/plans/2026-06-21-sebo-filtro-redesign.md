# Sebo — Redesign do Painel de Filtros — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformular o painel de filtros da página `/sebo` com busca em destaque, top 4 gêneros como pills fixos e popover premium contendo todos os gêneros.

**Architecture:** Reescrever o componente React Island `SeboFilter.tsx` mantendo a lógica de filtro existente, mas reorganizando a UI em layout vertical. Introduzir um popover customizado para seleção de gênero, usando hooks do React para controle de estado, refs para detecção de clique fora e teclado, e Tailwind para estilização. O projeto não possui suíte de testes automatizados; a verificação será feita via `bun run check`, `bun run build` e inspeção manual da rota `/sebo`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, GSAP, Biome.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/components/islands/SeboFilter.tsx` | Componente principal — painel de busca, pills de gênero, popover, grid de livros e estados vazios. |
| `src/types/sebo.ts` | Tipos e cores dos gêneros (possível ajuste de contraste, sem mudança estrutural). |
| `src/pages/sebo.astro` | Página que consome o componente (sem alterações esperadas). |

---

### Task 1: Preparar helpers de cor e normalização

**Files:**
- Modify: `src/components/islands/SeboFilter.tsx`

- [ ] **Step 1: Adicionar helper para cor de texto sobre fundo colorido**

  No topo do arquivo, após os imports, adicione:

  ```ts
  function getContrastColor(genero: string): string {
    const lightBackgrounds = [
      "Biografia",
      "Literatura Juvenil",
      "Infantil/Paradidático",
    ];
    return lightBackgrounds.includes(genero) ? "#1A1612" : "#F0EDE8";
  }
  ```

- [ ] **Step 2: Commitar**

  ```bash
  git add src/components/islands/SeboFilter.tsx
  git commit -m "feat(sebo): helper de contraste para pills de gênero"
  ```

---

### Task 2: Implementar o popover de gêneros

**Files:**
- Modify: `src/components/islands/SeboFilter.tsx`

- [ ] **Step 1: Adicionar estado e refs para o popover**

  Dentro do componente `SeboFilter`, após os estados existentes:

  ```ts
  const [isGeneroOpen, setIsGeneroOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  ```

- [ ] **Step 2: Adicionar efeito para fechar popover ao clicar fora ou pressionar ESC**

  Após o `useLayoutEffect` existente, adicione:

  ```ts
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsGeneroOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsGeneroOpen(false);
      }
    }

    if (isGeneroOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isGeneroOpen]);
  ```

- [ ] **Step 3: Commitar**

  ```bash
  git add src/components/islands/SeboFilter.tsx
  git commit -m "feat(sebo): estado e comportamento do popover de gêneros"
  ```

---

### Task 3: Reestruturar o painel de filtros

**Files:**
- Modify: `src/components/islands/SeboFilter.tsx`

- [ ] **Step 1: Substituir a seção "Filter Panel" atual pelo novo layout vertical**

  Localize e substitua a seção do painel (`<section className="-mt-10 rounded-[2.5rem] ...">` até `</section>`) por:

  ```tsx
  {/* Filter Panel */}
  <section className="-mt-10 rounded-[2.5rem] border border-white/40 bg-white/50 p-5 shadow-2xl shadow-bordo/5 backdrop-blur-sm md:p-10">
    <div className="space-y-8">
      {/* Search */}
      <div className="relative w-full">
        <label
          htmlFor="search-sebo"
          className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-bordo/50 md:text-[11px]"
        >
          Garimpar no acervo
        </label>
        <div className="relative group">
          <input
            id="search-sebo"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Título, autor ou editora..."
            className="w-full rounded-t-xl border-b-2 border-bordo/10 bg-bordo/[0.03] px-5 py-5 text-base font-medium text-bordo outline-none transition-all placeholder:text-bordo/30 focus:border-orange focus:bg-white md:py-6 md:text-lg"
          />
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within:opacity-50">
            <svg
              width="22"
              height="22"
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

      {/* Genre filters */}
      <div className="space-y-4">
        <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-bordo/50 md:text-[11px]">
          Gêneros
        </span>
        <nav
          className="flex flex-wrap items-center gap-3"
          aria-label="Filtrar por gênero"
        >
          {activeGenero === "todos" ? (
            <>
              <button
                type="button"
                aria-pressed
                className="rounded-full border-2 border-bordo bg-bordo px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-cream shadow-sm shadow-bordo/20 transition-all md:px-8 md:py-3.5 md:text-[11px]"
              >
                Todos · {livros.length}
              </button>
              {generos.slice(0, 4).map(([genero, count]) => (
                <button
                  key={genero}
                  type="button"
                  aria-pressed={false}
                  onClick={() => setActiveGenero(genero)}
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
                aria-pressed
                className="rounded-full border-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm md:px-8 md:py-3.5 md:text-[11px]"
                style={{
                  backgroundColor: CORES_GENERO[activeGenero] ?? "#EC6838",
                  borderColor: CORES_GENERO[activeGenero] ?? "#EC6838",
                  color: getContrastColor(activeGenero),
                }}
              >
                {activeGenero} · {(counts.get(activeGenero) ?? 0)}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveGenero("todos");
                  setSearch("");
                }}
                className="rounded-full border border-bordo/20 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-bordo/60 transition-all hover:border-bordo hover:text-bordo md:px-7 md:py-3.5 md:text-[11px]"
              >
                Limpar
              </button>
            </>
          )}

          {/* Popover trigger */}
          <div className="relative">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setIsGeneroOpen((prev) => !prev)}
              aria-expanded={isGeneroOpen}
              aria-controls="genero-popover"
              className="rounded-full border-2 border-bordo/10 bg-bordo/[0.06] px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-bordo/70 transition-all hover:border-bordo/30 hover:bg-bordo/10 md:px-7 md:py-3.5 md:text-[11px]"
            >
              Todos os gêneros
              <span
                className="ml-2 inline-block transition-transform"
                style={{ transform: isGeneroOpen ? "rotate(180deg)" : undefined }}
              >
                ▾
              </span>
            </button>

            {/* Popover */}
            {isGeneroOpen && (
              <div
                id="genero-popover"
                ref={popoverRef}
                role="dialog"
                aria-label="Escolha um gênero"
                className="absolute left-0 top-full z-50 mt-3 w-[min(90vw,520px)] rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-2xl shadow-bordo/10 backdrop-blur-md md:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-bordo/50 md:text-[11px]">
                    Escolha um gênero
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGeneroOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-bordo/40 transition-colors hover:bg-bordo/10 hover:text-bordo"
                    aria-label="Fechar"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
                  <button
                    type="button"
                    aria-pressed={activeGenero === "todos"}
                    onClick={() => {
                      setActiveGenero("todos");
                      setIsGeneroOpen(false);
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
                    Todos · {livros.length}
                  </button>
                  {generos.map(([genero, count]) => (
                    <button
                      key={genero}
                      type="button"
                      aria-pressed={activeGenero === genero}
                      onClick={() => {
                        setActiveGenero(genero);
                        setIsGeneroOpen(false);
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
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  </section>
  ```

  > **Nota:** a variável `counts` precisa estar disponível no escopo do componente. Converta o `useMemo` que calcula `generos` para também expor o `Map` de contagens. Substitua:
  >
  > ```ts
  > const generos = useMemo(() => {
  >   const counts = new Map<string, number>();
  >   for (const livro of livros) {
  >     counts.set(livro.genero, (counts.get(livro.genero) ?? 0) + 1);
  >   }
  >   return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  > }, [livros]);
  > ```
  >
  > por:
  >
  > ```ts
  > const counts = useMemo(() => {
  >   const map = new Map<string, number>();
  >   for (const livro of livros) {
  >     map.set(livro.genero, (map.get(livro.genero) ?? 0) + 1);
  >   }
  >   return map;
  > }, [livros]);
  >
  > const generos = useMemo(() => {
  >   return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  > }, [counts]);
  > ```

- [ ] **Step 2: Verificar lint e tipos**

  ```bash
  bun run check
  ```

  Expected: sem erros de lint ou formatação.

- [ ] **Step 3: Commitar**

  ```bash
  git add src/components/islands/SeboFilter.tsx
  git commit -m "feat(sebo): redesign do painel de filtros com busca em destaque e popover"
  ```

---

### Task 4: Adaptar o popover para mobile (bottom sheet)

**Files:**
- Modify: `src/components/islands/SeboFilter.tsx`

- [ ] **Step 1: Detectar viewport mobile e renderizar bottom sheet**

  No topo do componente, adicione um estado para detectar mobile:

  ```ts
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    setIsMobile(media.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);
  ```

  Substitua o wrapper do popover por uma versão condicional:

  ```tsx
  {isGeneroOpen && (
    <div
      id="genero-popover"
      ref={popoverRef}
      role="dialog"
      aria-label="Escolha um gênero"
      className={
        isMobile
          ? "fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] border-t border-white/60 bg-white/90 p-6 shadow-[0_-20px_60px_rgba(61,16,32,0.15)] backdrop-blur-md"
          : "absolute left-0 top-full z-50 mt-3 w-[min(90vw,520px)] rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-2xl shadow-bordo/10 backdrop-blur-md md:p-6"
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-bordo/50 md:text-[11px]">
          Escolha um gênero
        </span>
        <button
          type="button"
          onClick={() => setIsGeneroOpen(false)}
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
        {/* botões dos gêneros — mesmo conteúdo do Step anterior */}
      </div>
    </div>
  )}
  ```

- [ ] **Step 2: Verificar lint e tipos**

  ```bash
  bun run check
  ```

  Expected: sem erros.

- [ ] **Step 3: Commitar**

  ```bash
  git add src/components/islands/SeboFilter.tsx
  git commit -m "feat(sebo): bottom sheet mobile no popover de gêneros"
  ```

---

### Task 5: Verificar build e comportamento visual

**Files:**
- Modify: `src/components/islands/SeboFilter.tsx`

- [ ] **Step 1: Fazer build de produção**

  ```bash
  bun run build
  ```

  Expected: build completo sem erros.

- [ ] **Step 2: Verificar rota `/sebo` localmente**

  ```bash
  bun run preview
  ```

  Acesse `http://localhost:4321/sebo` e verifique:

  - A busca ocupa a largura total do painel.
  - Os pills "Todos", "Romance", "Biografia", "Auto Ajuda" e "Poesia" aparecem.
  - O trigger "Todos os gêneros" abre o popover com todos os gêneros coloridos.
  - Ao clicar em um gênero, o painel mostra apenas o pill ativo + "Limpar" + trigger.
  - A busca filtra corretamente por título, autor e editora.
  - No mobile (devtools), o popover aparece como bottom sheet.
  - `prefers-reduced-motion` desabilita animações.

- [ ] **Step 3: Commitar ajustes finais se necessário**

  Se houver ajustes visuais pequenos (padding, cores, etc.):

  ```bash
  git add src/components/islands/SeboFilter.tsx
  git commit -m "style(sebo): ajustes finais no painel de filtros"
  ```

---

## Self-Review

### Spec coverage

| Spec Section | Task(s) |
|--------------|---------|
| Layout vertical com busca em destaque | Task 3 |
| Top 4 gêneros como pills fixos | Task 3 |
| Popover com todos os gêneros coloridos | Task 2, Task 3 |
| Estados padrão e filtrado | Task 3 |
| Busca textual | Task 3 (mantida lógica existente) |
| Mobile bottom sheet | Task 4 |
| Estilo visual e cores | Task 1, Task 3 |
| Animações e `prefers-reduced-motion` | Task 3, Task 4 (mantidas transições Tailwind) |
| Acessibilidade | Task 2, Task 3 |

### Placeholder scan

Nenhum TBD, TODO ou referência vaga encontrada.

### Type consistency

- `activeGenero` continua como `string`.
- `CORES_GENERO` é indexado por `genero` do tipo `GeneroSebo`; o fallback `"#EC6838"` cobre casos inesperados.
- `counts` é `Map<string, number>`.
