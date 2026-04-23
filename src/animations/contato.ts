import gsap from "gsap";

export function animateContato(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const section = document.querySelector<HTMLElement>(".contato");
  const header = document.querySelector<HTMLElement>(".contato__header");
  const info = document.querySelector<HTMLElement>(".contato__info");

  if (!section) return;

  const ease = "power2.out";

  if (prefersReducedMotion) {
    if (header) gsap.set(header, { opacity: 1 });
    if (info) gsap.set(info, { opacity: 1 });
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

  if (info) {
    gsap.fromTo(
      info,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  window.addEventListener(
    "contato:hydrated",
    () => {
      const formWrapper = document.querySelector<HTMLElement>(
        ".contato__form-wrapper",
      );
      if (!formWrapper) return;

      gsap.fromTo(
        formWrapper,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease,
          overwrite: "auto",
        },
      );
    },
    { once: true },
  );
}
