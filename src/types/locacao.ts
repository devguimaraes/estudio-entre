export type IdEspacoLocavel =
  | "sala-expositiva"
  | "sala-multi-2-pavimento"
  | "estudio-podcast"
  | "espaco-completo";

export type IdParceria = "cocriacao-atividades" | "criadores-conteudo";

export interface TarifasEspaco {
  hora: number | null;
  turno: number | null;
  diaria: number | null;
}

export interface ImagemLocacao {
  src: string;
  alt: string;
}

export interface EspacoLocavel {
  id: IdEspacoLocavel;
  nome: string;
  capacidade: number;
  indicadoPara: string[];
  inclui: string[];
  tarifas: TarifasEspaco;
  observacoes?: string[];
  imagem: ImagemLocacao;
}

export interface StatLocacao {
  valor: string;
  label: string;
}

export interface LinhaTabelaValores {
  id: IdEspacoLocavel;
  nome: string;
  capacidade: number;
  hora: number | null;
  turno: number | null;
  diaria: number | null;
}

export interface ExposicoesResidentes {
  titulo: string;
  texto: string;
  imagem: ImagemLocacao;
}

export interface Parceria {
  id: IdParceria;
  titulo: string;
  descricao: string;
  formatos: string[];
  modeloFuncionamento: string;
  modeloFinanceiro?: string;
  observacoes?: string[];
  imagem?: ImagemLocacao;
}

export interface LocacaoContato {
  whatsapp: string;
  email: string;
  endereco: string;
  imagem: ImagemLocacao;
}

export interface MensagensWhatsApp {
  hero: string;
  contato: string;
  exposicao: string;
  espaco: (nomeEspaco: string) => string;
  parceria: (tipoParceria: string) => string;
}

export interface LocacaoSobre {
  eyebrow: string;
  titulo: string;
  texto: string;
}

export interface LocacaoSeo {
  title: string;
  description: string;
}

export interface LocacaoHero {
  titulo: string;
  subtitulo: string;
  imagem: ImagemLocacao;
  ctaPrimario: string;
  ctaPrimarioLabel: string;
  ctaSecundarioLabel: string;
  ctaSecundarioAnchor: string;
}
