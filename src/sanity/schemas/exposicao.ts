import { defineField, defineType } from "sanity";

export const exposicao = defineType({
  name: "exposicao",
  title: "Exposição",
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
      options: { source: "titulo", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitulo",
      title: "Subtítulo (opcional)",
      type: "string",
    }),
    defineField({
      name: "textoCuratorial",
      title: "Texto Curatorial",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "artista",
      title: "Artista(s)",
      type: "string",
    }),
    defineField({
      name: "curadoria",
      title: "Curadoria",
      type: "string",
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
      name: "local",
      title: "Local / Sala",
      type: "string",
    }),
    defineField({
      name: "tecnica",
      title: "Técnica / Mídia",
      type: "string",
    }),
    defineField({
      name: "apoio",
      title: "Apoio / Parceria",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "imagemCapa",
      title: "Imagem de capa",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imagens",
      title: "Galeria de imagens",
      type: "array",
      of: [
        defineField({
          name: "imagem",
          title: "Imagem",
          type: "image",
          options: { hotspot: true },
        }),
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "albumRelacionado",
      title: "Álbum da galeria (opcional)",
      type: "reference",
      to: [{ type: "albumGaleria" }],
      weak: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Em cartaz", value: "em-cartaz" },
          { title: "Futura", value: "futura" },
          { title: "Passada", value: "passada" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ativo",
      title: "Ativo",
      type: "boolean",
      initialValue: true,
      description: "Desmarque para ocultar do site",
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "artista", media: "imagemCapa" },
  },
  orderings: [
    {
      title: "Data de início",
      name: "data",
      by: [{ field: "dataInicio", direction: "desc" }],
    },
  ],
});
