import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateAgenda(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".agenda");
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set([".agenda__eyebrow", ".agenda__title-line", ".agenda__card"], {
      opacity: 1,
      y: 0,
      visibility: "visible",
    });
    return;
  }

  const tlHeader = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  tlHeader.fromTo(".agenda__eyebrow", { opacity: 0, y: 15 }, { opacity: 0.4, y: 0, duration: 0.8 });

  tlHeader.fromTo(
    ".agenda__title-line",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "expo.out" },
    "-=0.5",
  );

  // Note: AgendaFilter handles card animations on its own based on state,
  // but we can trigger the initial stagger here if needed.
  // However, AgendaFilter has its own useEffect for initial reveal.
}
