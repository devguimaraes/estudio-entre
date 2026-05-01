import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateVooLiterario(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".voo-literario");
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set([".voo__quote-mark", ".voo__text", ".voo__attribution"], {
      opacity: 1,
      y: 0,
      scale: 1,
    });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    ".voo__quote-mark",
    { opacity: 0, scale: 0.8, y: 20 },
    { opacity: 0.12, scale: 1, y: 0, duration: 1.5, ease: "expo.out" },
  );

  tl.fromTo(
    ".voo__text",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
    "-=1.2",
  );

  tl.fromTo(
    ".voo__attribution",
    { opacity: 0, y: 15 },
    { opacity: 0.6, y: 0, duration: 1, ease: "power2.out" },
    "-=0.8",
  );
}
