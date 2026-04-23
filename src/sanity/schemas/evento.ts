import { defineField, defineType } from "sanity";

export const evento = defineType({
  name: "evento",
  title: "Evento",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Titulo",
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
      name: "categoria",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Show", value: "show" },
          { title: "Oficina", value: "oficina" },
          { title: "Roda de Conversa", value: "roda-de-conversa" },
          { title: "Lançamento", value: "lancamento" },
          { title: "Sarau", value: "sarau" },
          { title: "Exposição", value: "exposicao" },
          { title: "Biblioterapia", value: "biblioterapia" },
          { title: "DJ Session", value: "dj-session" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dataHora",
      title: "Data e Hora",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "local",
      title: "Local",
      type: "string",
    }),
    defineField({
      name: "descricao",
      title: "Descricao",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "imagens",
      title: "Imagens",
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
      validation: (rule) => rule.min(1).max(3),
      description: "Até 3 imagens (formato Instagram ~960x768). A primeira será a capa.",
    }),
    defineField({
      name: "valor",
      title: "Valor",
      type: "string",
      description: "Ex: 'Gratuito', 'R$ 30,00'",
    }),
    defineField({
      name: "linkCompra",
      title: "Link para Compra",
      type: "url",
      validation: (rule) =>
        rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "ativo",
      title: "Ativo",
      type: "boolean",
      initialValue: true,
      description: "Desmarque para ocultar o evento do site",
    }),
  ],
  preview: {
    select: {
      title: "titulo",
      subtitle: "categoria",
      media: "imagens.0",
    },
  },
});
