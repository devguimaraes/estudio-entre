# Deploy no Vercel — Site Estúdio Entre

Este documento orienta o deploy do projeto na Vercel, incluindo configuração de variáveis de ambiente e webhook do Sanity CMS.

---

## 1. Deploy Inicial no Vercel

### Conectar Repositório

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Importe o repositório do Git (GitHub/GitLab/Bitbucket)
4. Configure o projeto:
   - **Framework Preset**: Other
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist`
   - **Install Command**: `bun install`

### Configurar Variáveis de Ambiente

No painel do projeto Vercel, vá em **Settings → Environment Variables** e adicione:

| Nome | Valor | Ambiente |
|------|-------|-----------|
| `SANITY_PROJECT_ID` | `7a0ee11t` | Production, Preview, Development |
| `SANITY_DATASET` | `production` | Production, Preview, Development |

**Importante**: O `SANITY_PROJECT_ID` é o ID do projeto Sanity (7a0ee11t).

---

## 2. Configurar Webhook do Sanity CMS

O webhook permite que o Sanity dispare um rebuild automático na Vercel quando o conteúdo for alterado.

### Criar Webhook no Sanity

1. Acesse [Sanity Management](https://www.sanity.io/manage)
2. Selecione o projeto **Estudio Entre** (ID: 7a0ee11t)
3. Vá em **API → Webhooks**
4. Clique em "Create new webhook"
5. Configure:
   - **URL**: `https://deploy-preview-<url-projetada>.vercel.app/api/webhook`
   - **Projection**: `{ _type, slug, _createdAt }`
   - **Filter**: `_type in ["evento", "configuracao"]`
   - **HTTP Method**: POST
   - **Secret**: gere uma chave segura (ex: UUID v4)

### Adicionar Webhook no Vercel

No Vercel, crie um arquivo `api/webhook.ts` (será criado na DEV-45) para receber os eventos do Sanity.

---

## 3. Configurar Domínio Customizado (Opcional)

### Comprar Domínio

Se ainda não tiver, compre um domínio (ex: estudioentre.com.br) em:
- Registro.br
- GoDaddy
- Namecheap

### Adicionar no Vercel

1. No painel do projeto Vercel, vá em **Settings → Domains**
2. Adicione o domínio principal (ex: `estudioentre.com.br`)
3. Adicione subdomínios se necessário:
   - `www.estudioentre.com.br`
   - `staging.estudioentre.com.br`
4. Configure DNS no registrante conforme instruções do Vercel

---

## 4. Headers de Segurança

Os headers de segurança já estão configurados em `vercel.json`:

- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=()`

---

## 5. Configuração de Cache

O cache otimizado já está configurado em `vercel.json`:

- **Fonts**: 1 ano (immutable)
- **Assets do Astro (/_astro/)**: 1 ano (immutable)
- **HTML**: Cache control via Astro (revalidate)

---

## 6. Deploy Automático (CI/CD)

O Vercel já está configurado para deploy automático:

- **Branch `main`**: Deploy em Production
- **Branch `develop`**: Deploy em Preview
- **Pull Requests**: Deploy em Preview com URL única

---

## 7. Monitoramento e Analytics

### Google Analytics 4

1. Crie uma propriedade GA4 em [Google Analytics](https://analytics.google.com)
2. Copie o **Measurement ID** (ex: `G-XXXXXXXXXX`)
3. Adicione ao projeto (será feito na DEV-67)

### Google Search Console

1. Adicione a propriedade em [Search Console](https://search.google.com/search-console)
2. Verifique a propriedade via DNS ou arquivo HTML
3. Submeta o `sitemap.xml` gerado automaticamente pelo Astro

---

## 8. Checklist Final de Deploy

- [ ] Projeto conectado ao Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build funcionando localmente (`bun run build`)
- [ ] First deploy bem-sucedido
- [ ] Webhook Sanity configurado e testado
- [ ] Domínio customizado configurado (se aplicável)
- [ ] GA4 configurado (DEV-67)
- [ ] Search Console configurado
- [ ] Sitemap.xml submetido

---

## Comandos Úteis

```bash
# Build local para testar
bun run build

# Preview do build local
bun run preview

# Deploy manual via CLI (opcional)
vercel --prod
```

---

## Troubleshooting

### Build falha no Vercel

- Verifique se as variáveis de ambiente estão corretas
- Confirme que o `bun.lockb` está commitado
- Veja os logs de build no painel do Vercel

### Webhook Sanity não funciona

- Verifique se a URL do webhook está correta
- Confirme se o secret está configurado corretamente
- Teste o webhook no painel do Sanity

### Assets não carregam

- Verifique os headers de cache no `vercel.json`
- Confirme que os caminhos estão corretos
- Veja o console do navegador para erros 404

---

## Suporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Sanity Docs**: [sanity.io/docs](https://www.sanity.io/docs)
- **Astro Deploy**: [docs.astro.build/en/guides/deploy/vercel](https://docs.astro.build/en/guides/deploy/vercel)
