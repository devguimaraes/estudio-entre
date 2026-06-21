/**
 * Script de atualização do catálogo da Loja.
 *
 * Uso: bun run scripts/refresh-loja.ts
 *
 * Busca os produtos via API InfinitePay (com retry, backoff, jitter e rate limiter),
 * sobrescreve src/data/loja.json e exibe um resumo.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fetchInfinitePayProducts } from "../src/utils/infinitepay";

const OUTPUT_PATH = resolve(import.meta.dirname, "../src/data/loja.json");

console.log("🔄 Buscando catálogo do InfinitePay...\n");

try {
  const produtos = await fetchInfinitePayProducts();

  console.log(`✅ ${produtos.length} produtos encontrados.\n`);

  let comImagem = 0;
  for (const p of produtos) {
    const tem = !!p.imagemUrl;
    if (tem) comImagem++;
    const icon = tem ? "🖼️" : "📦";
    console.log(`  ${icon}  ${p.titulo.padEnd(45).slice(0, 45)} | ${p.preco}`);
  }

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(produtos, null, 2)}\n`, "utf-8");

  console.log("\n📝 Salvo em src/data/loja.json");
  console.log(`📊 ${comImagem}/${produtos.length} produtos com imagem`);
  console.log("\n⚠️  Execute 'bun run build' e faça deploy para publicar as atualizações.");
} catch (err) {
  console.error("❌ Falha ao buscar catálogo:", err);
  process.exit(1);
}
