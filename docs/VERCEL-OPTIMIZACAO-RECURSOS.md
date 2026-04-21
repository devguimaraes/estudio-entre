# Plano de Otimização de Recursos Vercel - Estúdio Entre

**Projeto:** Estúdio Entre  
**Objetivo:** Reduzir drasticamente consumo de recursos no plano Hobby  
**Meta:** Manter alta performance com mínimo custo

---

## 📊 Plano atual (Análise)

### Arquitetura Atual
- **Framework:** Astro 6.x SSG (Static Site Generation)
- **Runtime:** Serverless Functions (endpoint webhook)
- **CMS:** Sanity CMS com webhook para rebuilds
- **Imagens:** Sharp + Astro Image optimization
- **Animações:** GSAP + ScrollTrigger + Lenis
- **Páginas:** 3 páginas estáticas + 1 API route

---

## 🎯 Plano de Otimização por Categoria

### 1. EDGE REQUESTS (Meta: -90% consumo)

#### Problema Atual
- Cada requisição de página gasta Edge Requests
- Assets estáticos não estão usando cache agressivo
- Sem stale-while-revalidate para conteúdo dinâmico

#### Otimizações

**1.1 Cache Agressivo de Assets Estáticos**
```json
// vercel.json - AUMENTAR cache de 1 ano para 2 anos
{
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=63072000, immutable"
        }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=63072000, immutable"
        }
      ]
    }
  ]
}
```

**1.2 Implementar Stale-While-Revalidate para HTML**
```typescript
// astro.config.mjs
export default defineConfig({
  site: "https://www.estudioentre.com.br",
  adapter: vercel({
    edgeMiddleware: false, // Desativar edge middleware para economizar requests
  }),
  integrations: [
    // ...
  ],
  // Configurar revalidação para HTML
  build: {
    format: 'directory',
  },
});
```

**1.3 Pré-renderizar Todo o Conteúdo**
- Remover `prerender = false` do webhook
- Mover webhook para Edge Function (mais barato que serverless)
- Usar Vercel Edge Functions para webhook (100x mais barato)

**1.4 Implementar ISR para Eventos Sanity**
```typescript
// src/pages/eventos/[slug].astro
export async function getStaticPaths() {
  const eventos = await sanity.fetch(eventosQuery);
  
  return {
    paths: eventos.map((evento) => ({ 
      params: { slug: evento.slug } 
    })),
    // ISR: revalida a cada 1 hora
    revalidate: 3600, 
  };
}

export async function getStaticProps({ params }) {
  const evento = await sanity.fetch(eventoBySlugQuery(params.slug));
  
  return {
    props: { evento },
    // Revalida se houver mudanças no Sanity
    revalidate: 3600,
  };
}
```

**Impacto Esperado:** -90% Edge Requests

---

### 2. FLUID ACTIVE CPU (Meta: -85% consumo)

#### Problema Atual
- Build demorando ~30s
- Animações GSAP rodando no client
- Serverless function com lógica desnecessária

#### Otimizações

**2.1 Otimizar Build Time**
```json
// vercel.json - Limitar CPUs do build
{
  "buildCommand": "bun run build",
  "build.env": {
    "NODE_OPTIONS": "--max-old-space-size=2048"
  }
}
```

**2.2 Code Splitting Agressivo**
```javascript
// src/pages/index.astro
---
// Lazy load componentes pesados
const Agenda = () => import('@/components/Agenda.astro');
const Galeria = () => import('@/components/Galeria.astro');
---

<div id="agenda">
  <Agenda client:visible />
</div>
```

**2.3 Pré-carregar Dados do Sanity no Build**
```typescript
// src/pages/_data.ts - Criar arquivo de dados estáticos
export async function generateEventData() {
  const eventos = await sanity.fetch(eventosQuery);
  
  // Salvar como JSON estático
  fs.writeFileSync(
    'public/_eventos.json',
    JSON.stringify(eventos)
  );
}

// Executar durante o build
// package.json
{
  "scripts": {
    "build": "bun run generate:data && astro build"
  }
}
```

