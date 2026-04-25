import gsap from "gsap";

/**
 * Editorial Sobre Animation
 * Reveal de texto por blocos e parallax sutil.
 */
export function animateSobre(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".sobre");

  if (!section || prefersReducedMotion) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
    }
  });

  tl.fromTo(".sobre__title", 
    { opacity: 0, x: -30 }, 
    { opacity: 1, x: 0, duration: 1.5, ease: "expo.out" }
  )
  .fromTo(".sobre__text", 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out" },
    "-=1"
  )
  .fromTo(".sobre__image-reveal", 
    { clipPath: "inset(100% 0 0 0)" }, 
    { clipPath: "inset(0% 0 0 0)", duration: 1.8, ease: "expo.inOut" },
    "-=1.5"
  )
  .fromTo(".sobre__watermark", 
    { scale: 0.8, opacity: 0 }, 
    { scale: 1, opacity: 0.02, duration: 3, ease: "power2.out" },
    "0"
  );
}
