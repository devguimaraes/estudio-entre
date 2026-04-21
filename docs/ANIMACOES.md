# Animações GSAP + Lenis — Documentação

Sistema de animações global do site Estúdio Entre usando GSAP 3 + Lenis smooth scroll.

---

## Estrutura

```
src/animations/
├── init.ts    # Inicialização do Lenis e ScrollTrigger
└── utils.ts   # Utilitários de animação reutilizáveis
```

---

## Inicialização

O sistema é inicializado automaticamente no `BaseLayout.astro`:

```astro
<script>
  import { initAnimations } from "../animations/init";
  initAnimations();
</script>
```

Isso configura:
- **Lenis**: Smooth scroll com duração de 1.2s
- **ScrollTrigger**: Integrado com Lenis
- **GSAP defaults**: `power2.out`, `0.5s`

---

## Utilitários Disponíveis

### `fadeIn(element, options?)`

Animação de fade in simples.

```typescript
fadeIn("#meu-elemento", {
  duration: 0.6,
  delay: 0,
  from: 0,
  scrollTrigger: true
});
```

### `slideUp(element, options?)`

Elemento sobe de baixo para cima com fade.

```typescript
slideUp(".minha-classe", {
  duration: 0.8,
  delay: 0,
  distance: 50,
  stagger: 0.1,  // Para múltiplos elementos
  scrollTrigger: true
});
```

### `scaleIn(element, options?)`

Animação de zoom in.

```typescript
scaleIn("#box", {
  duration: 0.6,
  from: 0.8,
  scrollTrigger: true
});
```

### `parallax(element, options?)`

Efeito parallax simples.

```typescript
parallax(".parallax-bg", {
  speed: 0.5,
  start: "top bottom",
  end: "bottom top",
  scrub: true
});
```

### `textReveal(element, options?)`

Texto animado caractere por caractere.

```typescript
textReveal("h1", {
  duration: 0.5,
  stagger: 0.02,
  scrollTrigger: true
});
```

### `pinElement(element, options?)`

Fixa elemento durante scroll.

```typescript
pinElement("#secao-pinned", {
  start: "top top",
  end: "+=100%",
  scrub: true
});
```

---

## Exemplo de Uso em Componente

```astro
---
// MeuComponente.astro
---

<section class="min-h-screen">
  <h2 id="titulo">Título Animado</h2>
  <div class="cards">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </div>
</section>

<script>
  import { slideUp, textReveal } from "@/animations/utils";

  document.addEventListener("astro:page-load", () => {
    // Texto animado
    textReveal("#titulo");

    // Cards com stagger
    slideUp(".card", { stagger: 0.15 });
  });
</script>
```

---

## Preferências de Redução de Movimento

O sistema respeita `prefers-reduced-motion` automaticamente via CSS.

Adicione ao `global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance

- **GSAP**: ~100KB gzipped (incluindo plugins)
- **Lenis**: ~10KB gzipped
- Total: ~110KB adicionais ao bundle

Otimizações aplicadas:
- Code splitting automático do Astro
- ScrollTrigger apenas quando necessário
- tree-shaking de funções não utilizadas

---

## Troubleshooting

### Animações não funcionam

1. Verifique se `initAnimations()` foi chamado no BaseLayout
2. Confirme que GSAP e Lenis estão instalados
3. Veja o console do navegador para erros

### ScrollTrigger não dispara

1. Verifique se o elemento tem altura suficiente
2. Confirme que o `start` do ScrollTrigger está correto
3. Teste com valores diferentes (ex: `"top 80%"`)

### Lenis não está funcionando

1. Verifique se não há CSS `overflow: hidden` no body
2. Confirme que não há outro smooth scroll ativo
3. Teste com `lenis.start()` no console

---

## Referências

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger/)
- [Lenis Documentation](https://github.com/studio-freight/lenis)
- [Astro Integration](https://docs.astro.build/en/guides/integrations-guide/)
