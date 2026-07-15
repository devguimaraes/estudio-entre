import { describe, expect, test } from "bun:test";
import { WHATSAPP_PHONE, buildWaLink } from "@/utils/whatsapp";

describe("buildWaLink", () => {
  test("gera URL wa.me com telefone canônico e mensagem encoded", () => {
    const url = buildWaLink("Olá! Tenho interesse em locação no Estúdio Entre.");
    expect(url).toBe(
      "https://wa.me/5521973101451?text=Ol%C3%A1!%20Tenho%20interesse%20em%20loca%C3%A7%C3%A3o%20no%20Est%C3%BAdio%20Entre.",
    );
  });

  test("aceita telefone customizado", () => {
    const url = buildWaLink("Teste", "5511999999999");
    expect(url).toBe("https://wa.me/5511999999999?text=Teste");
  });

  test("exporta telefone canônico", () => {
    expect(WHATSAPP_PHONE).toBe("5521973101451");
  });
});
