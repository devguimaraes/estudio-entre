# Limpeza e Sanitização do Projeto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduzir o peso do repositório e remover resíduos operacionais com rastreabilidade, sem afetar segurança, performance, rotas públicas ou comportamento visual intencional.

**Architecture:** A execução será auditável e incremental: primeiro gera relatórios de estado, depois remove worktrees antigos, depois limpa assets/código morto com evidência forte, validando a aplicação ao final. Arquivos ambíguos permanecem para evitar regressões.

**Tech Stack:** Astro 6, Bun, Biome, Git worktrees, shell utilities (`git`, `du`, `sort`, `sha256sum`, `comm`) e validação com `bun run check`/`bun run build`.

---

## Estrutura de arquivos

- Criar: `docs/superpowers/reports/2026-05-15-cleanup-audit.md`
  - Relatório auditável com estado dos worktrees, maiores arquivos, duplicatas, candidatos a remoção e resumo antes/depois.
- Modificar/remover conforme auditoria:
  - `.worktrees/m2-hero-sobre-eixos`
  - `.worktrees/redesign-layout`
  - arquivos de `src/assets/mockups/` não referenciados;
  - duplicatas exatas entre `src/assets/` e `public/`;
  - páginas/componentes temporários somente se comprovadamente não usados.
- Não modificar:
  - `.env`, `.env.local`, `.env.*.local`;
  - lógica de Sanity/webhook/deploy;
  - `docs/Guia_Estudio Entre.pdf`, salvo aprovação explícita posterior;
  - arquivos com referência dinâmica ou ambígua.

---

### Task 1: Gerar relatório inicial de auditoria

**Files:**
- Create: `docs/superpowers/reports/2026-05-15-cleanup-audit.md`

- [ ] **Step 1: Criar diretório de relatórios se necessário**

Run:

```bash
mkdir -p "docs/superpowers/reports"
```

Expected: comando conclui sem erro.

- [ ] **Step 2: Registrar estado git principal**

Run:

```bash
{
  printf '# Relatório de limpeza e sanitização - 2026-05-15\n\n'
  printf '## Estado inicial do repositório\n\n'
  printf '```text\n'
  git status --short --branch
  printf '\n'
  git log --oneline -5
  printf '```\n\n'
} > "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: o arquivo `docs/superpowers/reports/2026-05-15-cleanup-audit.md` passa a existir com status e commits recentes.

- [ ] **Step 3: Registrar worktrees e status de cada um**

Run:

```bash
{
  printf '## Worktrees antes da limpeza\n\n'
  printf '```text\n'
  git worktree list
  printf '```\n\n'

  for path in ".worktrees/m2-hero-sobre-eixos" ".worktrees/redesign-layout"; do
    printf '### `%s`\n\n' "$path"
    if [ -d "$path" ]; then
      printf '```text\n'
      git -C "$path" status --short --branch
      printf '\n'
      git -C "$path" log --oneline -3
      printf '```\n\n'
    else
      printf 'Worktree não encontrado no filesystem.\n\n'
    fi
  done
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório contém branch, status e últimos commits de cada worktree existente.

- [ ] **Step 4: Registrar maiores arquivos e pastas**

Run:

```bash
{
  printf '## Maiores arquivos e pastas antes da limpeza\n\n'
  printf '```text\n'
  du -ah public src/assets docs | sort -hr | head -60
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório mostra os maiores itens, incluindo `src/assets/mockups`, `src/assets/textures`, `public/images` e docs pesados.

- [ ] **Step 5: Registrar referências conhecidas a assets no código**

Run:

```bash
{
  printf '## Referências a assets no código\n\n'
  printf '```text\n'
  rg '(/images/|/logos/|/icons/|/fonts/|@/assets|src/assets|\.webp|\.jpg|\.png|\.svg)' src --glob '*.{astro,tsx,ts,css}' || true
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório lista referências diretas a assets. Se `rg` não encontrar algo, o comando ainda conclui por causa de `|| true`.

