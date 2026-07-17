import type {
  EspacoLocavel,
  ExposicoesResidentes,
  LinhaTabelaValores,
  LocacaoContato,
  LocacaoHero,
  LocacaoSeo,
  LocacaoSobre,
  Parceria,
  StatLocacao,
} from "@/types/locacao";
import { WHATSAPP_PHONE } from "@/utils/whatsapp";
import { mensagensWhatsApp } from "./messages";

const INCLUSOES_SALAS = [
  "Suporte da equipe Entre",
  "Apoio na organização do espaço",
  "Orientação de uso",
];

const TARIFAS_SALAS = { hora: 80, turno: 300, diaria: 500 };

export const locacaoStats: StatLocacao[] = [
  { valor: "20", label: "pessoas nas salas" },
  { valor: "50", label: "no espaço completo" },
  { valor: "R$80", label: "hora avulsa" },
  { valor: "100%", label: "suporte da equipe" },
];

export const espacosLocaveis: EspacoLocavel[] = [
  {
    id: "sala-expositiva",
    nome: "Sala Expositiva Multidisciplinar",
    capacidade: 20,
    indicadoPara: [
      "Oficinas",
      "Vivências",
      "Cursos",
      "Ações formativas",
      "Clubes",
      "Rodas de conversa",
      "Exposições",
    ],
    inclui: INCLUSOES_SALAS,
    tarifas: TARIFAS_SALAS,
    imagem: {
      src: "/images/locacao/sala-expositiva.webp",
      alt: "Sala expositiva multidisciplinar do Estúdio Entre, ambiente acolhedor para oficinas e encontros",
    },
  },
  {
    id: "sala-multi-2-pavimento",
    nome: "Sala Multidisciplinar — 2º Pavimento",
    capacidade: 20,
    indicadoPara: [
      "Oficinas",
      "Vivências",
      "Cursos",
      "Aulas com projeção",
      "Cineclubes",
      "Clube de leitura",
    ],
    inclui: INCLUSOES_SALAS,
    tarifas: TARIFAS_SALAS,
    imagem: {
      src: "/images/locacao/sala-multi.webp",
      alt: "Sala multidisciplinar no 2º pavimento do Estúdio Entre, preparada para aulas e projeções",
    },
  },
  {
    id: "estudio-podcast",
    nome: "Estúdio de Podcast",
    capacidade: 20,
    indicadoPara: ["Gravação de podcast", "Conteúdos em áudio", "Videocast"],
    inclui: ["Suporte durante a gravação", "Uso dos equipamentos de áudio"],
    tarifas: TARIFAS_SALAS,
    observacoes: [
      "Edição de áudio é serviço à parte, negociado direto com o operador conforme demanda.",
    ],
    imagem: {
      src: "/images/locacao/podcast.webp",
      alt: "Estúdio de podcast do Estúdio Entre com equipamentos de áudio profissionais",
    },
  },
  {
    id: "espaco-completo",
    nome: "Espaço Completo",
    capacidade: 50,
    indicadoPara: ["Eventos", "DJ sets", "Pocket shows", "Audições", "Encontros", "Ativações"],
    inclui: [
      "Uso total do espaço",
      "Suporte da equipe Entre",
      "Apoio logístico",
      "Montagem e desmontagem",
    ],
    tarifas: { hora: null, turno: 600, diaria: 900 },
    observacoes: [
      "Estúdio Entre responsável pela estrutura e qualidade do áudio.",
      "Captação de vídeo não inclusa — indicamos parceiros ou o cliente traz equipe própria.",
    ],
    imagem: {
      src: "/images/locacao/espaco-completo.webp",
      alt: "Espaço completo do Estúdio Entre preparado para eventos com até 50 pessoas",
    },
  },
];

export const tabelaValoresResumo: LinhaTabelaValores[] = espacosLocaveis.map((espaco) => ({
  id: espaco.id,
  nome: espaco.nome,
  capacidade: espaco.capacidade,
  hora: espaco.tarifas.hora,
  turno: espaco.tarifas.turno,
  diaria: espaco.tarifas.diaria,
}));

