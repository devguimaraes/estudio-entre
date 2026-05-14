# Spec: Eixos - Atmospheric Blades

## Visão Geral
Redesign da seção `Eixos` para um formato de "Atmospheric Blades" (lâminas verticais), trazendo uma estética premium com ênfase em tipografia, espaços negativos e ícones sutis de background.

## Design

### Layout de Blades (Full Width)
- Cada eixo ("Cultura" e "Produção") será uma lâmina de tela cheia vertical, com padding vertical robusto (min. 10rem).
- Grid de serviços será ajustado para manter a legibilidade, possivelmente passando para uma coluna em telas menores.

### Anchors (Background)
- Uso dos ícones de `src/assets/icons/`:
  - Eixo Cultura: Background com `olho.svg`.
  - Eixo Produção: Background com `microfone.svg`.
- Estilo: Outline, fixos, absolute, opacity: 0.1, z-index: 0.

### Interação e Glow
- Hover em cada blade dispara:
  - Glow sutil na borda ou box-shadow suave (transição CSS ease-in-out).
  - Mudança de cursor: `data-cursor="EXPLORAR"`.

## Implementação Técnica
- Alteração no `src/components/sections/Eixos.astro` para refatorar `.eixos__grid`.
- Atualização em `src/animations/eixos.ts` para suavizar a entrada se necessário.

## Verificação
- Executar `bun run lint`.
