import { defineField, defineType } from "sanity";

export const albumGaleria = defineType({
  name: "albumGaleria",
  title: "Álbum da Galeria",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "titulo",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "dataInicio",
      title: "Data de início",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dataFim",
      title: "Data de término (opcional)",
      type: "date",
    }),
    defineField({
      name: "imagens",
      title: "Fotos",
      type: "array",
      of: [
        defineField({
          name: "imagem",
          title: "Imagem",
          type: "image",
          options: {
            hotspot: true,
          },
        }),
      ],
      options: { layout: "grid" },
      validation: (rule) => rule.min(1).error("Adicione pelo menos uma foto"),
    }),
    defineField({
      name: "eventoRelacionado",
      title: "Evento relacionado (opcional)",
      type: "reference",
      to: [{ type: "evento" }],
      weak: true,
    }),
    defineField({
      name: "ativo",
      title: "Ativo",
      type: "boolean",
      initialValue: true,
      description: "Desmarque para ocultar o álbum da galeria",
    }),
  ],
  preview: {
    select: {
      title: "titulo",
      subtitle: "dataInicio",
      media: "imagens.0",
    },
  },
  orderings: [
    {
      title: "Data",
      name: "data",
      by: [{ field: "dataInicio", direction: "desc" }],
    },
  ],
});
