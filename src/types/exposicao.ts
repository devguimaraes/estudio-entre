export type ExposicaoStatus = "em-cartaz" | "futura" | "passada";

export interface ExposicaoCard {
  _id: string;
  titulo: string;
  slug: string;
  artista: string | null;
  dataInicio: string;
  dataFim: string | null;
  status: ExposicaoStatus;
  capaUrl: string | null;
}
