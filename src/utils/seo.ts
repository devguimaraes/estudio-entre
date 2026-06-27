/**
 * Utilitários de SEO — metadados de compartilhamento social (Open Graph, Twitter Cards)
 * e dados estruturados Schema.org.
 *
 * Todas as funções são puras e não dependem de runtime do Astro.
 */

/** Nome canônico do site, usado em `og:site_name` e fallback de título. */
export const SITE_NAME = "Estúdio Entre";

/** Descrição padrão para compartilhamento quando a página não define uma própria. */
export const DEFAULT_DESCRIPTION =
  "Hub cultural e criativo independente no Méier, Rio de Janeiro. Entre livros, vozes e beats.";

/** Tamanhos recomendados para imagem de compartilhamento (OG / Twitter). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Otimiza uma URL de imagem para compartilhamento social.
 *
 * Para URLs do CDN do Sanity (`cdn.sanity.io`), adiciona parâmetros de redimensionamento
 * para o formato 1200×630 recomendado pelo Open Graph e WhatsApp.
 *
 * Para qualquer outra URL (paths relativos, outros domínios), retorna a URL original.
 *
 * @param imageUrl - URL da imagem (absoluta ou relativa)
 * @returns URL otimizada para preview social
 */
export function buildOgImageUrl(imageUrl: string): string {
  if (!imageUrl) return imageUrl;

  // Sanity CDN: adicionar crop/dimensões OG
  if (imageUrl.includes("cdn.sanity.io")) {
    const separator = imageUrl.includes("?") ? "&" : "?";
    return `${imageUrl}${separator}w=${OG_IMAGE_SIZE.width}&h=${OG_IMAGE_SIZE.height}&fit=crop`;
  }

  return imageUrl;
}

/**
 * Converte um path relativo em URL absoluta usando o `site` do Astro.
 *
 * URLs que já são absolutas (https://…) são retornadas sem modificação.
 *
 * @param url - Path relativo (`/og-default.png`) ou URL absoluta
 * @param site - URL base do site (Astro.site)
 * @returns URL absoluta pronta para meta tags
 */
export function ensureAbsoluteUrl(url: string, site: URL): string {
  if (!url) return url;

  // Já é absoluta (ex.: Sanity CDN, domínio externo)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Path relativo — resolver contra o site
  return new URL(url, site).href;
}

/**
 * Constrói a URL canônica normalizada para uma página.
 *
 * Garante trailing slash consistente e encoding correto.
 *
 * @param pathname - Pathname da página (Astro.url.pathname)
 * @param site - URL base do site (Astro.site)
 * @returns URL canônica absoluta
 */
export function canonicalUrl(pathname: string, site: URL): string {
  return new URL(pathname, site).href;
}

// ---------------------------------------------------------------------------
// Schema.org JSON-LD
// ---------------------------------------------------------------------------

/** Dados canônicos da organização — fonte única para Schema.org e meta tags. */
export const ORGANIZATION = {
  name: "Estúdio Entre",
  description:
    "Hub cultural e criativo independente no Méier, Rio de Janeiro. Agenda de shows, oficinas, saraus, exposições. Sebo colaborativo, loja autoral e produção de conteúdo.",
  url: "https://www.estudioentre.com.br",
  telephone: "+5521973101451",
  email: "contato@estudioentre.com.br",
  address: {
    streetAddress: "Rua Maria Calmon, 100",
    addressLocality: "Rio de Janeiro",
    addressRegion: "RJ",
    postalCode: "20710-030",
    addressCountry: "BR",
  },
  geo: {
    latitude: -22.9027,
    longitude: -43.2096,
  },
  sameAs: [
    "https://instagram.com/entrenoestudio",
    "https://tiktok.com/@entrenoestudio",
    "https://maps.app.goo.gl/A9bjYkH2eRP2ekz87",
  ],
  openingHoursSpecification: [
    {
      dayOfWeek: ["Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    {
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "15:00",
    },
  ],
} as const;

/**
 * Constrói o objeto JSON-LD `Organization` + `LocalBusiness` + `EntertainmentBusiness`
 * para a página inicial.
 *
 * Usar com `<script type="application/ld+json">` + `JSON.stringify()`.
 *
 * @returns Objeto JSON-LD pronto para serialização
 */
export function localBusinessSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "EntertainmentBusiness"],
    name: ORGANIZATION.name,
    description: ORGANIZATION.description,
    url: ORGANIZATION.url,
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION.address.streetAddress,
      addressLocality: ORGANIZATION.address.addressLocality,
      addressRegion: ORGANIZATION.address.addressRegion,
      postalCode: ORGANIZATION.address.postalCode,
      addressCountry: ORGANIZATION.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORGANIZATION.geo.latitude,
      longitude: ORGANIZATION.geo.longitude,
    },
    sameAs: ORGANIZATION.sameAs,
    openingHoursSpecification: ORGANIZATION.openingHoursSpecification.map(
      (spec) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: spec.dayOfWeek,
        opens: spec.opens,
        closes: spec.closes,
      }),
    ),
  };
}
