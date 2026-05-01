import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateGaleria(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".galeria");
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set([".galeria__eyebrow", ".galeria__title"], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(".galeria__eyebrow", { opacity: 0, y: 15 }, { opacity: 0.5, y: 0, duration: 0.8 });

  tl.fromTo(
    ".galeria__title",
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
    "-=0.5",
  );

  // Fade in the marquee
  tl.fromTo(
    ".galeria__marquee-wrapper",
    { opacity: 0, scale: 0.98 },
    { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
    "-=1.0",
  );
}
