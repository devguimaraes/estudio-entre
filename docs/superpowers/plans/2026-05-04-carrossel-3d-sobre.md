# Carrossel Vertical 3D - Seção Sobre Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir as imagens estáticas da seção "Sobre" por um carrossel vertical 3D rotativo utilizando GSAP e CSS 3D Transforms.

**Architecture:** Implementação de um container com perspectiva 3D contendo um "wheel" (roda) rotacionado via GSAP. Os itens são posicionados radialmente no eixo X usando `rotateX` e `translateZ`.

**Tech Stack:** Astro, GSAP (ScrollTrigger), CSS 3D.

---

### Task 0: Atualização dos Dados e Máscaras

**Files:**
- Modify: `src/components/sections/Sobre.astro`
- Modify: `src/components/ui/BlobMask.astro`

- [ ] **Step 1: Adicionar variantes irregulares ao BlobMask.astro** (Já realizado conforme discussão)
- [ ] **Step 2: Atualizar array imagensSobre em Sobre.astro**

```astro
const imagensSobre = [
  {
    src: "/images/brand/fundadora-thayna.jpg",
    label: "Thayná",
    variant: 5 as const,
    width: "220px",
    mdWidth: "300px",
  },
  {
    src: "/images/brand/fundadora-valdete.jpg",
    label: "Valdete",
    variant: 6 as const,
    width: "200px",
    mdWidth: "280px",
  },
  {
    src: "/images/brand/fundadoras-encontro.jpg",
    label: "O Encontro",
    variant: 7 as const,
    width: "240px",
    mdWidth: "320px",
  },
  {
    src: "/images/brand/fundadora-detalhe.jpg",
    label: "Essência",
    variant: 5 as const,
    width: "180px",
    mdWidth: "250px",
  },
  {
    src: "/images/brand/detalhe-afeto.jpg",
    label: "Afeto",
    variant: 6 as const,
    width: "150px",
    mdWidth: "200px",
  },
];
```

### Task 1: Preparação de Estilos e Estrutura Base

**Files:**
- Modify: `src/components/sections/Sobre.astro`

- [ ] **Step 1: Atualizar a estrutura HTML da seção Sobre**

Substituir o bloco da galeria atual pela nova estrutura de carrossel.

```astro
<!-- Gallery Column (Carousel 3D) -->
<div class="w-full lg:w-1/2 relative min-h-[600px] lg:min-h-[800px] flex items-center justify-center sobre__carousel-container">
  <div class="sobre__carousel-wheel relative w-[280px] h-[380px] preserve-3d">
    {
      imagensSobre.map((img, index) => (
        <div
          class="sobre__carousel-item absolute inset-0 backface-hidden"
          style={`--index: ${index};`}
        >
          <div class="relative group cursor-pointer h-full">
            <BlobMask variant={img.variant} class="h-full">
              <img
                src={img.src}
                alt={img.label}
                class="w-full h-full object-cover"
              />
            </BlobMask>
          </div>
        </div>
      ))
    }
  </div>
</div>
```

- [ ] **Step 2: Adicionar classes CSS utilitárias para 3D**

No bloco `<style>` do `Sobre.astro`, adicionar suporte a 3D e posicionamento radial.

```css
  .sobre__carousel-container {
    perspective: 1200px;
  }

  .preserve-3d {
    transform-style: preserve-3d;
  }

  .backface-hidden {
    backface-visibility: hidden;
  }

  .sobre__carousel-item {
    /* 5 itens: 360 / 5 = 72 graus de separação */
    /* O translateZ deve ser calculado com base no tamanho do card para formar o círculo */
    transform: rotateX(calc(var(--index) * 72deg)) translateZ(300px);
  }

  @media (max-width: 1023px) {
    .sobre__carousel-container {
      perspective: none;
      min-height: auto;
    }
    .sobre__carousel-wheel {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      width: 100%;
      height: auto;
      transform: none !important;
      transform-style: flat;
    }
    .sobre__carousel-item {
      position: relative !important;
      transform: none !important;
      width: 100% !important;
    }
  }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Sobre.astro
git commit -m "feat(sobre): add 3D carousel structure and base styles"
```

---

### Task 2: Implementação da Animação GSAP

**Files:**
- Modify: `src/animations/sobre.ts`

- [ ] **Step 1: Implementar a rotação infinita e pause on hover**

Substituir a lógica antiga de revelação de imagens pela lógica do carrossel.

```typescript
  // 4) Carousel 3D Animation
  const container = document.querySelector<HTMLElement>(".sobre__carousel-container");
  const wheel = document.querySelector<HTMLElement>(".sobre__carousel-wheel");
  const carouselItems = document.querySelectorAll<HTMLElement>(".sobre__carousel-item");

  if (container && wheel && carouselItems.length > 0) {
    // Revelação inicial
    tl.fromTo(
      carouselItems,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: "back.out(1.7)" },
      "-=1.2"
    );

    // Rotação contínua
    const rotation = gsap.to(wheel, {
      rotationX: "-=360",
      duration: 25,
      repeat: -1,
      ease: "none",
      paused: false
    });

    // Pause on Hover com suavidade
    container.addEventListener("mouseenter", () => {
      gsap.to(rotation, { timeScale: 0, duration: 0.8, ease: "power2.out" });
    });

    container.addEventListener("mouseleave", () => {
      gsap.to(rotation, { timeScale: 1, duration: 1.2, ease: "power2.in" });
    });
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/animations/sobre.ts
git commit -m "feat(sobre): implement infinite 3D rotation and pause on hover"
```

---

### Task 3: Ajustes de Refinamento e Responsividade

**Files:**
- Modify: `src/components/sections/Sobre.astro`

- [ ] **Step 1: Ajustar min-height e espaçamento para mobile**

Garantir que a transição entre 3D e Grid seja limpa.

```css
  @media (max-width: 1023px) {
    .sobre__carousel-container {
      display: block; /* Remove flex center */
      margin-top: 3rem;
    }
    .sobre__carousel-wheel {
      transform-style: flat;
    }
  }
```

- [ ] **Step 2: Verificar importação de GSAP e ScrollTrigger**

Garantir que `gsap` e `ScrollTrigger` estão sendo usados corretamente no arquivo de animação.

- [ ] **Step 3: Commit final**

```bash
git add src/components/sections/Sobre.astro
git commit -m "style(sobre): refine mobile layout and 3D transitions"
```
