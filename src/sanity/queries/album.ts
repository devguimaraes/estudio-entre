import { defineQuery } from "groq";

export const albunsQuery = defineQuery(
  `*[_type == "albumGaleria" && ativo == true]
    | order(dataInicio desc){
    _id,
    titulo,
    "slug": slug.current,
    descricao,
    dataInicio,
    dataFim,
    "capaUrl": imagens[0].asset->url
  }`,
);

export const albumBySlugQuery = defineQuery(
  `*[_type == "albumGaleria" && slug.current == $slug && ativo == true][0]{
    _id,
    titulo,
    "slug": slug.current,
    descricao,
    dataInicio,
    dataFim,
    imagens[]{
      _key,
      asset->{
        _id,
        url,
        metadata { dimensions { width, height } }
      },
      alt
    },
    eventoRelacionado->{
      _id,
      titulo,
      "slug": slug.current,
      dataHora
    }
  }`,
);

export const todosAlbunsSlugsQuery = defineQuery(
  `*[_type == "albumGaleria" && defined(slug.current) && ativo == true]{
    "slug": slug.current
  }`,
);
