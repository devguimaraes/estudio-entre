import type { APIRoute } from 'astro';

export const prerender = false;

// Constantes de validação do webhook
const SANITY_WEBHOOK_SECRET = import.meta.env.SANITY_WEBHOOK_SECRET;
const ALLOWED_TYPES = ['evento', 'configuracao'];

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Verificar secret do webhook
    const signature = request.headers.get('x-sanity-webhook-secret');
    if (!signature || signature !== SANITY_WEBHOOK_SECRET) {
      console.error('Secret do webhook inválido');
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Parse do payload do webhook
    const payload = await request.json();

    // 3. Validar estrutura do payload
    if (!payload._type || !ALLOWED_TYPES.includes(payload._type)) {
      console.log('Ignorando webhook para tipo:', payload._type);
      return new Response(JSON.stringify({ message: 'Ignorado' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Logar a mudança
    console.log(`Webhook Sanity recebido: ${payload._type} - ${payload.operation || 'create'}`);

    // 5. Trigger deploy hook da Vercel
    const deployHookUrl = import.meta.env.VERCEL_DEPLOY_HOOK_URL;
    if (deployHookUrl) {
      await fetch(deployHookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Deploy hook acionado');
    } else {
      console.warn('VERCEL_DEPLOY_HOOK_URL não configurado');
    }

    // 6. Retornar resposta de sucesso
    return new Response(JSON.stringify({
      message: 'Webhook recebido',
      type: payload._type,
      deployed: !!deployHookUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro no webhook:', error);
    return new Response(JSON.stringify({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET endpoint para health checks
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    status: 'saudável',
    tiposPermitidos: ALLOWED_TYPES
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
