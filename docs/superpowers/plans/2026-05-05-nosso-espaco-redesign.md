# Redesign da Galeria "Nosso Espaço" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a galeria "Nosso Espaço" para um estilo de mural de fotos de papel rasgado, preservando a integridade das imagens originais.

**Architecture:** Criação de um componente wrapper `TornPaperFrame.astro` que aplica molduras irregulares e sombras, substituindo o uso de `BlobMask` na galeria para evitar cortes agressivos.

**Tech Stack:** Astro, TailwindCSS, CSS Clip-path, GSAP.

---

### Task 1: Criar o Componente TornPaperFrame

**Files:**
- Create: `src/components/ui/TornPaperFrame.astro`

- [ ] **Step 1: Implementar a estrutura base do componente**

```astro
---
interface Props {
  variant?: 1 | 2 | 3 | 4;
  rotation?: string;
  class?: string;
}

const { variant = 1, rotation = "0deg", class: className = "" } = Astro.props;

// Polígonos que simulam papel rasgado (quase retangulares mas com irregularidades nas bordas)
const variants = {
  1: "polygon(1% 2%, 99% 1%, 98% 97%, 2% 99%)",
  2: "polygon(2% 1%, 98% 2%, 99% 98%, 1% 97%)",
  3: "polygon(1% 1%, 97% 2%, 100% 99%, 2% 98%)",
  4: "polygon(0% 2%, 98% 0%, 99% 98%, 1% 100%)",
};

const clipPath = variants[variant as keyof typeof variants];
---

<div 
  class={`relative p-4 bg-white shadow-xl ${className}`}
  style={`clip-path: ${clipPath}; transform: rotate(${rotation}); filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));`}
>
  <div class="relative w-full h-full overflow-hidden" style="clip-path: polygon(1% 1%, 99% 1%, 99% 99%, 1% 99%);">
    <slot />
  </div>
</div>
```

- [ ] **Step 2: Verificar renderização básica**
Validar se o componente aceita um slot e aplica o estilo de moldura.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/TornPaperFrame.astro
git commit -m "feat(ui): add TornPaperFrame component for gallery redesign"
```

---

### Task 2: Refatorar Galeria.astro

**Files:**
- Modify: `src/components/sections/Galeria.astro`

- [ ] **Step 1: Atualizar imports e estrutura de mapeamento**

Substituir `BlobMask` por `TornPaperFrame` e adicionar a lógica de rotação aleatória.

```astro
---
import TornPaperFrame from "@/components/ui/TornPaperFrame.astro";
// ... imagens array ...

// Função utilitária para rotação aleatória leve
const getRotation = (i: number) => {
  const angles = ["-1.5deg", "1.2deg", "-0.8deg", "2deg", "-2.1deg"];
  return angles[i % angles.length];
};
---

// No loop:
<div class="galeria__item w-[300px] md:w-[450px] flex-shrink-0">
  <div class="relative group h-[400px] md:h-[600px]">
    <TornPaperFrame 
      variant={((i % 4) + 1) as any} 
      rotation={getRotation(i)}
      class="w-full h-full"
    >
       <img
        src={img.src}
        alt={img.alt}
        class="w-full h-full object-cover transition-all duration-700 scale-[1.05]"
        loading="lazy"
      />
    </TornPaperFrame>
    // ... label ...
  </div>
</div>
```

- [ ] **Step 2: Ajustar estilos de animação e espaçamento**
Garantir que as sombras do drop-shadow não sejam cortadas pelo container do marquee.

- [ ] **Step 3: Validar no navegador**
Usar `agent-browser` para verificar se as fotos estão completas e sem cortes indesejados.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Galeria.astro
git commit -m "refactor(galeria): switch to TornPaperFrame and fix layout"
```

---

### Task 3: Polimento Final e Verificação

- [ ] **Step 1: Verificar performance mobile**
Garantir que a animação de marquee continua fluida com os novos efeitos de sombra.

- [ ] **Step 2: Build de produção**
Executar `bun run build` para garantir que não há erros de tipagem ou caminhos.

- [ ] **Step 3: Commit final**

```bash
git commit --allow-empty -m "fix(galeria): final polish for Nosso Espaço redesign"
```
