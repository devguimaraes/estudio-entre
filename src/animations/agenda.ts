import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateAgenda(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const header = document.querySelector(".agenda__header");
  const cards = document.querySelectorAll(".agenda .event-card, .agenda [class*='card']");

  if (header) {
    gsap.fromTo(header, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1.0, ease: "expo.out",
      scrollTrigger: { trigger: ".agenda", start: "top 75%", toggleActions: "play none none reverse" },
    });
  }

  if (cards.length > 0) {
    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".agenda", start: "top 70%", toggleActions: "play none none reverse" },
    });
  }
}
