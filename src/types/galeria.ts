export interface AlbumGaleriaCard {
  _id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string | null;
  capaUrl: string | null;
}
