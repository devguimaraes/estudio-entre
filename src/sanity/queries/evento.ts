import { defineQuery } from "groq";

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
