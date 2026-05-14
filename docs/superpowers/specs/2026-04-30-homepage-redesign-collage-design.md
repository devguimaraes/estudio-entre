# Design Spec — Homepage Redesign "Collage & Asymmetry"

> **Projeto:** Estúdio Entre — Site Institucional
> **Data:** 2026-04-30
> **Versão:** 1.0
> **Status:** Aprovado para implementação

---

## 1. Visão Geral

Redesign completo da homepage do Estúdio Entre, migrando de um layout tradicional de blocos para uma estética **editorial collage** inspirada diretamente no guia de identidade visual (`docs/Guia_Estudio Entre.pdf`).

**Princípios diretores:**
- **Assimetria intencional** — nada centralizado sem propósito
- **Sobreposição de camadas** — fotografia + gráfico + tipografia coexistem
- **Máscaras orgânicas (BlobMask)** — fotos em recortes irregulares
- **Ícones SVG como protagonistas** — nos pilares, não fotos genéricas
- **Movimento contínuo** — parallax, reveals, marquee, stagger
- **Harmonia com o guia visual** — paleta completa, texturas, citações

**Fluxo de seções (8 no total):**

```
Hero → Sobre → Pilares → Agenda → Galeria → Voo Literário → Contato → Footer
(bordô) (creme) (near-black) (verde-floresta) (ciano) (verde-floresta) (lilás) (near-black)
```

---

## 2. Hero

### Layout
Composição collage de `100vh` com múltiplos elementos em camadas sobrepostas.

```
┌─────────────────────────────────────────────────────────────┐
│ 🔑 Chave SVG (grande, canto sup. esq., parallax no mouse)   │
│                                                             │
│   "Hub Cultural      ┌─────────────────────┐                │
│    Independente"     │  Foto do espaço     │                │
│                      │  em BlobMask        │                │
│   ESTÚDIO            │  (direita, ~40vw)   │                │
│   eNTRE              └─────────────────────┘                │
│                                                             │
│   "onde a palavra vira encontro."                           │
│                                                             │
│   [Próximos encontros]  [Conheça o espaço]                  │
│                                                             │
│  ✨ Letra "E" gigante em watermark (0.03 opacity)           │
│     Estrelas e pontos decorativos flutuando                 │
└─────────────────────────────────────────────────────────────┘
```

### Cores
- **Fundo:** `bordô` `#3D1020` (referência fachada/cartão do guia)
- **Texto primário:** `creme` `#F0EDE8`
- **CTA primário:** `creme` fundo + `bordô` texto
- **CTA secundário:** border `creme` + texto `creme`
- **Acento:** `laranja` `#EC6838` nos hover states

### Tipografia
- Logo: **Buvera Black**, 72–96px (tipografia viva, não imagem PNG)
- Eyebrow: "Hub Cultural Independente" — 10px, uppercase, tracking 0.4em
- Tagline: "onde a palavra vira encontro." — Buvera Regular Italic, 20–24px
- CTAs: Buvera Bold, 14px, uppercase, tracking-widest

### Elementos Gráficos
- **Chave SVG** (`/icons/chave.svg`): posicionada no canto superior esquerdo, ~240px, responde a `mousemove` com parallax suave (já existe, preservar)
- **Letra "E" watermark**: Buvera Black, `60vw`, opacity 0.03, posicionada atrás do conteúdo
- **Estrelas/pontos decorativos**: componentes `Decorative` (star, dots, ray) em posições assimétricas

### Animações
1. **Chave**: fade-in + scale(0.8→1) + depois scale(25) + fade-out (transição para logo)
2. **Logo tipográfico**: SplitText — revelação palavra por palavra, stagger 0.1s, ease expo.out, duração ~1.5s
3. **Foto BlobMask**: `clipPath: inset(100% 0 0 0) → inset(0% 0 0 0)`, duração 1.4s, ease expo.inOut
4. **Tagline**: fade-in + translateY(20→0), delay -0.7s
5. **CTAs**: fade-in + translateY(24→0), stagger 0.15s
6. **Scroll indicator**: fade-in + linha animada em loop
7. **Decorativos**: `float` keyframes CSS (já existe)

