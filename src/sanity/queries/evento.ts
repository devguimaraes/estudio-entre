import { defineQuery } from "groq";

export const eventosQuery = defineQuery(
  `*[_type == "evento" && ativo == true && dataHora > now()]
    | order(dataHora asc){
    _id,
    titulo,
    "slug": slug.current,
    categoria,
    dataHora,
    local,
    descricao,
    valor,
    linkCompra,
    "imagens": imagens[].asset->url
  }`,
);

export const eventoBySlugQuery = defineQuery(
  `*[_type == "evento" && slug.current == $slug][0]{
    _id,
    titulo,
    "slug": slug.current,
    categoria,
    dataHora,
    local,
    descricao,
    valor,
    linkCompra,
    ativo,
    "imagens": imagens[].asset->url
  }`,
);

export const todosEventosSlugsQuery = defineQuery(
  `*[_type == "evento" && defined(slug.current)]{
    "slug": slug.current
  }`,
);
