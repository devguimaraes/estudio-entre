/**
 * Setup global de animações GSAP + Lenis Smooth Scroll
 *
 * Inicializa:
 * - Lenis (smooth scroll)
 * - ScrollTrigger (integração com Lenis)
 * - Configurações globais do GSAP
 */

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar plugins do GSAP
gsap.registerPlugin(ScrollTrigger);

// Instância global do Lenis
export let lenis: Lenis | null = null;

/**
 * Inicializa o smooth scroll com Lenis e integra com ScrollTrigger
 */
export function initSmoothScroll(): Lenis {
  // Criar instância do Lenis
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Integrar Lenis com ScrollTrigger
  function onScroll(scrollTime: number, scrollDirection: number) {
    ScrollTrigger.update();
  }

  lenis.on("scroll", onScroll);

  // Request animation frame loop
  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
}

/**
 * Inicializa todas as animações globais
 */
export function initAnimations(): void {
  // Inicializar smooth scroll
  initSmoothScroll();

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

/**
 * Para o smooth scroll (útil para debug)
 */
export function stopSmoothScroll(): void {
  lenis?.stop();
}

/**
 * Retoma o smooth scroll
 */
export function startSmoothScroll(): void {
  lenis?.start();
}
