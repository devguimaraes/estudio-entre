import type { CategoriaEvento, EventoCard, EventoNormalizado } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";

const COLLATOR_LOCALE = "pt-BR";

export function isCategoriaEvento(value: unknown): value is CategoriaEvento {
  return typeof value === "string" && value in CATEGORIAS;
}

export function getMesKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function isSafeExternalUrl(value: string | null): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeEvento(evento: EventoCard): EventoNormalizado | null {
  if (!evento._id || !evento.titulo || !isCategoriaEvento(evento.categoria)) {
    return null;
  }

  const data = new Date(evento.dataHora);
  if (Number.isNaN(data.getTime())) {
    return null;
  }

  const local = evento.local?.trim() || null;
  const descricao = evento.descricao?.trim() || null;
  const valor = evento.valor?.trim() || null;
  const linkCompra = isSafeExternalUrl(evento.linkCompra) ? evento.linkCompra : null;
  const buscaTexto = [evento.titulo, local, descricao]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase(COLLATOR_LOCALE);

  return {
    ...evento,
    local,
    descricao,
    valor,
    linkCompra,
    timestamp: data.getTime(),
    mesKey: getMesKey(data),
    buscaTexto,
  };
}

export function normalizeEventos(eventos: EventoCard[]): EventoNormalizado[] {
  return eventos
    .map(normalizeEvento)
    .filter((evento): evento is EventoNormalizado => evento !== null)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function getFutureEventos(eventos: EventoNormalizado[], referenceDate = new Date()) {
  return eventos.filter((evento) => evento.timestamp >= referenceDate.getTime());
}

export function getAvailableMonthKeys(eventos: EventoNormalizado[]): string[] {
  return Array.from(new Set(eventos.map((evento) => evento.mesKey)));
}

export function formatMonthLabel(mesKey: string): string {
  const [year, month] = mesKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase(COLLATOR_LOCALE);
}
