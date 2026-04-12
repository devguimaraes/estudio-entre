# Git Flow Configuration

## Branches Permanentes

- **main** — Produção (tags de versão aqui)
- **develop** — Integração de features

## Branches Temporárias

- **feature/**** — Novas funcionalidades (de `develop`)
- **release/**** — Preparação de versão (de `develop`)
- **hotfix/**** — Correções críticas (de `main`)

## Padrão de Nomenclatura

```
feature/nome-descritivo-feature
release/1.0.0
hotfix/1.0.1
```

## Versionamento Semântico

- **MAJOR.MINOR.PATCH** (ex: 1.2.3)
- MAJOR: Mudanças incompatíveis
- MINOR: Novos recursos compatíveis
- PATCH: Correções de bugs

## Convenções de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `perf:` Performance
- `test:` Testes
- `chore:` Configuração/Deps

## Como Iniciar Trabalho

1. Puxar mudanças recentes: `git pull origin develop`
2. Criar feature: `git checkout -b feature/nome develop`
3. Trabalhar e commitar normalmente
4. Abrir PR para `develop`
5. Após review: merge com `--no-ff`

---

**Data de configuração:** Abril 2026
