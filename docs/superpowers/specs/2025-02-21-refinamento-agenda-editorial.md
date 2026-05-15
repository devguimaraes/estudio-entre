# Spec: Refinamento da Agenda Cultural — Estúdio Entre (Editorial Refinado)

**Data:** 21 de Fevereiro de 2025  
**Status:** Aguardando Revisão do Usuário  
**Autor:** Gemini CLI  
**Tópico:** Refinamento de UI/UX da página de Agenda (Estética Editorial / Premium)

---

## 1. Objetivo e Visão Geral
Refinar a página de agenda para uma estética **Editorial Refinada**, focada em sofisticação, legibilidade e fluidez. Diferente da abordagem anterior, esta prioriza formas orgânicas, sombras suaves e um layout que respira, alinhado com a proposta de "hub cultural acolhedor".

## 2. Requisitos de Design (UI)

### 2.1 Estética Geral
- **Estilo:** Editorial / Magazine Modern.
- **Cores:** Paleta quente e equilibrada (`Cream`, `Forest`, `Orange`).
- **Fundo:** `bg-cream` com uma textura de ruído (noise filter) ultra-sutil (opacity 0.05) para remover o aspecto digital "chapado".
- **Bordas:** Ausência de bordas escuras. O contraste será feito por sombras e variação de tons.
- **Formas:** Cantos extremamente arredondados (`rounded-[2.5rem]`) para containers e cards.
- **Sombras:** Sombras multi-camadas profundas e suaves (`shadow-2xl shadow-forest/5`).

### 2.2 Componentes Principais

#### A. Navegação de Meses (Minimal Timeline)
- Lista horizontal de meses em caixa alta, com tipografia `Buvera Black` em tamanho reduzido (11px).
- Indicador de mês ativo: Underline elegante em `Orange` ou pílula sutil.
- Scroll horizontal suave para dispositivos móveis.

#### B. Hierarquia de Datas
- A data e o dia da semana aparecem de forma elegante ao lado do card, usando a tipografia `Buvera` de forma limpa, sem blocos sólidos de cor.
- Foco em tipografia `Forest` com opacidades variadas para criar hierarquia (Ex: Número em 100%, Dia em 40%).

#### C. Event Card Polido
- **Layout:** Flex ou Grid dependendo da tela, priorizando o equilíbrio entre imagem e texto.
- **Imagem:** Cantos arredondados (`rounded-2xl`) dentro do card, com um leve "overlay" se necessário para legibilidade.
- **Conteúdo:** Títulos em `Buvera Black` (não itálico por padrão, ou itálico apenas para ênfase). Badges de categoria com cantos arredondados e cores suaves.

#### D. Filtros e Busca
- Inputs e botões com bordas muito finas e tons neutros, ganhando destaque apenas quando necessário.

## 3. Experiência do Usuário (UX) & Interatividade

### 3.1 Animações (GSAP)
- **Entrance:** Fade-in suave com deslocamento vertical positivo (`y: 20 -> 0`) em cascata (stagger).
- **Hover:** Micro-interações de escala (1.01) e aumento sutil da profundidade da sombra.
- **Transição de Meses:** Os cards antigos deslizam para fora e os novos entram suavemente, sem saltos de layout.

### 3.2 Detalhes Decorativos
- Assets (estrelas/pontos) com animação de flutuação (floating) e profundidade (parallax) durante o scroll.

## 4. Arquitetura Técnica
- **Astro/React:** Manutenção da estrutura de Islands.
- **Tailwind:** Uso de classes utilitárias para sombras e arredondamento personalizado.
- **GSAP:** Orquestração das animações de entrada e troca de estado.

## 5. Próximos Passos
1. Aprovação desta especificação pelo usuário.
2. Elaboração do plano de implementação detalhado.
3. Execução focada no polimento e "cuidado" visual.

---

## Auto-Revisão da Spec
- [x] **Placeholder scan:** Sem lacunas.
- [x] **Internal consistency:** Estilo consistente em todos os pontos.
- [x] **Scope check:** Focado apenas no refinamento visual da agenda.
- [x] **Ambiguity check:** Comportamentos de sombra e arredondamento definidos.
