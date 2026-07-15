import { describe, expect, test } from "bun:test";
import { formatPreco } from "@/utils/locacao";

describe("formatPreco", () => {
  test("formata valor numérico como R$", () => {
    expect(formatPreco(80)).toBe("R$80");
    expect(formatPreco(600)).toBe("R$600");
  });

  test("retorna travessão para valor nulo", () => {
    expect(formatPreco(null)).toBe("—");
  });
});
