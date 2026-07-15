import type { CategoriaEvento } from "@/domain/categoriaEvento";

export const CATEGORIAS = {
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
} satisfies Record<CategoriaEvento, { label: string; color: string; textColor: string }>;
