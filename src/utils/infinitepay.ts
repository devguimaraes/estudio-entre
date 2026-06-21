/**
 * Utilitário para comunicação com a API pública do InfinitePay.
 *
 * Implementa:
 * - Retry com exponential backoff + jitter (máx. 4 tentativas)
 * - Respeito ao header Retry-After (se presente)
 * - Rate limiter local (fila sequencial, máx. 2 reqs simultâneas)
 * - Cache em memória com TTL de 1 hora
 */

import type { ProdutoLoja } from "@/types/loja";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const INFINITE_PAY_CATALOG = "https://loja.infinitepay.io/llms/thaynawho.txt";
const INFINITE_PAY_PRODUCT_BASE = "https://loja.infinitepay.io/thaynawho";
const MAX_RETRIES = 4; // máximo de tentativas por requisição
const MAX_CONCURRENT = 2; // requisições simultâneas contra o InfinitePay
const BASE_DELAY_MS = 1_000; // delay base do backoff (1s)
const CACHE_TTL_MS = 60 * 60 * 1_000; // 1 hora

// ---------------------------------------------------------------------------
// Cache em memória (evita chamadas repetidas durante o mesmo processo)
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) return entry.data;
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ---------------------------------------------------------------------------
// Rate Limiter local (fila sequencial, não dispara mais de MAX_CONCURRENT)
// ---------------------------------------------------------------------------

class LocalRateLimiter {
  private running = 0;
  private queue: Array<() => void> = [];

  /** Executa `fn` respeitando o limite de concorrência */
  async run<T>(fn: () => Promise<T>): Promise<T> {
    // Se já estamos no limite, entra na fila
    if (this.running >= MAX_CONCURRENT) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }

    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      // Libera o próximo da fila, se houver
      this.queue.shift()?.();
    }
  }
}

const rateLimiter = new LocalRateLimiter();

// ---------------------------------------------------------------------------
// Retry com exponential backoff + jitter + Retry-After
// ---------------------------------------------------------------------------

/**
 * Calcula o delay para a tentativa `attempt` (0-indexed):
 *   delay = baseDelay * 2^attempt + random[0, 1000) ms
 *
 * Ex:
 *   attempt 0 → 1s + jitter
 *   attempt 1 → 2s + jitter
 *   attempt 2 → 4s + jitter
 *   attempt 3 → 8s + jitter
 */
