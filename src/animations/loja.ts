import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateLojaHome(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  gsap.fromTo(
    ".loja-home__eyebrow",
    { opacity: 0, y: 15 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".loja-home",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );

  gsap.fromTo(
    ".loja-home__title",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".loja-home",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );
}

export function animateFreteInfo(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const banner = document.querySelector(".frete-info__banner");
  const cards = gsap.utils.toArray<HTMLElement>(".frete-info__card");

  if (banner) {
    gsap.fromTo(
      banner,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".frete-info",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".frete-info",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }
}
