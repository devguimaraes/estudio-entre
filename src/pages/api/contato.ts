import type { APIRoute } from "astro";
import {
  INTERESSE_OPTIONS,
  EMAIL_REGEX,
  type ContatoPayload,
} from "@/types/contato";

export const prerender = false;

export const config = {
  runtime: "edge",
  maxDuration: 10,
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: ContatoPayload = await request.json();

    if (body.honeypot) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { nome, email, interesse, mensagem } = body;

    if (!nome || nome.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Nome deve ter pelo menos 2 caracteres." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: "Email inválido." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!interesse || !INTERESSE_OPTIONS.includes(interesse)) {
      return new Response(
        JSON.stringify({ error: "Selecione uma opção válida de interesse." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!mensagem || mensagem.trim().length < 10) {
      return new Response(
        JSON.stringify({
          error: "Mensagem deve ter pelo menos 10 caracteres.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn(
        "RESEND_API_KEY não configurada — email não enviado.",
        { nome, email, interesse },
      );
      return new Response(
        JSON.stringify({ success: true, warning: "Email não enviado (API key ausente)." }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Estúdio Entre <noreply@estudioentre.com.br>",
        to: ["contato@estudioentre.com.br"],
        subject: `[Estúdio Entre] Novo contato — ${interesse}`,
        text: [
          `Nome: ${nome}`,
          `Email: ${email}`,
          `Interesse: ${interesse}`,
          "",
          "Mensagem:",
          mensagem,
        ].join("\n"),
      }),
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.text();
      console.error("Erro Resend:", errorBody);
      return new Response(
        JSON.stringify({ error: "Erro ao enviar email. Tente novamente." }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Erro no endpoint de contato:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
