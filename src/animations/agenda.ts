import gsap from "gsap";

/**
 * Editorial Agenda Animation
 * Reveal do cabeçalho e orquestração da entrada da lista.
 */
export function animateAgenda(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const section = document.querySelector<HTMLElement>(".agenda");
  const header = document.querySelector<HTMLElement>(".agenda__header");

  if (!section || !header) return;

  if (prefersReducedMotion) {
    gsap.set(header, { opacity: 1 });
    return;
  }

  gsap.fromTo(header,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "expo.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      }
    }
  );
}
