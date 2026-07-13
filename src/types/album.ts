/** Payload bruto do GROQ — listagem. */
export interface AlbumSanityListagem {
  _id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string | null;
  capaUrl: string | null;
}

/** Payload bruto do GROQ — imagem do álbum (asset nested). */
export interface AlbumSanityImagem {
  _key: string;
  asset: {
    _id: string;
    url: string;
    metadata: { dimensions: { width: number; height: number } } | null;
  } | null;
  alt: string | null;
}

export interface AlbumSanityEventoRelacionado {
  _id: string;
  titulo: string;
  slug: string;
  dataHora: string;
}

/** Payload bruto do GROQ — detalhe. */
export interface AlbumSanityDetalhe {
  _id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string | null;
  imagens: AlbumSanityImagem[] | null;
  eventoRelacionado: AlbumSanityEventoRelacionado | null;
}

/** DTO de listagem — cards em /galeria. */
export interface AlbumCard {
  _id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string | null;
  periodoFormatado: string;
  capaUrl: string | null;
}

/** Foto normalizada — masonry e lightbox. */
export interface AlbumFoto {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** DTO de detalhe — página /galeria/[slug]. */
export interface AlbumDetalhe {
  _id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string | null;
  periodoFormatado: string;
  fotos: AlbumFoto[];
  totalFotos: number;
  capaOgUrl: string | null;
  eventoRelacionado: AlbumSanityEventoRelacionado | null;
}
