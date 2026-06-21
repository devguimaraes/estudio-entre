# Sebo & Lojinha — Design Spec

**Data:** 2026-06-21
**Status:** Aprovado (design visual)
**Escopo:** Duas novas páginas + seções na home + links na navbar/footer

---

## 1. Visão Geral

Duas novas páginas de catálogo para o site do Estúdio Entre:

| Página | Rota | Fonte de dados | Atualização |
|--------|------|---------------|-------------|
| **Sebo** | `/sebo` | JSON estático (snapshot Google Sheets) | Manual (V1); futura integração CSV |
| **Lojinha** | `/lojinha` | API pública InfinitePay (`/llms/thaynawho.txt`) | A cada build (SSG) |

Ambas seguem o padrão visual da **página Agenda** (`/agenda`), com header editorial, filtros interativos via React Island e cards arredondados.

---

## 2. Estrutura de Navegação

### 2.1 Navbar (desktop + mobile)
Adicionar 2 novos links entre "Galeria" e "Visitação":

```
Início → O Lugar → O Estúdio → Exposições → Programação → Galeria → Sebo → Loja → Visitação
```

- **Arquivos afetados:**
  - `src/components/ui/Navbar.astro` — adicionar `<li>` com links para `/sebo` e `/lojinha`
  - `src/components/islands/MobileNav.tsx` — adicionar entradas no array `links`

### 2.2 Footer
Adicionar links para Sebo e Loja no Footer (arquivo: `src/components/sections/Footer.astro`).

### 2.3 Homepage
Criar duas seções de teaser na homepage, cada uma com:
- Título editorial (ex: "Garimpe no Sebo" / "Leve o Estúdio pra casa")
- 3-4 cards de destaque
- CTA "Ver todos" linkando para a página completa

---

## 3. Página: Sebo (`/sebo`)

### 3.1 Fonte de dados
- **Arquivo:** `src/data/sebo.json` — JSON estático com snapshot da planilha Google Sheets
- **Estrutura do JSON:**
  ```json
  [
    {
      "autor": "Markus Zusak",
      "titulo": "A menina que roubava livros",
      "editora": "Intrínseca",
      "genero": "Romance",
      "valor": "R$ 20,00"
    }
  ]
  ```
- **Genêros extraídos da planilha:** Romance, Poesia, Teatro, Biografia, Auto Ajuda, Crítica, Crônica, Contos, Feminismo, Tecnologia, Religioso, Cristianismo, Meditação, Entrevista, Literatura Juvenil, Literatura Inglesa, Infantil/Paradidático

### 3.2 Layout
- **Header:** fundo ciano (`#B9E4EB`), dot grid, watermark "e", estrela decorativa
- **Corpo:** fundo creme (`#F0EDE8`), textura halftone
- **Painel de filtros:** card branco arredondado (`rounded-[2.5rem]`), campo de busca + pills de gênero
- **Grid:** 2 colunas desktop, 1 coluna mobile

### 3.3 Card do livro (sem imagem)
```yaml
Formato: rounded-2xl, bg white, sombra sutil
Elementos:
  - Bolinha colorida (cor do gênero) + label gênero
  - Título: Buvera Black, uppercase, ~1.2rem
  - Autor · Editora: linha única, texto small
  - Separador sutil
  - Preço: Buvera Black, cor laranja (#EC6838)
  - Botão WhatsApp: círculo verde (#25D366), ícone SVG oficial
```

### 3.4 Botão WhatsApp
- **Ícone:** SVG oficial do WhatsApp (copiado de `/icons/whatsapp.svg` ou inline)
- **Link:** `https://wa.me/5521973101451?text=Olá! Tenho interesse no livro: {titulo}`
- **Comportamento:** abre em nova aba (`target="_blank"`)

### 3.5 Filtro interativo
- **Componente:** React Island `SeboFilter.tsx` (padrão: `AgendaPageFilter.tsx`)
- **Funcionalidades:**
  - Busca textual por título, autor ou editora
  - Pills de gênero com contagem
  - Animação GSAP nos cards ao trocar filtro
  - Estado vazio com mensagem e botão "Limpar filtros"
- **Renderização:** `client:load`

