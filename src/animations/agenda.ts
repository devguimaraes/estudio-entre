import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateAgenda(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const section = document.querySelector<HTMLElement>(".agenda");
  const header = document.querySelector<HTMLElement>(".agenda__header");
  const content = section?.querySelector<HTMLElement>(".agenda__header + div");

  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set([header, content], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 76%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    header,
    { opacity: 0, y: 34 },
    { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
  ).fromTo(
    content,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.95, ease: "power2.out" },
    "-=0.55",
  );
}
