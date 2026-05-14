# Design Spec: Página de Agenda — Estúdio Entre

**Data:** 2026-05-14  
**Status:** Aprovado  
**Escopo:** Criar uma página `/agenda` com eventos futuros cadastrados no Sanity, mantendo a home com uma prévia enxuta.

## 1. Objetivo

Criar uma página de agenda completa para visitantes explorarem os próximos eventos do Estúdio Entre de forma clara, segura e amigável. A experiência deve combinar busca textual, navegação por mês, filtros por categoria e cards expansíveis, sem adicionar complexidade desnecessária ou dependências novas.

## 2. Decisões aprovadas

- Criar uma rota separada `/agenda`.
- Manter a seção `Agenda` da home, mas exibir apenas os 3 próximos eventos e um CTA para a agenda completa.
- Mostrar somente eventos futuros e ativos.
- Usar navegação por mês com botões anterior/próximo e seletor rápido de mês/ano.
- Incluir busca textual e agrupamento visual por data.
- Manter detalhes do evento expansíveis no próprio card/lista, sem página individual de evento nesta etapa.
- Manter o modelo atual de dados: fetch do Sanity no build/deploy, atualizado por webhook/deploy.
- Seguir a abordagem visual “lista editorial com calendário de apoio”.

## 3. Arquitetura proposta

### 3.1 Rota `/agenda`

Adicionar `src/pages/agenda.astro` usando `BaseLayout`, com título e descrição SEO próprios.

A página Astro será responsável por:

- Buscar eventos no Sanity durante o build/deploy.
- Tratar falhas de fetch com log genérico e estado vazio amigável.
- Normalizar os eventos antes de enviá-los para a UI interativa.
- Passar apenas os campos necessários para uma island React da agenda completa.

### 3.2 Home

A seção `src/components/sections/Agenda.astro` deve continuar existindo, mas receber apenas os 3 próximos eventos na home e exibir um CTA para `/agenda`.

A home não deve assumir a responsabilidade de filtros complexos por mês. Ela funciona como vitrine rápida para os próximos encontros.

### 3.3 Island React da agenda completa

Criar ou adaptar uma island dedicada, por exemplo `AgendaPageFilter`, para concentrar:

- Estado do mês selecionado.
- Estado da busca textual.
- Estado da categoria ativa.
- Expansão dos cards.
- Cálculo dos eventos filtrados e agrupados por data.

Essa island recebe dados prontos do Astro; não faz fetch direto ao Sanity.

## 4. Dados e segurança

### 4.1 Query Sanity

Criar uma query específica para eventos futuros, filtrando:

- `_type == "evento"`
- `ativo == true`
- `dataHora >= now()`
- ordenação `dataHora asc`

Campos permitidos:

- `_id`
- `titulo`
- `slug`
- `categoria`
- `dataHora`
- `local`
- `descricao`
- `valor`
- `linkCompra`
- `imagens`

### 4.2 Normalização e validação

Antes de renderizar, normalizar dados para evitar quebra de UI:

- Validar se `dataHora` gera uma data válida.
- Ignorar eventos sem `_id`, `titulo`, `categoria` válida ou `dataHora` válida para impedir cards quebrados.
- Validar categoria contra o conjunto aceito pelo schema/tipos.
- Garantir fallback para strings opcionais (`local`, `descricao`, `valor`).
- Renderizar `linkCompra` apenas se for URL `http` ou `https`.

### 4.3 Renderização segura

- Não usar HTML bruto vindo do Sanity (`set:html` ou equivalente).
- Renderizar textos como conteúdo normal de JSX/Astro.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Erros internos não devem ser expostos na interface do usuário.

### 4.4 Ajuste de tipos/categorias

Há desalinhamento atual entre `CategoriaEvento` e `CATEGORIAS`: o mapeamento contém chaves extras que não fazem parte do tipo/schema. A implementação deve alinhar o tipo, o schema e o mapeamento para evitar erro de typecheck e inconsistência de dados.

## 5. Experiência de usuário

### 5.1 Estado inicial

A página deve abrir no mês mais relevante:

- Se houver eventos no mês atual, abrir no mês atual.
- Caso contrário, abrir no mês do próximo evento futuro.
- Se não houver eventos futuros, exibir estado vazio editorial.