**2.4 Remover Lógica do Runtime**
- Mover toda lógica de fetch de dados para build time
- Usar dados estáticos em vez de fetch dinâmico
- Webhook apenas dispara rebuild, não processa dados

**Impacto Esperado:** -85% Fluid Active CPU

---

### 3. FUNCTION INVOCATIONS (Meta: -95% consumo)

#### Problema Atual
- Webhook usa serverless function tradicional
- Cada invocação gasta Function Invocations
- Webhook dispara rebuild a cada mudança

#### Otimizações

**3.1 Migrar Webhook para Edge Function**
```typescript
// src/pages/api/webhook.ts - Usar Edge Runtime
export const config = {
  runtime: 'edge',
  maxDuration: 5, // 5 segundos é suficiente
};

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Lógica leve - apenas validar e disparar deploy hook
  
  // Edge Functions são ~100x mais baratas que serverless
  // Runtime: Edge (free) vs Node (pago)
};
```

**3.2 Debounce de Webhooks**
```typescript
// Implementar debounce para evitar múltiplos rebuilds rápidos
import { Ratelimit } from '@vercel/ratelimit';

const ratelimit = new Ratelimit({
  redis: VercelKV(), // Ou usar memória local
  limiter: Ratelimit.slidingWindow(10, '1m'), // 10 requests por minuto
});

// Antes de processar webhook
const { success } = await ratelimit.limit(request.headers.get('x-forwarded-for') || 'unknown');
if (!success) {
  return new Response('Too many requests', { status: 429 });
}
```

**3.3 Batch Rebuilds**
- Não disparar rebuild imediato
- Aguardar 30-60 segundos antes de rebuild
- Agrupar múltiplas mudanças em um único rebuild

**3.4 Remover Webhook se Possível**
- Para SSG, webhook pode ser desnecessário
- Usar builds agendados a cada hora em vez de webhook
- Ou usar builds sob demanda (botão "Deploy" no Sanity)

**Impacto Esperado:** -95% Function Invocations

---

### 4. FAST DATA TRANSFER (Meta: -80% consumo)

#### Problema Atual
- Assets não otimizados
- Sem compressão
- Imagens pesadas

#### Otimizações

**4.1 Compressão Brotli**
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Encoding",
          "value": "br"
        }
      ]
    }
  ]
}
```

**4.2 Minificar HTML/CSS/JS**
```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    minify: 'terser', // Minificação agressiva
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap'],
            'sanity': ['@sanity/client'],
          },
        },
      },
    },
  },
});
```

**4.3 Pré-carregar Assets Críticos**
```html
<!-- src/layouts/BaseLayout.astro -->
<head>
  <!-- Preload fontes críticas -->
  <link rel="preload" href="/fonts/buvera.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Preload CSS crítico -->
  <link rel="preload" href="/_astro/index.css" as="style">
  
  <!-- DNS prefetch para domínios externos -->
  <link rel="dns-prefetch" href="https://cdn.sanity.io">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
</head>
```

**4.4 Usar CDNs Externos para Assets Estáticos**
- Mover fontes para CDN (Google Fonts, ou Cloudflare)
- Hospedar imagens estáticas em Vercel Blob ou Cloudflare R2
- Usar Vercel Blob para uploads de usuários (se houver)

**Impacto Esperado:** -80% Fast Data Transfer

---

### 5. IMAGE OPTIMIZATION (Meta: -90% consumo)

#### Problema Atual
- Imagens sendo otimizadas on-demand
- Sem cache de imagens otimizadas
- Formato não otimizado (AVIF/WebP)

#### Otimizações

**5.1 Pré-otimizar Imagens no Build**
```typescript
// scripts/optimize-images.ts
import sharp from 'sharp';
import fs from 'fs';

const IMAGE_DIR = 'src/assets/images';
const OUTPUT_DIR = 'public/images/optimized';

