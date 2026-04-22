import gsap from "gsap";

/**
 * Animações da seção Sobre
 * - Text reveal via ScrollTrigger (staggered)
 * - Parallax na foto (desktop apenas)
 * - Decoração flutuante com movimento no scroll
 *
 * Usa gsap.fromTo() porque os elementos começam com opacity: 0 no CSS.
 * Parallax desativado em mobile por performance.
 */
export function animateSobre(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const section = document.querySelector<HTMLElement>(".sobre");
  const eyebrow = document.querySelector<HTMLElement>(".sobre__eyebrow");
  const title = document.querySelector<HTMLElement>(".sobre__title");
  const texts = document.querySelectorAll<HTMLElement>(".sobre__text");
  const signature = document.querySelector<HTMLElement>(".sobre__signature");
  const photoWrapper = document.querySelector<HTMLElement>(
    ".sobre__photo-wrapper",
  );
  const decoration = document.querySelector<HTMLElement>(".sobre__decoration");

  if (!section) return;

  const ease = "power2.out";

  // Reduced motion: mostrar tudo sem animação
  if (prefersReducedMotion) {
    const all = [eyebrow, title, signature];
    for (const el of all) {
      if (el) gsap.set(el, { opacity: 1 });
    }
    for (const t of texts) {
      gsap.set(t, { opacity: 1 });
    }
    return;
  }

  // 1. Text reveal (ScrollTrigger com stagger)
  const textElements = [
    eyebrow,
    title,
    ...Array.from(texts),
    signature,
  ].filter(Boolean) as HTMLElement[];

  gsap.fromTo(
    textElements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.25,
      ease,
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    },
  );

  // 2. Parallax na foto (desktop apenas)
  if (photoWrapper && window.innerWidth > 1024) {
    gsap.fromTo(
      photoWrapper,
      { yPercent: 0 },
      {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }

  // 3. Decoração flutuante (desktop apenas)
  if (decoration && window.innerWidth > 1024) {
    gsap.fromTo(
      decoration,
      { y: 0 },
      {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }
}
