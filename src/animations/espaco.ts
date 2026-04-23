import gsap from "gsap";

export function animateEspaco(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const section = document.querySelector<HTMLElement>(".espaco");
  const header = document.querySelector<HTMLElement>(".espaco__header");

  if (!section) return;

  const ease = "power2.out";

  if (prefersReducedMotion) {
    if (header) gsap.set(header, { opacity: 1 });
    return;
  }

  if (header) {
    gsap.fromTo(
      header,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  window.addEventListener(
    "espaco:hydrated",
    () => {
      const items = document.querySelectorAll<HTMLElement>("[data-foto-item]");
      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease,
          overwrite: "auto",
        },
      );
    },
    { once: true },
  );
}
