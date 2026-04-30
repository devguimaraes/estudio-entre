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
  const carousel = section.querySelector<HTMLElement>(".sobre__carousel");
  const texts = section.querySelectorAll<HTMLElement>(".sobre__text");
  const signature = section.querySelector<HTMLElement>(".sobre__signature");

  if (prefersReducedMotion) {
    gsap.set([eyebrow, title, lead, carousel, signature, ...texts], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
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
  if (lead) {
    tl.fromTo(
      lead,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      "-=0.8",
    );
  }
  if (carousel) {
    tl.fromTo(
      carousel,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
      "-=0.6",
    );
  }
  if (texts.length > 0) {
    tl.fromTo(
      texts,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: "power3.out" },
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
}
