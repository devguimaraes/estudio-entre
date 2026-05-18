import { defineQuery } from "groq";

export const exposicoesEmCartazQuery = defineQuery(
  `*[_type == "exposicao" && ativo == true && status == "em-cartaz"]
    | order(dataInicio desc)[0...3]{
    _id, titulo, "slug": slug.current, artista, dataInicio, dataFim, status,
    "capaUrl": imagemCapa.asset->url
  }`,
);

export const exposicoesFuturasQuery = defineQuery(
  `*[_type == "exposicao" && ativo == true && status == "futura"]
    | order(dataInicio asc)[0...3]{
    _id, titulo, "slug": slug.current, artista, dataInicio, dataFim, status,
    "capaUrl": imagemCapa.asset->url
  }`,
);

export const exposicoesByStatusQuery = defineQuery(
  `*[_type == "exposicao" && ativo == true && status == $status]
    | order(dataInicio desc){
    _id, titulo, "slug": slug.current, artista, dataInicio, dataFim, status,
    "capaUrl": imagemCapa.asset->url
  }`,
);

export const exposicaoBySlugQuery = defineQuery(
  `*[_type == "exposicao" && slug.current == $slug && ativo == true][0]{
    _id, titulo, "slug": slug.current, subtitulo, textoCuratorial,
    artista, curadoria, dataInicio, dataFim, local, tecnica, apoio, status,
    linkAgendamento,
    "capaUrl": imagemCapa.asset->url,
    imagens[]{ _key, "url": asset->url, alt },
    albumRelacionado->{ _id, titulo, "slug": slug.current }
  }`,
);

export const todasExposicoesSlugsQuery = defineQuery(
  `*[_type == "exposicao" && defined(slug.current) && ativo == true]{
    "slug": slug.current
  }`,
);
