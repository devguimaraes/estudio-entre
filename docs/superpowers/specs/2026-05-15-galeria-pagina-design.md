# Design: Página de Galeria (/galeria)

## Data

2026-05-15

## Contexto

O site do Estúdio Entre já possui uma seção `Galeria` na homepage (`/#galeria`) com um marquee horizontal contínuo de 4 imagens do espaço. Existem aproximadamente 26 imagens adicionais do espaço físico disponíveis em `public/images/espaco/` que não são exibidas na homepage. O objetivo é criar uma página dedicada `/galeria` que exiba todas essas imagens mantendo a estética visual do projeto (colagem, texturas, cores, tipografia).

## Objetivo

Criar uma página `/galeria` acessível pela navegação principal, que apresente todas as fotos do espaço físico do Estúdio Entre em um grid masonry com lightbox, preservando a identidade visual do site.

## Abordagem Escolhida

**Grid Masonry com Lightbox (Opção 1)**

Imagens dispostas em colunas desalinhadas (masonry CSS), cada uma dentro do `TornPaperFrame` já utilizado na homepage. Clique abre lightbox customizado para navegação em tamanho real. Paleta e texturas idênticas à seção existente.

## Estrutura de Arquivos

```
src/
  pages/
    galeria.astro              # Página principal
  components/
    sections/
      GaleriaGrid.astro        # Grid masonry de imagens
    ui/
      Lightbox.astro           # Overlay de visualização
  data/
    galeriaImagens.ts          # Array estático de imagens do espaço
  animations/
    galeriaPagina.ts           # Animações de entrada do grid e lightbox
```

## Componentes

### `galeria.astro`
- Usa `BaseLayout` com `title="Galeria — Estúdio Entre"`, `description` customizado, `navTheme="dark"`.
- Renderiza: header da galeria (eyebrow + título display), `GaleriaGrid`, `Footer`.
- Importa array de imagens de `data/galeriaImagens.ts`.
- Inclui `<script>` para inicializar `animateGaleriaPagina()`.

### `GaleriaGrid.astro`
- Props: `imagens: { src: string; alt: string; categoria?: string }[]`.
- Layout masonry via CSS `columns`: 2 colunas mobile, 3 tablet, 4 desktop.
- Cada item envolvido em `TornPaperFrame` com:
  - `variant` cíclica (1–4).
  - `rotation` aleatória leve (mesma função `getRotation` da homepage).
  - `group-hover:scale-[1.02]` no frame.
  - Imagem interna com `scale-[1.05] → group-hover:scale-[1.1]`.
  - Label inferior no hover: `font-display italic`, fundo `cream/95`, `rounded-full`.
- `break-inside: avoid` em cada item para evitar corte do frame.
- Imagens fora do viewport inicial usam `loading="lazy"`.

### `Lightbox.astro`
- Props: `imagens` (mesmo tipo do grid) + índice inicial.
- Overlay escuro (`bg-black/95`), `role="dialog"`, `aria-modal="true"`.
- Imagem central com animação GSAP de entrada (`scale: 0.9 → 1`, `opacity: 0 → 1`).
- Navegação:
  - Setas visuais laterais (`← →`).
  - Teclas `←`, `→`, `Esc`.
  - Clique fora fecha.
  - Transição entre imagens: fade + scale suave (0.2s).
- Acessibilidade:
  - Focus trap quando aberto.
  - `aria-label` em todos os controles.
  - Retorno de foco ao item clicado ao fechar.

### `data/galeriaImagens.ts`
- Array estático com todas as imagens de `public/images/espaco/`.
- Inclui `src`, `alt` descritivo em português.
- As 4 imagens já usadas no marquee da homepage fazem parte deste conjunto (sem duplicação de assets).

## Animações

### Entrada do Header
- Mesmo padrão da seção `Galeria` atual:
  - `.galeria__eyebrow`: `opacity: 0 → 0.5`, `y: 15 → 0`, `duration: 0.6`.
  - `.galeria__title`: `opacity: 0 → 1`, `y: 40 → 0`, `duration: 0.8`, `ease: expo.out`.
  - Trigger: `ScrollTrigger`, `start: "top 75%"`.

### Entrada do Grid
- Cada item do masonry:
  - `opacity: 0 → 1`
  - `y: 30 → 0`
  - `scale: 0.96 → 1`
  - `duration: 0.6`, `ease: power2.out`
  - Stagger: `0.08s` entre itens.
- Trigger: `ScrollTrigger` no container do grid, `start: "top 80%"`.

### Lightbox
- Overlay: `opacity: 0 → 1`, `duration: 0.3`.
- Imagem: `scale: 0.9 → 1`, `opacity: 0 → 1`, `duration: 0.4`, `ease: power3.out`.
- Transição entre imagens: fade cruzado com scale (0.2s).

### Preferências de Movimento
- Se `prefers-reduced-motion: reduce`, todos os elementos aparecem instantaneamente (`opacity: 1`, `y: 0`, `scale: 1`).

## Paleta e Texturas

- **Fundo:** `#b9e4eb` (teal).
- **Textura de papel:** `texturePaper` via `<Image>` com `opacity: 0.04`, `mix-blend-multiply`.
- **Halftone:** `HalftoneTexture` com `density={20}`, `dotSize={1.2}`, `color="61,16,32"`, `opacity={0.06}`.
- **Decorações flutuantes:** `Decorative` star e dots em posições absolutas, baixa opacidade.
- **Tipografia:** `font-display` black/italic para título, eyebrow em uppercase tracking amplo.

## SEO e Acessibilidade

- **Meta tags:** title, description, OG, Twitter configurados no `BaseLayout`.
- **Schema.org:** `ImageGallery` em `<script type="application/ld+json">` listando as imagens.
- **Imagens:** todos os `alt` descritivos em português.
- **Lightbox:** `role="dialog"`, `aria-modal="true"`, focus trap, labels ARIA nos controles.
- **Lazy loading:** imagens fora do viewport inicial.

## Integração com Navegação

- Adicionar link `"Galeria"` apontando para `/galeria` na navbar (desktop e mobile).
- Manter link `"O Lugar"` apontando para `/#galeria` (seção da homepage).
- Link usa `data-cursor="ENTRAR"` para consistência.

## Dependências

- Astro + BaseLayout existentes.
- GSAP + ScrollTrigger (já usados no projeto).
- Componentes existentes: `TornPaperFrame`, `Decorative`, `HalftoneTexture`, `Footer`.
- Nenhuma dependência externa nova.

## Notas

- As imagens são servidas estaticamente de `public/images/espaco/`.
- O masonry é implementado via CSS puro (`columns`), sem bibliotecas JS, para melhor performance.
- A página não depende do Sanity; os dados são estáticos.
- Futuramente, pode-se migrar as imagens para um documento Sanity se houver necessidade de edição pelo CMS.
- **Lightbox:** embora descrito como `Lightbox.astro`, o componente requer interatividade (estado de aberto/fechado, índice atual, eventos de teclado). Pode ser implementado como um Astro component com `<script>` client-side gerenciando o estado via atributos `data-*`, ou como um island (React/Vue/Svelte) se o projeto já utilizar esse padrão. A escolha da implementação será detalhada no plano de implementação.
- **Pasta `src/data/`:** não existe no projeto atual; será criada para o arquivo `galeriaImagens.ts`.
- **Navbar mobile:** o menu mobile (`MobileNav` island) também deve refletir o novo link "Galeria".
