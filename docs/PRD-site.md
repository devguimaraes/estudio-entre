# PRD — Site Institucional Estúdio Entre

> **Versão:** 2.0 · **Atualizado em:** Abril 2026  
> **Status:** Documento técnico de referência para desenvolvimento

---

## 1. Visão e Objetivos

### Objetivo do Site

O site do Estúdio Entre tem três funções primárias:

1. **Autoridade e descoberta:** ser encontrado organicamente por quem busca espaço cultural, biblioterapia, sarau ou gravação de podcast no Méier/zona norte do Rio
2. **Conversão:** transformar visitantes em participantes de eventos ou clientes do estúdio de áudio
3. **Hub de informação:** centralizar agenda, serviços e formas de contato — reduzindo a dependência de redes sociais como única fonte de informação

### Métricas de Sucesso

| Métrica | Meta (3 meses pós-lançamento) |
|---|---|
| Lighthouse Performance | ≥ 95 |
| Lighthouse SEO | ≥ 98 |
| Lighthouse Accessibility | ≥ 95 |
| Core Web Vitals (LCP) | < 2.5s |
| Core Web Vitals (CLS) | < 0.1 |
| Cliques orgânicos/mês | > 200 |
| Posição média keywords-alvo | Top 5 local |

---

## 2. Stack Técnico

### Resumo Executivo — Custo Total: R$ 0/mês

| Camada | Tecnologia | Versão | Custo |
|---|---|---|---|
| Framework | Astro | 5.x | Gratuito |
| UI Islands | React | 19.x | Gratuito |
| Estilos | Tailwind CSS | 4.x | Gratuito |
| Componentes base | Shadcn/ui + Radix UI | latest | Gratuito |
| Scroll suave | Lenis | latest | Gratuito |
| Animações | GSAP + ScrollTrigger + SplitText | 3.x | Gratuito* |
| CMS | Sanity.io | Free plan | R$ 0 |
| Linting | Biome | latest | Gratuito |
| Runtime / PM | Bun | latest | Gratuito |
| Deploy | Vercel Hobby | — | R$ 0 |
| Analytics | GA4 + Search Console | — | R$ 0 |

> *GSAP é gratuito para projetos sem fins comerciais. Validar a natureza comercial do projeto antes da produção para definir necessidade de licença Business (~$200/ano).

### Por que Astro e não Next.js

| Critério | Astro 5 | Next.js 14 |
|---|---|---|
| JS entregue ao browser | ~20kb (apenas islands) | ~200kb+ por padrão |
| SSG nativo | Sim, sem configuração | Requer `getStaticProps` |
| Lighthouse 95+ com animações | Significativamente mais fácil | Requer otimização agressiva |
| Caso de uso ideal | Sites de conteúdo com interatividade pontual | Aplicações com muito estado dinâmico |
| **Veredicto** | **✅ Escolhido** | Overkill para este projeto |

---

## 3. Arquitetura de Rendering

### Modelo: SSG com Astro Islands

```
Visitante
    │
    ▼
Vercel CDN (Edge Network)
    │
    ▼
HTML Estático (gerado no build)
    │
    ├── CSS (Tailwind purged + tokens da marca)
    ├── JS mínimo (apenas islands hidratadas)
    └── Assets otimizados (WebP/AVIF via Sharp)
```

### Mapa de Islands

```
Página completa (HTML Estático)
│
├── <Header />              → Astro puro (sem JS)
├── <Hero />                → Astro puro (animações via GSAP em <script>)
├── <Sobre />               → Astro puro
├── <Eixos />               → Astro puro
├── <Agenda />              → ★ ISLAND client:visible
│   └── Filtro de eventos por categoria (React)
├── <GaleriaEspaco />       → ★ ISLAND client:visible
│   └── Lightbox + drag scroll (React)
├── <Contato />             → ★ ISLAND client:idle
│   └── Formulário com validação (React)
└── <Footer />              → Astro puro (sem JS)
```

### Diretivas de Hidratação

| Diretiva | Quando usar | Exemplo |
|---|---|---|
| `client:visible` | Componente below the fold — hidrata ao entrar na viewport | `<AgendaFilter client:visible />` |
| `client:idle` | Não-crítico — hidrata quando o browser estiver ocioso | `<ContatoForm client:idle />` |
| `client:load` | ⚠️ Evitar — hidrata imediatamente, impacta performance | Não usado neste projeto |

---

## 4. Estrutura de Rotas

```
/                          → Home (one-page com âncoras)
/eventos/[slug]            → Página individual de evento (SSG dinâmico)
/studio                    → Sanity Studio (acesso restrito, não indexado)
/sitemap.xml               → Gerado automaticamente (@astrojs/sitemap)
/robots.txt                → Gerado via endpoint Astro
```

