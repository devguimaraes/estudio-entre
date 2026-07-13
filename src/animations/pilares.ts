import {
  createSectionTimeline,
  ensureGsapRegistered,
  prefersReducedMotion,
  revealSectionHeader,
  setElementsVisible,
} from "@/animations/motion";
import gsap from "gsap";

export function animatePilares(): void {
  ensureGsapRegistered();
  const section = document.querySelector<HTMLElement>(".pilares");
  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([".pilares__eyebrow", ".pilares__title", ".pilares__lead", ".pilar__cell"], {
      opacity: 1,
      y: 0,
      scale: 1,
      visibility: "visible",
    });
    return;
  }

  const tlHeader = createSectionTimeline(section, "top 80%");

  revealSectionHeader(tlHeader, {
    eyebrow: ".pilares__eyebrow",
    title: ".pilares__title",
    eyebrowOpacity: 0.4,
    eyebrowDuration: 0.8,
    titleY: 30,
    titleDuration: 1,
    overlap: "-=0.5",
  });

  tlHeader.fromTo(
    ".pilares__lead",
    { opacity: 0, x: 20 },
    { opacity: 0.6, x: 0, duration: 0.8 },
    "-=0.7",
  );

  gsap.fromTo(
    ".pilar__cell",
    {
      opacity: 0,
      y: 40,
      scale: 0.98,
      rotateX: -10,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration: 1.2,
      stagger: {
        amount: 0.6,
        grid: [2, 3],
        from: "start",
      },
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".pilares",
        start: "top 65%",
        toggleActions: "play none none reverse",
      },
    },
  );

  const cells = section.querySelectorAll(".pilar__cell");
  for (const cell of cells) {
    const icon = cell.querySelector(".pilar__icon-wrap");
    if (icon) {
      gsap.to(icon, {
        y: -20,
        scrollTrigger: {
          trigger: cell,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }
  }
}
