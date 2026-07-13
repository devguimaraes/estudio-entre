import { describe, expect, test } from "bun:test";
import {
  mapAlbumFotos,
  normalizeAlbumDetalhe,
  normalizeAlbumListagem,
  resolveCapaListagemUrl,
  resolveFotoAlbumUrl,
} from "@/intake/galeria";
import type { AlbumSanityDetalhe, AlbumSanityListagem } from "@/types/galeria";

function baseListagem(overrides: Partial<AlbumSanityListagem> = {}): AlbumSanityListagem {
  return {
    _id: "alb-1",
    titulo: "Inauguração",
    slug: "inauguracao",
    descricao: " Momentos da abertura ",
    dataInicio: "2026-03-01",
    dataFim: "2026-03-28",
    capaUrl: "https://cdn.sanity.io/capa.jpg",
    ...overrides,
  };
}

function baseDetalhe(overrides: Partial<AlbumSanityDetalhe> = {}): AlbumSanityDetalhe {
  return {
    _id: "alb-1",
    titulo: "Inauguração",
    slug: "inauguracao",
    descricao: " Momentos da abertura ",
    dataInicio: "2026-03-01",
    dataFim: "2026-03-28",
    imagens: [
      {
        _key: "img-1",
        asset: {
          _id: "asset-1",
          url: "https://cdn.sanity.io/foto1.jpg",
          metadata: { dimensions: { width: 1000, height: 800 } },
        },
        alt: "Foto 1",
      },
      {
        _key: "img-2",
        asset: {
          _id: "asset-2",
          url: "https://cdn.sanity.io/foto2.jpg",
          metadata: { dimensions: { width: 900, height: 1200 } },
        },
        alt: null,
      },
    ],
    eventoRelacionado: {
      _id: "evt-1",
      titulo: "Festa de abertura",
      slug: "festa-abertura",
      dataHora: "2026-03-01T19:00:00-03:00",
    },
    ...overrides,
  };
}

describe("resolveCapaListagemUrl", () => {
  test("retorna URL raw", () => {
    expect(resolveCapaListagemUrl("https://cdn.sanity.io/capa.jpg")).toBe(
      "https://cdn.sanity.io/capa.jpg",
    );
  });

  test("retorna null sem URL", () => {
    expect(resolveCapaListagemUrl(null)).toBeNull();
  });
});

describe("resolveFotoAlbumUrl", () => {
  test("aplica auto=format e w=1600", () => {
    expect(resolveFotoAlbumUrl("https://cdn.example.com/f.jpg")).toBe(
      "https://cdn.example.com/f.jpg?auto=format&w=1600",
    );
  });
});

describe("mapAlbumFotos", () => {
  test("mapeia fotos com URL resolvida e metadados", () => {
    const fotos = mapAlbumFotos(
      [
        {
          _key: "k1",
          asset: {
            _id: "a1",
            url: "https://cdn.example.com/f.jpg",
            metadata: { dimensions: { width: 900, height: 600 } },
          },
          alt: "Foto",
        },
      ],
      "Título",
      (url) => `${url}?w=1600`,
    );
    expect(fotos).toHaveLength(1);
    expect(fotos[0]).toEqual({
      id: "k1",
      src: "https://cdn.example.com/f.jpg?w=1600",
      alt: "Foto",
      width: 900,
      height: 600,
    });
  });

  test("ignora imagens sem asset/url", () => {
    const fotos = mapAlbumFotos(
      [
        { _key: "k1", asset: null, alt: null },
        {
          _key: "k2",
          asset: { _id: "a2", url: "", metadata: null },
          alt: null,
        },
      ],
      "Título",
    );
    expect(fotos).toHaveLength(0);
  });

  test("usa fallback de alt e dimensões", () => {
    const fotos = mapAlbumFotos(
      [
        {
          _key: "k1",
          asset: { _id: "a1", url: "https://cdn.example.com/f.jpg", metadata: null },
          alt: null,
        },
      ],
      "Álbum X",
      (url) => url,
    );
    expect(fotos[0].alt).toBe("Álbum X");
    expect(fotos[0].width).toBe(800);
    expect(fotos[0].height).toBe(600);
  });
});

describe("normalizeAlbumListagem", () => {
  test("normaliza card válido com período e capa", () => {
    const result = normalizeAlbumListagem(baseListagem());
    expect(result).not.toBeNull();
    expect(result?.descricao).toBe("Momentos da abertura");
    expect(result?.periodoFormatado).toMatch(/1–28/);
    expect(result?.periodoFormatado).toContain("mar");
    expect(result?.capaUrl).toBe("https://cdn.sanity.io/capa.jpg");
  });

  test("retorna null sem campos obrigatórios", () => {
    expect(normalizeAlbumListagem(baseListagem({ _id: "" }))).toBeNull();
    expect(normalizeAlbumListagem(baseListagem({ titulo: "" }))).toBeNull();
    expect(normalizeAlbumListagem(baseListagem({ slug: "" }))).toBeNull();
    expect(normalizeAlbumListagem(baseListagem({ dataInicio: "" }))).toBeNull();
  });

  test("trim de descrição vazia vira null", () => {
    const result = normalizeAlbumListagem(baseListagem({ descricao: "   " }));
    expect(result?.descricao).toBeNull();
  });
});

describe("normalizeAlbumDetalhe", () => {
  test("normaliza detalhe com fotos, capaOg e evento", () => {
    const result = normalizeAlbumDetalhe(baseDetalhe());
    expect(result).not.toBeNull();
    expect(result?.descricao).toBe("Momentos da abertura");
    expect(result?.fotos).toHaveLength(2);
    expect(result?.fotos[0].src).toContain("w=1600");
    expect(result?.fotos[1].alt).toBe("Inauguração");
    expect(result?.totalFotos).toBe(2);
    expect(result?.capaOgUrl).toBe("https://cdn.sanity.io/foto1.jpg");
    expect(result?.periodoFormatado).toContain("1 e 28");
    expect(result?.periodoFormatado).toContain("março");
    expect(result?.eventoRelacionado?.slug).toBe("festa-abertura");
  });

  test("retorna null sem campos obrigatórios", () => {
    expect(normalizeAlbumDetalhe(baseDetalhe({ titulo: "" }))).toBeNull();
  });

  test("capaOgUrl null quando não há fotos válidas", () => {
    const result = normalizeAlbumDetalhe(baseDetalhe({ imagens: [] }));
    expect(result?.capaOgUrl).toBeNull();
    expect(result?.totalFotos).toBe(0);
  });

  test("preserva eventoRelacionado null", () => {
    const result = normalizeAlbumDetalhe(baseDetalhe({ eventoRelacionado: null }));
    expect(result?.eventoRelacionado).toBeNull();
  });
});