### Assets
- Foto do espaço: `/images/brand/apresentacao-estudio-entre.jpg` ou similar
- Chave: `/icons/chave.svg`

---

## 3. Sobre

### Layout
Editorial assimétrico — texto e imagens se sobrepõem com offset intencional.

```
┌─────────────────────────────────────────────────────────────┐
│  BG: creme #F0EDE8                                          │
│                                                             │
│  "Nossa Essência" (eyebrow, bordô, 10px uppercase)          │
│                                                             │
│  ┌────────────────────────────────────┐                     │
│  │  Uma mãe, uma                      │  ┌──────────────┐   │
│  │  filha e um                        │  │  Foto        │   │
│  │  sonho.            ←── texto flui  │  │  fundadoras  │   │
│  │                                    │  │  em          │   │
│  │  Hub cultural...                   │  │  BlobMask    │   │
│  │  (corpo de texto)                  │  └──────────────┘   │
│  └────────────────────────────────────┘                     │
│                                    ┌──────────────┐         │
│                                    │  Foto        │         │
│                                    │  secundária  │         │
│                                    │  offset      │         │
│                                    └──────────────┘         │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  "Entre palavras, entre pessoas — é só entrar."             │
│  (signature, bordô, Buvera Italic, 24–32px)                 │
│                                                             │
│  🖼️ Watermark: letra "e" cursiva gigante, 0.03 opacity      │
└─────────────────────────────────────────────────────────────┘
```

### Mudanças vs. Atual
- Remove sticky title no lado esquerdo (causava espaço em branco)
- Título reduzido para ~5xl (64px) mas mantém **peso Black** para impacto
- Texto flui em largura confortável (max-width ~640px)
- Imagens menores (~280–320px), posicionadas com **offset intencional**
- Remove a segunda imagem grande no corpo do texto

### Cores
- Fundo: `creme` `#F0EDE8`
- Texto: `near-black` `#1A1612`
- Título/eyebrow: `bordô` `#3D1020`
- Destaque no corpo: `laranja` `#EC6838` em itálico
- Signature: `bordô` `#3D1020`

### Texturas
- Halftone sutil em `bordô` sobre o creme: opacity 0.06, density 16, dotSize 1.2
- Referência direta à página 20 do guia

### Animações
- Título: fade-in + translateX(-34→0), ease expo.out, 1.25s
- Textos: stagger fade-in + translateY(28→0), ease power3.out, 1s
- Imagens BlobMask: `clipPath` reveal de baixo para cima, 1.45s
- Signature: fade-in + translateY(24→0), 0.95s
- Watermark "e": scale(0.92→1.05) com scrub no scroll

### Assets
- Foto primária: `/images/brand/apresentacao-estudio-entre.jpg` (Thayná e Valdete)
- Foto secundária: `/images/brand/sobre-estudio-entre-4.jpg`

---

## 4. Pilares

### Layout
**Bento Grid** — células de tamanhos variados em grid irregular, diretamente inspirado nos destaques do Instagram no guia.

```
┌─────────────────────────────────────────────────────────────┐
│  BG: near-black #1A1612                                     │
│                                                             │
│  "O que fazemos" (eyebrow, ciano #B9E4EB)                   │
│                                                             │
│  ┌─────────────┬────────────────┬─────────────┐            │
│  │             │                │             │            │
│  │ BIBLIO-     │   OFICINAS     │  PALESTRAS  │            │
│  │ TERAPIA     │                │             │            │
│  │             │  [spark.svg]   │             │            │
│  │ [olho.svg]  │                │[microfone]  │            │
│  │             │  Criação       │             │            │
│  │  terracota  │  coletiva      │  ciano      │            │
│  │  #9E4B2D    │  #BDB2DD       │  #B9E4EB    │            │
│  │             │                │             │            │
│  ├─────────────┴────────────────┴─────────────┤            │
│  │                                             │            │
│  │            E S T Ú D I O                    │            │
│  │                                             │            │
│  │         [play.svg]  #DEC72C                 │            │
│  │                                             │            │
│  ├─────────────────────────────────────────────┤            │
│  │                                             │            │
│  │         E N C O N T R O S                   │            │
│  │                                             │            │
│  │         [pin.svg]  #EC6838                  │            │
│  │                                             │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│  Cada célula: cor do guia + ícone SVG centralizado          │
│  em círculo/orgânico + título Buvera Black + descrição      │
└─────────────────────────────────────────────────────────────┘
```

