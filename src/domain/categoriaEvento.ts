/**
 * Fonte canônica de CategoriaEvento — alinhada a CONTEXT.md.
 * Schema Sanity, tipos e labels de UI derivam desta lista.
 */
export const CATEGORIA_EVENTO_VALUES = [
  "show",
  "oficina",
  "roda-de-conversa",
  "lancamento",
  "sarau",
  "exposicao",
  "biblioterapia",
  "dj-session",
] as const;

export type CategoriaEvento = (typeof CATEGORIA_EVENTO_VALUES)[number];

export function isCategoriaEvento(value: unknown): value is CategoriaEvento {
  return (
    typeof value === "string" && (CATEGORIA_EVENTO_VALUES as readonly string[]).includes(value)
  );
}
