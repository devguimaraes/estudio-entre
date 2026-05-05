import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animatePilares(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".pilares");
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set([".pilares__eyebrow", ".pilares__title", ".pilares__lead", ".pilar__cell"], {
      opacity: 1,
      y: 0,
      scale: 1,
      visibility: "visible",
    });
    return;
  }

  const tlHeader = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  tlHeader.fromTo(
    ".pilares__eyebrow",
    { opacity: 0, y: 15 },
    { opacity: 0.4, y: 0, duration: 0.8 },
  );

  tlHeader.fromTo(
    ".pilares__title",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
    "-=0.5",
  );

  tlHeader.fromTo(
    ".pilares__lead",
    { opacity: 0, x: 20 },
    { opacity: 0.6, x: 0, duration: 0.8 },
    "-=0.7",
  );

  // Grid Stagger
  gsap.fromTo(
    ".pilar__cell",
    {
      opacity: 0,
      y: 40,
      scale: 0.98,
      rotateX: -10,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration: 1.2,
      stagger: {
        amount: 0.6,
        grid: [2, 3],
        from: "start",
      },
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".pilares",
        start: "top 65%",
        toggleActions: "play none none reverse",
      },
    },
  );

  // Subtle Parallax on icons inside cells
  const cells = section.querySelectorAll(".pilar__cell");
  for (const cell of cells) {
    const icon = cell.querySelector(".pilar__icon-wrap");
    if (icon) {
      gsap.to(icon, {
        y: -20,
        scrollTrigger: {
          trigger: cell,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }
  }
}
