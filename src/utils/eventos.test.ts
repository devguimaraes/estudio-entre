import { describe, expect, test } from "bun:test";
import { getCurrentMesKey } from "@/utils/eventos";

describe("getCurrentMesKey", () => {
  test("usa fuso America/Sao_Paulo, não o local do browser", () => {
    const date = new Date("2026-02-01T02:30:00.000Z");
    expect(getCurrentMesKey(date)).toBe("2026-01");
  });

  test("retorna mês corrente em SP para data no mesmo mês", () => {
    const date = new Date("2026-03-15T15:00:00-03:00");
    expect(getCurrentMesKey(date)).toBe("2026-03");
  });
});
