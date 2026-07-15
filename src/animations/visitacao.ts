import {
  createSectionTimeline,
  ensureGsapRegistered,
  prefersReducedMotion,
  setElementsVisible,
} from "@/animations/motion";
import gsap from "gsap";

export function animateVisitacao(): void {
  ensureGsapRegistered();
  const section = document.querySelector(".visitacao-cta");
  const eyebrow = document.querySelector(".visitacao__eyebrow");
  const title = document.querySelector(".visitacao__title");
  const infoBox = document.querySelector(".visitacao__info-box");
  const buttonReveal = document.querySelector(".visitacao__reveal:last-child");
  const decors = document.querySelectorAll(".visitacao__decor");

  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([
      ".visitacao__eyebrow",
      ".visitacao__title",
      ".visitacao__info-box",
      ".visitacao__reveal:last-child",
    ]);
    for (const d of decors) gsap.set(d, { opacity: 0.2, scale: 1, rotation: 0 });
    return;
  }

  const tl = createSectionTimeline(section, "top 70%");

  tl.to([eyebrow, title], {
    opacity: 1,
    y: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out",
  });

  tl.to(
    infoBox,
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.2)",
    },
    "-=0.6",
  );

  tl.to(
    buttonReveal,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=0.4",
  );

  decors.forEach((decor, i) => {
    gsap.fromTo(
      decor,
      { opacity: 0, scale: 0, rotation: -45 },
      {
        opacity: i === 1 ? 0.15 : 0.2,
        scale: 1,
        rotation: 0,
        duration: 2,
        delay: 0.5 + i * 0.2,
        ease: "elastic.out(1, 0.3)",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      },
    );

    gsap.to(decor, {
      y: (i + 1) * -80,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
