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
 * Lida com:
 * - Campos entre aspas (podem conter vírgulas e quebras de linha)
 * - Vírgula como separador
 * - Primeira linha como cabeçalho (ignorada)
 * - Linhas vazias (ignoradas)
 */
export function parseSeboCSV(text: string): LivroSebo[] {
  const livros: LivroSebo[] = [];
  const rows = splitCSVLines(text);

  // Linha 0 é cabeçalho: Autor,Título,Editora,Gênero,Valor
  for (let i = 1; i < rows.length; i++) {
    const fields = splitCSVRow(rows[i]);
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

/** Quebra um texto CSV em linhas, respeitando campos entre aspas com \n */
function splitCSVLines(text: string): string[] {
  const lines: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      insideQuotes = !insideQuotes;
      current += ch;
    } else if (ch === "\n" && !insideQuotes) {
      lines.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  if (current) lines.push(current);
  return lines;
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