### Mudanças vs. Atual
- **Remove fotos** dos pilares → substitui por **ícones SVG**
- Strips horizontais viram **grid bento/masonry**
- Cores diretas do guia para cada pilar
- Ícones em círculos ou formas orgânicas (como stories do guia)

### Configuração dos Pilares

| Pilar | Cor Fundo | Cor Texto | Ícone SVG | Descrição |
|-------|-----------|-----------|-----------|-----------|
| Biblioterapia | `#9E4B2D` terracota | `#F0EDE8` creme | `/icons/olho.svg` | Rodas de leitura como cura |
| Oficinas | `#BDB2DD` lilás médio | `#1A1612` near-black | `/icons/spark.svg` | Criação coletiva |
| Palestras | `#B9E4EB` ciano | `#1A1612` near-black | `/icons/microfone.svg` | Diálogos profundos |
| Estúdio | `#DEC72C` mostarda | `#1A1612` near-black | `/icons/play.svg` | Produção e áudio |
| Encontros | `#EC6838` laranja | `#F0EDE8` creme | `/icons/pin.svg` | Conexão real |

### Animações
- Células: fade-in + translateY(40→0) com stagger entre elas
- Ícones: scale(0.8→1) + rotação sutil (0→5deg) no hover
- Hover do card: scale(1.02) + sombra + ícone gira 15deg

---

## 5. Agenda

### Layout
Cards editoriais com imagem do evento em blob mask.

```
┌─────────────────────────────────────────────────────────────┐
│  BG: verde-floresta #1D432C                                 │
│                                                             │
│  "Próximos encontros" (eyebrow, creme)                      │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ [foto do    │ │ [foto do    │ │ [foto do    │           │
│  │  evento em  │ │  evento em  │ │  evento em  │           │
│  │  BlobMask]  │ │  BlobMask]  │ │  BlobMask]  │           │
│  ├─────────────┤ ├─────────────┤ ├─────────────┤           │
│  │ BIBLIOTERAPIA│ │ OFICINA     │ │ PALESTRA    │           │
│  │ "Nome do    │ │ "Nome do    │ │ "Nome do    │           │
│  │  Evento"    │ │  Evento"    │ │  Evento"    │           │
│  │ 00 de mês   │ │ 00 de mês   │ │ 00 de mês   │           │
│  │ [Ver mais →]│ │ [Ver mais →]│ │ [Ver mais →]│           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  Tags coloridas por categoria (igual stories do guia)       │
└─────────────────────────────────────────────────────────────┘
```

### Mudanças vs. Atual
- Fundo muda de `oliva` `#8E8100` para `verde-floresta` `#1D432C`
- Cards ganham **imagem do evento** em blob mask (do Sanity)
- Tags coloridas por categoria
- Tipografia mais bold nos títulos

### Cores das Tags
- Biblioterapia: terracota `#9E4B2D`
- Oficinas: lilás `#BDB2DD`
- Palestras: ciano `#B9E4EB`
- Estúdio: mostarda `#DEC72C`
- Encontros: laranja `#EC6838`

### Animações
- Cards: stagger fade-in + translateY(30→0)
- Imagens: `clipPath` reveal
- Hover: card eleva + imagem scale(1.05)

---

## 6. Galeria (Nova Seção)

### Layout
Marquee horizontal infinito com fotos do espaço.

```
┌─────────────────────────────────────────────────────────────┐
│  BG: ciano #B9E4EB                                          │
│                                                             │
│  "O Lugar" (eyebrow, bordô)                                 │
│                                                             │
│  ← [foto] [foto] [foto] [foto] [foto] [foto] [foto] →      │
│     scroll horizontal contínuo (marquee)                    │
│     velocidade: ~40px/s, pausa no hover                     │
│     fotos: @etudio-entre-imagem/                            │
│                                                             │
│  Cada foto em BlobMask com label discreto                   │
└─────────────────────────────────────────────────────────────┘
```

