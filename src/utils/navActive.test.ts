import { describe, expect, test } from "bun:test";
import { isLinkActive } from "@/utils/navActive";

describe("isLinkActive", () => {
  test("ativa âncora na home quando activeHash coincide", () => {
    expect(isLinkActive("/#espaco", "/", "espaco")).toBe(true);
    expect(isLinkActive("/#espaco", "/", "agenda")).toBe(false);
  });

  test("ativa path completo na rota correspondente", () => {
    expect(isLinkActive("/agenda", "/agenda", "")).toBe(true);
    expect(isLinkActive("/locacao", "/locacao", "")).toBe(true);
    expect(isLinkActive("/galeria/foo", "/galeria/foo", "")).toBe(true);
  });

  test("ativa /agenda na home quando scroll está na seção agenda", () => {
    expect(isLinkActive("/agenda", "/", "agenda")).toBe(true);
    expect(isLinkActive("/agenda", "/", "espaco")).toBe(false);
  });
});
