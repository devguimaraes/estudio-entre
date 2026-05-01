import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateSobre(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".sobre");
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set(
      [
        ".sobre__eyebrow",
        ".sobre__title-word",
        ".sobre__text",
        ".sobre__blob-1",
        ".sobre__blob-2",
        ".sobre__signature",
        ".sobre__watermark",
      ],
      { opacity: 1, y: 0, scale: 1, visibility: "visible" },
    );
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  // 1) Watermark reveal
  tl.fromTo(
    ".sobre__watermark",
    { opacity: 0, scale: 0.95 },
    { opacity: 0.03, scale: 1, duration: 2, ease: "power2.out" },
  );

  // 2) Eyebrow & Title reveal
  tl.fromTo(".sobre__eyebrow", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=1.5");

  tl.fromTo(
    ".sobre__title-word",
    { opacity: 0, y: "105%" },
    { opacity: 1, y: "0%", duration: 1.2, stagger: 0.1, ease: "expo.out" },
    "-=0.7",
  );

  // 3) Body text reveal
  tl.fromTo(
    ".sobre__text",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
    "-=0.9",
  );

  // 4) Images reveal - Opacity & Scale only to preserve clipPath
  tl.fromTo(
    ".sobre__blob-1",
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out" },
    "-=1.2",
  );

  tl.fromTo(
    ".sobre__blob-2",
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 1.4, ease: "expo.out" },
    "-=1.0",
  );

  // 5) Signature reveal
  tl.fromTo(
    ".sobre__signature",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
    "-=0.8",
  );

  // --- Scroll Parallax for Watermark ---
  gsap.to(".sobre__watermark", {
    y: -80,
    rotate: -5,
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    },
  });

  // Parallax for images
  gsap.to(".sobre__image-sub", {
    y: -40,
    scrollTrigger: {
      trigger: section,
      start: "top center",
      end: "bottom top",
      scrub: 2,
    },
  });
}
