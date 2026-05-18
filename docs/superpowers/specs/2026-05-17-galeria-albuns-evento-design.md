# Design: Galeria com Álbuns por Evento

**Data:** 2026-05-17
**Status:** Aprovado
**Tipo:** feature

---

## 1. Motivação

A página de galeria atual (`/galeria`) carrega 24 imagens estáticas de uma vez, sem organização temática. O objetivo é:

1. Organizar fotos por **álbuns** vinculados a eventos/exposições
2. Criar um schema no Sanity (`albumGaleria`) para gerenciar álbuns via CMS
3. Estreia com o álbum da **Inauguração do Estúdio Entre** (25 e 26 de abril)

---

## 2. Decisões de Design

### Abordagem escolhida: Schema novo + referência opcional a evento

- **Schema `albumGaleria`** dedicado à galeria (não se mistura com eventos da agenda)
- **Referência opcional** (`eventoRelacionado`) para vincular um álbum a um evento da agenda
- **Substituição completa** da galeria atual — sem manter fotos antigas

### Navegação

- Página de listagem (`/galeria`) → cards de álbuns
- Página de detalhe (`/galeria/[slug]/`) → grid masonry + lightbox
- Cards de álbuns com capa, título, data e descrição truncada

---

## 3. Schema `albumGaleria` (Sanity)

```typescript
{
  name: "albumGaleria",
  title: "Álbum da Galeria",
  type: "document",
  fields: [
    {
      name: "titulo",
      title: "Título",
      type: "string",
      validation: Rule => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titulo", maxLength: 96 },
    },
    {
      name: "descricao",
      title: "Descrição",
      type: "text",
      rows: 3,
    },
    {
      name: "dataInicio",
      title: "Data de início",
      type: "date",
    },
    {
      name: "dataFim",
      title: "Data de término (opcional)",
      type: "date",
    },
    {
      name: "imagens",
      title: "Fotos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
      validation: Rule => Rule.min(1).error("Adicione pelo menos uma foto"),
    },
    {
      name: "eventoRelacionado",
      title: "Evento relacionado (opcional)",
      type: "reference",
      to: [{ type: "evento" }],
      weak: true,
    },
    {
      name: "ativo",
      title: "Ativo",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: { title: "titulo", subtitle: "dataInicio", media: "imagens.0" },
  },
  orderings: [
    { title: "Data", name: "data", by: [{ field: "dataInicio", direction: "desc" }] },
  ],
}
```

**Decisões de schema:**
- `imagens`: array sem limite, layout grid no Studio para upload facilitado
- `eventoRelacionado`: `weak: true` — se o evento for deletado, não quebra o álbum
- `dataFim`: opcional (eventos de um dia só não preenchem)
- `ativo`: igual ao schema `evento`, controla visibilidade
- Sem `categoria` — álbuns são só álbuns, sem subclassificação

---

## 4. Página de Listagem (`/galeria`)

### Dados
- Query Sanity: todos `albumGaleria` com `ativo == true`, ordenados por `dataInicio desc`

### Layout
- Grid de cards: 2 colunas (mobile) / 3 colunas (desktop)
- Cada card: capa (clip-path papel rasgado), título, data formatada, descrição truncada (2 linhas)
- Sem JavaScript — renderização server-side pelo Astro

### Formato de data
- Data única (`dataInicio` sem `dataFim`): "25 de abril"
- Intervalo (`dataInicio` + `dataFim`): "25 e 26 de abril"
- Intervalo com mês diferente: "30 de abril a 2 de maio"

### Estrutura do card
```
┌──────────────────┐
│   [foto capa]    │
│   clip-path      │
│   papel rasgado  │
├──────────────────┤
│ Título           │
│ 25 e 26 de abril │
│ Descrição curt.. │
└──────────────────┘
```

### Edge cases
- **Empty state**: "Nenhum álbum ainda. Em breve novas memórias!" quando não há álbuns ativos
- **Loading**: não se aplica (SSR)

---