### Comportamento
- Scroll horizontal **automático e contínuo** (marquee/drag scroll)
- Velocidade lenta para contemplação
- **Pausa no hover** para permitir observação
- Fotos em **BlobMask** variante (rotacionadas, diferentes formas)
- Labels discretos: "01. Perspectiva", "02. Encontros", etc.

### Assets
- Fotos do diretório `etudio-entre-imagem/`:
  - `apresentacao-estudio-entre.jpg`
  - `apresentacao-estudio-entre-2.jpg` a `-5.jpg`
  - `sobre-estudio-entre.jpg`, `-2.jpg`, `-3.jpg`, `-4.jpg`
  - `onde-a-palavra-vira-encontro.jpg`

### Animações
- Marquee: animação CSS `translateX` contínua, linear
- Hover: pausa a animação
- Fotos: stagger reveal ao entrar no viewport

---

## 7. Voo Literário (Nova Seção)

### Layout
Seção de citação/citação editorial, substituindo a seção Espaço atual.

```
┌─────────────────────────────────────────────────────────────┐
│  BG: verde-floresta #1D432C                                 │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │              "66                                      │  │
│  │                                                       │  │
│  │   A leitura é ponte para o que ainda virá.            │  │
│  │                                                       │  │
│  │                                                       │  │
│  │              — Estúdio Entre                          │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Aspas gigantes como elemento gráfico (referência p.16)     │
│  Texto em lilás-claro #D2BCFA                               │
└─────────────────────────────────────────────────────────────┘
```

### Racional
A seção Espaço atual (imagens espalhadas com parallax) é **redundante** com a nova Galeria. A citação traz:
- **Impacto editorial** forte
- **Conexão emocional** com a marca
- **Referência direta** ao guia visual
- **Pausa narrativa** antes do Contato

### Tipografia
- Citação: Buvera Extrabold, 48–64px, cor `lilás-claro` `#D2BCFA`
- Aspas: Buvera Black, 120–200px, opacity 0.2, posicionadas como elemento gráfico
- Assinatura: Buvera Regular Italic, 18px

### Animações
- Aspas: fade-in + scale(0.9→1)
- Texto: SplitText reveal, stagger palavra por palavra

---

## 8. Contato

### Layout
Split-screen com elemento gráfico à esquerda e formulário à direita.

```
┌─────────────────────────────────────────────────────────────┐
│  BG: lilás #777BDE                                          │
│                                                             │
│  ┌──────────────────┐                                       │
│  │                  │                                       │
│  │   🔑 Chave SVG   │   "O que você quer                   │
│  │   flutuante      │    criar entre nós?"                 │
│  │   (grande)       │                                       │
│  │                  │   [Seu nome]                          │
│  │                  │   _____________________________       │
│  │                  │                                       │
│  │                  │   [Seu e-mail]                        │
│  │                  │   _____________________________       │
│  │                  │                                       │
│  │                  │   [Sua ideia...]                      │
│  │                  │   _____________________________       │
│  │                  │                                       │
│  │                  │   [Enviar mensagem →]                 │
│  │                  │                                       │
│  └──────────────────┘                                       │
│                                                             │
│  Texto em bordô #3D1020 sobre lilás                         │
│  Inputs estilo editorial: underline, sem caixa              │
└─────────────────────────────────────────────────────────────┘
```

### Mudanças vs. Atual
- Fundo muda de `near-black` para `lilás` `#777BDE` — surpreendente, memorável
- Chave SVG como elemento gráfico de destaque na esquerda
- Inputs estilo **editorial** (underline, sem bordas de caixa)
- Botão submit com hover que vira `terracota` `#9E4B2D`

### Cores
- Fundo: `lilás` `#777BDE`
- Texto: `bordô` `#3D1020`
- Inputs: border-bottom `bordô/30`, focus `laranja` `#EC6838`
- Botão: `bordô` texto + hover `terracota` fundo

### Animações
- Chave: parallax suave no scroll
- Título: fade-in + translateX
- Inputs: stagger reveal
- Focus: border-bottom transição de cor, 300ms

---

## 9. Footer

### Layout
Footer funcional com 3 colunas + copyright.

