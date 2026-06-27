# Webhook do Sanity para Deploy Automático

Este documento descreve a configuração do webhook do Sanity para disparar rebuilds automáticos na Vercel quando eventos ou configurações são alterados no CMS.

## Contexto

O site do Estúdio Entre utiliza **Static Site Generation (SSG)** com Astro, o que significa que os dados do Sanity são buscados durante o **build time**, não em runtime. Quando um novo evento é criado no Sanity Studio, o site precisa ser reconstruído para incluir esse evento.

Sem automação, seria necessário fazer deploy manual toda vez que conteúdo fosse alterado. O webhook resolve isso disparando rebuilds automaticamente.

## Arquitetura

```
┌─────────────────┐
│  Sanity Studio  │
│  (CMS Editor)   │
└────────┬────────┘
         │ 1. Create/Update/Delete
         ▼
┌─────────────────┐
│  Sanity Content │
│     Lake        │
└────────┬────────┘
         │ 2. Webhook trigger
         ▼
┌─────────────────┐
│  /api/webhook   │
│  (Edge Function)│
└────────┬────────┘
         │ 3. Validate & forward
         ▼
┌─────────────────┐
│ Vercel Deploy   │
│     Hook        │
└────────┬────────┘
         │ 4. Rebuild
         ▼
┌─────────────────┐
│  Site Updated   │
│  (1-2 minutos)  │
└─────────────────┘
```

## Configuração

### Variáveis de Ambiente

As seguintes variáveis devem estar configuradas na Vercel:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `SANITY_PROJECT_ID` | `7a0ee11t` | ID do projeto Sanity |
| `SANITY_DATASET` | `production` | Dataset do Sanity |
| `SANITY_WEBHOOK_SECRET` | `c6d2354f-9659-4462-8685-dbb545d0cf97` | Secret para validação |
| `VERCEL_DEPLOY_HOOK_URL` | (URL do deploy hook) | URL para disparar rebuild |

### Webhook no Sanity

Acesse o painel do Sanity e configure o webhook:

**URL**: https://www.sanity.io/manage/project/7a0ee11t/api

**Configuração**:

- **Name**: `Vercel Deploy Hook`
- **Description**: `Dispara rebuild automático quando eventos ou configurações são alterados`
- **URL**: `https://www.estudioentre.com.br/api/webhook`
- **Trigger on**: `Create`, `Update`, `Delete`
- **Filter**: `_type == "evento" || _type == "configuracao"`
- **HTTP method**: `POST`
- **Secret**: `c6d2354f-9659-4462-8685-dbb545d0cf97`
- **Status**: `Enabled`

## Implementação

### Endpoint do Webhook

O endpoint está implementado em `src/pages/api/webhook.ts` e utiliza Edge Runtime para melhor performance e custo reduzido.

**Funcionalidades**:
- Validação de Content-Type e tamanho do payload
- Autenticação via header `x-sanity-webhook-secret`
- Filtro de tipos permitidos (`evento`, `configuracao`)
- Timeout de 3 segundos para o deploy hook
- Health check via GET

### Fluxo de Validação

1. **Content-Type**: Deve ser `application/json`
2. **Tamanho**: Máximo de 10KB
3. **Secret**: Deve corresponder ao `SANITY_WEBHOOK_SECRET`
4. **Tipo**: Deve ser `evento` ou `configuracao`
5. **Deploy**: Dispara `VERCEL_DEPLOY_HOOK_URL` se configurado

## Monitoramento

### Logs do Webhook

Acesse os logs na Vercel:
- **URL**: https://vercel.com/devguimaraes-projects/estudio-entre/functions/webhook

### Tentativas de Webhook

No painel do Sanity, clique nos três pontos ao lado do webhook e selecione **"View attempts log"**

### Health Check

```bash
curl https://www.estudioentre.com.br/api/webhook
```

Resposta esperada:
```json
{
  "status": "saudável",
  "tiposPermitidos": ["evento", "configuracao"],
  "runtime": "edge"
}
```

## Troubleshooting

### Webhook não dispara

**Sintoma**: Eventos criados não aparecem no site

**Causas possíveis**:
1. Webhook não está habilitado no Sanity
2. URL do webhook está incorreta
3. Secret não corresponde

**Solução**:
- Verifique se o webhook está com status "Enabled"
- Confirme a URL: `https://www.estudioentre.com.br/api/webhook`
- Verifique se o secret corresponde ao configurado na Vercel

### Deploy não acontece

**Sintoma**: Webhook dispara mas site não é atualizado

**Causas possíveis**:
1. `VERCEL_DEPLOY_HOOK_URL` não está configurada
2. Deploy hook está inválido ou expirado

**Solução**:
- Verifique se a variável existe na Vercel
- Teste o deploy hook manualmente:
  ```bash
  curl -X POST "$VERCEL_DEPLOY_HOOK_URL"
  ```

### Eventos não aparecem após rebuild

**Sintoma**: Deploy completa mas eventos ainda não visíveis

**Causas possíveis**:
1. Evento tem `ativo = false`
2. `dataHora` está no passado
3. `categoria` não é válida

**Solução**:
- Verifique no Sanity Studio:
  - Campo `ativo` está marcado
  - `dataHora` é futura
  - `categoria` é uma das opções: `show`, `oficina`, `roda-de-conversa`, `lancamento`, `sarau`, `exposicao`, `biblioterapia`, `dj-session`

## Performance

- **Runtime**: Edge (mais rápido e barato que Node.js)
- **Timeout**: 5 segundos
- **Retry**: Sanity tenta 2 vezes com intervalo de 30 segundos
- **Idempotência**: Header `idempotency-key` para evitar duplicatas

## Segurança

- Autenticação via secret no header `x-sanity-webhook-secret`
- Validação de Content-Type para prevenir ataques
- Limite de tamanho de payload (10KB)
- Não expõe erros internos ao cliente
- Logs não incluem PII (dados pessoais)

## Referências

- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Vercel Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks)
- [Astro + Sanity Integration](https://docs.astro.build/en/guides/integrations-guide/sanity/)
- [Edge Functions na Vercel](https://vercel.com/docs/functions/edge-functions)

## Changelog

- **2026-06-01**: Documentação inicial criada após diagnóstico de eventos não aparecendo
- **2026-06-01**: Implementação do endpoint `/api/webhook` com Edge Runtime
- **2026-06-01**: Configuração de variáveis de ambiente na Vercel
