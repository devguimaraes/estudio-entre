export interface LivroSebo {
  autor: string;
  titulo: string;
  editora: string;
  genero: string;
  valor: string;
}

/** Gêneros disponíveis no acervo (extraídos da planilha) */
export const GENEROS_SEBO = [
  "Romance",
  "Poesia",
  "Teatro",
  "Biografia",
  "Auto Ajuda",
  "Crítica",
  "Crônica",
  "Contos",
  "Feminismo",
  "Tecnologia",
  "Religioso",
  "Cristianismo",
  "Meditação",
  "Entrevista",
  "Literatura Juvenil",
  "Literatura Inglesa",
  "Infantil/Paradidático",
] as const;

export type GeneroSebo = (typeof GENEROS_SEBO)[number];

/** Mapeia cada gênero a uma cor (bolinha + badge) */
export const CORES_GENERO: Record<string, string> = {
  Romance: "#EC6838",
  Poesia: "#777BDE",
  "Teatro Brasileiro": "#9E4B2D",
  Teatro: "#9E4B2D",
  Biografia: "#DEC72C",
  "Auto Ajuda": "#8E8100",
  Crítica: "#C4A54B",
  Crônica: "#E08D3D",
  Contos: "#6B5FBF",
  Feminismo: "#D2BCFA",
  Tecnologia: "#1D432C",
  Religioso: "#5548A5",
  Cristianismo: "#5548A5",
  Meditação: "#BDB2DD",
  Entrevista: "#C86440",
  "Literatura Juvenil": "#F0DCB4",
  "Literatura Inglesa": "#3D1020",
  "Infantil/Paradidático": "#B9E4EB",
};
