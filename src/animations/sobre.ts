import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateSobre(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".sobre");

  if (!section) return;

  const title = section.querySelector<HTMLElement>(".sobre__title");
  const texts = section.querySelectorAll<HTMLElement>(".sobre__text");
  const image = section.querySelector<HTMLElement>(".sobre__image-reveal");
  const watermark = section.querySelector<HTMLElement>(".sobre__watermark");
  const signature = section.querySelector<HTMLElement>(".sobre__signature");
  const contentTargets = [title, image, signature, ...texts].filter(Boolean);

  if (prefersReducedMotion) {
    gsap.set(contentTargets, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: "inset(0% 0 0 0)",
    });
    if (watermark) {
      gsap.set(watermark, { opacity: 0.025, scale: 1, x: 0, y: 0 });
    }
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  if (title) {
    tl.fromTo(
      title,
      { opacity: 0, x: -34 },
      { opacity: 1, x: 0, duration: 1.25, ease: "expo.out" },
    );
  }

  if (texts.length > 0) {
    tl.fromTo(
      texts,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.16, ease: "power3.out" },
      "-=0.75",
    );
  }

  if (image) {
    tl.fromTo(
      image,
      { clipPath: "inset(100% 0 0 0)", y: 36 },
      {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: 1.45,
        ease: "expo.inOut",
      },
      "-=1",
    );
  }

  if (signature) {
    tl.fromTo(
      signature,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.95, ease: "power2.out" },
      "-=0.55",
    );
  }

  if (watermark) {
    gsap.fromTo(
      watermark,
      { scale: 0.92, opacity: 0 },
      {
        scale: 1.05,
        opacity: 0.025,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }
}
