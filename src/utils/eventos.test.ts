import { describe, expect, test } from "bun:test";
import { isCategoriaEvento } from "@/domain/categoriaEvento";
import type { EventoCard } from "@/types/evento";
import {
  EVENT_TIME_ZONE,
  getMesKey,
  isSafeExternalUrl,
  normalizeEvento,
  normalizeEventos,
} from "@/utils/eventos";

function baseEvento(overrides: Partial<EventoCard> = {}): EventoCard {
  return {
    _id: "evt-1",
    titulo: "Sarau Entre",
    slug: "sarau-entre",
    categoria: "sarau",
    dataHora: "2026-08-15T19:00:00.000Z",
    local: " Estúdio Entre ",
    descricao: " Noite de poesia ",
    valor: " Gratuito ",
    linkCompra: "https://ingressos.example.com/sarau",
    imagens: null,
    ...overrides,
  };
}

describe("isCategoriaEvento", () => {
  test("aceita categorias canônicas", () => {
    expect(isCategoriaEvento("show")).toBe(true);
    expect(isCategoriaEvento("dj-session")).toBe(true);
    expect(isCategoriaEvento("roda-de-conversa")).toBe(true);
  });

  test("rejeita valores inválidos", () => {
    expect(isCategoriaEvento("palestra")).toBe(false);
    expect(isCategoriaEvento("")).toBe(false);
    expect(isCategoriaEvento(null)).toBe(false);
    expect(isCategoriaEvento(undefined)).toBe(false);
    expect(isCategoriaEvento(42)).toBe(false);
  });
});

describe("isSafeExternalUrl", () => {
  test("aceita http e https", () => {
    expect(isSafeExternalUrl("https://example.com/tickets")).toBe(true);
    expect(isSafeExternalUrl("http://example.com/tickets")).toBe(true);
  });

  test("rejeita protocolos inseguros ou URLs malformadas", () => {
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("not-a-url")).toBe(false);
    expect(isSafeExternalUrl(null)).toBe(false);
    expect(isSafeExternalUrl("")).toBe(false);
  });
});

describe("normalizeEvento", () => {
  test("normaliza evento válido", () => {
    const result = normalizeEvento(baseEvento());

    expect(result).not.toBeNull();
    expect(result?.local).toBe("Estúdio Entre");
    expect(result?.descricao).toBe("Noite de poesia");
    expect(result?.valor).toBe("Gratuito");
    expect(result?.linkCompra).toBe("https://ingressos.example.com/sarau");
    expect(result?.buscaTexto).toContain("sarau entre");
    expect(result?.timestamp).toBeGreaterThan(0);
    expect(result?.mesKey).toMatch(/^\d{4}-\d{2}$/);
  });

  test("retorna null sem _id, titulo ou categoria inválida", () => {
    expect(normalizeEvento(baseEvento({ _id: "" }))).toBeNull();
    expect(normalizeEvento(baseEvento({ titulo: "" }))).toBeNull();
    expect(
      normalizeEvento(baseEvento({ categoria: "invalid" as EventoCard["categoria"] })),
    ).toBeNull();
  });

  test("retorna null com data inválida", () => {
    expect(normalizeEvento(baseEvento({ dataHora: "data-invalida" }))).toBeNull();
  });

  test("sanitiza linkCompra inseguro", () => {
    const result = normalizeEvento(baseEvento({ linkCompra: "javascript:void(0)" }));
    expect(result?.linkCompra).toBeNull();
  });

  test("mesKey respeita fuso America/Sao_Paulo", () => {
    const date = new Date("2026-01-15T02:30:00.000Z");
    expect(getMesKey(date)).toBe("2026-01");
    expect(EVENT_TIME_ZONE).toBe("America/Sao_Paulo");
  });
});

describe("normalizeEventos", () => {
  test("filtra inválidos e ordena por timestamp", () => {
    const eventos = normalizeEventos([
      baseEvento({ _id: "b", dataHora: "2026-09-01T19:00:00.000Z" }),
      baseEvento({ _id: "invalid", categoria: "x" as EventoCard["categoria"] }),
      baseEvento({ _id: "a", dataHora: "2026-07-01T19:00:00.000Z" }),
    ]);

    expect(eventos).toHaveLength(2);
    expect(eventos[0]._id).toBe("a");
    expect(eventos[1]._id).toBe("b");
  });
});