### 3.6 Página Astro (`/sebo`)
```astro
---
// src/pages/sebo.astro
import seboData from "@/data/sebo.json";
import SeboFilter from "@/components/islands/SeboFilter";
import BaseLayout from "@/layouts/BaseLayout.astro";
// + texturas, decorativos, Footer
---
<BaseLayout title="Sebo — Estúdio Entre" navTheme="dark">
  <main class="...bg-ciano...">
    <!-- Header editorial -->
    <!-- Painel de filtros -->
    <!-- <SeboFilter client:load livros={seboData} /> -->
  </main>
  <Footer />
</BaseLayout>
```

---

## 4. Página: Lojinha (`/lojinha`)

### 4.1 Fonte de dados
- **Endpoint principal:** `https://loja.infinitepay.io/llms/thaynawho.txt`
- **Produto individual:** `https://loja.infinitepay.io/llms/thaynawho/{slug}.txt`
- **Fetch no build** via `fetch()` no frontmatter do Astro
- **Parse:** extrair título, descrição, preço, imagem, categoria, variation_id, slug do produto
- **Estrutura de dados (TypeScript):**
  ```ts
  interface ProdutoLoja {
    slug: string;
    titulo: string;
    descricao: string;
    preco: string;        // "R$ 60,00"
    imagemUrl: string | null;
    categoria: string;    // "Livros" | "Leitura e Criação"
    productUrl: string;   // link InfinitePay
    checkoutUrl: string;  // link checkout (com variation_id)
    variationId: number | null;
  }
  ```

### 4.2 Layout
- **Header:** fundo creme (`#F0EDE8`), texto forest (`#1D432C`), dot grid, watermark "e", estrela laranja
- **Corpo:** fundo creme, textura halftone
- **Painel de filtros:** card branco arredondado, campo de busca + pills de categoria
- **Grid:** 3 colunas desktop, 2 tablet, 1 coluna mobile

### 4.3 Card do produto (com imagem)
```yaml
Formato: rounded-2xl, bg white, overflow-hidden, sombra sutil
Elementos:
  - Imagem: aspect-ratio 4/3, object-cover, placeholder gradient se sem imagem
  - Badge de categoria: canto superior esquerdo, bg forest ou lilás
  - Título: Buvera Black, uppercase, ~1.15rem
  - Descrição: texto small (2-3 linhas máx), cor muted
  - Separador sutil
  - Preço: Buvera Black, cor laranja (#EC6838)
  - Botão Comprar: bg bordô (#3D1020), texto creme, pill, com seta →
```

### 4.4 Botão Comprar
- **Link:** URL do produto no InfinitePay (`https://loja.infinitepay.io/thaynawho/{slug}`) ou checkout direto com `variation_id`
- **Comportamento:** abre em nova aba (`target="_blank" rel="noopener noreferrer"`)

### 4.5 Filtro interativo
- **Componente:** React Island `LojaFilter.tsx`
- **Funcionalidades:**
  - Busca textual por nome do produto
  - Pills de categoria (2 categorias: Livros, Leitura e Criação)
  - Animação GSAP nos cards ao trocar filtro
  - Estado vazio com mensagem
- **Renderização:** `client:load`

### 4.6 Fallback de dados
- Se o fetch do InfinitePay falhar (erro de rede, timeout):
  - Exibir mensagem amigável no lugar do grid
  - Log do erro no console (build)
  - Não quebrar o build

### 4.7 Página Astro (`/lojinha`)
```astro
---
// src/pages/lojinha.astro
import LojaFilter from "@/components/islands/LojaFilter";
import BaseLayout from "@/layouts/BaseLayout.astro";
// fetch da API InfinitePay no build
---
<BaseLayout title="Loja — Estúdio Entre" navTheme="dark">
  <main class="...bg-cream...">
    <!-- Header editorial -->
    <!-- Painel de filtros -->
    <!-- <LojaFilter client:load produtos={produtos} /> -->
  </main>
  <Footer />
</BaseLayout>
```

---

## 5. Seções da Homepage

### 5.1 Sebo Home
- **Posição:** após a seção Sobre, antes de Visitação
- **Fundo:** ciano (`#B9E4EB`)
- **Conteúdo:** título "Garimpe no Sebo", 3-4 cards de destaque, CTA "Ver acervo completo →"
- **Dados:** import dos primeiros 4 itens do `sebo.json`

### 5.2 Lojinha Home
- **Posição:** após Sebo Home, antes de Visitação (ou invertido)
- **Fundo:** creme (`#F0EDE8`)
- **Conteúdo:** título "Loja Entre", 3 cards de destaque, CTA "Ver todos os produtos →"
- **Dados:** fetch dos primeiros 3 produtos do InfinitePay (ou fallback estático)

