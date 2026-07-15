import { prefersReducedMotion } from "@/animations/motion";
import gsap from "gsap";

/**
 * Editorial Cursor Animation
 * Smooth tracking with contextual labels and scale transitions.
 */
export function initCursor(): void {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice || prefersReducedMotion()) return;

  const cursor = document.getElementById("custom-cursor");
  const label = cursor?.querySelector(".cursor__label");

  if (!cursor || !label) return;

  gsap.set(cursor, {
    opacity: 0,
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });

  let isVisible = false;

  const onMouseMove = (e: MouseEvent) => {
    if (!isVisible) {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      isVisible = true;
    }
    xTo(e.clientX);
    yTo(e.clientY);
  };

  window.addEventListener("mousemove", onMouseMove);

  const updateCursor = (el: HTMLElement) => {
    const text = el.getAttribute("data-cursor") || "ENTRAR";
    label.textContent = text;
    cursor.classList.add("is-hovering");
  };

  const resetCursor = () => {
    cursor.classList.remove("is-hovering");
  };

  document.addEventListener(
    "mouseenter",
    (e) => {
      const target = e.target as HTMLElement;
      if (target?.hasAttribute?.("data-cursor")) {
        updateCursor(target);
      } else {
        const parentWithCursor = target?.closest?.("[data-cursor]") as HTMLElement;
        if (parentWithCursor) updateCursor(parentWithCursor);
      }
    },
    true,
  );

  document.addEventListener(
    "mouseleave",
    (e) => {
      const target = e.target as HTMLElement;
      if (target?.hasAttribute?.("data-cursor") || target?.closest?.("[data-cursor]")) {
        resetCursor();
      }
    },
    true,
  );
}
