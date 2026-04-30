import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateContato(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const graphic = document.querySelector(".contato__graphic");
  const eyebrow = document.querySelector(".contato__eyebrow");
  const title = document.querySelector(".contato__title");
  const fields = document.querySelectorAll(".contato__field");
  const submit = document.querySelector(".contato__submit");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".contato",
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  if (graphic) {
    tl.fromTo(
      graphic,
      { opacity: 0, x: -40, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: "expo.out" },
    );
  }
  if (eyebrow) {
    tl.fromTo(
      eyebrow,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.8",
    );
  }
  if (title) {
    tl.fromTo(
      title,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: "expo.out" },
      "-=0.5",
    );
  }
  if (fields.length > 0) {
    tl.fromTo(
      fields,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" },
      "-=0.5",
    );
  }
  if (submit) {
    tl.fromTo(
      submit,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.3",
    );
  }
}
