import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animatePilares(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const strips = document.querySelectorAll(".pilar__strip");

  for (const strip of strips) {
    const title = strip.querySelector(".pilar__title");
    const subtitle = strip.querySelector(".pilar__subtitle");
    const desc = strip.querySelector(".pilar__desc");

    if (title) {
      gsap.fromTo(
        title,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strip,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 0.7,
          duration: 0.6,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strip,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    if (desc) {
      gsap.fromTo(
        desc,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 0.8,
          duration: 0.6,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strip,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }
  }
}