## 5. Página de Detalhe (`/galeria/[slug]/`)

### Dados
- Query Sanity por slug: `titulo, descricao, dataInicio, dataFim, imagens[], eventoRelacionado->`

### Layout
```
┌────────────────────────────┐
│  ← Voltar para Galeria      │  (link para /galeria)
├────────────────────────────┤
│  Título do álbum            │
│  Data · N fotos             │
├────────────────────────────┤
│  Descrição                  │
│  ┌─ eventoRelacionado ──┐  │
│  │ 🔗 Ver detalhes →    │  │
│  └───────────────────────┘  │
├────────────────────────────┤
│  Grid masonry com fotos     │
│  (clip-path papel rasgado)  │
└────────────────────────────┘
```

### Comportamentos
- Grid masonry: CSS `columns` + clip-path igual ao `GaleriaMasonry` atual
- Lightbox: reutilizar `Lightbox.tsx` existente (island React com `<dialog>`)
- Lazy loading: 4 primeiras `eager`, resto `lazy`
- Link para evento relacionado (se existir): roteia para `/agenda/`

### SEO
- `<title>`: `{titulo} | Galeria`
- `og:image`: primeira imagem do álbum
- `meta description`: descrição do álbum

### Edge cases
- Álbum sem `dataFim`: mostrar só `dataInicio` (ex: "25 de abril")
- Álbum com 1 foto: grid de 1 coluna
- `eventoRelacionado` nulo: não renderizar o box de link

---

## 6. Dependências e Impacto

### Arquivos afetados
| Arquivo | Ação |
|---------|------|
| `src/sanity/schemas/albumGaleria.ts` | **Novo** — schema Sanity |
| `src/sanity/schemas/index.ts` | Editar — adicionar `albumGaleria` |
| `src/sanity/schema/index.ts` | Editar — adicionar `albumGaleria` (Studio local) |
| `src/sanity/queries/galeria.ts` | **Novo** — queries GROQ |
| `src/sanity/queries/index.ts` | Editar — re-exportar |
| `src/types/galeria.ts` | **Novo** — tipos TypeScript |
| `src/pages/galeria.astro` | Reescrever — página de listagem |
| `src/pages/galeria/[slug].astro` | **Novo** — página de detalhe |
| `src/components/sections/GaleriaListagem.astro` | **Novo** — grid de cards |
| `src/components/sections/GaleriaDetalhe.astro` | **Novo** — grid masonry |
| `src/data/galeriaImagens.ts` | Remover — dados estáticos obsoletos |
| `src/components/islands/GaleriaMasonry.tsx` | Remover — substituído |
| `src/components/sections/Galeria.astro` | Manter — seção marquee na homepage (não afetada) |
| `src/components/islands/Lightbox.tsx` | Manter — reutilizado na página de detalhe |

### Imagens
| Pasta | Ação |
|-------|------|
| `public/images/espaco/` | Remover (24 .webp antigos) |
| `public/images/geral/fotos-do-estudio/` | Manter localmente, fazer upload no Sanity |

---

## 7. O que NÃO está no escopo

- Filtros por categoria de álbum
- Paginação (número de álbuns ainda é pequeno)
- Upload de imagens em lote via interface customizada (usar Studio do Sanity)
- Migração automática das imagens existentes para o Sanity (feito manualmente via Studio)
- Alterações na seção `Galeria.astro` da homepage (marquee)

---

## 8. UX Copy (preliminar)

- **Listagem vazia:** "Nenhum álbum ainda. Em breve novas memórias!"
- **Voltar:** "← Voltar para Galeria"
- **Link evento:** "Ver detalhes do evento →"
- **Eyebrow listagem:** "GALERIA"
- **Título listagem:** "Momentos do Estúdio"

---

## 9. Sequelas (futuro)

- Evento de inauguração com docs de processo criativo/poético
- Criar docs para cada exposição
- Plano editorial com mais exposições e eventos
- Evento "Sala de Ensaio" com estréia de filmes/vídeos
