import type { CategoriaEvento } from "@/domain/categoriaEvento";

export type { CategoriaEvento } from "@/domain/categoriaEvento";

/** Referência de imagem Sanity — uso interno do intake. */
export interface SanityImageRef {
  _type: string;
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}

/** Payload bruto do GROQ — entrada do adapter de intake. */
export interface EventoSanityDocument {
  _id: string;
  titulo: string;
  slug: string;
  categoria: string;
  dataHora: string;
  local: string | null;
  descricao: string | null;
  valor: string | null;
  linkCompra: string | null;
  imagens: SanityImageRef[] | null;
}

/**
 * DTO público de Evento — único contrato para home, /agenda e islands.
 * Imagens e datas já resolvidas no build; sem tipos Sanity na superfície.
 */
export interface EventoNormalizado {
  _id: string;
  titulo: string;
  slug: string;
  categoria: CategoriaEvento;
  dataHora: string;
  dataFormatada: string;
  horaFormatada: string;
  diaKey: string;
  local: string | null;
  descricao: string | null;
  valor: string | null;
  linkCompra: string | null;
  imagemUrl: string | null;
  timestamp: number;
  mesKey: string;
  buscaTexto: string;
}
