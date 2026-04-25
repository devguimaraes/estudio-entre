import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateEixos(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".eixos");
  const blades = document.querySelectorAll<HTMLElement>(".eixos__blade");

  if (!section || blades.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(".eixos__blade, .eixos__image, .eixos__eyebrow, .eixos__title", {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    });
    gsap.set(".eixos__body, .eixos__cta", { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 68%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    blades,
    { opacity: 0, y: 52, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.35,
      stagger: 0.14,
      ease: "expo.out",
    },
  )
    .fromTo(
      ".eixos__image",
      { scale: 1.08 },
      { scale: 1, duration: 1.6, stagger: 0.08, ease: "power3.out" },
      "-=1.1",
    )
    .fromTo(
      ".eixos__eyebrow, .eixos__title",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" },
      "-=0.9",
    );
}
