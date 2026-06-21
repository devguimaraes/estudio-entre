// src/utils/infinitepay.ts
import type { ProdutoLoja } from "@/types/loja";

const INFINITE_PAY_CATALOG = "https://loja.infinitepay.io/llms/thaynawho.txt";
const INFINITE_PAY_PRODUCT_BASE = "https://loja.infinitepay.io/thaynawho";

interface InfinitePayProductDetail {
  slug: string;
  title: string;
  price: string;
  category: string;
  descricao: string;
  imagemUrl: string | null;
  variationId: number | null;
  productUrl: string;
}

export async function fetchInfinitePayProducts(): Promise<ProdutoLoja[]> {
  const catalogResponse = await fetch(INFINITE_PAY_CATALOG);
  if (!catalogResponse.ok) {
    throw new Error(`Catalog fetch failed: ${catalogResponse.status}`);
  }
  const catalogText = await catalogResponse.text();

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
    if (line.startsWith("- ") && (line.includes("leitura-e-criacao") || line.includes("livros"))) {
      currentCategory = line.includes("Livros") ? "Livros" : "Leitura e Criação";
    }

    const productMatch = line.match(/^- (.+?) - (R\$\s?[\d,.]+) - (available|unavailable) - (.+)$/);
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

  const detailFetches = productLinks
    .filter((p) => p.slug)
    .map(async (product) => {
      try {
        const detailResponse = await fetch(product.detailUrl);
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
    });

  const results = await Promise.all(detailFetches);
  return results
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
}

export async function fetchInfinitePayProductBySlug(slug: string): Promise<ProdutoLoja | null> {
  const detailUrl = `https://loja.infinitepay.io/llms/thaynawho/${slug}.txt`;

  try {
    const detailResponse = await fetch(detailUrl);
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

    return {
      slug,
      titulo,
      descricao: descricao.replace(/^Autora?:.+?\n?/gm, "").trim(),
      preco,
      imagemUrl,
      categoria: "Livros",
      productUrl: `${INFINITE_PAY_PRODUCT_BASE}/${slug}`,
      variationId,
    };
  } catch {
    return null;
  }
}
