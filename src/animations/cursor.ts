import gsap from "gsap";

/**
 * Cursor customizado — ícone da marca (olho) com estados contextuais.
 * Desktop only. Usa gsap.quickTo() para seguir o mouse sem lag.
 */

export function initCursor(): void {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (isTouchDevice || prefersReducedMotion) return;

  const cursor = document.querySelector<HTMLElement>(".cursor");
  const cursorInner = document.querySelector<HTMLElement>(".cursor__inner");
  const label = document.querySelector<HTMLElement>(".cursor__label");

  if (!cursor || !cursorInner || !label) return;

  // Tornar cursor visível após primeira interação
  cursor.style.opacity = "0";

  const xTo = gsap.quickTo(cursor, "x", {
    duration: 0.15,
    ease: "power2.out",
  });
  const yTo = gsap.quickTo(cursor, "y", {
    duration: 0.15,
    ease: "power2.out",
  });
  const rotTo = gsap.quickTo(cursorInner, "rotation", {
    duration: 0.4,
    ease: "power2.out",
  });

  let lastX = 0;

  window.addEventListener("mousemove", (e) => {
    if (cursor.style.opacity === "0") {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    }
    xTo(e.clientX - 20);
    yTo(e.clientY - 20);

    // Rotação leve baseada na direção horizontal
    const dx = e.clientX - lastX;
    rotTo(dx * 0.5);
    lastX = e.clientX;
  });

  window.addEventListener("mouseleave", () => {
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
  });

  window.addEventListener("mouseenter", () => {
    gsap.to(cursor, { opacity: 1, duration: 0.3 });
  });

  // Hover em elementos interativos
  const interactives = document.querySelectorAll<HTMLElement>("[data-cursor]");
  for (const el of interactives) {
    el.addEventListener("mouseenter", () => {
      const text = el.dataset.cursor ?? "ENTRAR";
      label.textContent = text;
      cursor.classList.add("is-hovering");
      gsap.to(cursorInner, { scale: 1.6, duration: 0.3, ease: "power2.out" });
      gsap.to(label, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hovering");
      gsap.to(cursorInner, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(label, { opacity: 0, y: 4, duration: 0.3, ease: "power2.out" });
    });
  }
}
