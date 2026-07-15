import { describe, expect, test } from "bun:test";
import { navGroups } from "@/components/nav/navConfig";

describe("navConfig", () => {
  test("Serviços contém Locação apontando para /locacao", () => {
    const servicos = navGroups.find((group) => group.id === "servicos");
    expect(servicos).toBeDefined();
    const locacao = servicos?.links.find((link) => link.label === "Locação");
    expect(locacao?.href).toBe("/locacao");
  });

  test("O Entre mantém âncoras de O Lugar e Visitação", () => {
    const oEntre = navGroups.find((group) => group.id === "o-entre");
    const hrefs = oEntre?.links.map((link) => link.href);
    expect(hrefs).toContain("/#espaco");
    expect(hrefs).toContain("/#agendar-visita");
  });

  test("Programação contém Exposições, Agenda e Galeria", () => {
    const programacao = navGroups.find((group) => group.id === "programacao");
    const labels = programacao?.links.map((link) => link.label);
    expect(labels).toEqual(["Exposições", "Agenda", "Galeria"]);
  });

  test("desktop e mobile compartilham o mesmo mapa de links", () => {
    const flatLinks = navGroups.flatMap((group) => group.links);
    expect(flatLinks).toHaveLength(9);
    expect(flatLinks.map((link) => link.href)).toContain("/locacao");
  });
});
