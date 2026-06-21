# Sebo — Redesign do Painel de Filtros

## 1. Contexto e Problema

A seção de filtros da página `/sebo` foi implementada com todas as categorias (19 gêneros) expostas como pills em `flex-wrap`, ao lado de uma busca limitada a `max-w-xl`. Isso gerou três problemas visuais:

1. **Busca pequena**: o campo de busca fica estreito e sem destaque.
2. **Categorias mal organizadas**: 19 pills quebram em várias linhas, deixando o painel alto e confuso.
3. **Falta de hierarquia visual**: não há distinção entre gêneros populares e gêneros secundários.

## 2. Objetivo

Reformular o painel de filtros do Sebo para:

- Destacar a busca como elemento principal.
- Reduzir a poluição visual sem esconder funcionalidade.
- Manter acesso rápido aos gêneros mais populares.
- Oferecer acesso completo aos 19 gêneros via popover premium.
- Preservar a identidade visual editorial do site.

## 3. Decisões de Design

### 3.1 Layout geral (Opção A aprovada)

O painel mantém o card branco translúcido com borda arredondada, mas adota um **layout vertical**:

1. **Busca no topo**, ocupando 100% da largura, com label "Garimpar no acervo" e input maior.
2. **Filtros abaixo da busca**, alinhados à esquerda, contendo:
   - Pill "Todos · 45" (pré-selecionado).
   - Pills dos top 4 gêneros: Romance, Biografia, Auto Ajuda, Poesia.
   - Trigger "Todos os gêneros" que abre o popover completo.

### 3.2 Gêneros principais

Os 4 gêneros com maior contagem no acervo serão exibidos como pills fixos:

| Gênero | Contagem |
|--------|----------|
| Romance | 17 |
| Biografia | 5 |
| Auto Ajuda | 3 |
| Poesia | 2 |

A contagem é dinâmica e calculada a partir da prop `livros`.

### 3.3 Popover de gêneros (Opção 1 aprovada)

- Acionado por **click** no trigger "Todos os gêneros".
- Painel flutuante com fundo branco translúcido, `backdrop-blur`, borda arredondada e sombra editorial.
- **Grid de pills coloridos** exibindo todos os 19 gêneros (incluindo os top 4).
- Cada gênero usa sua cor definida em `CORES_GENERO` e exibe a contagem.
- Gênero ativo recebe destaque visual adicional (ring, escala ou borda).
- Fecha ao clicar fora, pressionar `ESC` ou selecionar um gênero.
- No mobile, transforma-se em **bottom sheet** deslizando da base da tela.

## 4. Estados e Comportamento

### 4.1 Estado padrão

- "Todos" está ativo.
- Top 4 gêneros visíveis como pills.
- Trigger "Todos os gêneros" visível.
- Todos os livros são exibidos no grid.

### 4.2 Estado filtrado

Ao clicar em qualquer gênero (pill principal ou no popover):

- Os pills de navegação rápida ("Todos" + top 4) são substituídos por:
  - Um único pill destacado com o gênero ativo (cor do `CORES_GENERO`).
  - Botão "Limpar" para voltar ao estado padrão.
- O trigger "Todos os gêneros" permanece visível para permitir troca direta de gênero.
- O grid de livros é filtrado.
- A busca textual continua funcionando combinada ao gênero ativo.

### 4.3 Busca

- Filtra por título, autor e editora.
- Normaliza texto removendo acentos e caixa.
- Funciona independentemente do gênero selecionado.

### 4.4 Estado vazio

Mantido o estado vazio atual: mensagem "Nenhum livro encontrado" com botão "Limpar filtros".

## 5. Estilo Visual

### 5.1 Pills

- Tipografia: Buvera Black, uppercase, tracking amplo (`tracking-[0.2em]`).
- Inativo: fundo branco, borda bordô 10%, texto bordô 60%.
- Ativo: cor própria do gênero (`CORES_GENERO`), texto creme (`#F0EDE8`) ou near-black (`#1A1612`) quando o fundo for claro (Biografia, Literatura Juvenil, Infantil/Paradidático).
- Hover: leve elevação e mudança de borda.

### 5.2 Popover

- Fundo: `bg-white/70` com `backdrop-blur-md`.
- Borda: `border-white/60`.
- Borda arredondada: `rounded-[2rem]`.
- Sombra: `shadow-2xl shadow-bordo/10`.
- Grid responsivo: 2 colunas mobile, 3 colunas tablet, 4 colunas desktop.
- Header com título "Escolha um gênero" e botão de fechar.

### 5.3 Busca

- Input com largura total dentro do painel.
- Altura aumentada (`py-5` no desktop).
- Fundo sutil (`bg-bordo/[0.03]`), borda inferior bordô 10%.
- Focus: borda laranja e fundo branco.
- Ícone de lupa à direita.

## 6. Mobile

- Busca ocupa 100% da largura.
- Pills principais e trigger quebram em múltiplas linhas conforme necessário.
- Popover vira bottom sheet fixado na base da viewport com `max-h-[80vh]` e scroll interno.

## 7. Animações

- Pills: transição suave de cores, borda e transform.
- Popover: animação de abertura com fade + scale, fechamento com fade.
- Bottom sheet mobile: slide up/down.
- Grid de livros: mantida animação GSAP de entrada ao trocar filtro ou buscar.
- `prefers-reduced-motion`: transições e animações desabilitadas.

## 8. Acessibilidade

- Trigger do popover usa `aria-expanded`, `aria-controls` e `role="button"`.
- Popover usa `role="dialog"` e `aria-label="Escolha um gênero"`.
- Foco travado dentro do popover quando aberto.
- Navegação por teclado: `Tab`, `Enter`, `ESC`.
- Pills usam `aria-pressed` para indicar estado ativo.
- `prefers-reduced-motion` respeitado em todas as animações.

## 9. Arquivos Afetados

| Arquivo | Alteração |
|---------|-----------|
| `src/components/islands/SeboFilter.tsx` | Redesign completo do painel de filtros, popover, estados e comportamento. |
| `src/types/sebo.ts` | Possível ajuste na definição de cores para garantir contraste (nenhuma mudança estrutural esperada). |

## 10. Fora do Escopo

- Mudanças no grid de livros (cards permanecem iguais).
- Mudanças na página `sebo.astro` (layout externo permanece igual).
- Integração com API/backend (dados continuam vindo do JSON estático).
- Alterações no CMS Sanity.