### Âncoras da Home

```
/#sobre         → Sobre o espaço
/#eixos         → Serviços (biblioterapia, sarau, estúdio, etc.)
/#agenda        → Próximos eventos
/#espaco        → Galeria do espaço físico
/#contato       → Formulário + mapa + links
```

---

## 5. CMS — Sanity.io

### Plano Free — Limites

| Recurso | Limite Free | Estimativa do projeto |
|---|---|---|
| Documentos | 10.000 | ~200 eventos/ano → suficiente |
| Assets | 100GB | Suficiente |
| CDN requests | 5M/mês | Suficiente |

### Schemas

**Schema: Evento**

```ts
// schemas/evento.ts
export const evento = {
  name: 'evento',
  title: 'Evento',
  type: 'document',
  fields: [
    { name: 'titulo',        title: 'Título',              type: 'string' },
    { name: 'slug',          title: 'Slug',                type: 'slug',
      options: { source: 'titulo' } },
    { name: 'tipo',          title: 'Tipo',                type: 'string',
      options: { list: ['sarau', 'biblioterapia', 'dj-session', 'oficina', 'pre-inauguracao', 'podcast'] } },
    { name: 'modo',          title: 'Modo',                type: 'string',
      options: { list: ['presencial', 'online', 'hibrido'] } },
    { name: 'dataInicio',    title: 'Data e Hora',         type: 'datetime' },
    { name: 'descricao',     title: 'Descrição',           type: 'text' },
    { name: 'imagem',        title: 'Imagem',              type: 'image',
      options: { hotspot: true } },
    { name: 'linkInscricao', title: 'Link de Inscrição',  type: 'url' },
    { name: 'preco',         title: 'Preço',               type: 'string' },
    // Exemplos de valor: "Gratuito", "R$ 60", "Colaborativo"
    { name: 'destaque',      title: 'Evento em Destaque', type: 'boolean' },
  ],
}
```

### Fluxo de Publicação de Conteúdo

```
Cliente edita evento no Sanity Studio (/studio)
    │
    ▼
Sanity salva no Content Lake
    │
    ▼
Webhook dispara para Vercel Deploy Hook
    │
    ▼
Vercel faz rebuild do site (SSG) — ~30–60 segundos
    │
    ▼
Novo HTML estático publicado no CDN
    │
    ▼
Visitante recebe página atualizada
```

---

## 6. SEO — Implementação Técnica

### 6.1 Keywords Alvo

| Intenção | Keywords | Volume estimado |
|---|---|---|
| Espaço cultural local | "espaço cultural Méier", "espaço cultural zona norte Rio" | Médio |
| Biblioterapia | "biblioterapia Rio de Janeiro", "roda de biblioterapia RJ" | Baixo-médio |
| Eventos | "sarau Méier", "eventos culturais Méier Rio" | Baixo |
| Produção | "gravação podcast Rio de Janeiro", "estúdio de podcast Méier" | Médio |
| Hub cultural | "hub cultural Rio de Janeiro", "centro cultural Méier" | Médio |

### 6.2 Schema.org — LocalBusiness

Injetado no `BaseLayout.astro` em todas as páginas:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Estúdio Entre",
  "description": "Espaço cultural independente no Méier. Encontros, palavra e som.",
  "url": "https://www.estudioentre.com.br",
  "telephone": "+55-21-XXXXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Maria Calmon, 100",
    "addressLocality": "Méier",
    "addressRegion": "RJ",
    "postalCode": "20710-030",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -22.8976,
    "longitude": -43.2896
  },
  "sameAs": [
    "https://www.instagram.com/entrenoestudio/",
    "https://www.tiktok.com/@entrenoestudio",
    "https://www.facebook.com/61583641444105"
  ]
}
```

### 6.3 Schema.org — Event

Injetado em cada `/eventos/[slug]`:

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "[Nome do Evento]",
  "startDate": "[ISO 8601]",
  "location": {
    "@type": "Place",
    "name": "Estúdio Entre",
    "address": "Rua Maria Calmon, 100 — Méier, RJ"
  },
  "organizer": {
    "@type": "Organization",
    "name": "Estúdio Entre"
  }
}
```

### 6.4 Meta Tags e Open Graph

```astro
<!-- BaseLayout.astro -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:type" content="website" />
<meta property="og:locale" content="pt_BR" />
<meta name="twitter:card" content="summary_large_image" />
```

Open Graph dinâmico para eventos: imagem gerada via `@vercel/og` com identidade visual do Estúdio (logo + nome do evento + data).

### 6.5 Sitemap e Robots

```ts
// astro.config.mjs
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://www.estudioentre.com.br',
  integrations: [sitemap()],
})
```

