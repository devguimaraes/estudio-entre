import { describe, expect, test } from "bun:test";
import { isCategoriaEvento } from "@/domain/categoriaEvento";
import {
  getDiaKey,
  getMesKey,
  isSafeExternalUrl,
  normalizeEventoDocument,
  normalizeEventoDocuments,
} from "@/intake/evento";
import type { EventoSanityDocument } from "@/types/evento";
import { EVENT_TIME_ZONE } from "@/utils/eventos";

function baseDoc(overrides: Partial<EventoSanityDocument> = {}): EventoSanityDocument {
  return {
    _id: "evt-1",
    titulo: "Sarau Entre",
    slug: "sarau-entre",
    categoria: "sarau",
    dataHora: "2026-08-15T22:00:00.000Z",
    local: " Estúdio Entre ",
    descricao: " Noite de poesia ",
    valor: " Gratuito ",
    linkCompra: "https://ingressos.example.com/sarau",
    imagens: null,
    ...overrides,
  };
}

const mockResolveImage = () => "https://cdn.example.com/evento.jpg";

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

describe("normalizeEventoDocument", () => {
  test("normaliza evento válido com campos formatados", () => {
    const result = normalizeEventoDocument(baseDoc(), mockResolveImage);

    expect(result).not.toBeNull();
    expect(result?.local).toBe("Estúdio Entre");
    expect(result?.descricao).toBe("Noite de poesia");
    expect(result?.valor).toBe("Gratuito");
    expect(result?.linkCompra).toBe("https://ingressos.example.com/sarau");
    expect(result?.buscaTexto).toContain("sarau entre");
    expect(result?.timestamp).toBeGreaterThan(0);
    expect(result?.mesKey).toMatch(/^\d{4}-\d{2}$/);
    expect(result?.diaKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result?.dataFormatada.length).toBeGreaterThan(0);
    expect(result?.horaFormatada).toMatch(/^\d{2}:\d{2}$/);
    expect(result?.imagemUrl).toBe("https://cdn.example.com/evento.jpg");
    expect(result).not.toHaveProperty("imagens");
  });

  test("retorna null sem _id, titulo ou categoria inválida", () => {
    expect(normalizeEventoDocument(baseDoc({ _id: "" }), mockResolveImage)).toBeNull();
    expect(normalizeEventoDocument(baseDoc({ titulo: "" }), mockResolveImage)).toBeNull();
    expect(normalizeEventoDocument(baseDoc({ categoria: "invalid" }), mockResolveImage)).toBeNull();
  });

  test("retorna null com data inválida", () => {
    expect(
      normalizeEventoDocument(baseDoc({ dataHora: "data-invalida" }), mockResolveImage),
    ).toBeNull();
  });

  test("sanitiza linkCompra inseguro", () => {
    const result = normalizeEventoDocument(
      baseDoc({ linkCompra: "javascript:void(0)" }),
      mockResolveImage,
    );
    expect(result?.linkCompra).toBeNull();
  });

  test("imagemUrl é null sem imagens e sem resolveImage customizado", () => {
    const result = normalizeEventoDocument(baseDoc({ imagens: null }), () => null);
    expect(result?.imagemUrl).toBeNull();
  });

  test("mesKey e diaKey respeitam fuso America/Sao_Paulo", () => {
    // 2026-01-15 02:30 UTC = 2026-01-14 23:30 em São Paulo (UTC-3)
    const nearMidnight = new Date("2026-01-15T02:30:00.000Z");
    expect(getMesKey(nearMidnight)).toBe("2026-01");
    expect(getDiaKey(nearMidnight)).toBe("2026-01-14");
    expect(EVENT_TIME_ZONE).toBe("America/Sao_Paulo");

    const result = normalizeEventoDocument(
      baseDoc({ dataHora: "2026-01-15T02:30:00.000Z" }),
      mockResolveImage,
    );
    expect(result?.mesKey).toBe("2026-01");
    expect(result?.diaKey).toBe("2026-01-14");
  });

  test("trim de campos vazios vira null", () => {
    const result = normalizeEventoDocument(
      baseDoc({ local: "  ", descricao: "", valor: "   " }),
      mockResolveImage,
    );
    expect(result?.local).toBeNull();
    expect(result?.descricao).toBeNull();
    expect(result?.valor).toBeNull();
  });
});

describe("normalizeEventoDocuments", () => {
  test("filtra inválidos e ordena por timestamp", () => {
    const eventos = normalizeEventoDocuments(
      [
        baseDoc({ _id: "b", dataHora: "2026-09-01T19:00:00.000Z" }),
        baseDoc({ _id: "invalid", categoria: "x" }),
        baseDoc({ _id: "a", dataHora: "2026-07-01T19:00:00.000Z" }),
      ],
      mockResolveImage,
    );

    expect(eventos).toHaveLength(2);
    expect(eventos[0]._id).toBe("a");
    expect(eventos[1]._id).toBe("b");
  });
});
