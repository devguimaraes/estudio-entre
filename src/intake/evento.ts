import { isCategoriaEvento } from "@/domain/categoriaEvento";
import { eventosFuturosQuery } from "@/sanity/queries/evento";
import type { EventoNormalizado, EventoSanityDocument, SanityImageRef } from "@/types/evento";
import { EVENT_TIME_ZONE } from "@/utils/eventos";

const COLLATOR_LOCALE = "pt-BR";

export type ResolveEventoImage = (imagens: SanityImageRef[] | null) => string | null;

export function getMesKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  return `${year}-${month}`;
}

export function getDiaKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
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

export function formatDataEvento(date: Date): string {
  return new Intl.DateTimeFormat(COLLATOR_LOCALE, {
    timeZone: EVENT_TIME_ZONE,
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatHoraEvento(date: Date): string {
  return new Intl.DateTimeFormat(COLLATOR_LOCALE, {
    timeZone: EVENT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Normaliza um documento Sanity em DTO de UI.
 * `resolveImage` é injetável para testes sem client Sanity.
 */
export function normalizeEventoDocument(
  doc: EventoSanityDocument,
  resolveImage: ResolveEventoImage = () => null,
): EventoNormalizado | null {
  if (!doc._id || !doc.titulo || !isCategoriaEvento(doc.categoria)) {
    return null;
  }

  const data = new Date(doc.dataHora);
  if (Number.isNaN(data.getTime())) {
    return null;
  }

  const local = doc.local?.trim() || null;
  const descricao = doc.descricao?.trim() || null;
  const valor = doc.valor?.trim() || null;
  const linkCompra = isSafeExternalUrl(doc.linkCompra) ? doc.linkCompra : null;
  const buscaTexto = [doc.titulo, local, descricao]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase(COLLATOR_LOCALE);

  return {
    _id: doc._id,
    titulo: doc.titulo,
    slug: doc.slug,
    categoria: doc.categoria,
    dataHora: doc.dataHora,
    dataFormatada: formatDataEvento(data),
    horaFormatada: formatHoraEvento(data),
    diaKey: getDiaKey(data),
    local,
    descricao,
    valor,
    linkCompra,
    imagemUrl: resolveImage(doc.imagens),
    timestamp: data.getTime(),
    mesKey: getMesKey(data),
    buscaTexto,
  };
}

export function normalizeEventoDocuments(
  docs: EventoSanityDocument[],
  resolveImage: ResolveEventoImage = () => null,
): EventoNormalizado[] {
  return docs
    .map((doc) => normalizeEventoDocument(doc, resolveImage))
    .filter((evento): evento is EventoNormalizado => evento !== null)
    .sort((a, b) => a.timestamp - b.timestamp);
}

/** Fetch + normalização — único ponto de entrada para pages Astro. */
export async function getEventosFuturos(): Promise<EventoNormalizado[]> {
  try {
    const { sanityClient } = await import("sanity:client");
    const { urlFor } = await import("@/sanity/image");

    const docs = await sanityClient.fetch<EventoSanityDocument[]>(eventosFuturosQuery);

    return normalizeEventoDocuments(docs, (imagens) => {
      const principal = imagens?.[0];
      if (!principal?.asset?._ref) return null;
      try {
        // Sem height fixo: preserva proporção original (evita crop/zoom do Sanity).
        return urlFor(principal).width(1200).fit("max").auto("format").url();
      } catch {
        return null;
      }
    });
  } catch (error) {
    console.error("Falha ao buscar eventos futuros do Sanity:", error);
    return [];
  }
}
