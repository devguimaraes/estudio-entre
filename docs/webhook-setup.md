# Configuração de Webhook para Deploy Automático

Este guia explica como configurar o webhook do Sanity para disparar rebuilds automáticos na Vercel quando eventos ou configurações são alterados.

## Por que isso é necessário?

O site usa **SSG (Static Site Generation)** - os dados são buscados no **build time**, não em runtime. Isso significa que quando você cria um novo evento no Sanity, o site precisa ser reconstruído para incluir esse evento.

Sem o webhook configurado, você precisaria fazer deploy manual toda vez que criar um evento. Com o webhook, o rebuild acontece automaticamente.

## Configuração Automática (Recomendado)

Execute o script de configuração:

```bash
./scripts/setup-webhook.sh
```

O script irá:
1. Verificar se você está autenticado no Sanity CLI
2. Criar o webhook com as configurações corretas
3. Confirmar que tudo está funcionando

## Configuração Manual

Se preferir configurar manualmente, siga estes passos:

### 1. Acessar o Painel do Sanity

1. Acesse: https://www.sanity.io/manage/project/7a0ee11t
2. No menu lateral, clique em **API**
3. Role até a seção **Webhooks**
4. Clique em **Add webhook**

### 2. Configurar o Webhook

Preencha os campos:

- **Name**: `Vercel Deploy Hook`
- **URL**: `https://estudio-entre.vercel.app/api/webhook`
- **Trigger on**: Marque `Create`, `Update` e `Delete`
- **Document types**: Selecione `evento` e `configuracao`
- **Secret**: `c6d2354f-9659-4462-8685-dbb545d0cf97`

### 3. Salvar

Clique em **Save** para criar o webhook.

## Verificar Variáveis de Ambiente na Vercel

Confirme que estas variáveis estão configuradas no painel da Vercel:

1. Acesse: https://vercel.com/devguimaraes-projects/estudio-entre/settings/environment-variables
2. Verifique que existem:
   - `SANITY_PROJECT_ID` = `7a0ee11t`
   - `SANITY_DATASET` = `production`
   - `SANITY_WEBHOOK_SECRET` = `c6d2354f-9659-4462-8685-dbb545d0cf97`
   - `VERCEL_DEPLOY_HOOK_URL` = (URL do deploy hook)

## Como Funciona

```
1. Você cria/edita/deleta um evento no Sanity Studio
   ↓
2. Sanity dispara webhook para /api/webhook
   ↓
3. Webhook valida o secret e o tipo do documento
   ↓
4. Se for evento ou configuracao, dispara VERCEL_DEPLOY_HOOK_URL
   ↓
5. Vercel inicia rebuild do site
   ↓
6. Site é atualizado com os novos dados (~1-2 minutos)
```

## Testar o Webhook

### Teste 1: Verificar Health Check

```bash
curl https://estudio-entre.vercel.app/api/webhook
```

Deve retornar:
```json
{
  "status": "saudável",
  "tiposPermitidos": ["evento", "configuracao"],
  "runtime": "edge"
}
```

### Teste 2: Simular Webhook

```bash
curl -X POST https://estudio-entre.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-sanity-webhook-secret: c6d2354f-9659-4462-8685-dbb545d0cf97" \
  -d '{"_type": "evento", "operation": "create"}'
```

Deve retornar:
```json
{
  "message": "Webhook recebido",
  "type": "evento",
  "deployed": true
}
```

### Teste 3: Criar Evento Real

1. Acesse o Sanity Studio: https://estudio-entre.vercel.app/studio
2. Crie um novo evento com:
   - Título: "Evento de Teste"
   - Categoria: qualquer uma válida
   - Data/Hora: futura (ex: 2026-12-31 19:00)
   - Ativo: ✓
3. Salve o evento
4. Aguarde 1-2 minutos
5. Verifique se o evento aparece em https://estudio-entre.vercel.app

## Troubleshooting

### Webhook não está disparando

1. Verifique se o webhook está ativo no painel do Sanity
2. Confirme que a URL está correta: `https://estudio-entre.vercel.app/api/webhook`
3. Verifique os logs da Vercel: Functions → webhook

### Deploy não está acontecendo

1. Verifique se `VERCEL_DEPLOY_HOOK_URL` está configurada na Vercel
2. Teste o deploy hook manualmente:
   ```bash
   curl -X POST "$VERCEL_DEPLOY_HOOK_URL"
   ```

### Eventos ainda não aparecem

1. Verifique se o evento tem `ativo = true`
2. Verifique se `dataHora` está no futuro
3. Verifique se `categoria` é uma das opções válidas
4. Aguarde o rebuild completar (pode levar até 2 minutos)

## Logs e Monitoramento

### Ver logs do webhook na Vercel

1. Acesse: https://vercel.com/devguimaraes-projects/estudio-entre
2. Clique em **Functions**
3. Selecione `webhook`
4. Veja os logs em tempo real

### Ver webhooks no Sanity

Use o Sanity CLI:

```bash
npx sanity@latest hook list --project 7a0ee11t --dataset production
```

## Informações Técnicas

- **Runtime**: Edge (mais rápido e barato que Node.js)
- **Timeout**: 5 segundos
- **Tipos permitidos**: `evento`, `configuracao`
- **Validação**: Secret via header `x-sanity-webhook-secret`
- **Endpoint**: `/api/webhook` (POST e GET)

## Referências

- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Vercel Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks)
- [Astro + Sanity Integration](https://docs.astro.build/en/guides/integrations-guide/sanity/)
