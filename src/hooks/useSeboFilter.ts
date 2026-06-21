import type { GeneroSebo, LivroSebo } from "@/types/sebo";
import { normalizeText } from "@/utils/sebo";
import { useCallback, useMemo, useState } from "react";

/**
 * Hook de estado e filtro para o acervo Sebo.
 * Centraliza a lógica de filtragem por gênero + busca textual.
 */
export function useSeboFilter(livros: LivroSebo[]) {
  const [activeGenero, setActiveGenero] = useState<"todos" | GeneroSebo>("todos");
  const [search, setSearch] = useState("");

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

  const clearFilters = useCallback(() => {
    setActiveGenero("todos");
    setSearch("");
  }, []);

  return {
    activeGenero,
    setActiveGenero,
    search,
    setSearch,
    counts,
    generos,
    filteredLivros,
    clearFilters,
  };
}
