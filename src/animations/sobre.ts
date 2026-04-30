import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateSobre(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".sobre");
  if (!section) return;

  const eyebrow = section.querySelector<HTMLElement>(".sobre__eyebrow");
  const title = section.querySelector<HTMLElement>(".sobre__title");
  const lead = section.querySelector<HTMLElement>(".sobre__lead");
  const texts = section.querySelectorAll<HTMLElement>(".sobre__text");
  const imageMain = section.querySelector<HTMLElement>(".sobre__image-main");
  const imageSecondary = section.querySelector<HTMLElement>(".sobre__image-secondary");
  const signature = section.querySelector<HTMLElement>(".sobre__signature");
  const watermark = section.querySelector<HTMLElement>(".sobre__watermark");

  if (prefersReducedMotion) {
    gsap.set([eyebrow, title, lead, imageMain, imageSecondary, signature, ...texts], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: "inset(0% 0 0 0)",
    });
    if (watermark) gsap.set(watermark, { opacity: 0.02 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reverse" },
  });

  if (eyebrow) {
    tl.fromTo(
      eyebrow,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
  }
  if (title) {
    tl.fromTo(
      title,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 1.2, ease: "expo.out" },
      "-=0.5",
    );
  }
  if (imageMain) {
    tl.fromTo(
      imageMain,
      { opacity: 0, x: 40, clipPath: "inset(0 0 100% 0)" },
      { opacity: 1, x: 0, clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.inOut" },
      "-=1.0",
    );
  }
  if (lead) {
    tl.fromTo(
      lead,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      "-=0.8",
    );
  }
  if (texts.length > 0) {
    tl.fromTo(
      texts,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: "power3.out" },
      "-=0.6",
    );
  }
  if (imageSecondary) {
    tl.fromTo(
      imageSecondary,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" },
      "-=0.5",
    );
  }
  if (signature) {
    tl.fromTo(
      signature,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
      "-=0.4",
    );
  }

  if (watermark) {
    gsap.fromTo(
      watermark,
      { scale: 0.92, opacity: 0 },
      {
        scale: 1.05,
        opacity: 0.02,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }
}
