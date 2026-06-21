import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateSeboHome(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  gsap.fromTo(
    ".sebo-home__eyebrow",
    { opacity: 0, y: 15 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".sebo-home",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );

  gsap.fromTo(
    ".sebo-home__title",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".sebo-home",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );
}
