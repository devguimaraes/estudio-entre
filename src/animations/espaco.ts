import {
  createSectionTimeline,
  ensureGsapRegistered,
  prefersReducedMotion,
  revealSectionHeader,
  setElementsVisible,
} from "@/animations/motion";

export function animateEspaco(): void {
  ensureGsapRegistered();
  const section = document.querySelector<HTMLElement>(".espaco");
  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([".espaco__eyebrow", ".espaco__title", ".espaco__marquee-wrapper"]);
    return;
  }

  const tl = createSectionTimeline(section);

  revealSectionHeader(tl, {
    eyebrow: ".espaco__eyebrow",
    title: ".espaco__title",
    eyebrowOpacity: 0.5,
  });

  tl.fromTo(
    ".espaco__marquee-wrapper",
    { opacity: 0, scale: 0.98 },
    { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" },
    "-=0.6",
  );
}
