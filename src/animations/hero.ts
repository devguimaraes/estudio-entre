import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateHero(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    gsap.set(
      [
        ".hero__keyhole",
        ".hero__container",
        ".hero__decor",
        ".hero__watermark",
        ".hero__eyebrow",
        ".hero__logo",
        ".hero__tagline",
        ".hero__ctas",
        ".hero__scroll",
        ".hero__image",
        ".hero__floating-key",
      ],
      { opacity: 1, visibility: "visible", y: 0, x: 0, scale: 1 },
    );
    gsap.set(".hero__keyhole", { opacity: 0 });
    return;
  }

  // --- Initial states ---
  gsap.set(".hero__keyhole", { scale: 0.8, opacity: 1 });
  gsap.set(".hero__logo", { opacity: 0, y: 20, scale: 0.95 });
  gsap.set(".hero__eyebrow", { opacity: 0, y: 15 });
  gsap.set(".hero__tagline", { opacity: 0, y: 20 });
  gsap.set(".hero__ctas", { opacity: 0, y: 25 });
  gsap.set(".hero__image", { opacity: 0, scale: 0.9 });
  gsap.set(".hero__floating-key", { opacity: 0, x: -30, rotate: -15 });
  gsap.set(".hero__decor", { opacity: 0, scale: 0.5 });
  gsap.set(".hero__watermark", { opacity: 0, scale: 0.9 });
  gsap.set(".hero__scroll", { opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: "expo.out", duration: 1.5 },
    onStart: () => {
      document.querySelector(".hero")?.classList.add("is-animating");
    },
    onComplete: () => {
      document.querySelector(".hero")?.classList.add("is-ready");
    },
  });

  // 1) The Portal Reveal (Keyhole expansion)
  tl.to(".hero__keyhole", {
    scale: 60,
    opacity: 0,
    duration: 1.5,
    ease: "expo.inOut",
  });

  // 2) Background elements (Watermark & Decor)
  tl.to(
    ".hero__watermark",
    {
      opacity: 0.03,
      scale: 1,
      duration: 1.2,
    },
    "-=1.0",
  );

  tl.to(
    ".hero__decor",
    {
      opacity: 1,
      scale: 1,
      stagger: 0.2,
      duration: 1.0,
    },
    "-=0.8",
  );

  // 3) Typography Reveal
  tl.to(
    ".hero__eyebrow",
    {
      opacity: 0.8,
      y: 0,
      duration: 0.8,
    },
    "-=0.6",
  );

  tl.to(
    ".hero__logo",
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "expo.out",
    },
    "-=0.8",
  );

  tl.to(
    ".hero__tagline",
    {
      opacity: 0.9,
      y: 0,
      duration: 1.0,
    },
    "-=1.0",
  );

  // 4) Image Frame Reveal
  tl.to(
    ".hero__image-frame",
    {
      opacity: 1,
      x: 0,
      duration: 1.5,
      ease: "expo.out",
    },
    "-=1.2",
  );

  tl.to(
    ".hero__image",
    {
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: "power2.out",
    },
    "-=1.3",
  );

  // 5) CTAs & Scroll
  tl.to(
    ".hero__ctas",
    {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 1.0,
    },
    "-=1.0",
  );

  tl.to(
    ".hero__scroll",
    {
      opacity: 1,
      duration: 0.8,
    },
    "-=0.5",
  );

  // --- Parallax & Interactions ---

  // Mouse Parallax suave para o frame de papel
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 30;
    const yPos = (clientY / window.innerHeight - 0.5) * 30;

    gsap.to(".hero__image-frame", {
      x: xPos * 0.4,
      y: yPos * 0.4,
      rotate: 1 + xPos * 0.05,
      duration: 2,
      ease: "power2.out",
    });

    gsap.to(".hero__decor", {
      x: xPos * 1.5,
      y: yPos * 1.5,
      stagger: 0.05,
      duration: 2.5,
      ease: "power2.out",
    });
  });

  // Scroll Parallax Diferencial
  const heroParallaxTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  heroParallaxTl
    .to(".hero__watermark", { y: -150, x: -50, scale: 1.2, ease: "none" }, 0)
    .to(".hero__image-col", { y: -80, ease: "none" }, 0)
    .to(".hero__text-col", { y: 50, ease: "none" }, 0)
    .to(".hero__decor", { y: -200, stagger: 0.1, ease: "none" }, 0);
}
