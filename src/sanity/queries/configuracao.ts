import { defineQuery } from "groq";

export const configuracaoQuery = defineQuery(
  `*[_type == "configuracao"][0]{
    titulo,
    descricao,
    "ogImage": ogImage.asset->url,
    redesSociais{
      instagram,
      spotify,
      youtube
    }
  }`,
);
