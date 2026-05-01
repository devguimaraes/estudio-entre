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
  slug: { current: string };
  categoria: CategoriaEvento;
  dataHora: string;
  local: string | null;
  descricao: string | null;
  valor: string | null;
  linkCompra: string | null;
  imagens: unknown[] | null;
}
