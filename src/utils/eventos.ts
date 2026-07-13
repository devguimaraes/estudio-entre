import type { EventoNormalizado } from "@/types/evento";

export const EVENT_TIME_ZONE = "America/Sao_Paulo";

const COLLATOR_LOCALE = "pt-BR";

export function getAvailableMonthKeys(eventos: EventoNormalizado[]): string[] {
  return Array.from(new Set(eventos.map((evento) => evento.mesKey)));
}

export function formatMonthLabel(mesKey: string): string {
  const [year, month] = mesKey.split("-").map(Number);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: EVENT_TIME_ZONE,
  }).format(new Date(Date.UTC(year, month - 1, 15)));
}

export function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase(COLLATOR_LOCALE);
}
