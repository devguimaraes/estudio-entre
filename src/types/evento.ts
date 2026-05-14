export type CategoriaEvento =
  | "show"
  | "oficina"
  | "roda-de-conversa"
  | "lancamento"
  | "sarau"
  | "exposicao"
  | "biblioterapia"
  | "dj-session";

export interface EventoCard {
  _id: string;
  titulo: string;
  slug: string;
  categoria: CategoriaEvento;
  dataHora: string;
  local: string | null;
  descricao: string | null;
  valor: string | null;
  linkCompra: string | null;
  imagens: SanityImageRef[] | null;
}

export interface EventoNormalizado extends EventoCard {
  timestamp: number;
  mesKey: string;
  buscaTexto: string;
}

export interface SanityImageRef {
  _type: string;
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}
