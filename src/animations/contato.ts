import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateContato(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const section = document.querySelector<HTMLElement>(".contato");
  if (!section) return;

  const headerItems = section.querySelectorAll<HTMLElement>(".contato__eyebrow, .contato__title");
  const fields = section.querySelectorAll<HTMLElement>(".contato__field");
  const submit = section.querySelector<HTMLElement>(".contato__submit");

  if (prefersReducedMotion) {
    gsap.set([headerItems, fields, submit], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 76%",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    headerItems,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "expo.out" },
  )
    .fromTo(
      fields,
      { y: 18 },
      { y: 0, duration: 0.75, stagger: 0.09, ease: "power2.out" },
      "-=0.45",
    )
    .fromTo(submit, { y: 12 }, { y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25");
}
