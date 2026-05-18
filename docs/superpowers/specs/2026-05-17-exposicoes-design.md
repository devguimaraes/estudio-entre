# Design: Exposições — Schema, Home e Páginas

**Data:** 2026-05-17
**Status:** Aprovado
**Tipo:** feature

---

## 1. Motivação

Criar um sistema de exposições no site, com:
1. Schema no Sanity (`exposicao`) com texto curatorial, ficha técnica e imagens
2. Seção na home (abaixo da Hero) com grid de cards das exposições em destaque
3. Página de listagem (`/exposicoes/`) com filtro por status
4. Página dedicada por exposição (`/exposicoes/[slug]/`) com perfil editorial + galeria

---

## 2. Relação com a Galeria

- Uma `exposicao` pode ter referência opcional (`weak: true`) a um `albumGaleria`
- O ciclo natural: **exposição nasce primeiro** (conceito, texto curatorial) → depois gera álbum de fotos na galeria
- Na página da exposição, se houver álbum vinculado, exibe um link "Ver fotos do evento →"

---

## 3. Schema `exposicao` (Sanity)

```typescript
{
  name: "exposicao",
  title: "Exposição",
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
      name: "subtitulo",
      title: "Subtítulo (opcional)",
      type: "string",
    },
    {
      name: "textoCuratorial",
      title: "Texto Curatorial",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "artista",
      title: "Artista(s)",
      type: "string",
    },
    {
      name: "curadoria",
      title: "Curadoria",
      type: "string",
    },
    {
      name: "dataInicio",
      title: "Data de início",
      type: "date",
      validation: Rule => Rule.required(),
    },
    {
      name: "dataFim",
      title: "Data de término (opcional)",
      type: "date",
    },
    {
      name: "local",
      title: "Local / Sala",
      type: "string",
    },
    {
      name: "tecnica",
      title: "Técnica / Mídia",
      type: "string",
    },
    {
      name: "apoio",
      title: "Apoio / Parceria",
      type: "text",
      rows: 2,
    },
    {
      name: "imagemCapa",
      title: "Imagem de capa",
      type: "image",
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    },
    {
      name: "imagens",
      title: "Galeria de imagens",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
    },
    {
      name: "albumRelacionado",
      title: "Álbum da galeria (opcional)",
      type: "reference",
      to: [{ type: "albumGaleria" }],
      weak: true,
    },
    {
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
      validation: Rule => Rule.required(),
    },
    {
      name: "ativo",
      title: "Ativo",
      type: "boolean",
      initialValue: true,
      description: "Desmarque para ocultar do site",
    },
  ],
  preview: {
    select: { title: "titulo", subtitle: "artista", media: "imagemCapa" },
  },
  orderings: [
    { title: "Data de início", name: "data", by: [{ field: "dataInicio", direction: "desc" }] },
  ],
}
```

---

## 4. Seção na Home

**Posição:** Abaixo da Hero, acima do restante do conteúdo.

**Dados:** Query Sanity — exposições com `status == "em-cartaz"` e `ativo == true`. Fallback: se não houver "em-cartaz", busca `status == "futura"`. Se vazia também, a seção não renderiza.

**Layout:**

```
┌──────────────────────────────────────────┐
│  EM CARTAZ         (eyebrow)            │
│  Exposições        (título)             │
│                                          │
│  ┌─────────┐ ┌─────────┐ ┌───────────┐  │
│  │  capa   │ │  capa   │ │   capa    │  │
│  │         │ │         │ │            │  │
│  ├─────────┤ ├─────────┤ ├───────────┤  │
│  │ Título  │ │ Título  │ │  Título   │  │
│  │ Artista │ │ Artista │ │  Artista  │  │
│  │ Período │ │ Período │ │  Período  │  │
│  └─────────┘ └─────────┘ └───────────┘  │
│                                          │
│  [Ver todas as exposições →]            │
└──────────────────────────────────────────┘
```

**Comportamento:**
- Máximo **3 cards** na home (se houver mais, o link "Ver todas" aparece)
- Seção **some completamente** se não houver exposição em cartaz nem futura
- Cards com clip-path de papel rasgado (padrão visual da galeria)
- Link para `/exposicoes/`

---

## 5. Página de Listagem (`/exposicoes/`)

**Layout:**

```
┌──────────────────────────────────────────┐
│  EXPOSIÇÕES       (eyebrow)             │
│  Em cartaz e acervo                     │
│                                          │
│  [Em cartaz] [Futuras] [Passadas] ←filtro│
│                                          │
│  ┌─────────┐ ┌─────────┐ ┌───────────┐  │
│  │  card   │ │  card   │ │   card    │  │
│  └─────────┘ └─────────┘ └───────────┘  │
│  ┌─────────┐ ┌─────────┐                │
│  │  card   │ │  card   │                │
│  └─────────┘ └─────────┘                │
└──────────────────────────────────────────┘
```

