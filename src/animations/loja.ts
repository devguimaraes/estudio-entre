import {
  ensureGsapRegistered,
  prefersReducedMotion,
  revealSectionHeaderStandalone,
  setElementsVisible,
} from "@/animations/motion";
import gsap from "gsap";

export function animateLojaHome(): void {
  ensureGsapRegistered();

  if (prefersReducedMotion()) {
    setElementsVisible([".loja-home__eyebrow", ".loja-home__title"]);
    return;
  }

  revealSectionHeaderStandalone(".loja-home", {
    eyebrow: ".loja-home__eyebrow",
    title: ".loja-home__title",
    eyebrowOpacity: 1,
  });
}

export function animateFreteInfo(): void {
  ensureGsapRegistered();

  if (prefersReducedMotion()) {
    setElementsVisible([".frete-info__banner", ".frete-info__card"], {
      opacity: 1,
      y: 0,
      scale: 1,
    });
    return;
  }

  const banner = document.querySelector(".frete-info__banner");
  const cards = gsap.utils.toArray<HTMLElement>(".frete-info__card");

  if (banner) {
    gsap.fromTo(
      banner,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".frete-info",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".frete-info",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }
}
