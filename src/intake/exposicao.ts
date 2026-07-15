import { isSafeExternalUrl } from "@/intake/evento";
import { exposicaoBySlugQuery, exposicoesByStatusQuery } from "@/sanity/queries/exposicao";
import {
  type ExposicaoDetalhe,
  type ExposicaoFoto,
  type ExposicaoListagem,
  type ExposicaoSanityDetalhe,
  type ExposicaoSanityImagem,
  type ExposicaoSanityListagem,
  type ExposicaoStatus,
  type FichaTecnicaItem,
  isExposicaoStatus,
} from "@/types/exposicao";
import { EVENT_TIME_ZONE } from "@/utils/eventos";

const COLLATOR_LOCALE = "pt-BR";

export { isExposicaoStatus } from "@/types/exposicao";

export type ResolveCapaUrl = (url: string | null) => string | null;
export type ResolveFotoUrl = (url: string) => string;

/** Parse data editorial YYYY-MM-DD como meio-dia no fuso Rio. */
export function parseEditorialDateOnly(date: string): Date {
  return new Date(`${date}T12:00:00-03:00`);
}

export function withImageParams(baseUrl: string, width: number): string {
  const params = new URLSearchParams({ auto: "format", w: String(width) });
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${params.toString()}`;
}

/** Período curto para cards de listagem (ex.: "15–28 mar."). */
export function formatarPeriodoListagem(dataInicio: string, dataFim: string | null): string {
  const formato = new Intl.DateTimeFormat(COLLATOR_LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: EVENT_TIME_ZONE,
  });

  if (!dataFim) return formato.format(parseEditorialDateOnly(dataInicio));

  const d1 = parseEditorialDateOnly(dataInicio);
  const d2 = parseEditorialDateOnly(dataFim);

  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    const mes = new Intl.DateTimeFormat(COLLATOR_LOCALE, {
      month: "short",
      timeZone: EVENT_TIME_ZONE,
    }).format(d1);
    return `${d1.getDate()}–${d2.getDate()} ${mes}`;
  }

  return `${formato.format(d1)} – ${formato.format(d2)}`;
}

/** Período longo para ficha técnica e detalhe (ex.: "15 de março de 2026 – 28 de abril de 2026"). */
export function formatarPeriodoDetalhe(dataInicio: string, dataFim: string | null): string {
  const formato = new Intl.DateTimeFormat(COLLATOR_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: EVENT_TIME_ZONE,
  });

  if (!dataFim) return formato.format(parseEditorialDateOnly(dataInicio));

  const d1 = parseEditorialDateOnly(dataInicio);
  const d2 = parseEditorialDateOnly(dataFim);

  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    const mesAno = new Intl.DateTimeFormat(COLLATOR_LOCALE, {
      month: "long",
      year: "numeric",
      timeZone: EVENT_TIME_ZONE,
    }).format(d1);
    return `${d1.getDate()} e ${d2.getDate()} de ${mesAno}`;
  }

  return `${formato.format(d1)} – ${formato.format(d2)}`;
}

export function resolveCapaListagemUrl(url: string | null): string | null {
  if (!url) return null;
  return url;
}

export function resolveCapaDetalheUrl(url: string | null): string | null {
  if (!url) return null;
  return withImageParams(url, 1800);
}

export function resolveFotoGaleriaUrl(url: string): string {
  return withImageParams(url, 1600);
}

export function mapExposicaoFotos(
  imagens: ExposicaoSanityImagem[] | null,
  titulo: string,
  resolveFoto: ResolveFotoUrl = resolveFotoGaleriaUrl,
): ExposicaoFoto[] {
  return (imagens ?? [])
    .filter((img) => img.url)
    .map((img) => ({
      id: img._key,
      src: resolveFoto(img.url),
      alt: img.alt ?? titulo,
      width: img.width ?? 800,
      height: img.height ?? 600,
    }));
}

export function buildFichaTecnica(
  detalhe: Pick<
    ExposicaoSanityDetalhe,
    "artista" | "curadoria" | "dataInicio" | "dataFim" | "local" | "tecnica"
  >,
  periodoFormatado: string,
): FichaTecnicaItem[] {
  return [
    { label: "Artista", value: detalhe.artista },
    { label: "Curadoria", value: detalhe.curadoria },
    { label: "Período", value: periodoFormatado },
    { label: "Local", value: detalhe.local },
    { label: "Técnica", value: detalhe.tecnica },
  ].filter((item): item is FichaTecnicaItem => Boolean(item.value));
}

export function normalizeExposicaoListagem(
  doc: ExposicaoSanityListagem,
  resolveCapa: ResolveCapaUrl = resolveCapaListagemUrl,
): ExposicaoListagem | null {
  if (!doc._id || !doc.titulo || !doc.slug || !doc.dataInicio || !isExposicaoStatus(doc.status)) {
    return null;
  }

  return {
    _id: doc._id,
    titulo: doc.titulo,
    slug: doc.slug,
    artista: doc.artista?.trim() || null,
    dataInicio: doc.dataInicio,
    dataFim: doc.dataFim,
    status: doc.status,
    periodoFormatado: formatarPeriodoListagem(doc.dataInicio, doc.dataFim),
    capaUrl: resolveCapa(doc.capaUrl),
    capaWidth: doc.capaWidth,
    capaHeight: doc.capaHeight,
  };
}

export function normalizeExposicaoListagens(
  docs: ExposicaoSanityListagem[],
  resolveCapa: ResolveCapaUrl = resolveCapaListagemUrl,
): ExposicaoListagem[] {
  return docs
    .map((doc) => normalizeExposicaoListagem(doc, resolveCapa))
    .filter((item): item is ExposicaoListagem => item !== null);
}

export function normalizeExposicaoDetalhe(
  doc: ExposicaoSanityDetalhe,
  resolveCapa: ResolveCapaUrl = resolveCapaDetalheUrl,
  resolveFoto: ResolveFotoUrl = resolveFotoGaleriaUrl,
): ExposicaoDetalhe | null {
  if (!doc._id || !doc.titulo || !doc.slug || !doc.dataInicio || !isExposicaoStatus(doc.status)) {
    return null;
  }

  const periodoFormatado = formatarPeriodoDetalhe(doc.dataInicio, doc.dataFim);
  const linkAgendamento = isSafeExternalUrl(doc.linkAgendamento) ? doc.linkAgendamento : null;

  return {
    _id: doc._id,
    titulo: doc.titulo,
    slug: doc.slug,
    subtitulo: doc.subtitulo?.trim() || null,
    textoCuratorial: doc.textoCuratorial,
    artista: doc.artista?.trim() || null,
    curadoria: doc.curadoria?.trim() || null,
    dataInicio: doc.dataInicio,
    dataFim: doc.dataFim,
    local: doc.local?.trim() || null,
    tecnica: doc.tecnica?.trim() || null,
    apoio: doc.apoio?.trim() || null,
    status: doc.status,
    linkAgendamento,
    periodoFormatado,
    capaUrl: resolveCapa(doc.capaUrl),
    capaOgUrl: doc.capaUrl,
    fotos: mapExposicaoFotos(doc.imagens, doc.titulo, resolveFoto),
    fichaTecnica: buildFichaTecnica(doc, periodoFormatado),
    albumRelacionado: doc.albumRelacionado,
  };
}

export async function getExposicoesPorStatus(
  status: ExposicaoStatus,
): Promise<ExposicaoListagem[]> {
  try {
    const { sanityClient } = await import("sanity:client");
    const docs = await sanityClient.fetch<ExposicaoSanityListagem[]>(exposicoesByStatusQuery, {
      status,
    });
    return normalizeExposicaoListagens(docs);
  } catch (error) {
    console.error(`Falha ao buscar exposições (${status}) do Sanity:`, error);
    return [];
  }
}

export async function getExposicaoPorSlug(slug: string): Promise<ExposicaoDetalhe | null> {
  try {
    const { sanityClient } = await import("sanity:client");
    const doc = await sanityClient.fetch<ExposicaoSanityDetalhe | null>(exposicaoBySlugQuery, {
      slug,
    });
    if (!doc) return null;
    return normalizeExposicaoDetalhe(doc);
  } catch (error) {
    console.error(`Falha ao buscar exposição "${slug}" do Sanity:`, error);
    return null;
  }
}

export async function getTodosExposicaoSlugs(): Promise<string[]> {
  try {
    const { sanityClient } = await import("sanity:client");
    const { todasExposicoesSlugsQuery } = await import("@/sanity/queries/exposicao");
    const slugs: { slug: string }[] = await sanityClient.fetch(todasExposicoesSlugsQuery);
    return slugs.map((s) => s.slug);
  } catch (error) {
    console.error("Falha ao buscar slugs de exposições do Sanity:", error);
    return [];
  }
}
