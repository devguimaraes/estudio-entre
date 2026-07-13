import {
  formatarPeriodoDetalhe,
  formatarPeriodoListagem,
  withImageParams,
} from "@/intake/exposicao";
import { albumBySlugQuery, albunsQuery, todosAlbunsSlugsQuery } from "@/sanity/queries/album";
import type {
  AlbumCard,
  AlbumDetalhe,
  AlbumFoto,
  AlbumSanityDetalhe,
  AlbumSanityImagem,
  AlbumSanityListagem,
} from "@/types/album";

export type ResolveCapaUrl = (url: string | null) => string | null;
export type ResolveFotoUrl = (url: string) => string;

export function resolveCapaListagemUrl(url: string | null): string | null {
  if (!url) return null;
  return url;
}

export function resolveFotoAlbumUrl(url: string): string {
  return withImageParams(url, 1600);
}

export function mapAlbumFotos(
  imagens: AlbumSanityImagem[] | null,
  titulo: string,
  resolveFoto: ResolveFotoUrl = resolveFotoAlbumUrl,
): AlbumFoto[] {
  return (imagens ?? [])
    .filter((img) => img.asset?.url)
    .map((img) => ({
      id: img._key,
      src: resolveFoto(img.asset!.url),
      alt: img.alt ?? titulo,
      width: img.asset!.metadata?.dimensions?.width ?? 800,
      height: img.asset!.metadata?.dimensions?.height ?? 600,
    }));
}

export function normalizeAlbumListagem(
  doc: AlbumSanityListagem,
  resolveCapa: ResolveCapaUrl = resolveCapaListagemUrl,
): AlbumCard | null {
  if (!doc._id || !doc.titulo || !doc.slug || !doc.dataInicio) {
    return null;
  }

  return {
    _id: doc._id,
    titulo: doc.titulo,
    slug: doc.slug,
    descricao: doc.descricao?.trim() || null,
    dataInicio: doc.dataInicio,
    dataFim: doc.dataFim,
    periodoFormatado: formatarPeriodoListagem(doc.dataInicio, doc.dataFim),
    capaUrl: resolveCapa(doc.capaUrl),
  };
}

export function normalizeAlbumListagens(
  docs: AlbumSanityListagem[],
  resolveCapa: ResolveCapaUrl = resolveCapaListagemUrl,
): AlbumCard[] {
  return docs
    .map((doc) => normalizeAlbumListagem(doc, resolveCapa))
    .filter((item): item is AlbumCard => item !== null);
}

export function normalizeAlbumDetalhe(
  doc: AlbumSanityDetalhe,
  resolveFoto: ResolveFotoUrl = resolveFotoAlbumUrl,
): AlbumDetalhe | null {
  if (!doc._id || !doc.titulo || !doc.slug || !doc.dataInicio) {
    return null;
  }

  const fotos = mapAlbumFotos(doc.imagens, doc.titulo, resolveFoto);
  const capaOgUrl = doc.imagens?.find((img) => img.asset?.url)?.asset?.url ?? null;

  return {
    _id: doc._id,
    titulo: doc.titulo,
    slug: doc.slug,
    descricao: doc.descricao?.trim() || null,
    dataInicio: doc.dataInicio,
    dataFim: doc.dataFim,
    periodoFormatado: formatarPeriodoDetalhe(doc.dataInicio, doc.dataFim),
    fotos,
    totalFotos: fotos.length,
    capaOgUrl,
    eventoRelacionado: doc.eventoRelacionado,
  };
}

export async function getAlbuns(): Promise<AlbumCard[]> {
  try {
    const { sanityClient } = await import("sanity:client");
    const docs = await sanityClient.fetch<AlbumSanityListagem[]>(albunsQuery);
    return normalizeAlbumListagens(docs);
  } catch (error) {
    console.error("Falha ao buscar álbuns do Sanity:", error);
    return [];
  }
}

export async function getAlbumPorSlug(slug: string): Promise<AlbumDetalhe | null> {
  try {
    const { sanityClient } = await import("sanity:client");
    const doc = await sanityClient.fetch<AlbumSanityDetalhe | null>(albumBySlugQuery, { slug });
    if (!doc) return null;
    return normalizeAlbumDetalhe(doc);
  } catch (error) {
    console.error(`Falha ao buscar álbum "${slug}" do Sanity:`, error);
    return null;
  }
}

export async function getTodosAlbumSlugs(): Promise<string[]> {
  try {
    const { sanityClient } = await import("sanity:client");
    const slugs: { slug: string }[] = await sanityClient.fetch(todosAlbunsSlugsQuery);
    return slugs.map((s) => s.slug);
  } catch (error) {
    console.error("Falha ao buscar slugs de álbuns do Sanity:", error);
    return [];
  }
}