```
┌─────────────────────────────────────────────────────────────┐
│  BG: near-black #1A1612                                     │
│                                                             │
│  ┌──────────────┬──────────────────┬────────────────┐      │
│  │              │                  │                │      │
│  │  🔑          │  "Hub cultural   │  ENDEREÇO      │      │
│  │  ESTÚDIO     │   no Méier,      │  Rua ..., s/n  │      │
│  │  eNTRE       │   Rio de         │  Méier, RJ     │      │
│  │  (logo       │   Janeiro"       │  CEP: ...      │      │
│  │   completo)  │                  │                │      │
│  │              │  Biblioterapia,  │  REDES         │      │
│  │              │  oficinas,       │  [IG] [TT] [WA]│      │
│  │              │  palestras,      │                │      │
│  │              │  encontros.      │  [Google       │      │
│  │              │                  │   Meu Negócio] │      │
│  │              │                  │                │      │
│  └──────────────┴──────────────────┴────────────────┘      │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  © 2026 Estúdio Entre · Rio de Janeiro                      │
│  "Entre palavras, entre pessoas — é só entrar."             │
│                                                             │
│  🖼️ Watermark "eNTRE" em 15vw, opacity 0.04 (fundo)         │
└─────────────────────────────────────────────────────────────┘
```

### Colunas
1. **Logo:** versão horizontal completa (claro sobre escuro)
2. **Descrição:** tagline + lista de eixos
3. **Info:** endereço completo, ícones redes sociais, link Google Meu Negócio

### Cores
- Fundo: `near-black` `#1A1612`
- Texto: `creme` `#F0EDE8`
- Links: `creme/60`, hover `laranja` `#EC6838`
- Divider: `creme/10`
- Watermark: `creme`, 15vw, opacity 0.04

### Ícones Sociais
- Instagram: `/icons/spark.svg`
- TikTok: `/icons/tiktok.svg`
- WhatsApp: `/icons/whatsapp.svg`

---

## 10. Sistema de Transições de Cor

O body muda de cor suavemente conforme o scroll cruza cada seção:

| Seção | Cor Body | Navbar Theme |
|-------|----------|--------------|
| Hero | `#3D1020` bordô | light |
| Sobre | `#F0EDE8` creme | dark |
| Pilares | `#1A1612` near-black | light |
| Agenda | `#1D432C` verde-floresta | light |
| Galeria | `#B9E4EB` ciano | dark |
| Voo Literário | `#1D432C` verde-floresta | light |
| Contato | `#777BDE` lilás | dark |
| Footer | `#1A1612` near-black | light |

**Duração:** 1.2s, ease power2.inOut (já implementado em `colorTransition.ts`)

---

## 11. Sistema de Animações

### Padrões Reutilizáveis

| Padrão | Duração | Easing | Uso |
|--------|---------|--------|-----|
| Reveal fade-in | 0.8–1.0s | power3.out | Elementos genéricos |
| Reveal slide-up | 0.8–1.2s | power3.out | Textos, cards |
| Reveal slide-left | 1.0–1.4s | expo.out | Títulos |
| ClipPath reveal | 1.2–1.6s | expo.inOut | Imagens BlobMask |
| SplitText | 1.5–2.0s | expo.out | Hero, citações |
| Stagger | 0.1–0.16s | — | Múltiplos elementos |
| Hover scale | 0.3s | power2.out | Cards, botões |
| Color transition | 1.2s | power2.inOut | Background body |

### ScrollTrigger Defaults
- Start: `"top 72%"` para reveals de entrada
- Start: `"top 80%"` para cards e grids
- Toggle actions: `"play none none reverse"` (reversível ao scrollar para cima)

### Reduced Motion
Todos os padrões respeitam `prefers-reduced-motion: reduce`:
- Durações → 0.01ms
- Opacity → 1 imediato
- Sem transformações

---

## 12. Assets Necessários

### Imagens (já existem)
- `/images/brand/apresentacao-estudio-entre.jpg` — Hero, Sobre
- `/images/brand/sobre-estudio-entre-4.jpg` — Sobre secundária
- `/images/brand/apresentacao-estudio-entre-2.jpg` a `-5.jpg` — Galeria
- `/images/brand/sobre-estudio-entre.jpg`, `-2.jpg`, `-3.jpg` — Galeria
- `/images/brand/onde-a-palavra-vira-encontro.jpg` — Galeria
- Eventos: imagens do Sanity (Agenda)

