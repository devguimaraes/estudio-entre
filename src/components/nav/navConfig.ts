export interface NavLink {
  href: string;
  label: string;
  cursor?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  links: NavLink[];
}

export const navGroups: NavGroup[] = [
  {
    id: "o-entre",
    label: "O Entre",
    links: [
      { href: "/#sobre", label: "O Estúdio", cursor: "ENTRAR" },
      { href: "/#espaco", label: "O Lugar", cursor: "ENTRAR" },
      { href: "/#agendar-visita", label: "Visitação", cursor: "ENTRAR" },
    ],
  },
  {
    id: "programacao",
    label: "Programação",
    links: [
      { href: "/exposicoes", label: "Exposições", cursor: "ENTRAR" },
      { href: "/agenda", label: "Agenda", cursor: "ENTRAR" },
      { href: "/galeria", label: "Galeria", cursor: "ENTRAR" },
    ],
  },
  {
    id: "servicos",
    label: "Serviços",
    links: [
      { href: "/locacao", label: "Locação", cursor: "ENTRAR" },
      { href: "/sebo", label: "Sebo", cursor: "GARIMPAR" },
      { href: "/lojinha", label: "Loja", cursor: "COMPRAR" },
    ],
  },
];

export const allNavLinks: NavLink[] = navGroups.flatMap((group) => group.links);
