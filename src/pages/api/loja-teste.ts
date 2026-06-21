/**
 * Endpoint de diagnóstico: testa se a Vercel consegue acessar a API InfinitePay.
 *
 * Uso: GET /api/loja-teste?secret={SANITY_WEBHOOK_SECRET}
 */

import type { APIRoute } from "astro";

export const prerender = false;

const CATALOG_URL = "https://loja.infinitepay.io/llms/thaynawho.txt";

export const GET: APIRoute = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const expected = import.meta.env.SANITY_WEBHOOK_SECRET;

  if (!expected) {
    return new Response(
      JSON.stringify({ erro: "SANITY_WEBHOOK_SECRET não configurado no ambiente" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!secret || secret !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(CATALOG_URL, { signal: controller.signal });
    clearTimeout(timeout);
    const text = await res.text();
    const elapsed = Date.now() - start;

    const isCaptcha =
      text.includes("Verificação de Segurança") ||
      text.includes("challenge-platform") ||
      text.includes("_cf_chl_opt");

    const isCatalog = text.includes("- ") && text.includes("R$");
    const contentType = res.headers.get("content-type") ?? "desconhecido";

    const preview = text.slice(0, 200).replace(/\n/g, "\\n");

    return new Response(
      JSON.stringify(
        {
          status: res.status,
          contentType,
          tamanho: text.length,
          tempoMs: elapsed,
          captcha: isCaptcha,
          catalogo: isCatalog,
          preview,
        },
        null,
        2,
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        erro: "Fetch falhou",
        mensagem: (err as Error).message,
        tempoMs: Date.now() - start,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
