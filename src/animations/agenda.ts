import {
  createSectionTimeline,
  ensureGsapRegistered,
  prefersReducedMotion,
  revealSectionHeader,
  setElementsVisible,
} from "@/animations/motion";

export function animateAgenda(): void {
  ensureGsapRegistered();
  const section = document.querySelector<HTMLElement>(".agenda");
  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([".agenda__eyebrow", ".agenda__title-line", ".agenda__card"], {
      opacity: 1,
      y: 0,
      visibility: "visible",
    });
    return;
  }

  const tlHeader = createSectionTimeline(section);

  revealSectionHeader(tlHeader, {
    eyebrow: ".agenda__eyebrow",
    title: ".agenda__title-line",
    eyebrowOpacity: 0.4,
    eyebrowDuration: 0.8,
    titleY: 30,
    titleDuration: 1.2,
    titleStagger: 0.2,
    overlap: "-=0.5",
  });
}
