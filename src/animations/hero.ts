import { onPreloaderComplete } from "@/animations/preloader";
import gsap from "gsap";

export function animateHero(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      defaults: { ease: "power4.out", duration: 1.5 },
    });

    tl.set(".hero__symbol", { opacity: 1, scale: 0.8 });
    tl.set(".hero__logo, .hero__tagline, .hero__ctas, .hero__scroll", { opacity: 0 });

    tl.to(".hero__symbol", {
      scale: 25,
      opacity: 0,
      duration: 1.8,
      ease: "expo.inOut",
    })
      .fromTo(
        ".hero__logo",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2 },
        "-=1.2",
      )
      .to(".hero__tagline", { opacity: 1, duration: 0.01 }, "-=1.05")
      .fromTo(
        ".hero__reveal-word",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 1.2 },
        "-=0.8",
      )
      .to(".hero__ctas", { opacity: 1, y: 0, duration: 1 }, "-=0.6")
      .to(".hero__scroll", { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");
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
