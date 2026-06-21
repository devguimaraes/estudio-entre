// src/utils/infinitepay.ts
import type { ProdutoLoja } from "@/types/loja";

const INFINITE_PAY_CATALOG = "https://loja.infinitepay.io/llms/thaynawho.txt";
const INFINITE_PAY_PRODUCT_BASE = "https://loja.infinitepay.io/thaynawho";

// Cache: armazena resultados por 1 hora para evitar rate-limiting
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora
const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/** Fetch com retry e backoff exponencial para lidar com rate limiting (429) */
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url);

    // 429 = rate limit; espera e tenta de novo
    if (response.status === 429 && i < retries - 1) {
      const delay = 2 ** i * 1000 + Math.random() * 1000; // 1s, 2s, 4s + jitter
      console.warn(
        `[InfinitePay] Rate limited (429). Retrying in ${Math.round(delay)}ms... (attempt ${i + 1}/${retries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    return response;
  }

  throw new Error(`Fetch failed after ${retries} retries`);
}

/** Processa um array em batches com delay entre eles */
async function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  delayMs: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);

    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return results;
}

export async function fetchInfinitePayProducts(): Promise<ProdutoLoja[]> {
  const cacheKey = "all_products";

  // Verifica cache
  const cached = getCached<ProdutoLoja[]>(cacheKey);
  if (cached) {
    console.log("[InfinitePay] Usando dados em cache");
    return cached;
  }

  try {
    // 1. Fetch catalog com retry
    const catalogResponse = await fetchWithRetry(INFINITE_PAY_CATALOG);
    if (!catalogResponse.ok) {
      throw new Error(`Catalog fetch failed: ${catalogResponse.status}`);
    }
    const catalogText = await catalogResponse.text();

    // 2. Parse catalog
    const productLinks: {
      slug: string;
      title: string;
      price: string;
      category: string;
      detailUrl: string;
    }[] = [];
    const lines = catalogText.split("\n");

    let currentCategory = "";
    for (const line of lines) {
      if (
        line.startsWith("- ") &&
        (line.includes("leitura-e-criacao") || line.includes("livros"))
      ) {
        currentCategory = line.includes("Livros") ? "Livros" : "Leitura e Criação";
      }

      const productMatch = line.match(
        /^- (.+?) - (R\$\s?[\d,.]+) - (available|unavailable) - (.+)$/,
      );
      if (productMatch) {
        const [, title, price, , detailUrl] = productMatch;
        const slugMatch = detailUrl.match(/\/([a-z0-9]+-[^/]+)\.txt$/);
        const slug = slugMatch?.[1] ?? "";

        productLinks.push({
          slug,
          title: title.trim(),
          price: price.trim(),
          category: currentCategory || "Livros",
          detailUrl: detailUrl.trim(),
        });
      }
    }

    // 3. Fetch detail de cada produto em batches de 2 (evita rate limit)
    const details = await batchProcess(
      productLinks.filter((p) => p.slug),
      2, // batch size
      1500, // delay entre batches (ms)
      async (product) => {
        try {
          const detailResponse = await fetchWithRetry(product.detailUrl, 2);
          if (!detailResponse.ok) return null;

          const detailText = await detailResponse.text();

          const descMatch = detailText.match(/## Description\n+(.+?)(?=\n##|\n\Z)/s);
          const descricao = descMatch?.[1]?.trim() ?? "";

          const imgMatch = detailText.match(/https:\/\/infinitepay-sales[^\s)]+/);
          const imagemUrl = imgMatch?.[0] ?? null;

          const varMatch = detailText.match(/variation_id\s+(\d+)/);
          const variationId = varMatch ? Number.parseInt(varMatch[1]) : null;

          return {
            slug: product.slug,
            title: product.title,
            price: product.price,
            category: product.category,
            descricao: descricao.replace(/^Autora?:.+?\n?/gm, "").trim(),
            imagemUrl,
            variationId,
            productUrl: `${INFINITE_PAY_PRODUCT_BASE}/${product.slug}`,
          };
        } catch {
          return null;
        }
      },
    );

    const produtos = details
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .map((p) => ({
        slug: p.slug,
        titulo: p.title,
        descricao: p.descricao,
        preco: p.price,
        imagemUrl: p.imagemUrl,
        categoria: p.category,
        productUrl: p.productUrl,
        variationId: p.variationId,
      }));

    setCache(cacheKey, produtos);
    return produtos;
  } catch (error) {
    console.error("[InfinitePay] Erro ao buscar catálogo:", error);
    throw error;
  }
}

export async function fetchInfinitePayProductBySlug(slug: string): Promise<ProdutoLoja | null> {
  const cacheKey = `product_${slug}`;

  const cached = getCached<ProdutoLoja>(cacheKey);
  if (cached) {
    return cached;
  }

  const detailUrl = `https://loja.infinitepay.io/llms/thaynawho/${slug}.txt`;

  try {
    const detailResponse = await fetchWithRetry(detailUrl, 3);
    if (!detailResponse.ok) return null;

    const detailText = await detailResponse.text();

    const titleMatch = detailText.match(/^# (.+)$/m);
    const titulo = titleMatch?.[1]?.trim() ?? slug;

    const descMatch = detailText.match(/## Description\n+(.+?)(?=\n##|\n\Z)/s);
    const descricao = descMatch?.[1]?.trim() ?? "";

    const imgMatch = detailText.match(/https:\/\/infinitepay-sales[^\s)]+/);
    const imagemUrl = imgMatch?.[0] ?? null;

    const priceMatch = detailText.match(/- .+ - (R\$\s?[\d,.]+) - available/);
    const preco = priceMatch?.[1]?.trim() ?? "Sob consulta";

    const varMatch = detailText.match(/variation_id\s+(\d+)/);
    const variationId = varMatch ? Number.parseInt(varMatch[1]) : null;

    const produto: ProdutoLoja = {
      slug,
      titulo,
      descricao: descricao.replace(/^Autora?:.+?\n?/gm, "").trim(),
      preco,
      imagemUrl,
      categoria: "Livros",
      productUrl: `${INFINITE_PAY_PRODUCT_BASE}/${slug}`,
      variationId,
    };

    setCache(cacheKey, produto);
    return produto;
  } catch {
    return null;
  }
}
