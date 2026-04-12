import { defineField, defineType } from "sanity";

export const configuracao = defineType({
  name: "configuracao",
  title: "Configuracoes do Site",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Titulo do Site",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descricao",
      title: "Descricao",
      type: "text",
      rows: 3,
      description: "Descricao padrao para SEO e compartilhamentos",
    }),
    defineField({
      name: "ogImage",
      title: "Imagem OG Padrao",
      type: "image",
      description: "Imagem exibida ao compartilhar o site em redes sociais",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "redesSociais",
      title: "Redes Sociais",
      type: "object",
      fields: [
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
          validation: (rule) =>
            rule.uri({
              scheme: ["https"],
            }),
        }),
        defineField({
          name: "spotify",
          title: "Spotify",
          type: "url",
          validation: (rule) =>
            rule.uri({
              scheme: ["https"],
            }),
        }),
        defineField({
          name: "youtube",
          title: "YouTube",
          type: "url",
          validation: (rule) =>
            rule.uri({
              scheme: ["https"],
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "titulo",
    },
  },
});
