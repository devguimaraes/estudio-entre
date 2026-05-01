import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateFooter(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".footer");
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set([".footer__col", ".footer__watermark"], { opacity: 1, y: 0, scale: 1 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    ".footer__watermark",
    { opacity: 0, scale: 0.9, y: 50 },
    { opacity: 0.04, scale: 1, y: 0, duration: 2, ease: "expo.out" },
  );

  tl.fromTo(
    ".footer__col",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
    },
    "-=1.5",
  );

  // Scroll Parallax for watermark
  gsap.to(".footer__watermark", {
    y: -50,
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    },
  });
}
