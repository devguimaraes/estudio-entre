import type { CategoriaEvento } from "@/types/evento";

export const CATEGORIAS: Record<
  CategoriaEvento,
  { label: string; color: string; textColor: string }
> = {
  show: { label: "Show", color: "#ec6838", textColor: "#f0ede8" },
  oficina: { label: "Oficina", color: "#e08d3d", textColor: "#1a1612" },
  "roda-de-conversa": {
    label: "Roda de Conversa",
    color: "#777bde",
    textColor: "#f0ede8",
  },
  lancamento: { label: "Lançamento", color: "#dec72c", textColor: "#1a1612" },
  sarau: { label: "Sarau", color: "#8e8100", textColor: "#f0ede8" },
  exposicao: { label: "Exposição", color: "#b9e4eb", textColor: "#1a1612" },
  biblioterapia: {
    label: "Biblioterapia",
    color: "#9e4b2d",
    textColor: "#f0ede8",
  },
  "dj-session": { label: "DJ Session", color: "#1d432c", textColor: "#f0ede8" },
};
