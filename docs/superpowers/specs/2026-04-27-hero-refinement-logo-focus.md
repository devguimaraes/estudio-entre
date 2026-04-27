# Design Spec: Refino do Hero — Foco no Logo e Nova Tagline

**Data:** 2026-04-27  
**Status:** Aprovado pelo Usuário  
**Tópico:** Ajuste de escala do Hero para destacar o Logo e atualizar a mensagem institucional.

---

## 1. Visão Geral
Ajustar as proporções do Hero para que o Logo seja o protagonista visual, reduzindo a escala da tagline e atualizando seu conteúdo para a descrição do Instagram. A harmonia deve ser mantida através de tipografia refinada e equilíbrio de espaços em branco.

## 2. Elementos Visuais

### 2.1 Logo
- **Arquivo:** `Logo_Estudio Entre - Claro 2.png`.
- **Escala:** `max-w-[320px]` (mobile) a `max-w-[500px]` (desktop).
- **Posicionamento:** Centralizado.

### 2.2 Tagline (Nova)
- **Texto:** "Espaço cultural independente: encontros, palavra e som."
- **Tipografia:** Buvera.
- **Estilo:** 
    - Parte 1 ("Espaço cultural independente"): Regular ou Medium, uppercase, tracking alto.
    - Parte 2 ("encontros, palavra e som"): Italic, case normal ou lowercase, para um ar mais poético.
- **Escala:** `text-sm` a `text-base` (muito mais discreta que a anterior).
- **Margem:** `mt-8` a `mt-10` abaixo do logo.

---

## 3. Animação (GSAP)
- **Portal:** Manter o efeito da Chave escalando para revelar o conteúdo.
- **Reveal de Conteúdo:**
    1. O Logo aparece primeiro (fade + scale up sutil).
    2. A tagline aparece logo abaixo com um fade suave e um leve deslocamento vertical (`y: 20` para `0`).

---

## 4. Estrutura de Arquivos Afetados
- `src/components/sections/Hero.astro`: Atualizar HTML e Tailwind classes.
- `src/animations/hero.ts`: Ajustar a timeline para a nova hierarquia e tempos de reveal.

---

## 5. Critérios de Sucesso
- O Logo deve ser o elemento que mais chama a atenção.
- A tagline deve ser perfeitamente legível, mas não deve competir visualmente com o Logo.
- A composição deve parecer editorial e limpa.
