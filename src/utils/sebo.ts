import type { GeneroSebo } from "@/types/sebo";

/**
 * Remove acentos/diacríticos e converte para minúsculas.
 * Útil para busca textual sem sensibilidade a acentuação.
 */
export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/**
 * Retorna a cor de texto com contraste adequado para o fundo do gênero.
 * Para fundos claros (Biografia, Literatura Juvenil, Infantil/Paradidático)
 * retorna near-black (#1A1612); para os demais retorna cream (#F0EDE8).
 */
export function getContrastColor(genero: GeneroSebo): string {
  const lightBackgrounds: GeneroSebo[] = [
    "Biografia",
    "Literatura Juvenil",
    "Infantil/Paradidático",
  ];
  return lightBackgrounds.includes(genero) ? "#1A1612" : "#F0EDE8";
}
