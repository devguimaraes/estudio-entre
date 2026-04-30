import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animatePilares(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const cells = document.querySelectorAll(".pilar__cell");
  const eyebrow = document.querySelector(".pilares__eyebrow");

  if (eyebrow) {
    gsap.fromTo(eyebrow, { opacity: 0, y: 15 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".pilares", start: "top 80%", toggleActions: "play none none reverse" },
    });
  }

  gsap.fromTo(cells,
    { y: 50, opacity: 0, scale: 0.96 },
    {
      y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".pilares", start: "top 75%", toggleActions: "play none none reverse" },
    }
  );
}
