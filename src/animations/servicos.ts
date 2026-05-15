import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateServicos(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".servicos");

  if (!section) return;

  const headerItems = section.querySelectorAll<HTMLElement>(".servicos__eyebrow, .servicos__title");
  const cards = section.querySelectorAll<HTMLElement>(".servicos__card");

  if (prefersReducedMotion) {
    gsap.set([headerItems, cards], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    headerItems,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.95, stagger: 0.12, ease: "expo.out" },
  ).fromTo(
    cards,
    { opacity: 0, y: 46 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
    "-=0.45",
  );
}