---

## 6. Arquivos a Criar/Modificar

### 6.1 Novos arquivos

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `src/pages/sebo.astro` | Página | Página do Sebo |
| `src/pages/lojinha.astro` | Página | Página da Lojinha |
| `src/data/sebo.json` | Dados | JSON estático com 44 livros |
| `src/types/sebo.ts` | Tipos | Interface `LivroSebo` |
| `src/types/loja.ts` | Tipos | Interface `ProdutoLoja` |
| `src/components/islands/SeboFilter.tsx` | React Island | Filtro interativo do Sebo |
| `src/components/islands/LojaFilter.tsx` | React Island | Filtro interativo da Lojinha |
| `src/components/sections/SeboHome.astro` | Seção | Teaser do Sebo na home |
| `src/components/sections/LojaHome.astro` | Seção | Teaser da Lojinha na home |
| `src/animations/sebo.ts` | Animação | GSAP para cards do Sebo |
| `src/animations/loja.ts` | Animação | GSAP para cards da Lojinha |

### 6.2 Arquivos a modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/ui/Navbar.astro` | Adicionar links Sebo + Loja |
| `src/components/islands/MobileNav.tsx` | Adicionar links Sebo + Loja |
| `src/components/sections/Footer.astro` | Adicionar links Sebo + Loja |
| `src/pages/index.astro` | Importar seções SeboHome + LojaHome |

---

## 7. Cores e Design Tokens

### 7.1 Paleta Sebo
| Elemento | Cor | Token |
|----------|-----|-------|
| Header bg | `#B9E4EB` | `--color-cyan` |
| Header texto | `#3D1020` | `--color-bordo` |
| Corpo bg | `#F0EDE8` | `--color-cream` |
| Card bg | `#FFFFFF` | white |
| Preço | `#EC6838` | `--color-orange` |
| WhatsApp btn | `#25D366` | (fixo) |
| Gênero dots | `#EC6838`, `#777BDE`, `#DEC72C`, `#9E4B2D` | variados |

### 7.2 Paleta Lojinha
| Elemento | Cor | Token |
|----------|-----|-------|
| Header bg | `#F0EDE8` | `--color-cream` |
| Header texto | `#1D432C` | `--color-forest` |
| Corpo bg | `#F0EDE8` | `--color-cream` |
| Card bg | `#FFFFFF` | white |
| Preço | `#EC6838` | `--color-orange` |
| Botão Comprar | `#3D1020` | `--color-bordo` |
| Badge Livros | `#1D432C` | `--color-forest` |
| Badge Leitura | `#777BDE` | `--color-lilas` |

---

## 8. Responsividade

| Breakpoint | Sebo Grid | Lojinha Grid |
|-----------|-----------|-------------|
| Mobile (< 768px) | 1 coluna | 1 coluna |
| Tablet (768px - 1023px) | 1 coluna | 2 colunas |
| Desktop (≥ 1024px) | 2 colunas | 3 colunas |

---

## 9. Loading & Edge Cases

| Situação | Comportamento |
|----------|--------------|
| Sebo: JSON vazio | Mensagem "Nenhum livro no acervo no momento." |
| Lojinha: API offline | Fallback: mensagem "Loja indisponível no momento." |
| Lojinha: produto sem imagem | Placeholder com gradiente + ícone |
| Lojinha: preço R$ 0,00 | Exibir "Sob consulta" ou omitir |
| Ambos: busca sem resultado | Mensagem + botão "Limpar filtros" |
| Ambos: `prefers-reduced-motion` | Desabilitar animações GSAP |

---

## 10. Performance

- **Sebo:** JSON estático importado diretamente — zero latência de rede no build
- **Lojinha:** 1 fetch HTTP no build (cacheável); imagens servidas via CDN do InfinitePay
- **Ambos:** imagens com `loading="lazy"` e `decoding="async"`
- **GSAP:** ScrollTrigger apenas nos cards visíveis (`client:visible` para home, `client:load` para páginas dedicadas)

---

## 11. Fora do Escopo (V1)

- Integração automática com Google Sheets (será V2)
- Carrinho de compras próprio
- Página de detalhe de produto/livro
- Paginação (44 livros e 10 produtos não justificam)
- CMS Sanity para produtos da loja (substituído por API InfinitePay)
- Schema Sanity `produto` (não será criado)
