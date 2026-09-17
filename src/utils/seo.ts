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
  "Centro cultural independente no Méier, Zona Norte do Rio. Biblioterapia, oficinas, palestras e estúdio para podcasts, DJ e videocasts. LGBTQ+ friendly.";

export interface PageSeo {
  title: string;
  description: string;
}

/** Titles e descriptions por intenção de busca — fonte única das páginas de listagem. */
export const PAGE_SEO = {
  home: {
    title: "Estúdio Entre - Centro Cultural Méier, RJ",
    description: DEFAULT_DESCRIPTION,
  },
  agenda: {
    title: "Agenda cultural no Méier — Estúdio Entre",
    description:
      "Confira encontros, oficinas, palestras, saraus e vivências no Méier. Programação atualizada do Estúdio Entre. Veja datas e reserve.",
  },
  galeria: {
    title: "Galeria de eventos — Estúdio Entre",
    description:
      "Fotos de inaugurações, exposições e encontros no hub cultural do Méier. Veja os registros do Estúdio Entre.",
  },
  exposicoes: {
    title: "Exposições em cartaz no Méier — Estúdio Entre",
    description:
      "Exposições em cartaz, futuras e acervo no Estúdio Entre, Méier. Conheça artistas, curadoria e período de visitação.",
  },
  sebo: {
    title: "Sebo no Méier — Estúdio Entre",
    description:
      "Livros usados no Méier. Garimpe o sebo do Estúdio Entre por gênero, autor ou título e fale no WhatsApp.",
  },
  lojinha: {
    title: "Loja autoral — Estúdio Entre",
    description:
      "Publicações independentes, objetos autorais e produtos da casa no Estúdio Entre. Compre ou retire no Méier.",
  },
} as const satisfies Record<string, PageSeo>;

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

const GMB_MAPS_URL = "https://maps.app.goo.gl/A9bjYkH2eRP2ekz87";

/** Dados canônicos da organização — fonte única para Schema.org e NAP visível. */
export const ORGANIZATION = {
  name: "Estúdio Entre - Centro Cultural Méier",
  alternateName: SITE_NAME,
  description:
    "Um Centro cultural independente no coração do Méier, Zona Norte do Rio de Janeiro. O Estúdio Entre reúne rodas de biblioterapia, oficinas, palestras e encontros culturais em um espaço plural e acolhedor, onde arte, palavra e cuidado se encontram para inspirar conexões reais. Para criadores de conteúdo, oferecemos estúdio profissional com estrutura completa para gravação de podcasts, sets de DJ e videocasts. Um espaço construído por mulheres empreendedoras, para pessoas que acreditam que cultura é acesso, cura e pertencimento. LGBTQ+ friendly. Entre — é só entrar.",
  url: "https://www.estudioentre.com.br",
  telephone: "+5521973101451",
  telephoneDisplay: "(21) 97310-1451",
  whatsappUrl: "https://wa.me/5521973101451",
  email: "contato@estudioentre.com.br",
  mapsUrl: GMB_MAPS_URL,
  address: {
    streetAddress: "Rua Maria Calmon, Nº 100",
    neighborhood: "Méier",
    addressLocality: "Rio de Janeiro",
    addressRegion: "RJ",
    postalCode: "20710-030",
    addressCountry: "BR",
  },
  geo: {
    latitude: -22.9043232,
    longitude: -43.2768551,
  },
  sameAs: [
    "https://instagram.com/entrenoestudio",
    "https://tiktok.com/@entrenoestudio",
    GMB_MAPS_URL,
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

/** Linhas do endereço para blocos `<address>` (rua, bairro/cidade/UF, CEP). */
export function formatAddressLines(): readonly [string, string, string] {
  const { streetAddress, neighborhood, addressLocality, addressRegion, postalCode } =
    ORGANIZATION.address;

  return [streetAddress, `${neighborhood}, ${addressLocality} - ${addressRegion}`, postalCode];
}

/** Endereço em uma linha, alinhado ao Google Meu Negócio. */
export function formatAddressLine(): string {
  const { streetAddress, neighborhood, addressLocality, addressRegion, postalCode } =
    ORGANIZATION.address;

  return `${streetAddress} - ${neighborhood}, ${addressLocality} - ${addressRegion}, ${postalCode}`;
}

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
    alternateName: ORGANIZATION.alternateName,
    description: ORGANIZATION.description,
    url: ORGANIZATION.url,
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    hasMap: ORGANIZATION.mapsUrl,
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
    openingHoursSpecification: ORGANIZATION.openingHoursSpecification.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.dayOfWeek,
      opens: spec.opens,
      closes: spec.closes,
    })),
  };
}
