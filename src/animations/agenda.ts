import gsap from "gsap";

export function animateAgenda(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const section = document.querySelector<HTMLElement>(".agenda");
  const header = document.querySelector<HTMLElement>(".agenda__header");

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
    "agenda:hydrated",
    () => {
      const cards = document.querySelectorAll<HTMLElement>("[data-event-card]");
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease,
          overwrite: "auto",
        },
      );
    },
    { once: true },
  );
}
