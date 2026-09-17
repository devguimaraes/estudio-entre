import { describe, expect, test } from "bun:test";
import {
  ORGANIZATION,
  PAGE_SEO,
  SITE_NAME,
  formatAddressLine,
  formatAddressLines,
  localBusinessSchema,
} from "@/utils/seo";

describe("NAP canônico", () => {
  test("alinha nome, endereço e telefone ao Google Meu Negócio", () => {
    expect(ORGANIZATION.name).toBe("Estúdio Entre - Centro Cultural Méier");
    expect(ORGANIZATION.alternateName).toBe(SITE_NAME);
    expect(ORGANIZATION.telephone).toBe("+5521973101451");
    expect(ORGANIZATION.telephoneDisplay).toBe("(21) 97310-1451");
    expect(ORGANIZATION.address.streetAddress).toBe("Rua Maria Calmon, Nº 100");
    expect(ORGANIZATION.address.neighborhood).toBe("Méier");
    expect(ORGANIZATION.address.postalCode).toBe("20710-030");
    expect(ORGANIZATION.geo).toEqual({
      latitude: -22.9043232,
      longitude: -43.2768551,
    });
  });

  test("formata endereço visível no padrão GMB", () => {
    expect(formatAddressLine()).toBe(
      "Rua Maria Calmon, Nº 100 - Méier, Rio de Janeiro - RJ, 20710-030",
    );
    expect(formatAddressLines()).toEqual([
      "Rua Maria Calmon, Nº 100",
      "Méier, Rio de Janeiro - RJ",
      "20710-030",
    ]);
  });

  test("JSON-LD LocalBusiness replica o NAP do GMB", () => {
    const schema = localBusinessSchema() as {
      name: string;
      alternateName: string;
      telephone: string;
      hasMap: string;
      address: { streetAddress: string; addressLocality: string };
      geo: { latitude: number; longitude: number };
    };

    expect(schema.name).toBe(ORGANIZATION.name);
    expect(schema.alternateName).toBe(SITE_NAME);
    expect(schema.telephone).toBe(ORGANIZATION.telephone);
    expect(schema.hasMap).toBe(ORGANIZATION.mapsUrl);
    expect(schema.address.streetAddress).toBe("Rua Maria Calmon, Nº 100");
    expect(schema.address.addressLocality).toBe("Rio de Janeiro");
    expect(schema.geo.latitude).toBe(-22.9043232);
    expect(schema.geo.longitude).toBe(-43.2768551);
  });
});

describe("PAGE_SEO", () => {
  test("home usa nome GMB e local no title", () => {
    expect(PAGE_SEO.home.title).toContain("Centro Cultural Méier");
    expect(PAGE_SEO.home.title).toContain("RJ");
    expect(PAGE_SEO.home.description).toContain("Méier");
  });

  test("páginas internas não repetem sufixo GMB no title", () => {
    const internalPages = [
      PAGE_SEO.agenda,
      PAGE_SEO.galeria,
      PAGE_SEO.exposicoes,
      PAGE_SEO.sebo,
      PAGE_SEO.lojinha,
    ];

    for (const page of internalPages) {
      expect(page.title).not.toContain("| Centro Cultural Méier");
      expect(page.title).toContain("Estúdio Entre");
    }
  });

  test("cada listagem tem title e description únicos", () => {
    const pages = Object.values(PAGE_SEO);
    const titles = pages.map((page) => page.title);
    const descriptions = pages.map((page) => page.description);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
