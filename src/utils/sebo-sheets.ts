/**
 * Utilitário para consumir o acervo do Sebo via Google Sheets (CSV público).
 *
 * Fluxo:
 *   fetchSeboCSV() → fetch(CSV_URL) → parseSeboCSV(text) → LivroSebo[]
 *
 * O CSV tem 5 colunas: Autor, Título, Editora, Gênero, Valor
 * com vírgula como separador e aspas duplas para campos com vírgulas internas.
 */

import type { GeneroSebo, LivroSebo } from "@/types/sebo";

const SEBO_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1v_ZqWDvG8N0WWx-JZFYKbFTDjGBqgZ5T8T9UsfDp1Ms/export?format=csv&gid=0";

const CSV_TIMEOUT_MS = 15_000;

/**
 * Busca o CSV do Google Sheets.
 * Segue redirects (Google retorna 302 para URL de exportação real).
 */
export async function fetchSeboCSV(): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CSV_TIMEOUT_MS);

  try {
    const res = await fetch(SEBO_CSV_URL, {
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Google Sheets retornou HTTP ${res.status}`);
    }

    return await res.text();
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Timeout ao buscar planilha do Google Sheets");
    }
    throw err;
  }
}

/**
 * Converte uma string CSV em array de LivroSebo.
 *
 * A planilha do Google Sheets exporta com:
 * - \r\n (CRLF) — removemos \r
 * - Linhas iniciais com título da planilha e vazias — ignoradas
 * - Linha de cabeçalho ("AUTOR,TÍTULO,...") — detectada e ignorada
 * - Colunas: Autor, Título, Editora, Gênero, Valor
 */
export function parseSeboCSV(text: string): LivroSebo[] {
  // Remove \r do CRLF do Google Sheets
  const clean = text.replace(/\r/g, "");

  const rows = clean.split("\n");
  const livros: LivroSebo[] = [];

  // Encontra a linha de cabeçalho (contém "AUTOR")
  let headerIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (/^AUTOR[,;]/.test(rows[i].trim().toUpperCase())) {
      headerIndex = i;
      break;
    }
  }

  // Se não encontrar cabeçalho, assume linha 0 como fallback
  const start = headerIndex >= 0 ? headerIndex + 1 : 1;

  for (let i = start; i < rows.length; i++) {
    const line = rows[i];
    if (!line.trim()) continue;

    const fields = splitCSVRow(line);
    if (fields.length < 5) continue;

    const [autor, titulo, editora, genero, valor] = fields;

    if (!autor.trim() || !titulo.trim()) continue;

    livros.push({
      autor: autor.trim(),
      titulo: titulo.trim(),
      editora: editora.trim(),
      genero: genero.trim() as GeneroSebo,
      valor: valor.trim(),
    });
  }

  return livros;
}

/** Quebra uma linha CSV em campos, respeitando aspas */
function splitCSVRow(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      insideQuotes = !insideQuotes;
    } else if (ch === "," && !insideQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  fields.push(current);
  return fields;
}