```
# robots.txt
User-agent: *
Allow: /
Disallow: /studio/

Sitemap: https://www.estudioentre.com.br/sitemap.xml
```

---

## 7. Animações e Motion

### Smooth Scroll — Lenis

```ts
// src/scripts/lenis.ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenis
}
```

```astro
<!-- BaseLayout.astro — inicialização condicional -->
<script>
  import { initLenis } from '../scripts/lenis'
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReduced) initLenis()
</script>
```

### Padrões GSAP por Seção

**Hero — Text reveal palavra por palavra:**
```ts
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const split = new SplitText('.hero-tagline', { type: 'words' })
gsap.from(split.words, {
  opacity: 0, y: 40, stagger: 0.08, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.hero-tagline', start: 'top 80%' },
})
```

**Sobre — Parallax na foto:**
```ts
gsap.to('.sobre-foto', {
  yPercent: -20, ease: 'none',
  scrollTrigger: {
    trigger: '.sobre-section', start: 'top bottom', end: 'bottom top', scrub: true,
  },
})
```

**Transição de cor de background entre seções:**
```ts
const sections = [
  { el: '.hero-section',    bg: '#E8541E' },
  { el: '.sobre-section',   bg: '#F5F0E8' },
  { el: '.eixos-section',   bg: '#1A1612' },
  { el: '.agenda-section',  bg: '#6B7A2A' },
  { el: '.espaco-section',  bg: '#F5F0E8' },
  { el: '.contato-section', bg: '#6B5FBF' },
]

sections.forEach(({ el, bg }) => {
  ScrollTrigger.create({
    trigger: el, start: 'top center', end: 'bottom center',
    onEnter:     () => gsap.to('body', { backgroundColor: bg, duration: 0.8 }),
    onEnterBack: () => gsap.to('body', { backgroundColor: bg, duration: 0.8 }),
  })
})
```

---

## 8. Direção de Experiência Imersiva (Awwwards Level)

### Conceito Central: “Entre”

O site do Estúdio Entre não deve ser tratado como uma interface tradicional, mas como uma experiência de travessia.

A navegação deve transmitir a sensação de:

- Entrar em um espaço
- Transitar entre estados (luz, som, palavra, corpo)
- Descobrir camadas progressivamente
- Permanecer por curiosidade, não apenas por necessidade

> O usuário não “acessa um site”.  
> Ele entra no Estúdio Entre.

---

### 8.1 Princípios de Experiência

#### 1. Transição > Navegação

- Evitar mudanças bruscas entre seções
- Cada scroll deve representar uma passagem
- O conteúdo não aparece de forma instantânea — ele se revela

**Diretriz técnica:**
- Uso de GSAP + ScrollTrigger para transições contínuas
- Transições de background, tipografia e elementos visuais entre seções

---

#### 2. Ritmo e Respiro

A experiência deve alternar entre:

- Momentos de intensidade (movimento, cor, animação)
- Momentos de pausa (espaço, silêncio visual, tipografia estática)

Evitar excesso de estímulos contínuos.

---

#### 3. Tempo como elemento de UX

- Nem toda interação deve ser instantânea
- Micro delays são intencionais e fazem parte da experiência

Exemplos:
- Textos que aparecem palavra por palavra
- Elementos que entram com leve atraso
- Hover com resposta suave e progressiva

---

#### 4. Interface invisível

- Minimizar elementos tradicionais de UI:
  - Botões excessivos
  - Containers rígidos
  - Divisões visuais óbvias

O layout deve parecer fluido e orgânico.

---

### 8.2 Scroll como narrativa

O scroll é o principal motor da experiência.

#### Regras obrigatórias:

- Uso de smooth scroll (Lenis)
- Transições contínuas entre seções (sem cortes secos)
- Uso de:
  - Parallax leve
  - Elementos sticky
  - Sobreposição de camadas

#### Comportamento esperado:

O conteúdo deve reagir ao scroll, criando sensação de progressão narrativa.

---

### 8.3 Direção Visual Sensorial

#### Cores como estados emocionais

| Seção | Emoção | Cor |
|------|------|------|
| Hero | Energia / convite | Laranja |
| Sobre | Acolhimento | Creme |
| Eixos | Profundidade | Preto |
| Agenda | Movimento | Verde |
| Contato | Conexão | Roxo |

- Mudanças de cor devem ser animadas (não instantâneas)

---

#### Tipografia

- Deve ter presença e ritmo
- Headlines com destaque e personalidade
- Uso de variações de escala e peso ao longo da página

---

#### Imagens

- Não devem ser decorativas
- Devem transmitir textura, ambiente e presença física

Preferência por:
- Close-ups
- Luz ambiente
- Detalhes do espaço

---

