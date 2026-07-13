import {
  createSectionTimeline,
  ensureGsapRegistered,
  prefersReducedMotion,
  setElementsVisible,
} from "@/animations/motion";
import gsap from "gsap";

export function animateFooter(): void {
  ensureGsapRegistered();
  const section = document.querySelector<HTMLElement>(".footer");
  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([".footer__col", ".footer__watermark"]);
    return;
  }

  const tl = createSectionTimeline(section, "top 85%");

  tl.fromTo(
    ".footer__watermark",
    { opacity: 0, scale: 0.9, y: 50 },
    { opacity: 0.04, scale: 1, y: 0, duration: 2, ease: "expo.out" },
  );

  tl.fromTo(
    ".footer__col",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
    },
    "-=1.5",
  );

  gsap.to(".footer__watermark", {
    y: -50,
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    },
  });
}
