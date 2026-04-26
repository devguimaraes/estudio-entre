import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateFooter(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const section = document.querySelector<HTMLElement>(".footer");
  if (!section) return;

  const socialLinks = section.querySelectorAll<HTMLElement>(".footer__social-link");
  const meta = section.querySelector<HTMLElement>(".footer__meta");
  const signature = section.querySelector<HTMLElement>(".footer__signature h2");
  const credit = section.querySelector<HTMLElement>(".footer__credit");

  if (prefersReducedMotion) {
    gsap.set([socialLinks, meta, credit], {
      opacity: 1,
      y: 0,
    });
    gsap.set(signature, { opacity: 0.08, scale: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    socialLinks,
    { opacity: 0, y: 18 },
    {
      opacity: 0.4,
      y: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: "power2.out",
      onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
    },
  )
    .fromTo(
      meta,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
      "-=0.35",
    )
    .fromTo(
      signature,
      { opacity: 0, scale: 0.96, y: 36 },
      { opacity: 0.08, scale: 1, y: 0, duration: 1.1, ease: "expo.out" },
      "-=0.25",
    )
    .fromTo(
      credit,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
      "-=0.45",
    );
}