export const exposicoesResidentes: ExposicoesResidentes = {
  titulo: "Exposições residentes",
  texto:
    "Recebemos propostas com duração média de 1 mês. Modelo base: evento de abertura, possibilidade de venda de obras, curadoria Entre. Cada exposição é personalizada com o artista ou coletivo considerando duração, formato da montagem, vendas de obras, comissão, programação paralela, mediação e ações educativas. Todos os acordos formalizados em contrato específico.",
  imagem: {
    src: "/images/locacao/exposicoes-residentes.webp",
    alt: "Exposição de arte no Estúdio Entre, ambiente de galeria com obras em cartaz",
  },
};

export const parcerias: Parceria[] = [
  {
    id: "cocriacao-atividades",
    titulo: "Cocriação de Atividades",
    descricao:
      "Formatos possíveis: oficinas, vivências, cursos, ações formativas, clubes, rodas de conversa, encontros e audições.",
    formatos: [
      "Oficinas",
      "Vivências",
      "Cursos",
      "Ações formativas",
      "Clubes",
      "Rodas de conversa",
      "Encontros",
      "Audições",
    ],
    modeloFuncionamento:
      "Curadoria compartilhada, construção conjunta da proposta, uso do espaço e suporte Entre.",
    modeloFinanceiro:
      "Divisão de receita de ingressos e inscrições (a definir por projeto). Operação e receita do bar são do Estúdio Entre.",
    imagem: {
      src: "/images/locacao/cocriacao-atividades.webp",
      alt: "Oficina colaborativa e vivência em grupo no Estúdio Entre",
    },
  },
  {
    id: "criadores-conteudo",
    titulo: "Parceria com Criadores de Conteúdo",
    descricao:
      "Uso do espaço para gravação, suporte técnico básico, divulgação conjunta e contrapartida em conteúdo.",
    formatos: ["Gravação de conteúdo", "Suporte técnico básico", "Divulgação conjunta"],
    modeloFuncionamento:
      "Permuta de uso do espaço por produção de conteúdo no local, menção ao Estúdio Entre e marcação nas redes.",
    observacoes: [
      "Parcerias avaliadas caso a caso.",
      "Prioridade para projetos alinhados à proposta do Entre.",
      "Disponibilidade sujeita à agenda.",
    ],
    imagem: {
      src: "/images/locacao/parcerias.webp",
      alt: "Criadores de conteúdo em gravação colaborativa no Estúdio Entre",
    },
  },
];

export const locacaoContato: LocacaoContato = {
  whatsapp: WHATSAPP_PHONE,
  email: "contato@estudioentre.com.br",
  endereco: "Rua Maria Calmon, 100 — Méier, Rio de Janeiro",
  imagem: {
    src: "/images/locacao/estudio-entre.webp",
    alt: "Fachada e entrada do Estúdio Entre no Méier, Rio de Janeiro",
  },
};

export const locacaoSeo: LocacaoSeo = {
  title: "Locação & Parcerias — Estúdio Entre",
  description:
    "Alugue salas, estúdio de podcast ou o espaço completo no Estúdio Entre. Méier, Rio de Janeiro — com suporte da equipe em cada etapa.",
};

export const locacaoSobre: LocacaoSobre = {
  eyebrow: "O lugar",
  titulo: "Um espaço para criar",
  texto:
    "No coração do Méier, o Estúdio Entre abre suas salas para quem quer criar, gravar e reunir gente — com a equipe Entre do seu lado em cada etapa.",
};

export const locacaoHero: LocacaoHero = {
  titulo: "Alugue um espaço para criar, gravar e reunir gente",
  subtitulo: "Salas, estúdio de podcast e o espaço completo — com a equipe Entre do seu lado.",
  imagem: {
    src: "/images/locacao/hero.webp",
    alt: "Ambiente do Estúdio Entre pronto para receber encontros criativos e produções",
  },
  ctaPrimario: mensagensWhatsApp.hero,
  ctaPrimarioLabel: "Agendar uma visita",
  ctaSecundarioLabel: "Ver espaços e valores",
  ctaSecundarioAnchor: "#espacos",
};

export { mensagensWhatsApp };
