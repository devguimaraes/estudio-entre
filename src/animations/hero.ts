import gsap from "gsap";
import { onPreloaderComplete } from "@/animations/preloader";

export function animateHero(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const revealTargets =
    ".hero__symbol, .hero__logo, .hero__reveal-word, .hero__ctas, .hero__scroll";

  if (prefersReducedMotion) {
    gsap.set(revealTargets, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    });
    return;
  }

  gsap.set(".hero__ctas", { y: 24 });
  gsap.set(".hero__scroll", { y: 12 });

  const runHeroTimeline = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.35 },
    });

    tl.to(".hero__symbol", {
      opacity: 0.12,
      scale: 1.14,
      duration: 2.4,
      ease: "expo.out",
    })
      .to(
        ".hero__logo",
        {
          opacity: 1,
          y: 0,
          duration: 1.45,
        },
        "-=2.05",
      )
      .to(
        ".hero__reveal-word",
        {
          y: 0,
          stagger: 0.13,
          duration: 1.45,
        },
        "-=1.2",
      )
      .to(
        ".hero__ctas",
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.75",
      )
      .to(
        ".hero__scroll",
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
        },
        "-=0.55",
      )
      .to(
        ".hero__scroll-line",
        {
          x: 0,
          duration: 1.25,
          ease: "expo.inOut",
        },
        "-=0.8",
      );
  };

  onPreloaderComplete(runHeroTimeline);

  if (!canHover) return;

  const symbol = document.querySelector<HTMLElement>(".hero__symbol");
  if (!symbol) return;

  const onMouseMove = (event: MouseEvent) => {
    const xPos = (event.clientX / window.innerWidth - 0.5) * 22;
    const yPos = (event.clientY / window.innerHeight - 0.5) * 22;

    gsap.to(symbol, {
      x: xPos,
      y: yPos,
      duration: 1.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  window.addEventListener("mousemove", onMouseMove, { passive: true });
}
