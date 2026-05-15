# Spec: Redesign Editorial da Hero Section - Estúdio Entre

## 1. Objetivo
Transformar a Hero Section (componente `Hero.astro`) de um layout de banner convencional para uma composição editorial de "full-impact". O objetivo é criar uma primeira impressão poderosa que utilize a foto vertical do salão de forma elegante, preenchendo o espaço visual de maneira equilibrada e artística, mantendo a consistência com o estilo de papel rasgado.

## 2. Requisitos Visuais
- **Composição 70/30:** O conteúdo textual ocupará aproximadamente 70% da largura, enquanto a imagem ocupará os 30% restantes à direita.
- **Faixa Editorial Vertical:** A imagem `estudio-entre-salao.webp` será apresentada em uma moldura vertical alta, com borda de papel rasgado (`TornPaperFrame`) na lateral esquerda.
- **Escala Ampliada:** O logotipo e a tipografia principal serão aumentados em ~20% para dominar o lado esquerdo e eliminar a sensação de vazio.
- **Preenchimento do Fundo:** Otimização da watermark "E" e elementos decorativos (estrelas, sparks) para servirem como conectores visuais entre texto e imagem.
- **Interação Parallax:** Movimentos sutis de parallax acionados pelo mouse e scroll para dar profundidade às camadas (texto, decorativos e moldura).

## 3. Arquitetura Técnica

### 3.1 Componentes
- **`Hero.astro`**: Reestruturação do grid para `lg:flex-row` com proporções ajustadas.
- **`TornPaperFrame.astro`**: Uso do componente já criado para envolver a imagem da Hero.

### 3.2 Animação (`hero.ts`)
- Ajuste da Timeline GSAP para suportar o novo layout.
- Implementação de parallax diferencial: a coluna da imagem deve se mover em uma velocidade ligeiramente diferente do texto no scroll.
- Refinamento da entrada (reveal) para ser mais "cinematográfica".

## 4. Plano de Verificação
- **Equilíbrio Visual:** Validar se o lado esquerdo não parece "vazio" em telas ultrawide.
- **Responsividade:** No mobile, a imagem deve ser ocultada ou reposicionada para priorizar o CTA e o logo, mantendo a legibilidade.
- **Performance:** Verificar se o aumento da escala do logo e as novas sombras não impactam o LCP (Largest Contentful Paint).

## 5. Próximos Passos
- Atualizar o componente `Hero.astro`.
- Refatorar `src/animations/hero.ts`.
- Validar via browser automation.
