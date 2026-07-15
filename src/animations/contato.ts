import {
  createSectionTimeline,
  ensureGsapRegistered,
  prefersReducedMotion,
  revealSectionHeader,
  setElementsVisible,
} from "@/animations/motion";

export function animateContato(): void {
  ensureGsapRegistered();
  const section = document.querySelector<HTMLElement>(".contato");
  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible(
      [".contato__eyebrow", ".contato__title", ".contato__info", ".contato__map"],
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        visibility: "visible",
      },
    );
    return;
  }

  const tl = createSectionTimeline(section, "top 72%");

  revealSectionHeader(tl, {
    eyebrow: ".contato__eyebrow",
    title: ".contato__title",
    eyebrowOpacity: 0.4,
    eyebrowDuration: 0.8,
    titleY: 30,
    titleDuration: 1.2,
    overlap: "-=0.6",
  });

  tl.fromTo(
    ".contato__info",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
    "-=0.8",
  );

  tl.fromTo(
    ".contato__map",
    { opacity: 0, y: 30, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" },
    "-=0.6",
  );

  tl.eventCallback("onComplete", () => {
    section.classList.add("is-ready");
  });
}
