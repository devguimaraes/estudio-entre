import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateVooLiterario(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const quoteMark = document.querySelector(".voo__quote-mark");
  const text = document.querySelector(".voo__text");
  const attr = document.querySelector(".voo__attribution");

  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".voo-literario", start: "top 70%", toggleActions: "play none none reverse" },
  });

  if (quoteMark) {
    tl.fromTo(quoteMark, { opacity: 0, scale: 0.8 }, { opacity: 0.12, scale: 1, duration: 1.2, ease: "expo.out" });
  }
  if (text) {
    tl.fromTo(text, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, "-=0.8");
  }
  if (attr) {
    tl.fromTo(attr, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");
  }
}
