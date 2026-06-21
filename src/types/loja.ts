export interface ProdutoLoja {
  slug: string;
  titulo: string;
  descricao: string;
  preco: string;
  imagemUrl: string | null;
  categoria: string;
  productUrl: string;
  variationId: number | null;
}

/** Categorias da loja InfinitePay */
export const CATEGORIAS_LOJA = ["Livros", "Leitura e Criação"] as const;
export type CategoriaLoja = (typeof CATEGORIAS_LOJA)[number];

export const CORES_CATEGORIA_LOJA: Record<string, string> = {
  Livros: "#1D432C",
  "Leitura e Criação": "#777BDE",
};
