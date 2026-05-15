# Design: Limpeza e sanitização balanceada do projeto

## Contexto

O projeto é um site Astro integrado ao Sanity, com assets estáticos em `public/`, assets importados em `src/assets/`, componentes Astro/React em `src/components/` e documentação em `docs/`.

O diagnóstico inicial indicou os principais candidatos a limpeza:

- worktrees antigos em `.worktrees/m2-hero-sobre-eixos` e `.worktrees/redesign-layout`;
- `src/assets/mockups` com aproximadamente 49 MB;
- `src/assets/textures` com aproximadamente 15 MB;
- `public/images` com aproximadamente 19 MB;
- duplicação provável entre texturas em `src/assets/textures` e `public/textures`;
- arquivos de teste/temporários e possíveis componentes/assets não referenciados.

A branch atual é `develop`, dois commits à frente de `origin/develop` no momento do diagnóstico.

## Objetivo

Reduzir o peso do repositório e remover resíduos operacionais sem afetar segurança, performance, rotas públicas ou comportamento visual intencional do site.

## Nível de agressividade aprovado

O usuário aprovou uma abordagem **balanceada** para assets e código morto, com remoção **forçada** de worktrees antigos após registro do estado deles.

Isso significa:

- limpar itens claramente obsoletos;
- otimizar ou remover duplicatas comprovadas;
- manter qualquer item ambíguo;
- validar a aplicação após cada grupo de mudanças;
- não alterar configurações sensíveis nem lógica de runtime sem evidência clara de segurança.

## Abordagem recomendada

### 1. Diagnóstico auditável

Antes de remover arquivos, gerar um relatório com:

- lista de worktrees, branch, commit e alterações locais;
- maiores arquivos e pastas;
- assets referenciados por código;
- duplicatas exatas por hash;
- candidatos a código morto por ausência de imports;
- tamanho total antes da limpeza.

Esse relatório deve orientar as remoções e permitir rastreabilidade, especialmente para worktrees removidos com `--force`.

### 2. Limpeza de worktrees

Para cada worktree registrado:

1. coletar `git status --short --branch` dentro do worktree;
2. registrar branch, commit e arquivos alterados;
3. remover com `git worktree remove --force <path>`;
4. executar `git worktree prune`.

Como o usuário aprovou remoção mesmo com alterações locais, não é necessário pedir nova confirmação para descartar essas alterações, desde que o relatório seja apresentado antes da remoção.

### 3. Limpeza de assets

Priorizar remoção ou consolidação de:

- duplicatas exatas por hash entre `src/assets` e `public`;
- mockups grandes não importados por páginas, componentes, estilos ou layouts;
- texturas pesadas duplicadas ou não referenciadas;
- imagens `.png`/`.jpg` antigas quando houver equivalente `.webp` claramente usado;
- ícones ou fotos não referenciados diretamente e sem indício de uso dinâmico.

Não remover arquivos apenas por nome parecido. A remoção deve se basear em pelo menos um dos critérios:

- hash idêntico;
- ausência de referência e localização em pasta de material bruto/mockup;
- substituição clara por asset otimizado já utilizado no código.

### 4. Limpeza de código morto

Investigar e remover apenas itens com evidência forte, como:

- componentes sem import ou referência;
- páginas temporárias, por exemplo rotas de teste, se não forem intencionais;
- arquivos CSS/font duplicados sem import efetivo;
- imports não usados.

Arquivos com possível referência dinâmica ou relação com Sanity devem permanecer, salvo comprovação contrária.

### 5. Fora do escopo

Para reduzir risco, esta limpeza não deve:

- alterar `.env`, secrets ou credenciais;
- mudar lógica de Sanity, webhooks ou deploy;
- adicionar novas dependências;
- fazer push remoto;
- apagar documentação institucional pesada, como `docs/Guia_Estudio Entre.pdf`, sem confirmação específica;
- alterar comportamento visual por refatoração ampla.

## Validação obrigatória

Após a execução:

1. rodar `bun run check`;
2. rodar `bun run build`;
3. comparar tamanho antes/depois;
4. revisar manualmente as rotas principais:
   - `/`;
   - `/agenda`;
   - `/studio`.

Se alguma validação falhar, a implementação deve corrigir a causa ou reverter a remoção responsável.

## Critérios de sucesso

- Worktrees antigos removidos e `git worktree list` limpo;
- redução mensurável de peso do repositório;
- nenhuma remoção de arquivo sensível;
- nenhuma alteração inesperada em rotas públicas;
- `bun run check` e `bun run build` concluindo com sucesso;
- relatório final com itens removidos, tamanho antes/depois e observações de risco.

## Riscos e mitigação

- **Remover asset ainda usado dinamicamente:** mitigar mantendo arquivos ambíguos e validando build/rotas.
- **Descartar alterações locais em worktrees:** mitigar com relatório prévio de branch, commit e arquivos alterados.
- **Quebrar visual por remoção de imagem/fonte:** mitigar removendo só referências comprovadamente não usadas e revisando rotas principais.
- **Apagar documentação útil:** mitigar mantendo docs institucionais pesados fora do escopo, salvo aprovação explícita.
