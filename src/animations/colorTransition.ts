import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Transição de cor de background conforme o scroll entre seções.
 * Cada seção define sua cor de fundo e cor de texto.
 * A transição é animada via gsap.to() com duration 0.8s.
 *
 * Integra-se com Lenis via ScrollTrigger.update() (já configurado em init.ts).
 */

interface SectionColor {
  selector: string;
  bg: string;
  text: string;
}

const sections: SectionColor[] = [
  { selector: ".hero", bg: "#ec6838", text: "#f0ede8" },
  { selector: ".sobre", bg: "#f0ede8", text: "#1a1612" },
  { selector: ".eixos", bg: "#1a1612", text: "#f0ede8" },
];

export function initColorTransition(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  for (const section of sections) {
    const el = document.querySelector<HTMLElement>(section.selector);
    if (!el) continue;

    ScrollTrigger.create({
      trigger: el,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => applyColors(section, prefersReducedMotion),
      onEnterBack: () => applyColors(section, prefersReducedMotion),
    });
  }
}

function applyColors(section: SectionColor, instant: boolean): void {
  gsap.to("body", {
    backgroundColor: section.bg,
    color: section.text,
    duration: instant ? 0 : 0.8,
    ease: "power2.out",
    overwrite: "auto",
  });
}
