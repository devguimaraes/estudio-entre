import { describe, expect, test } from "bun:test";
import {
  buildFichaTecnica,
  formatarPeriodoDetalhe,
  formatarPeriodoListagem,
  isExposicaoStatus,
  mapExposicaoFotos,
  normalizeExposicaoDetalhe,
  normalizeExposicaoListagem,
  resolveCapaDetalheUrl,
  withImageParams,
} from "@/intake/exposicao";
import type { ExposicaoSanityDetalhe, ExposicaoSanityListagem } from "@/types/exposicao";

function baseListagem(overrides: Partial<ExposicaoSanityListagem> = {}): ExposicaoSanityListagem {
  return {
    _id: "exp-1",
    titulo: "Eu me vejo em você",
    slug: "eu-me-vejo-em-voce",
    artista: " Coletivo Entre ",
    dataInicio: "2026-03-01",
    dataFim: "2026-03-28",
    status: "em-cartaz",
    capaUrl: "https://cdn.sanity.io/capa.jpg",
    capaWidth: 1200,
    capaHeight: 900,
    ...overrides,
  };
}

function baseDetalhe(overrides: Partial<ExposicaoSanityDetalhe> = {}): ExposicaoSanityDetalhe {
  return {
    _id: "exp-1",
    titulo: "Eu me vejo em você",
    slug: "eu-me-vejo-em-voce",
    subtitulo: " Retratos do entorno ",
    textoCuratorial: [{ _type: "block", _key: "b1", children: [] }],
    artista: "Coletivo Entre",
    curadoria: "Estúdio Entre",
    dataInicio: "2026-03-01",
    dataFim: "2026-03-28",
    local: "Sala principal",
    tecnica: "Fotografia",
    apoio: "Lei Aldir Blanc",
    status: "em-cartaz",
    linkAgendamento: "https://agenda.example.com/visita",
    capaUrl: "https://cdn.sanity.io/capa.jpg",
    imagens: [
      {
        _key: "img-1",
        url: "https://cdn.sanity.io/foto1.jpg",
        alt: "Obra 1",
        width: 1000,
        height: 800,
      },
    ],
    albumRelacionado: { _id: "alb-1", titulo: "Álbum", slug: "album" },
    ...overrides,
  };
}

describe("isExposicaoStatus", () => {
  test("aceita status canônicos", () => {
    expect(isExposicaoStatus("em-cartaz")).toBe(true);
    expect(isExposicaoStatus("futura")).toBe(true);
    expect(isExposicaoStatus("passada")).toBe(true);
  });

  test("rejeita valores inválidos", () => {
    expect(isExposicaoStatus("cancelada")).toBe(false);
    expect(isExposicaoStatus("")).toBe(false);
    expect(isExposicaoStatus(null)).toBe(false);
  });
});

describe("formatarPeriodoListagem", () => {
  test("formata data única", () => {
    const result = formatarPeriodoListagem("2026-05-10", null);
    expect(result).toContain("10");
    expect(result).toContain("mai");
  });

  test("formata intervalo no mesmo mês", () => {
    const result = formatarPeriodoListagem("2026-03-01", "2026-03-28");
    expect(result).toMatch(/1–28/);
    expect(result).toContain("mar");
  });

  test("formata intervalo em meses diferentes", () => {
    const result = formatarPeriodoListagem("2026-03-01", "2026-04-15");
    expect(result).toContain("–");
    expect(result).toContain("mar");
    expect(result).toContain("abr");
  });
});

describe("formatarPeriodoDetalhe", () => {
  test("formata período longo com intervalo", () => {
    const result = formatarPeriodoDetalhe("2026-03-01", "2026-04-15");
    expect(result).toContain("março");
    expect(result).toContain("abril");
    expect(result).toContain("–");
  });

  test("formata mesmo mês com 'e'", () => {
    const result = formatarPeriodoDetalhe("2026-03-01", "2026-03-28");
    expect(result).toContain("1 e 28");
    expect(result).toContain("março");
  });
});

describe("withImageParams e resolução de capa", () => {
  test("adiciona query string de otimização", () => {
    expect(withImageParams("https://cdn.example.com/img.jpg", 1800)).toBe(
      "https://cdn.example.com/img.jpg?auto=format&w=1800",
    );
  });

  test("resolveCapaDetalheUrl retorna null sem URL", () => {
    expect(resolveCapaDetalheUrl(null)).toBeNull();
  });

  test("resolveCapaDetalheUrl aplica largura de hero", () => {
    expect(resolveCapaDetalheUrl("https://cdn.example.com/capa.jpg")).toContain("w=1800");
  });
});

describe("mapExposicaoFotos", () => {
  test("mapeia fotos com URL resolvida", () => {
    const fotos = mapExposicaoFotos(
      [{ _key: "k1", url: "https://cdn.example.com/f.jpg", alt: "Foto", width: 900, height: 600 }],
      "Título",
      (url) => `${url}?w=1600`,
    );
    expect(fotos).toHaveLength(1);
    expect(fotos[0].src).toContain("w=1600");
    expect(fotos[0].alt).toBe("Foto");
  });

  test("ignora imagens sem URL", () => {
    const fotos = mapExposicaoFotos([{ _key: "k1", url: "", alt: null }], "Título");
    expect(fotos).toHaveLength(0);
  });
});

describe("normalizeExposicaoListagem", () => {
  test("normaliza card válido", () => {
    const result = normalizeExposicaoListagem(baseListagem());
    expect(result).not.toBeNull();
    expect(result?.artista).toBe("Coletivo Entre");
    expect(result?.periodoFormatado.length).toBeGreaterThan(0);
    expect(result?.capaUrl).toBe("https://cdn.sanity.io/capa.jpg");
  });

  test("retorna null com status inválido", () => {
    expect(normalizeExposicaoListagem(baseListagem({ status: "invalid" }))).toBeNull();
  });
});

describe("normalizeExposicaoDetalhe", () => {
  test("normaliza detalhe com ficha técnica e fotos", () => {
    const result = normalizeExposicaoDetalhe(baseDetalhe());
    expect(result).not.toBeNull();
    expect(result?.subtitulo).toBe("Retratos do entorno");
    expect(result?.textoCuratorial).toHaveLength(1);
    expect(result?.fichaTecnica.some((f) => f.label === "Artista")).toBe(true);
    expect(result?.fotos).toHaveLength(1);
    expect(result?.capaUrl).toContain("w=1800");
    expect(result?.linkAgendamento).toBe("https://agenda.example.com/visita");
  });

  test("sanitiza linkAgendamento inseguro", () => {
    const result = normalizeExposicaoDetalhe(
      baseDetalhe({ linkAgendamento: "javascript:void(0)" }),
    );
    expect(result?.linkAgendamento).toBeNull();
  });

  test("buildFichaTecnica omite campos vazios", () => {
    const ficha = buildFichaTecnica(
      {
        artista: null,
        curadoria: "X",
        dataInicio: "2026-01-01",
        dataFim: null,
        local: null,
        tecnica: null,
      },
      "janeiro de 2026",
    );
    expect(ficha).toHaveLength(2);
    expect(ficha.map((f) => f.label)).toEqual(["Curadoria", "Período"]);
  });
});
