import {
  ensureGsapRegistered,
  prefersReducedMotion,
  revealSectionHeaderStandalone,
  setElementsVisible,
} from "@/animations/motion";

export function animateSeboHome(): void {
  ensureGsapRegistered();

  if (prefersReducedMotion()) {
    setElementsVisible([".sebo-home__eyebrow", ".sebo-home__title"]);
    return;
  }

  revealSectionHeaderStandalone(".sebo-home", {
    eyebrow: ".sebo-home__eyebrow",
    title: ".sebo-home__title",
    eyebrowOpacity: 1,
  });
}
