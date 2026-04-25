import gsap from "gsap";

/**
 * Editorial Eixos Animation
 * Interatividade das blades e hover effects.
 */
export function animateEixos(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const blades = document.querySelectorAll<HTMLElement>(".eixos__blade");

  if (prefersReducedMotion) {
    gsap.set(".eixos__blade p, .eixos__cta", { opacity: 1, y: 0 });
    return;
  }

  // Animação inicial de entrada
  gsap.fromTo(blades,
    { opacity: 0, scale: 1.1 },
    {
      opacity: 1,
      scale: 1,
      duration: 2,
      stagger: 0.2,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".eixos",
        start: "top 60%",
      }
    }
  );
}