- [ ] **Step 6: Registrar duplicatas exatas por hash**

Run:

```bash
{
  printf '## Duplicatas exatas por hash em assets\n\n'
  printf '```text\n'
  tmp_hashes="/tmp/estudio-entre-asset-hashes.txt"
  find public src/assets -type f \( -name '*.webp' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' -o -name '*.svg' -o -name '*.woff2' -o -name '*.ttf' -o -name '*.otf' \) -print0 \
    | xargs -0 sha256sum \
    | sort > "$tmp_hashes"
  awk '{ count[$1]++; lines[$1]=lines[$1] "\n" $0 } END { for (hash in count) if (count[hash] > 1) print lines[hash] "\n" }' "$tmp_hashes"
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório lista grupos de arquivos com hash idêntico, se existirem.

- [ ] **Step 7: Commitar relatório inicial**

Run:

```bash
git add "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
git commit -m "docs(cleanup): add initial sanitization audit"
```

Expected: commit criado com o relatório inicial. Se não houver mudanças, não criar commit vazio.

---

### Task 2: Remover worktrees antigos com rastreabilidade

**Files:**
- Modify: `docs/superpowers/reports/2026-05-15-cleanup-audit.md`
- Remove via git worktree: `.worktrees/m2-hero-sobre-eixos`
- Remove via git worktree: `.worktrees/redesign-layout`

- [ ] **Step 1: Confirmar relatório prévio de worktrees no arquivo**

Run:

```bash
rg '## Worktrees antes da limpeza|\.worktrees/m2-hero-sobre-eixos|\.worktrees/redesign-layout' "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: saída contém as duas paths de worktree e a seção de worktrees antes da limpeza.

- [ ] **Step 2: Remover worktree `m2-hero-sobre-eixos`**

Run:

```bash
if git worktree list | rg -q '\.worktrees/m2-hero-sobre-eixos'; then
  git worktree remove --force ".worktrees/m2-hero-sobre-eixos"
fi
```

Expected: worktree removido ou comando não faz nada se ele não existir mais.

- [ ] **Step 3: Remover worktree `redesign-layout`**

Run:

```bash
if git worktree list | rg -q '\.worktrees/redesign-layout'; then
  git worktree remove --force ".worktrees/redesign-layout"
fi
```

Expected: worktree removido ou comando não faz nada se ele não existir mais.

- [ ] **Step 4: Prunar metadados de worktree**

Run:

```bash
git worktree prune
```

Expected: comando conclui sem erro.

- [ ] **Step 5: Registrar estado pós-remoção no relatório**

Run:

```bash
{
  printf '## Worktrees depois da limpeza\n\n'
  printf '```text\n'
  git worktree list
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório mostra apenas o worktree principal ou qualquer worktree remanescente intencional.

- [ ] **Step 6: Commitar remoção de worktrees e atualização de relatório**

Run:

```bash
git add "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
git commit -m "chore(cleanup): remove stale worktrees"
```

Expected: commit criado com atualização do relatório. Se a remoção de worktrees não alterar arquivos versionados além do relatório, o commit contém apenas o relatório.

---

### Task 3: Remover duplicatas exatas e mockups brutos não usados

**Files:**
- Modify: `docs/superpowers/reports/2026-05-15-cleanup-audit.md`
- Potentially delete: files under `src/assets/mockups/`
- Potentially delete: exact duplicates under `src/assets/textures/` or `public/textures/`

- [ ] **Step 1: Listar arquivos versionados em mockups**

Run:

```bash
{
  printf '## Arquivos versionados em src/assets/mockups\n\n'
  printf '```text\n'
  git ls-files 'src/assets/mockups/*'
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório registra todos os mockups versionados antes de qualquer remoção.

- [ ] **Step 2: Verificar referências aos mockups**

Run:

```bash
{
  printf '## Referências a mockups no código\n\n'
  printf '```text\n'
  rg 'Mockup_|src/assets/mockups|@/assets/mockups' src docs --glob '*.{astro,tsx,ts,css,md}' || true
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: se não houver referências em código/planos relevantes, saída fica vazia dentro do bloco.

- [ ] **Step 3: Remover mockups brutos se não houver referência de runtime**

Run:

```bash
if ! rg -q 'Mockup_|src/assets/mockups|@/assets/mockups' src --glob '*.{astro,tsx,ts,css}'; then
  git rm -r "src/assets/mockups"
fi
```

Expected: `src/assets/mockups` removido somente se não houver referência em `src/`. Se houver referência, nenhum arquivo é removido.

- [ ] **Step 4: Remover duplicata exata da textura vertical em `src/assets` se hash for idêntico ao `public`**

Run:

```bash
src_texture="src/assets/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp"
public_texture="public/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp"
if [ -f "$src_texture" ] && [ -f "$public_texture" ]; then
  src_hash="$(sha256sum "$src_texture" | cut -d ' ' -f 1)"
  public_hash="$(sha256sum "$public_texture" | cut -d ' ' -f 1)"
  if [ "$src_hash" = "$public_hash" ] && ! rg -q 'vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc\.webp' src --glob '*.{astro,tsx,ts,css}'; then
    git rm "$src_texture"
  fi
fi
```

Expected: remove apenas a cópia em `src/assets/textures` quando o arquivo é duplicata exata e não é importado no código.

- [ ] **Step 5: Atualizar relatório com remoções de assets**

Run:

```bash
{
  printf '## Remoções de assets aplicadas\n\n'
  printf '```text\n'
  git status --short
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório mostra arquivos removidos nesta tarefa.

- [ ] **Step 6: Rodar validação rápida após remoção de assets**

Run:

```bash
bun run check
```

Expected: Biome conclui sem erro. Se falhar, corrigir ou restaurar a remoção responsável antes de seguir.

- [ ] **Step 7: Commitar limpeza de assets comprovados**

Run:

```bash
git add -A
git commit -m "chore(assets): remove unused raw mockups and duplicates"
```

Expected: commit criado apenas com remoções comprovadas e atualização do relatório. Se nenhum asset foi removido, commitar somente a atualização do relatório com mensagem `docs(cleanup): record asset audit findings`.

---

### Task 4: Investigar e remover código/páginas temporárias comprovadamente mortas

**Files:**
- Modify: `docs/superpowers/reports/2026-05-15-cleanup-audit.md`
- Potentially delete: `src/pages/test-sanity.astro`
- Potentially delete: componentes sem import comprovado

- [ ] **Step 1: Mapear páginas existentes e referências à rota de teste**

Run:

```bash
{
  printf '## Auditoria de páginas temporárias\n\n'
  printf '### Páginas em src/pages\n\n'
  printf '```text\n'
  git ls-files 'src/pages/*' 'src/pages/**/*'
  printf '```\n\n'
  printf '### Referências a test-sanity\n\n'
  printf '```text\n'
  rg 'test-sanity|/test-sanity' . --glob '!node_modules/**' --glob '!dist/**' --glob '!.astro/**' || true
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório indica se `test-sanity` é referenciado em algum lugar.

- [ ] **Step 2: Remover `src/pages/test-sanity.astro` se não houver referência externa ao próprio arquivo**

Run:

```bash
if [ -f "src/pages/test-sanity.astro" ]; then
  refs="$(rg 'test-sanity|/test-sanity' . --glob '!node_modules/**' --glob '!dist/**' --glob '!.astro/**' --glob '!docs/superpowers/reports/2026-05-15-cleanup-audit.md' || true)"
  if [ -z "$refs" ]; then
    git rm "src/pages/test-sanity.astro"
  fi
fi
```

Expected: remove a página somente se não houver referência fora do relatório.

- [ ] **Step 3: Listar componentes Astro/React aparentemente sem import**

Run:

```bash
{
  printf '## Componentes aparentemente sem import direto\n\n'
  printf '```text\n'
  for file in $(git ls-files 'src/components/**/*.{astro,tsx}' 2>/dev/null); do
    base="$(basename "$file")"
    name="${base%.*}"
    if ! rg -q "${name}" src --glob '*.{astro,tsx,ts}' --glob "!$file"; then
      printf '%s\n' "$file"
    fi
  done
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório lista candidatos. Esta etapa não remove componentes, porque nomes podem ser usados dinamicamente ou por convenção.

- [ ] **Step 4: Atualizar relatório com decisões de código morto**

Run:

```bash
{
  printf '## Remoções de código morto aplicadas\n\n'
  printf '```text\n'
  git status --short
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório mostra se `src/pages/test-sanity.astro` foi removido e quaisquer outras mudanças.

- [ ] **Step 5: Rodar validação rápida após limpeza de código morto**

Run:

```bash
bun run check
```

Expected: Biome conclui sem erro. Se falhar por arquivo removido indevidamente, restaurar com `git restore <path>` e atualizar o relatório.

- [ ] **Step 6: Commitar limpeza de código morto ou relatório de auditoria**

Run:

```bash
git add -A
if git diff --cached --quiet; then
  printf 'Sem mudanças para commitar nesta tarefa.\n'
else
  git commit -m "chore(cleanup): remove temporary dead code"
fi
```

Expected: commit criado se houver remoções/relatório atualizado; caso contrário, mensagem informa ausência de mudanças.

---

### Task 5: Validação final e relatório de resultado

**Files:**
- Modify: `docs/superpowers/reports/2026-05-15-cleanup-audit.md`

- [ ] **Step 1: Registrar tamanho depois da limpeza**

Run:

```bash
{
  printf '## Maiores arquivos e pastas depois da limpeza\n\n'
  printf '```text\n'
  du -ah public src/assets docs | sort -hr | head -60
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório contém dados para comparar antes/depois.

- [ ] **Step 2: Rodar Biome**

Run:

```bash
bun run check
```

Expected: comando conclui com sucesso.

- [ ] **Step 3: Rodar build de produção**

Run:

```bash
bun run build
```

Expected: Astro gera build em `dist/` sem erro.

- [ ] **Step 4: Registrar validações no relatório**

Run:

```bash
{
  printf '## Validação final\n\n'
  printf '- `bun run check`: concluído com sucesso.\n'
  printf '- `bun run build`: concluído com sucesso.\n'
  printf '- Rotas para revisão manual: `/`, `/agenda`, `/studio`.\n\n'
  printf '## Estado git final\n\n'
  printf '```text\n'
  git status --short --branch
  printf '```\n\n'
} >> "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
```

Expected: relatório registra validações automáticas e rotas que precisam inspeção manual.

- [ ] **Step 5: Commitar relatório final**

Run:

```bash
git add "docs/superpowers/reports/2026-05-15-cleanup-audit.md"
if git diff --cached --quiet; then
  printf 'Sem mudanças finais de relatório para commitar.\n'
else
  git commit -m "docs(cleanup): record sanitization results"
fi
```

Expected: relatório final commitado se houver alterações pendentes.

- [ ] **Step 6: Entregar resumo ao usuário**

Run:

```bash
git status --short --branch
git worktree list
du -sh public src/assets docs
```

Expected: saída mostra branch limpa ou apenas mudanças intencionais, worktrees removidos e tamanhos finais das pastas principais.

---

## Self-review do plano

- Cobertura da spec: o plano cobre diagnóstico auditável, remoção forçada de worktrees com registro prévio, limpeza balanceada de assets, investigação de código morto, validação final e relatório de resultado.
- Escopo: o plano evita secrets, Sanity/webhook/deploy, novas dependências, push remoto e docs institucionais pesados sem nova confirmação.
- Placeholders: não há `TBD`, `TODO` ou passos genéricos sem comando específico.
- Risco controlado: arquivos ambíguos não são removidos; remoções são condicionais e seguidas por validação.
