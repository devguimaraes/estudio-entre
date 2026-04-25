import gsap from "gsap";

/**
 * Editorial Hero Entrance Animation
 * Sequência cinematográfica com revelação de camadas.
 */
export function animateHero(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    gsap.set(".hero__symbol, .hero__logo, .hero__reveal-word, .hero__ctas, .hero__scroll", { 
      opacity: 1, 
      y: 0, 
      scale: 1 
    });
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: "power4.out", duration: 1.5 }
  });

  tl.to(".hero__symbol", {
    opacity: 0.1,
    scale: 1.2,
    duration: 3,
    ease: "expo.out"
  })
  .to(".hero__logo", {
    opacity: 1,
    y: 0,
    duration: 1.8,
    delay: -2.5
  })
  .to(".hero__reveal-word", {
    y: 0,
    stagger: 0.15,
    duration: 1.8,
    delay: -1.5
  })
  .to(".hero__ctas", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    delay: -1
  })
  .to(".hero__scroll", {
    opacity: 1,
    duration: 1,
    delay: -0.5
  })
  .to(".hero__scroll-line", {
    x: 0,
    duration: 1.5,
    ease: "expo.inOut"
  }, "-=1");

  // Mouse parallax sutil no símbolo
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 30;
    const yPos = (clientY / window.innerHeight - 0.5) * 30;

    gsap.to(".hero__symbol", {
      x: xPos,
      y: yPos,
      duration: 1.5,
      ease: "power2.out"
    });
  });
}
