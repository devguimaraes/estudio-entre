# Design Spec: Remoção do Preloader e Ajuste de Entrada do Hero

**Data:** 2026-04-27  
**Status:** Em Revisão  
**Tópico:** Remoção da tela de carregamento (loader) e transição direta para a animação do Hero.

---

## 1. Visão Geral
Com a implementação da animação "Portal" no Hero, o preloader tornou-se desnecessário. O objetivo é remover todos os vestígios visuais e lógicos do preloader, garantindo que o Hero inicie sua animação com um leve delay após o carregamento inicial.

## 2. Requisitos Técnicos

### 2.1 Hero Animation (`src/animations/hero.ts`)
- Remover a dependência de `onPreloaderComplete`.
- Adicionar um `delay: 0.3` na timeline principal do GSAP.
- Garantir que `runHeroTimeline()` seja chamado diretamente na execução de `animateHero()`.

### 2.2 Layout (`src/layouts/BaseLayout.astro`)
- Remover o componente `<Preloader />`.
- Remover os scripts inline de fallback do preloader.
- Remover as classes `is-loading` do `body`.
- Remover o import e a chamada de `initPreloader()`.

### 2.3 Cleanup
- Deletar `src/components/ui/Preloader.astro`.
- Deletar `src/animations/preloader.ts`.
- Remover estilos relacionados no `src/styles/global.css` (se houver).

---

## 3. Critérios de Sucesso
- O site não deve exibir a tela preta com a chave (antigo loader).
- A animação do Hero deve iniciar 300ms após a execução do script.
- Não deve haver erros no console por chamadas a elementos do preloader inexistentes.
