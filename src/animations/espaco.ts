import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateEspaco(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(min-width: 769px)").matches;
  const section = document.querySelector<HTMLElement>(".espaco");
  const items = document.querySelectorAll<HTMLElement>(".espaco__item");

  if (!section || items.length === 0) return;

  if (prefersReducedMotion || !isDesktop) {
    gsap.set(items, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  gsap.fromTo(
    items,
    { opacity: 0, y: 42, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
        toggleActions: "play none none reverse",
      },
    },
  );

  for (const item of items) {
    const speed = Number.parseFloat(item.getAttribute("data-speed") || "1");

    gsap.fromTo(
      item,
      { y: 50 },
      {
        y: -120 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }
}
