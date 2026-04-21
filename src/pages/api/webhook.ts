import type { APIRoute } from "astro";

export const prerender = false;

// Configurar Edge Runtime (muito mais barato que Node.js)
export const config = {
  runtime: "edge",
  maxDuration: 5, // 5 segundos é suficiente para webhook
};

// Constantes de validação do webhook
const ALLOWED_TYPES = ["evento", "configuracao"];

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Verificar secret do webhook
    const signature = request.headers.get("x-sanity-webhook-secret");
    const secret = request.headers.get("x-sanity-webhook-secret");

    if (!signature || signature !== process.env.SANITY_WEBHOOK_SECRET) {
      console.error("Secret do webhook inválido");
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Parse do payload do webhook
    const payload = await request.json();

    // 3. Validar estrutura do payload
    if (!payload._type || !ALLOWED_TYPES.includes(payload._type)) {
      console.log("Ignorando webhook para tipo:", payload._type);
      return new Response(JSON.stringify({ message: "Ignorado" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Logar a mudança
    console.log(`Webhook Sanity recebido: ${payload._type} - ${payload.operation || "create"}`);

    // 5. Trigger deploy hook da Vercel
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (deployHookUrl) {
      // Usar timeout curto para Edge Functions
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      try {
        await fetch(deployHookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        console.log("Deploy hook acionado");
      } catch (fetchError: unknown) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          console.warn("Deploy hook timeout (continuando mesmo assim)");
        } else {
          throw fetchError;
        }
      }
    } else {
      console.warn("VERCEL_DEPLOY_HOOK_URL não configurado");
    }

    // 6. Retornar resposta de sucesso imediatamente
    return new Response(
      JSON.stringify({
        message: "Webhook recebido",
        type: payload._type,
        deployed: !!deployHookUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store", // Não cachear respostas de webhook
        },
      },
    );
  } catch (error) {
    console.error("Erro no webhook:", error);
    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

// GET endpoint para health checks (também usa Edge)
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: "saudável",
      tiposPermitidos: ALLOWED_TYPES,
      runtime: "edge",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // Cache health checks por 1 minuto
      },
    },
  );
};