### Ícones SVG (já existem em `/icons/`)
- `chave.svg` — Hero, Contato
- `olho.svg` — Pilar Biblioterapia
- `spark.svg` — Pilar Oficinas
- `microfone.svg` — Pilar Palestras
- `play.svg` — Pilar Estúdio
- `pin.svg` — Pilar Encontros
- `spark.svg` — Instagram
- `tiktok.svg` — TikTok
- `whatsapp.svg` — WhatsApp

### Logos (já existem em `/assets/logos/`)
- `Logo_Estudio Entre - Claro 1.png` — Footer (claro sobre escuro)

---

## 13. Componentes UI Afetados

| Componente | Ação | Notas |
|------------|------|-------|
| `Hero.astro` | **Reescrever** | Layout collage, logo tipográfico, fundo bordô |
| `Sobre.astro` | **Reescrever** | Layout assimétrico, imagens menores com offset |
| `Pilares.astro` | **Reescrever** | Bento grid, ícones SVG, remove fotos |
| `Agenda.astro` | **Modificar** | Novas cores, cards com imagem, tags coloridas |
| `Espaco.astro` | **Substituir** | Nova seção `VooLiterario.astro` |
| `Contato.astro` | **Reescrever** | Fundo lilás, split-screen, inputs underline |
| `Footer.astro` | **Reescrever** | 3 colunas, info prática, watermark |
| **Novo** `Galeria.astro` | **Criar** | Marquee horizontal com fotos |
| `BlobMask.astro` | **Reutilizar** | Já existe, usar em mais lugares |
| `Decorative.astro` | **Reutilizar** | Elementos flutuantes |
| `HalftoneTexture.astro` | **Reutilizar** | Overlay sutil |

---

## 14. Considerações Técnicas

### Performance
- Todas as animações usam `transform` e `opacity` (GPU-accelerated)
- Imagens lazy-load abaixo da fold
- BlobMasks usam SVG clipPath (render eficiente)
- Marquee da Galeria: usar CSS animation (não JS loop)

### Responsivo
- Mobile: stacks verticais, imagens 100% width, fontes reduzidas
- Tablet: grids 2-col
- Desktop: layouts completos descritos
- Touch: marquee da Galeria deve ser scrollável manualmente

### Acessibilidade
- `prefers-reduced-motion` em todas as animações
- Contraste WCAG AA em todas as combinações de cor
- Focus visível em todos os elementos interativos
- Labels semânticas em seções

### SEO
- Mantém meta tags e estrutura semântica existente
- Imagens com `alt` descritivos
- Heading hierarchy preservada (h1 no hero, h2 nas seções)

---

## 15. Checklist de Implementação

- [ ] Hero: layout collage, logo tipográfico Buvera Black, fundo bordô
- [ ] Hero: animações SplitText, clipPath, parallax chave
- [ ] Sobre: layout assimétrico, imagens com offset, watermark "e"
- [ ] Sobre: textura halftone em bordô
- [ ] Pilares: bento grid, ícones SVG, cores do guia, remove fotos
- [ ] Agenda: cards com imagem BlobMask, tags coloridas, fundo verde-floresta
- [ ] **Galeria (NOVO):** marquee horizontal, fotos etudio-entre-imagem, BlobMask
- [ ] **VooLiterario (NOVO):** citação editorial, aspas gráficas, fundo verde-floresta
- [ ] Contato: fundo lilás, split-screen, inputs underline, chave SVG
- [ ] Footer: 3 colunas, endereço, redes, Google Meu Negócio, watermark
- [ ] Transições de cor: atualizar mapeamento para 8 seções
- [ ] Animações: stagger em cards, reveals em todas as seções
- [ ] Responsivo: mobile, tablet, desktop
- [ ] Reduced motion: testar e validar
- [ ] Build e check (bun run check, bun run build)

---

*Spec aprovado em 2026-04-30. Próximo passo: writing-plans.*
