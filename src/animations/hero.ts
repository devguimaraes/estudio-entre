import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateHero(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const hero = document.querySelector(".hero");
  if (!hero) return;

  if (prefersReducedMotion) {
    gsap.set(
      [
        ".hero__dot-grid",
        ".hero__corner-info",
        ".hero__logo-wrapper",
        ".hero__badge",
        ".hero__spark",
        ".hero__divider",
        ".hero__tagline",
        ".hero__ctas",
        ".hero__scroll",
        ".hero__watermark",
      ],
      { opacity: 1, visibility: "visible", y: 0, x: 0, scale: 1 },
    );
    hero.classList.add("is-ready");
    return;
  }

  // --- Initial states ---
  gsap.set(".hero__corner-info", { opacity: 0, y: 15 });
  gsap.set(".hero__logo-wrapper", { opacity: 0, scale: 0.95, rotate: -3 });
  gsap.set(".hero__badge", { opacity: 0, y: -10 });
  gsap.set(".hero__spark", { opacity: 0, scale: 0.5, rotate: 15 });
  gsap.set(".hero__divider", { opacity: 0, width: 0 });
  gsap.set(".hero__tagline", { opacity: 0, y: 20 });
  gsap.set(".hero__ctas", { opacity: 0, y: 25 });
  gsap.set(".hero__scroll", { opacity: 0 });
  gsap.set(".hero__watermark", { opacity: 0, scale: 0.9 });

  const tl = gsap.timeline({
    defaults: { ease: "expo.out", duration: 1.5 },
    onStart: () => {
      hero.classList.add("is-animating");
    },
    onComplete: () => {
      hero.classList.add("is-ready");
    },
  });

  // 1) Logo Block Reveal (The Main Sign)
  tl.to(".hero__logo-wrapper", {
    opacity: 1,
    scale: 1,
    rotate: -1,
    duration: 1.8,
    ease: "expo.out",
  });

  tl.to(
    ".hero__badge",
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    },
    "-=1.2",
  );

  tl.to(
    ".hero__spark",
    {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
    },
    "-=1.0",
  );

  // 2) Tagline & Divider
  tl.to(
    ".hero__divider",
    {
      opacity: 0.4,
      width: 64,
      duration: 1.2,
      ease: "power4.out",
    },
    "-=0.8",
  );

  tl.to(
    ".hero__tagline",
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
    },
    "-=1.0",
  );

  // 3) Corner Info Reveal (Swiss Framework)
  tl.to(
    ".hero__corner-info",
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 1.0,
      ease: "power2.out",
    },
    "-=1.2",
  );

  // 4) Background Watermark
  tl.to(
    ".hero__watermark",
    {
      opacity: 0.03,
      scale: 1,
      duration: 1.5,
    },
    "-=1.5",
  );

  // 5) CTAs & Scroll
  tl.to(
    ".hero__ctas",
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: "power2.out",
    },
    "-=0.8",
  );

  tl.to(
    ".hero__scroll",
    {
      opacity: 1,
      duration: 0.8,
    },
    "-=0.4",
  );

  // --- Parallax & Interactions ---

  // Mouse Parallax for Dot Grid and Logo Block
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 40;
    const yPos = (clientY / window.innerHeight - 0.5) * 40;

    gsap.to(".hero__dot-grid", {
      x: xPos * 0.5,
      y: yPos * 0.5,
      duration: 2,
      ease: "power2.out",
    });

    gsap.to(".hero__logo-block", {
      x: xPos * 0.2,
      y: yPos * 0.2,
      rotateX: -yPos * 0.1,
      rotateY: xPos * 0.1,
      duration: 2,
      ease: "power2.out",
    });
  });

  // Scroll Parallax
  gsap.to(".hero__watermark", {
    y: -200,
    x: -100,
    scale: 1.2,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(".hero__logo-block", {
    y: -100,
    scale: 0.95,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}