### 8.4 Interações

#### Hover

- Nunca instantâneo
- Deve utilizar easing suave

#### Clique

- Deve gerar sensação de resposta física (feedback claro)

#### Scroll-triggered animations

- Entrada com:
  - Fade + translate
  - Ou revelação progressiva

---

### 8.5 Hero (Seção crítica)

O Hero deve ser o ponto de maior impacto da experiência.

#### Requisitos obrigatórios:

- Uso de SplitText (animação palavra por palavra)
- Movimento sutil contínuo (evitar estado completamente estático)
- Sensação de convite e abertura

---

### 8.6 Anti-padrões (não permitido)

❌ Layout excessivamente baseado em cards  
❌ Transições bruscas entre seções  
❌ Scroll sem suavização  
❌ Conteúdo totalmente estático  
❌ Interface genérica de template  

---

### 8.7 Critério de Qualidade

O site deve atingir um nível de experiência comparável a projetos de referência em plataformas como Awwwards.

#### Indicadores de sucesso:

- O usuário permanece navegando sem objetivo direto imediato
- O scroll gera curiosidade contínua
- A experiência é memorável, não apenas funcional

---

## 9. Performance

### Fontes

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="preload"
  href="[URL_BUVERA_SUBSETADA]"
  as="style"
/>
```

> **Atenção:** Buvera é a fonte do logotipo. Verificar disponibilidade no Google Fonts ou hospedar localmente. Font subsetting para subset latino reduz drasticamente o tamanho do arquivo.

### Imagens

- Formato WebP + AVIF via `<Image />` do Astro (Sharp no build)
- `loading="lazy"` em todas as imagens below the fold
- `loading="eager"` + `fetchpriority="high"` apenas na imagem hero
- Dimensões explícitas em todas as imagens (previne CLS)

### Acessibilidade e Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Analytics

### Eventos GA4 a Rastrear

| Evento | Gatilho |
|---|---|
| `event_view` | Visualização de página de evento |
| `event_register_click` | Clique em link de inscrição |
| `whatsapp_click` | Clique no link de WhatsApp (produção de áudio) |
| `social_click` | Clique em links de redes sociais |

### Implementação

```astro
<!-- BaseLayout.astro -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || []
  function gtag() { dataLayer.push(arguments) }
  gtag('js', new Date())
  gtag('config', 'G-XXXXXXXXXX')
</script>
```

---

## 10. Segurança

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options",  "value": "nosniff" },
        { "key": "X-Frame-Options",          "value": "DENY" },
        { "key": "Referrer-Policy",          "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy",       "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Variáveis de Ambiente na Vercel

| Variável | Valor | Visibilidade |
|---|---|---|
| `SANITY_PROJECT_ID` | ID do projeto Sanity | Public |
| `SANITY_DATASET` | `production` | Public |
| `SANITY_WEBHOOK_SECRET` | Secret do webhook | **Private** |

---

## 11. Dependências — package.json

```json
{
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/react": "^4.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@sanity/astro": "^1.0.0",
    "@sanity/client": "^6.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "gsap": "^3.12.0",
    "@gsap/react": "^2.0.0",
    "lenis": "^1.1.0",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-select": "latest",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "typescript": "^5.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

---

## 12. Configuração Base

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import sanity from '@sanity/astro'

export default defineConfig({
  site: 'https://www.estudioentre.com.br',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    sanity({
      projectId: import.meta.env.SANITY_PROJECT_ID,
      dataset: 'production',
      useCdn: true,
    }),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
})
```

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-orange:     #E8541E;
  --color-orange-dark:#C2420E;
  --color-olive:      #6B7A2A;
  --color-purple:     #6B5FBF;
  --color-near-black: #1A1612;
  --color-cream:      #F5F0E8;
  --color-text-muted: #7A6E62;

  --font-display: 'Buvera', sans-serif;
  --font-sans:    'Buvera', sans-serif;

  --ease-expo: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-circ: cubic-bezier(0.55, 0, 0.1, 1);
}
```

---

## 13. Itens em Aberto

- [ ] Confirmar URL final do domínio (`estudioentre.com.br` ou outro)
- [ ] Validar hexadecimais exatos da paleta com arquivo de design original
- [ ] Confirmar disponibilidade/licença da fonte Buvera para web
- [ ] Definir ID do projeto Sanity (criar conta e projeto)
- [ ] Preencher telefone e e-mail de contato no schema.org
- [ ] Definir ID do GA4 (`G-XXXXXXXXXX`)
- [ ] Configurar webhook Sanity → Vercel após deploy inicial
- [ ] Criar conta no Google Search Console e vincular ao domínio
- [ ] Configurar Google Meu Negócio com o mesmo endereço e NAP consistente