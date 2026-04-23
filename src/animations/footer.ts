import gsap from "gsap";

export function animateFooter(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  const section = document.querySelector<HTMLElement>(".footer");
  if (!section) return;

  const brand = document.querySelector<HTMLElement>(".footer__brand");
  const grid = document.querySelector<HTMLElement>(".footer__grid");
  const ease = "power2.out";

  if (brand) {
    gsap.fromTo(
      brand,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  if (grid) {
    const children = grid.querySelectorAll<HTMLElement>(
      ".footer__nav, .footer__contact, .footer__social",
    );

    gsap.fromTo(
      children,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease,
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }
}
