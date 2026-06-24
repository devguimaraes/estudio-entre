import type { GeneroSebo, LivroSebo } from "@/types/sebo";
import { normalizeText } from "@/utils/sebo";
import { useCallback, useMemo, useState } from "react";

const PAGE_SIZE = 6;

/**
 * Hook de estado e filtro para o acervo Sebo.
 * Centraliza a lógica de filtragem por gênero + busca textual + paginação.
 */
export function useSeboFilter(livros: LivroSebo[]) {
  const [activeGenero, setActiveGenero] = useState<"todos" | GeneroSebo>("todos");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const counts = useMemo(() => {
    const map = new Map<GeneroSebo, number>();
    for (const livro of livros) {
      map.set(livro.genero, (map.get(livro.genero) ?? 0) + 1);
    }
    return map;
  }, [livros]);

  const generos = useMemo(() => Array.from(counts.entries()).sort((a, b) => b[1] - a[1]), [counts]);

  const searchTerm = useMemo(() => normalizeText(search), [search]);

  const filteredLivros = useMemo(
    () =>
      livros.filter((livro) => {
        const matchesGenero = activeGenero === "todos" || livro.genero === activeGenero;
        const matchesSearch =
          !searchTerm ||
          normalizeText(livro.titulo).includes(searchTerm) ||
          normalizeText(livro.autor).includes(searchTerm) ||
          normalizeText(livro.editora).includes(searchTerm);
        return matchesGenero && matchesSearch;
      }),
    [livros, activeGenero, searchTerm],
  );

  const displayedLivros = useMemo(
    () => filteredLivros.slice(0, visibleCount),
    [filteredLivros, visibleCount],
  );

  const hasMore = visibleCount < filteredLivros.length;
  const remaining = filteredLivros.length - visibleCount;

  const handleSetGenero = useCallback((genero: "todos" | GeneroSebo) => {
    setActiveGenero(genero);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSetSearch = useCallback((value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveGenero("todos");
    setSearch("");
    setVisibleCount(PAGE_SIZE);
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  return {
    activeGenero,
    setActiveGenero: handleSetGenero,
    search,
    setSearch: handleSetSearch,
    counts,
    generos,
    filteredLivros,
    displayedLivros,
    hasMore,
    remaining,
    loadMore,
    clearFilters,
  };
}
