import { useEffect, useState } from "react";

/**
 * Acompanha o estado de uma media query CSS.
 * SSR-safe: retorna `false` durante a renderização no servidor.
 *
 * @example
 * ```ts
 * const isMobile = useMediaQuery("(max-width: 767px)");
 * const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
