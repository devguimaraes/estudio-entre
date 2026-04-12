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
          { title: "Lancamento", value: "lancamento" },
          { title: "Sarau", value: "sarau" },
          { title: "Exposicao", value: "exposicao" },
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
      name: "imagemCapa",
      title: "Imagem de Capa",
      type: "image",
      options: {
        hotspot: true,
      },
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
      media: "imagemCapa",
    },
  },
});
