# Design Spec: Redesign do Hero "Portal de Entrada" — Estúdio Entre

**Data:** 2026-04-27
**Status:** Aprovado pelo Usuário
**Tópico:** Refinação visual e animação do Hero da Home Institucional baseado no Guia de Identidade Visual.

---

## 1. Visão Geral
Transformar a entrada do site em uma experiência cinematográfica e impactante que utiliza o símbolo da **Chave** como um portal de entrada para a marca. O design abandona a entrada estática em favor de uma transição dinâmica que reforça o conceito de "Entre".

## 2. Requisitos Visuais

### 2.1 Cores e Texturas
- **Fundo:** `#EC6838` (Laranja Primário).
- **Textura:** Overlay de padrão **Halftone** (pontilhado).
    - Implementação: CSS `mask-image` ou um `div` absoluto com padrão de gradiente radial repetido.
    - Opacidade: 15%.
- **Conteúdo (Logo/Texto):** `#F0EDE8` (Creme).

### 2.2 Elementos Gráficos
- **Símbolo:** Usar a "Cabeça da Chave" (ícone do olho/bússola) como elemento central de portal.
- **Logo:** `Logo_Estudio Entre - Claro 2.png`.
- **Tipografia:**
    - Tagline: `Buvera Black` (ou Extrabold como fallback).
    - Botões: `Buvera Bold` com tracking espaçado.

---

## 3. Comportamento e Animação (GSAP)

### 3.1 Sequência "O Portal"
1. **Estado Inicial:** Chave centralizada (`scale: 0.8`, `opacity: 1`). Fundo laranja com halftone. Conteúdo oculto (`opacity: 0`, `scale: 0.5`).
2. **Animação de Reveal:**
    - A Chave escala para `scale: 20` (zoom-in profundo) e `opacity: 0`.
    - O conteúdo (Logo + Tagline) escala de `0.8` para `1` e `opacity` vai para `1`.
    - Curva de animação: `expo.inOut` para a chave, `power4.out` para o conteúdo.
3. **Estabilização:** As palavras da tagline "Entre", "Vozes" e "& Beats" aparecem com um pequeno stagger (atraso entre elas).

### 3.2 Interatividade (Mouse Follow)
- Aplicar parallax sutil no Logo e na Tagline com base na posição do mouse (movimento inverso ou direto de baixa intensidade, max 20px).

---

## 4. Estrutura de Arquivos Afetados
- `src/components/sections/Hero.astro`: Mudança na estrutura de camadas e estilos.
- `src/animations/hero.ts`: Reescrever a timeline do GSAP para o novo efeito de portal.
- `public/textures/`: Garantir que a textura halftone esteja disponível (ou via CSS).

---

## 5. Critérios de Sucesso
- O símbolo da Chave deve ser reconhecível antes de escalar.
- A transição deve ser fluida e não causar tontura (respeitar `prefers-reduced-motion`).
- O contraste entre o Laranja e o Creme deve manter a acessibilidade para leitura.

---

## 6. Auto-revisão do Spec
- [x] Sem placeholders (TBD/TODO).
- [x] Consistência interna: Cores e comportamentos batem com as escolhas do usuário.
- [x] Foco: O spec está restrito apenas ao Hero, conforme acordado.
- [x] Ambiguidade: Definidas escalas exatas e curvas de animação.
