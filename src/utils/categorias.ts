import type { CategoriaEvento } from "@/types/evento";

export const CATEGORIAS: Record<
  CategoriaEvento,
  { label: string; color: string; textColor: string }
> = {
  biblioterapia: {
    label: "Biblioterapia",
    color: "#9E4B2D", // terracota
    textColor: "#F0EDE8",
  },
  oficina: {
    label: "Oficina",
    color: "#BDB2DD", // lilás médio
    textColor: "#1A1612",
  },
  palestras: {
    label: "Palestras",
    color: "#B9E4EB", // ciano
    textColor: "#1A1612",
  },
  estudio: {
    label: "Estúdio",
    color: "#DEC72C", // mostarda
    textColor: "#1A1612",
  },
  encontros: {
    label: "Encontros",
    color: "#EC6838", // laranja
    textColor: "#F0EDE8",
  },
  // Mantendo os outros mapeados para as cores do guia conforme proximidade
  show: { label: "Show", color: "#EC6838", textColor: "#F0EDE8" },
  "roda-de-conversa": {
    label: "Roda de Conversa",
    color: "#777BDE", // lilás/periwinkle
    textColor: "#F0EDE8",
  },
  lancamento: { label: "Lançamento", color: "#E08D3D", textColor: "#1A1612" },
  sarau: { label: "Sarau", color: "#8E8100", textColor: "#F0EDE8" },
  exposicao: { label: "Exposição", color: "#B9E4EB", textColor: "#1A1612" },
  "dj-session": { label: "DJ Session", color: "#1D432C", textColor: "#F0EDE8" },
};
