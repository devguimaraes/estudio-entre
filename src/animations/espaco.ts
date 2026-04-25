import gsap from "gsap";

/**
 * Editorial Espaço Animation
 * Parallax multi-velocidade para efeito 3D.
 */
export function animateEspaco(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll<HTMLElement>(".espaco__item");

  if (prefersReducedMotion) return;

  for (const item of items) {
    const speed = Number.parseFloat(item.getAttribute("data-speed") || "1");
    
    gsap.fromTo(item, 
      { y: 50 },
      {
        y: -150 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );
  }
}