function backoffDelay(attempt: number, baseDelayMs = BASE_DELAY_MS): number {
  return baseDelayMs * 2 ** attempt + Math.random() * 1000;
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  let lastStatus = 0;

  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url);
    lastStatus = response.status;

    // Sucesso → retorna imediatamente
    if (response.ok) return response;

    // 429 Too Many Requests → espera e retry
    if (response.status === 429) {
      // 1. Respeitar header Retry-After (se presente)
      const retryAfter = response.headers.get("Retry-After");
      let delay: number;

      if (retryAfter) {
        // Retry-After pode ser segundos (número) ou data HTTP
        const seconds = Number.parseInt(retryAfter, 10);
        if (!Number.isNaN(seconds)) {
          delay = seconds * 1000;
        } else {
          // Data HTTP: calcula diferença até agora
          const retryDate = new Date(retryAfter).getTime();
          delay = Math.max(0, retryDate - Date.now());
        }
      } else {
        // 2. Fallback: exponential backoff + jitter
        delay = backoffDelay(attempt);
      }

      console.warn(
        `[InfinitePay] 429 Rate Limited. Tentativa ${attempt + 1}/${retries}. Aguardando ${Math.round(delay)}ms...`,
      );

      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    }

    // Outros erros (5xx, etc.) → tenta com backoff normal
    if (attempt < retries - 1) {
      const delay = backoffDelay(attempt);
      console.warn(
        `[InfinitePay] Erro ${response.status}. Tentativa ${attempt + 1}/${retries}. Aguardando ${Math.round(delay)}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Fetch failed after ${retries} retries (last status: ${lastStatus})`);
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

interface RawProductLink {
  slug: string;
  title: string;
  price: string;
  category: string;
  detailUrl: string;
}

function parseCatalog(text: string): RawProductLink[] {
  const links: RawProductLink[] = [];
  const lines = text.split("\n");
  let currentCategory = "";

  for (const line of lines) {
    // Cabeçalho de categoria: "- Livros (1566443-livros)"
    if (line.startsWith("- ") && (line.includes("leitura-e-criacao") || line.includes("livros"))) {
      currentCategory = line.includes("Livros") ? "Livros" : "Leitura e Criação";
      continue;
    }

    // Linha de produto: "- Nome - R$ XX,00 - available - url"
    const m = line.match(/^- (.+?) - (R\$\s?[\d,.]+) - (available|unavailable) - (.+)$/);
    if (!m) continue;

    const [, title, price, , detailUrl] = m;
    const slug = detailUrl.match(/\/([a-z0-9]+-[^/]+)\.txt$/)?.[1] ?? "";

    links.push({
      slug,
      title: title.trim(),
      price: price.trim(),
      category: currentCategory || "Livros",
      detailUrl: detailUrl.trim(),
    });
  }

  return links;
}

function parseProductDetail(text: string): {
  descricao: string;
  imagemUrl: string | null;
  category: string | null;
  variationId: number | null;
} {
  const desc = text.match(/## Description\n+(.+?)(?=\n##|\n\Z)/s)?.[1]?.trim() ?? "";
  const img = text.match(/https:\/\/infinitepay-sales[^\s)]+/)?.[0] ?? null;
  const varId = text.match(/variation_id\s+(\d+)/)?.[1];

  // Extrai categoria do texto do produto (ex: "Gênero: Literatura infantojuvenil")
  const categoryMatch = text.match(/\bCategoria:\s*([^\n]+)/i)?.[1]?.trim() ?? null;

  const descricao = desc
    .replace(/^Autora?:.+?\n?/gm, "")
    .replace(/\\\*/g, "*") // Markdown escapes
    .replace(/Gênero;/g, "Gênero:")
    .trim();

  return {
    descricao,
    imagemUrl: img,
    category: categoryMatch,
    variationId: varId ? Number.parseInt(varId) : null,
  };
}

/** Heurística para inferir categoria do produto com base no título */
function inferCategory(title: string, fallback = "Livros"): string {
  const criacaoKeywords = [
    "porta-livro",
    "porta livro",
    "porta-retrato",
    "porta retrato",
    "envelope",
    "colorir",
    "criação",
    "criacao",
    "adesivo",
    "marcador",
  ];
  const lower = title.toLowerCase();
  return criacaoKeywords.some((kw) => lower.includes(kw)) ? "Leitura e Criação" : fallback;
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

/** Busca o catálogo completo com detalhes de todos os produtos */
export async function fetchInfinitePayProducts(): Promise<ProdutoLoja[]> {
  const CACHE_KEY = "all_products";

  const cached = getCached<ProdutoLoja[]>(CACHE_KEY);
  if (cached) {
    console.log("[InfinitePay] Cache hit — retornando dados em cache");
    return cached;
  }

  // 1. Catálogo (com rate limiter + retry)
  const catalogRes = await rateLimiter.run(() => fetchWithRetry(INFINITE_PAY_CATALOG));
  const catalogText = await catalogRes.text();
  const links = parseCatalog(catalogText);

  // 2. Detalhes de cada produto — processados sequencialmente via rate limiter
  const details = await Promise.all(
    links
      .filter((l) => l.slug)
      .map((link) =>
        rateLimiter.run(async () => {
          try {
            const res = await fetchWithRetry(link.detailUrl);
            const text = await res.text();
            const detail = parseProductDetail(text);

            const bestCategory = detail.category ?? inferCategory(link.title, link.category);

            return {
              slug: link.slug,
              title: link.title,
              price: link.price,
              category: bestCategory,
              productUrl: `${INFINITE_PAY_PRODUCT_BASE}/${link.slug}`,
              ...detail,
            };
          } catch {
            return null;
          }
        }),
      ),
  );

  const produtos: ProdutoLoja[] = details
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .map((d) => ({
      slug: d.slug,
      titulo: d.title,
      descricao: d.descricao,
      preco: d.price,
      imagemUrl: d.imagemUrl,
      categoria: d.category,
      productUrl: d.productUrl,
      variationId: d.variationId,
    }));

  setCache(CACHE_KEY, produtos);
  return produtos;
}

/** Busca um único produto pelo slug */
export async function fetchInfinitePayProductBySlug(slug: string): Promise<ProdutoLoja | null> {
  const CACHE_KEY = `product_${slug}`;

  const cached = getCached<ProdutoLoja>(CACHE_KEY);
  if (cached) return cached;

  const url = `https://loja.infinitepay.io/llms/thaynawho/${slug}.txt`;

  try {
    const res = await rateLimiter.run(() => fetchWithRetry(url));
    const text = await res.text();

    const title = text.match(/^# (.+)$/m)?.[1]?.trim() ?? slug;
    const detail = parseProductDetail(text);
    const price = text.match(/- .+ - (R\$\s?[\d,.]+) - available/)?.[1]?.trim() ?? "Sob consulta";

    const produto: ProdutoLoja = {
      slug,
      titulo: title,
      descricao: detail.descricao,
      preco: price,
      imagemUrl: detail.imagemUrl,
      categoria: detail.category ?? inferCategory(title),
      productUrl: `${INFINITE_PAY_PRODUCT_BASE}/${slug}`,
      variationId: detail.variationId,
    };

    setCache(CACHE_KEY, produto);
    return produto;
  } catch {
    return null;
  }
}
