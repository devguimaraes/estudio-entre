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
export const CATEGORIAS_LOJA = ["Livros", "Leitura e Criação", "Atividades"] as const;
export type CategoriaLoja = (typeof CATEGORIAS_LOJA)[number];

export const CORES_CATEGORIA_LOJA: Record<CategoriaLoja, string> = {
  Livros: "#1D432C",
  "Leitura e Criação": "#777BDE",
  Atividades: "#EC6838",
};

export interface VariacaoFrete {
  localidade: string;
  preco?: string;
}

export interface OpcaoFrete {
  modalidade: string;
  prazo: string;
  icone: string;
  variacoes: VariacaoFrete[];
}

export const OPCOES_FRETE = [
  {
    modalidade: "Motoboy RJ",
    prazo: "Até 24h após a compra",
    icone: "ph:motorcycle",
    variacoes: [
      { localidade: "Zona Norte", preco: "R$13" },
      { localidade: "Demais localidades", preco: "R$18" },
    ],
  },
  {
    modalidade: "Correios",
    prazo: "Até 48h após a compra",
    icone: "ph:package",
    variacoes: [
      { localidade: "RJ", preco: "R$18" },
      { localidade: "Brasil", preco: "R$28" },
    ],
  },
  {
    modalidade: "Uber Flash / 99 Entrega",
    prazo: "Entrega rápida",
    icone: "ph:car",
    variacoes: [{ localidade: "Frete por conta do cliente" }],
  },
] as const satisfies readonly OpcaoFrete[];

export const FRETE_GRATIS_VALOR_MINIMO = 300;
