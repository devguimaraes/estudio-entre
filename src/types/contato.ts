export const INTERESSE_OPTIONS = [
  "Eventos e Cultura",
  "Gravação de Podcast",
  "Produção de Áudio",
  "Outro",
] as const;

export type Interesse = (typeof INTERESSE_OPTIONS)[number];

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContatoPayload {
  nome: string;
  email: string;
  interesse: string;
  mensagem: string;
  honeypot?: string;
}
