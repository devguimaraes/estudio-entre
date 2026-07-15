import { ensureGsapRegistered, prefersReducedMotion } from "@/animations/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Inicializa todas as animações globais (Lenis + GSAP)
 */
export function initGlobalAnimations() {
  ensureGsapRegistered();

  if (!prefersReducedMotion()) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // Configurações globais do GSAP
  gsap.defaults({
    ease: "power2.out",
    duration: 0.5,
  });

  // ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: "play none none reverse",
  });
}
