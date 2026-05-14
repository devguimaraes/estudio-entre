# Sobre - Asymmetric Narrative Design

## Objetivo
Refatorar a seção `Sobre` para um layout assimétrico, introduzindo uma narrativa mais dinâmica com elementos tipográficos de marca d'água e motion scroll sticky.

## Estrutura Visual
- **Grid Assimétrico**: Quebra da estrutura 60/40 para um layout que mistura elementos, usando `col-start`/`col-end` do Tailwind ou CSS grid preciso.
- **Watermark Tipográfica**: Inserção de uma letra "E" gigante ao fundo, `40vw` de largura, `opacity: 0.05` (z-index baixo, atrás de todo o conteúdo).
- **Narrativa Sticky**: O título `.sobre__title` se tornará sticky, mantendo-se visível enquanto os parágrafos de texto rolam ao lado.
- **Texturas Interativas**: Ajuste do halftone overlay para uma resposta mais suave (GSAP ou CSS transition melhorada).

## Detalhes de Implementação
- **Componente**: `Sobre.astro`
- **Animações**: `sobre.ts` (integração ScrollTrigger para sticky).

## Resumo das Mudanças
1. **Layout**: Migração para um grid mais orgânico/assimétrico.
2. **Typography**: Adição do "E" em marca d'água.
3. **Motion**: Título sticky no desktop.
4. **Responsividade**: Stacking mantido para mobile.

---
*Status: Design inicial. Aguardando aprovação.*