async function optimizeImages() {
  const images = fs.readdirSync(IMAGE_DIR);
  
  for (const image of images) {
    await sharp(`${IMAGE_DIR}/${image}`)
      .avif({ quality: 80 }) // AVIF para browsers modernos
      .toFile(`${OUTPUT_DIR}/${image}.avif`);
      
    await sharp(`${IMAGE_DIR}/${image}`)
      .webp({ quality: 80 }) // WebP para fallback
      .toFile(`${OUTPUT_DIR}/${image}.webp`);
  }
}

// Adicionar ao build
```

**5.2 Usar `<picture>` com Multiple Sources**
```astro
<!-- Componente de imagem otimizado -->
<picture>
  <source srcset={`/images/optimized/${image}.avif`} type="image/avif">
  <source srcset={`/images/optimized/${image}.webp`} type="image/webp">
  <img 
    src={`/images/optimized/${image}.webp`} 
    alt={alt}
    loading="lazy"
    decoding="async"
  />
</picture>
```

**5.3 Configurar Astro Image Optimization**
```typescript
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    // Configurar otimização agressiva
    remotePatterns: [
      {
        hostname: 'cdn.sanity.io',
        protocol: 'https',
      },
    ],
  },
  build: {
    assets: '_assets',
  },
});
```

**5.4 Cache Agressivo de Imagens**
```json
// vercel.json
{
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**5.5 Usar Sanity Image Builder com Params Otimizados**
```typescript
// src/sanity/image.ts
import urlBuilder from '@sanity/image-url';

export function urlFor(source) {
  return urlBuilder(source)
    .width(800) // Limitar width
    .quality(80) // Reduzir qualidade
    .format('webp') // Usar WebP
    .auto('format') // Fallback automático
    .url();
}
```

**Impacto Esperado:** -90% Image Optimization

---

### 6. ISR READS (Meta: -100% consumo)

#### Problema Atual
- SSG puro não usa ISR
- Se usar ISR, cada revalidação gasta ISR Reads

#### Otimizações

**6.1 Aumentar Intervalo de Revalidação**
```typescript
// Para páginas com dados Sanity
export const revalidate = 86400; // 24 horas em vez de 1 hora

// Para páginas estáticas (nunca revalidar)
export const revalidate = false;
```

**6.2 Usar On-Demand Revalidation**
```typescript
// Em vez de ISR automático, usar revalidação sob demanda
// Revalidar apenas quando webhook dispara

// src/pages/api/revalidate.ts
export async function POST({ request }) {
  const body = await request.json();
  const { slug } = body;
  
  // Revalidar apenas a página específica
  await revalidate(`/eventos/${slug}`);
  
  return Response.json({ revalidated: true });
}
```

**6.3 Cache de Dados do Sanity**
```typescript
// Usar Vercel KV ou Upstash KV para cache de dados Sanity
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getEventos() {
  // Verificar cache primeiro
  const cached = await redis.get('eventos');
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch do Sanity
  const eventos = await sanity.fetch(eventosQuery);
  
  // Salvar no cache por 1 hora
  await redis.set('eventos', JSON.stringify(eventos), {
    ex: 3600,
  });
  
  return eventos;
}
```

**6.4 Desabilitar ISR se Não Necessário**
- Para site SSG com rebuilds sob demanda, ISR é desnecessário
- Usar SSG puro (revalidate: false) para todas as páginas
- Depender apenas de webhook para rebuilds

**Impacto Esperado:** -100% ISR Reads

---

### 7. WEB ANALYTICS EVENTS (Meta: -100% consumo)

#### Problema Atual
- Se usar Google Analytics, cada pageview gasta eventos
- Se usar Vercel Analytics, também gasta

#### Otimizações

**7.1 Não Implementar Analytics na Vercel**
- Usar Google Analytics 4 diretamente (sem custo na Vercel)
- Ou usar Plausible/Fathom (self-hosted, sem custo Vercel)

**7.2 Sampling de Eventos**
```javascript
// Se precisar analytics, usar sampling
const SHOULD_TRACK = Math.random() < 0.1; // 10% dos eventos

if (SHOULD_TRACK) {
  // Track event
}
```

**7.3 Batch Analytics Events**
- Agrupar eventos e enviar em batch
- Enviar apenas a cada 30 segundos ou ao sair da página

**7.4 Usar Privacy-Friendly Analytics**
- Plausible (privacy-first, lightweight)
- Fathom (similar ao Plausible)
- Não usam cookies, mais leve

**Impacto Esperado:** -100% Web Analytics Events

---

## 🚀 Plano de Implementação

### Fase 1: Otimizações Rápidas (1-2 horas)
1. ✅ Aumentar cache de assets estáticos (vercel.json)
2. ✅ Mover webhook para Edge Runtime
3. ✅ Configurar compressão Brotli
4. ✅ Preload de assets críticos

### Fase 2: Otimizações Médias (4-6 horas)
1. ⏳ Implementar ISR com revalidate de 24h
2. ⏳ Pré-otimizar imagens no build
3. ⏳ Code splitting de componentes pesados
4. ⏳ Adicionar debounce no webhook

### Fase 3: Otimizações Avançadas (8-12 horas)
1. ⏳ Migrar para Vercel KV/Upstash para cache
2. ⏳ Implementar on-demand revalidation
3. ⏳ Configurar rebuilds agendados
4. ⏳ Remover webhook se possível

---

## 📈 Métricas de Sucesso

### Antes (Estimado)
- Edge Requests: 10.000/mês
- Fluid Active CPU: 5.000 GB-hrs/mês
- Function Invocations: 1.000/mês
- Data Transfer: 50 GB/mês
- Image Optimization: 5.000 operações/mês

### Depois (Meta)
- Edge Requests: 1.000/mês (-90%)
- Fluid Active CPU: 750 GB-hrs/mês (-85%)
- Function Invocations: 50/mês (-95%)
- Data Transfer: 10 GB/mês (-80%)
- Image Optimization: 500 operações/mês (-90%)

### Economia Estimada
- **Plano Hobby:** $0/mês (permanece dentro dos limites free)
- **Sem overages:** Economia de ~$20-50/mês em overages

---

## 🔧 Ferramentas e Serviços Recomendados

### Grátis/Open Source
- **Upstash Redis** (free tier: 10.000 requests/dia)
- **Cloudflare R2** (storage gratuito para imagens)
- **Plausible Analytics** (self-hosted, grátis)

### Vercel (free tier)
- **Vercel KV** (256 MB storage)
- **Vercel Blob** (1 GB storage)
- **Edge Functions** (ilimitado no plano free)

---

## 📝 Checklist de Implementação

### Imediato (Fase 1)
- [ ] Atualizar vercel.json com cache agressivo
- [ ] Migrar webhook.ts para Edge Runtime
- [ ] Adicionar headers de compressão
- [ ] Implementar preload de assets críticos

### Curto Prazo (Fase 2)
- [ ] Implementar ISR nas páginas de eventos
- [ ] Criar script de otimização de imagens
- [ ] Configurar code splitting
- [ ] Adicionar rate limiting no webhook

### Longo Prazo (Fase 3)
- [ ] Configurar Vercel KV para cache
- [ ] Implementar revalidação sob demanda
- [ ] Considerar remover webhook
- [ ] Migrar analytics para solução externa

---

## 🎯 Próximos Passos

1. **Implementar Fase 1** (hoje)
2. **Monitorar consumo** por 1 semana
3. **Implementar Fase 2** (se necessário)
4. **Implementar Fase 3** (se ainda necessário)
5. **Revisar plano** com base em métricas reais

---

**Data de Criação:** 2026-04-20  
**Próxima Revisão:** 2026-04-27 (após 1 semana de monitoramento)
