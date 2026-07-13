import type { PortableTextBlock } from "@portabletext/types";

export const EXPOSICAO_STATUS_VALUES = ["em-cartaz", "futura", "passada"] as const;

export type ExposicaoStatus = (typeof EXPOSICAO_STATUS_VALUES)[number];

export function isExposicaoStatus(value: unknown): value is ExposicaoStatus {
  return (
    typeof value === "string" && (EXPOSICAO_STATUS_VALUES as readonly string[]).includes(value)
  );
}

/** Payload bruto do GROQ — listagem. */
export interface ExposicaoSanityListagem {
  _id: string;
  titulo: string;
  slug: string;
  artista: string | null;
  dataInicio: string;
  dataFim: string | null;
  status: string;
  capaUrl: string | null;
  capaWidth: number | null;
  capaHeight: number | null;
}

export interface ExposicaoSanityImagem {
  _key: string;
  url: string;
  alt: string | null;
  width?: number | null;
  height?: number | null;
}

/** Payload bruto do GROQ — detalhe. */
export interface ExposicaoSanityDetalhe {
  _id: string;
  titulo: string;
  slug: string;
  subtitulo: string | null;
  textoCuratorial: PortableTextBlock[] | null;
  artista: string | null;
  curadoria: string | null;
  dataInicio: string;
  dataFim: string | null;
  local: string | null;
  tecnica: string | null;
  apoio: string | null;
  status: string;
  linkAgendamento: string | null;
  capaUrl: string | null;
  imagens: ExposicaoSanityImagem[] | null;
  albumRelacionado: { _id: string; titulo: string; slug: string } | null;
}

/** DTO de listagem — cards em /exposicoes e seções home. */
export interface ExposicaoListagem {
  _id: string;
  titulo: string;
  slug: string;
  artista: string | null;
  dataInicio: string;
  dataFim: string | null;
  status: ExposicaoStatus;
  periodoFormatado: string;
  capaUrl: string | null;
  capaWidth: number | null;
  capaHeight: number | null;
}

export interface ExposicaoFoto {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface FichaTecnicaItem {
  label: string;
  value: string;
}

/** DTO de detalhe — página /exposicoes/[slug]. */
export interface ExposicaoDetalhe {
  _id: string;
  titulo: string;
  slug: string;
  subtitulo: string | null;
  textoCuratorial: PortableTextBlock[] | null;
  artista: string | null;
  curadoria: string | null;
  dataInicio: string;
  dataFim: string | null;
  local: string | null;
  tecnica: string | null;
  apoio: string | null;
  status: ExposicaoStatus;
  linkAgendamento: string | null;
  periodoFormatado: string;
  capaUrl: string | null;
  fotos: ExposicaoFoto[];
  fichaTecnica: FichaTecnicaItem[];
  albumRelacionado: { _id: string; titulo: string; slug: string } | null;
}

/** @deprecated Use ExposicaoListagem */
export type ExposicaoCard = ExposicaoListagem;
