import type { MensagensWhatsApp } from "@/types/locacao";

export const mensagensWhatsApp: MensagensWhatsApp = {
  hero: "Olá! Tenho interesse em locação no Estúdio Entre.",
  contato: "Olá! Gostaria de saber mais sobre locação e parcerias no Estúdio Entre.",
  exposicao: "Olá! Tenho interesse em propor uma exposição residente no Estúdio Entre.",
  espaco: (nomeEspaco: string) =>
    `Olá! Tenho interesse em locar o espaço "${nomeEspaco}" no Estúdio Entre.`,
  parceria: (tipoParceria: string) =>
    `Olá! Tenho interesse em uma parceria do tipo "${tipoParceria}" com o Estúdio Entre.`,
};
