# SEO — Schema.org LocalBusiness + Google Tags

**Data:** 2026-06-27
**Issues Linear:** DEV-56 (Schema + Search Console), DEV-59 (GA4 + Search Console)
**Pré-requisito:** OG/Twitter Cards já implementados (`BaseLayout.astro`, `src/utils/seo.ts`, `public/og-default.png`)

## Escopo

1. Schema.org JSON-LD `Organization` + `LocalBusiness` + `EntertainmentBusiness` na home
2. Meta tag Google Search Console no `<head>`
3. Script Google Analytics 4 condicional no `<head>`
4. Link Google Meu Negócio no `sameAs` do schema

## Dados reais extraídos do código

| Campo | Valor | Fonte |
|---|---|---|
| Nome | Estúdio Entre | --
| Telefone | `+5521973101451` | Contato.astro |
| Email | `contato@estudioentre.com.br` | Contato.astro + API |
| Endereço | Rua Maria Calmon, 100, Méier, RJ, 20710-030 | Contato.astro |
| Lat/Lng | `-22.9014, -43.2822` | Méier (Wikipedia/OSM) |
| Horário | Qua-Sex 10h-18h, Sáb 10h-15h | Contato.astro |
| Instagram | `https://instagram.com/entrenoestudio` | Contato.astro / Footer |
| TikTok | `https://tiktok.com/@entrenoestudio` | Contato.astro / Footer |
| Google Meu Negócio | `https://maps.app.goo.gl/A9bjYkH2eRP2ekz87` | Fornecido pelo usuário |
| Search Console | `fWixLc61ACypJ23mrNhrwCNGM5i90arCA7qTj0ry3yA` | Fornecido pelo usuário |
| GA4 ID | `G-VPDFH2DZLR` | Fornecido pelo usuário |

## Arquivos a modificar

### `src/utils/seo.ts`

**Novas exportações:**

```ts
// Constantes tipadas da organização
export const ORGANIZATION = {
  name, description, url, telephone, email,
  address: { streetAddress, addressLocality, addressRegion, postalCode, addressCountry },
  geo: { latitude, longitude },
  sameAs: [instagram, tiktok, googleMeuNegocio],
  openingHoursSpecification: [
    { dayOfWeek: ["Wednesday","Thursday","Friday"], opens: "10:00", closes: "18:00" },
    { dayOfWeek: ["Saturday"], opens: "10:00", closes: "15:00" },
  ],
};

// Builder JSON-LD — retorna objeto puro pronto para JSON.stringify()
export function localBusinessSchema(): object;
```

Schema combina `@type: ["Organization", "LocalBusiness", "EntertainmentBusiness"]`.

### `src/layouts/BaseLayout.astro`

**Três blocos novos no `<head>` (após as fontes):**

```html
<!-- Google Search Console -->
<meta name="google-site-verification" content="fWixLc61ACypJ23mrNhrwCNGM5i90arCA7qTj0ry3yA" />

<!-- Google Analytics 4 — habilitado via env var PUBLIC_GA4_MEASUREMENT_ID -->
{import.meta.env.PUBLIC_GA4_MEASUREMENT_ID && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.PUBLIC_GA4_MEASUREMENT_ID}`}></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', import.meta.env.PUBLIC_GA4_MEASUREMENT_ID);
    </script>
  </>
)}

<!-- Schema.org JSON-LD (apenas home) -->
{Astro.url.pathname === "/" && (
  <script type="application/ld+json" set:html={JSON.stringify(localBusinessSchema())} />
)}
```

**Nova import no frontmatter:** `import { localBusinessSchema } from "@/utils/seo";`

### `.env` (variável de ambiente)

```
PUBLIC_GA4_MEASUREMENT_ID=G-VPDFH2DZLR
```

## Fora de escopo

- Schema `Product`, `Event`, `ExhibitionEvent` — iteração futura
- Eventos customizados GA4 (`cta_click`, `form_submit`) — depende de configuração no painel GA4
- Google Meu Negócio além do link no schema

## Verificação

1. `bun run build` — sem erros
2. `grep 'google-site-verification' dist/client/index.html` — presente
3. `grep 'googletagmanager' dist/client/index.html` — script presente
4. `grep 'application/ld+json' dist/client/index.html` — presente só na home
5. `grep 'application/ld+json' dist/client/agenda/index.html` — ausente
6. Validar JSON-LD em https://validator.schema.org — zero erros
7. Lighthouse SEO = 100