**Comportamento:**
- Filtro por status: "Em cartaz", "Futuras", "Passadas"
- Grid de cards: 2 colunas (mobile) / 3 (desktop)
- Cards idênticos aos da home (capa + título + artista + período)
- Server-side rendering (Astro), sem JavaScript no grid

---

## 6. Página de Detalhe (`/exposicoes/[slug]/`)

**Layout híbrido:**

```
┌──────────────────────────────────────┐
│  ← Voltar para Exposições            │
├──────────────────────────────────────┤
│                                      │
│  [Imagem de capa — full width]       │
│                                      │
├──────────────────────────────────────┤
│  Título da exposição                 │
│  Subtítulo                           │
│                                      │
│  ┌─ Ficha Técnica ──────────────┐   │
│  │ Artista: Fulano de Tal       │   │
│  │ Curadoria: Ciclana           │   │
│  │ Período: 10 mai — 30 jun     │   │
│  │ Local: Sala Principal        │   │
│  │ Técnica: Pintura a óleo     │   │
│  │ Apoio: Lei Paulo Gustavo    │   │
│  └──────────────────────────────┘   │
│                                      │
│  Texto curatorial (Portable Text)    │
│  Lorem ipsum dolor sit amet...       │
│                                      │
│  ┌─ Álbum relacionado ──────────┐   │
│  │ 📸 Ver fotos do evento →     │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │    │ │    │ │    │ │    │       │
│  └────┘ └────┘ └────┘ └────┘       │
│  Galeria de imagens (masonry)       │
└──────────────────────────────────────┘
```

**Comportamento:**
- Imagem de capa: full-width, hero visual
- Ficha técnica: box lateral ou abaixo da capa, apenas campos preenchidos
- Texto curatorial: renderizado com Portable Text (blocos do Sanity)
- Galeria de imagens: masonry com clip-path rasgado + lightbox (reaproveitar `GaleriaDetalhe.tsx`)
- Link para álbum: só aparece se `albumRelacionado` existir
- SEO: title, description, og:image com a capa

---

## 7. Filtro na listagem

| Status | Query GROQ | Onde aparece |
|--------|------------|--------------|
| em-cartaz | `status == "em-cartaz"` | Home + listagem |
| futura | `status == "futura"` | Listagem |
| passada | `status == "passada"` | Listagem |

> O campo `status` é definido manualmente pelo editor no Sanity. As datas (`dataInicio`/`dataFim`) servem para exibição na ficha técnica, não para lógica automática de filtro.

---

## 8. Dependências e Arquivos

| Arquivo | Ação |
|---------|------|
| `src/sanity/schemas/exposicao.ts` | **Novo** — schema |
| `src/sanity/schemas/index.ts` | Editar — adicionar `exposicao` |
| `src/sanity/schema/index.ts` | Editar — adicionar `exposicao` |
| `src/sanity/queries/exposicao.ts` | **Novo** — queries GROQ |
| `src/sanity/queries/index.ts` | Editar — re-exportar |
| `src/types/exposicao.ts` | **Novo** — tipos TypeScript |
| `src/pages/exposicoes.astro` | **Novo** — listagem |
| `src/pages/exposicoes/[slug].astro` | **Novo** — detalhe |
| `src/components/sections/ExposicoesHome.astro` | **Novo** — seção na home |
| `src/components/sections/ExposicoesListagem.astro` | **Novo** — grid para listagem |
| `src/components/islands/GaleriaDetalhe.tsx` | Reutilizar — masonry da exposição |
| `src/components/islands/Lightbox.tsx` | Reutilizar — lightbox |
| `src/pages/index.astro` | Editar — adicionar `<ExposicoesHome />` |
| `src/components/ui/Navbar.astro` | Editar — link "Exposições" no menu? |
| `src/components/islands/MobileNav.tsx` | Editar — link "Exposições" no menu |

---

## 9. O que NÃO está no escopo

- Migração de textos curatoriais existentes (começa do zero)
- Sistema de agendamento de visita para exposições
- Venda de ingressos
- Tour virtual 3D
- Alterações no menu (a menos que o usuário queira adicionar "Exposições")

---

## 10. UX Copy

- **Home eyebrow:** "EM CARTAZ"
- **Home título:** "Exposições"
- **Home CTA:** "Ver todas as exposições →"
- **Listagem eyebrow:** "EXPOSIÇÕES"
- **Listagem título:** "Em cartaz e acervo"
- **Filtro labels:** "Em cartaz", "Futuras", "Passadas"
- **Ficha técnica:** "Artista", "Curadoria", "Período", "Local", "Técnica", "Apoio"
- **Voltar:** "← Voltar para Exposições"
- **Álbum link:** "Ver fotos do evento →"
- **Empty listagem:** "Nenhuma exposição no momento."
- **Empty home:** seção não renderiza
