import { defineQuery } from "groq";

export const eventosQuery = defineQuery(
  `*[_type == "evento" && ativo == true]
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
    imagens
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
    imagens
  }`,
);

export const eventosFuturosQuery = defineQuery(
  `*[_type == "evento" && ativo == true && dataHora >= now()]
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
    imagens
  }`,
);

export const todosEventosSlugsQuery = defineQuery(
  `*[_type == "evento" && defined(slug.current)]{
    "slug": slug.current
  }`,
);
