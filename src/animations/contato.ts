import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateContato(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".contato");
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set([".contato__eyebrow", ".contato__title", ".contato__info", ".contato__map"], {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      visibility: "visible",
    });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      toggleActions: "play none none reverse",
      onComplete: () => {
        section.classList.add("is-ready");
      },
    },
  });

  // 1) Header reveal
  tl.fromTo(".contato__eyebrow", { opacity: 0, y: 15 }, { opacity: 0.4, y: 0, duration: 0.8 });

  tl.fromTo(
    ".contato__title",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
    "-=0.6",
  );

  // 2) Info blocks reveal
  tl.fromTo(
    ".contato__info",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
    "-=0.8",
  );

  // 3) Map reveal
  tl.fromTo(
    ".contato__map",
    { opacity: 0, y: 30, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" },
    "-=0.6",
  );
}
