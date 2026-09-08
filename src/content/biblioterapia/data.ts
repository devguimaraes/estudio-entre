import { buildWaLink } from "@/utils/whatsapp";

export const VAL_WHATSAPP_PHONE = "5521998971088";

export const BIBLIOTERAPIA_VIDEO_SRC =
  "https://pub-cb6c6a29faec42c288d5d1e371e10d8d.r2.dev/estudio-entre-site/blibioterapia-video.mp4";

export interface CuidadoItem {
  id: string;
  title: string;
  highlight: string;
  description: string;
  icon: string;
  color: string;
  textColor: string;
}

export interface RitualStep {
  number: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const biblioterapia = {
  eyebrow: "Pilar 01 // Cultura & Cuidado",
  tag: "Presencial no Méier",
  title: "Leituras que cuidam",
  subhead:
    "Roda de escuta e acolhimento no Méier — para quem busca um lugar seguro que não é consultório.",
  mechanism: "A gente lê junto, fala um pouco, escuta muito.",
  what: "Leitura guiada, partilha de textos e conversa como ferramenta de cuidado emocional, reflexão e conexão. Grupos pequenos, presencial no Méier.",
  not: "Não é terapia clínica. Não é clube do livro. É mediação afetiva através da literatura.",

  // Ritual em 4 passos
  ritual: [
    {
      number: "01",
      title: "Chegar & Acolher",
      description:
        "Desacelerar do ritmo da cidade, tomar um café e encontrar seu lugar no círculo sem pressa.",
    },
    {
      number: "02",
      title: "Leitura Guiada",
      description:
        "Um trecho de livro, crônica ou poema escolhido pela Val, lido com pausa e presença.",
    },
    {
      number: "03",
      title: "Partilha Livre",
      description:
        "Espaço aberto para expressar o que o texto despertou em você — sem obrigação de falar bonito.",
    },
    {
      number: "04",
      title: "Escuta Atenta",
      description:
        "O silêncio acolhedor e coletivo onde uma palavra de outra pessoa ilumina a sua própria história.",
    },
  ] satisfies RitualStep[],

  // 4 Cuidados da Tia Val (Bento Grid)
  cuidados: [
    {
      id: "saude-mental",
      title: "Cuidar da saúde mental",
      highlight: "Alívio no ritmo da cidade",
      description:
        "Nomear dores e sentimentos através das histórias de outros autores, tirando o peso de carregar tudo sozinho.",
      icon: "/icons/olho.svg",
      color: "#9E4B2D", // Terracota
      textColor: "#F0EDE8",
    },
    {
      id: "autocuidado",
      title: "Autocuidado & bem-estar",
      highlight: "Um respiro de duas horas",
      description:
        "Um tempo exclusivo e protegido para você. Sem notificações, sem exigências. O corpo desacelera e a mente respira.",
      icon: "/icons/spark.svg",
      color: "#3D1020", // Bordô
      textColor: "#F0EDE8",
    },
    {
      id: "conexoes",
      title: "Reflexões & caminhos",
      highlight: "Novas perspectivas cotidianas",
      description:
        "Fazer pontes entre as narrativas e a própria vida, descobrindo saídas possíveis onde antes parecia haver um impasse.",
      icon: "/icons/chave.svg",
      color: "#BDB2DD", // Lilás médio
      textColor: "#1A1612",
    },
    {
      id: "escuta",
      title: "Cuidar do outro ao ouvir",
      highlight: "Acolhimento sem julgamento",
      description:
        "Aprender a escutar com o coração aberto, sem tentar consertar nem diagnosticar. Ouvir já é metade do cuidado.",
      icon: "/icons/fone.svg",
      color: "#DEC72C", // Mostarda
      textColor: "#1A1612",
    },
  ] satisfies CuidadoItem[],

  quote: "Recria sua vida, sempre, sempre. Remove pedras e planta roseiras e faz doces. Recomeça.",
  quoteAuthor: "Cora Coralina",

  facilitator: {
    name: "Val Santos",
    role: "Especialista em recomeços",
    bio: "Leitora voraz, educadora e mediadora afetiva. Conduz rodas onde a literatura serve como espelho e ponte para novas fases da vida. Sem jaleco, sem julgamento — apenas com café, livros e escuta verdadeira.",
    phoneDisplay: "(21) 99897-1088",
  },

  faq: [
    {
      question: "Preciso ter lido algum livro antes de participar?",
      answer:
        "Não! Diferente de um clube do livro convencional, não há leitura prévia obrigatória. O texto é apresentado, lido e acolhido junto com o grupo na própria vivência.",
    },
    {
      question: "Tenho vergonha de falar em público. Sou obrigado a me expor?",
      answer:
        "De forma alguma. Sua presença e sua escuta silenciosa já são valiosas para a roda. Você só fala se e quando sentir vontade.",
    },
    {
      question: "A vivência substitui terapia psicológica?",
      answer:
        "Não. A biblioterapia é uma prática integrativa e comunitária de cuidado pela arte da palavra. É um complemento acolhedor para a alma, sem finalidade clínica médica.",
    },
    {
      question: "Quantas pessoas participam por roda?",
      answer:
        "Para garantir acolhimento, intimidade e tempo de fala para todos, os grupos são pequenos, com no máximo 10 participantes por encontro.",
    },
  ] satisfies FaqItem[],

  place: {
    name: "Estúdio Entre",
    street: "Rua Maria Calmon, 100",
    neighborhood: "Méier, Rio de Janeiro",
    note: "Um casarão acolhedor no coração da Zona Norte.",
  },

  practical:
    "Presencial, grupos reduzidos de até 10 pessoas. Inscrições e agendamento direto com a Val no WhatsApp.",
  ctaLabel: "Agendar vivência no WhatsApp",
  ctaSecondaryLabel: "Tirar dúvidas com a Val",
  clickTrigger: "Não é consulta clínica · Roda presencial no Méier",
  clickTriggerRoda: "Fale direto com a Val Santos · Sem compromisso",
  videoBadge: "Val explica a roda // 1 min",
  videoTitle: "A Roda de Biblioterapia",
  videoCaption: "O livro no meio. A Val conduz. Você se reconecta.",
  photoAlt: "Val Santos lê um livro de perfil, com o Rio ao fundo.",
  waUrl: buildWaLink(
    "Olá, Val! Gostaria de saber mais e agendar uma vivência de biblioterapia no Estúdio Entre.",
    VAL_WHATSAPP_PHONE,
  ),
  seo: {
    title: "Biblioterapia — Leituras que cuidam com Val Santos | Estúdio Entre",
    description:
      "Roda de biblioterapia presencial no Méier, RJ com Val Santos. Leitura guiada, escuta afetiva e recomeço — não é terapia clínica, é uma roda. Agende no WhatsApp.",
  },
} as const;