### 5.2 Controles de descoberta

A agenda completa terá:

- Campo de busca com label acessível e placeholder como “Buscar por título, local ou descrição…”.
- Botões de mês anterior/próximo.
- Seletor rápido de mês/ano limitado aos meses que têm eventos futuros cadastrados.
- Filtros de categoria derivados de `CATEGORIAS`, exibindo apenas categorias presentes nos eventos futuros.

### 5.3 Busca textual

A busca deve considerar:

- Título.
- Local.
- Descrição.

Busca e categoria atuam em conjunto.

Se houver resultados em outro mês, mas nenhum no mês atual selecionado, a interface deve mostrar uma mensagem amigável com ação para ir ao primeiro mês com resultado.

### 5.4 Lista agrupada por data

Eventos do mês selecionado devem ser agrupados por dia, com destaque para:

- Dia do mês.
- Dia da semana.
- Horário.
- Categoria.
- Título.
- Local, quando houver.

Os detalhes do evento ficam dentro do card expansível com “Ver mais/Ver menos”.

### 5.5 Estados vazios

Prever mensagens para:

- Nenhum evento futuro cadastrado.
- Nenhum evento no mês selecionado.
- Nenhum resultado para a busca/filtros atuais.

Cada estado deve oferecer uma ação clara quando fizer sentido, como limpar filtros ou mudar de mês.

## 6. Direção visual

Adotar a opção aprovada: **lista editorial com calendário de apoio**.

Diretrizes:

- Usar linguagem editorial premium já presente no site.
- Priorizar leitura dos eventos, com calendário e filtros como suporte.
- Usar paleta oficial: creme, verde floresta, bordô, laranja e cores de categorias.
- Reutilizar elementos existentes como `HalftoneTexture` e `Decorative` com moderação.
- Evitar calendário em grade interativa complexa nesta etapa; a navegação por mês e lista agrupada é mais simples e acessível.

## 7. Acessibilidade

- Controles de filtro e mês devem ser elementos `button` ou campos nativos apropriados.
- Campo de busca deve ter label acessível.
- Cards expansíveis devem indicar estado com `aria-expanded`.
- Estados ativos de filtros/mês devem ser perceptíveis por texto/estado, não apenas por cor.
- A experiência deve funcionar por teclado.
- Layout mobile deve ter áreas de toque confortáveis.

## 8. Fora de escopo nesta etapa

- Páginas individuais de evento (`/agenda/[slug]`).
- Arquivo de eventos passados.
- Filtros por gratuito/pago ou presencial/online, pois exigiriam campos adicionais no Sanity.
- Fetch client-side direto ao Sanity.
- Nova biblioteca de calendário.

## 9. Critérios de aceitação

- `/agenda` existe e renderiza eventos futuros ativos do Sanity.
- A home mostra apenas os 3 próximos eventos e link para `/agenda`.
- Usuário consegue navegar por mês com anterior/próximo e seletor mês/ano.
- Usuário consegue pesquisar por título, local ou descrição.
- Usuário consegue filtrar por categoria.
- Eventos aparecem agrupados por data.
- Cards de evento expandem/recolhem detalhes sem navegação para outra página.
- Links externos de compra/inscrição são validados e seguros.
- Dados vindos do Sanity são normalizados antes da UI.
- Não há uso de HTML bruto vindo do Sanity.
- `bun run check` passa.
- `bun run build` passa.
- Verificação manual cobre `/`, `/agenda`, responsividade, filtros, busca e estados vazios.

## 10. Riscos e mitigação

- **Categoria inválida no Sanity:** validar contra categorias aceitas e corrigir alinhamento entre schema/tipos/mapeamento.
- **Eventos sem dados opcionais:** usar fallbacks e renderização condicional.
- **Mês selecionado sem eventos após filtro:** exibir estado vazio claro e ação para limpar filtros ou ir ao mês com resultado.
- **Busca confusa quando resultado está em outro mês:** oferecer ação explícita para navegar até o primeiro mês com resultado.
- **Complexidade visual em mobile:** priorizar lista, controles empilhados e botões grandes.
