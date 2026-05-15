import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initColorTransitions(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const sections = [
    { trigger: ".hero", color: "#3D1020", theme: "light" }, // Bordô
    { trigger: ".sobre", color: "#f0ede8", theme: "dark" }, // Creme
    { trigger: ".pilares", color: "#1a1612", theme: "light" }, // Near Black
    { trigger: ".agenda", color: "#1d432c", theme: "light" }, // Verde Floresta
    { trigger: ".galeria", color: "#b9e4eb", theme: "dark" }, // Ciano
    { trigger: ".voo-literario", color: "#1d432c", theme: "light" }, // Verde Floresta
    { trigger: ".contato", color: "#777bde", theme: "dark" }, // Lilás
    { trigger: ".footer", color: "#1a1612", theme: "light" }, // Near Black
  ];

  const nav = document.querySelector(".navbar");

  for (const { trigger, color, theme } of sections) {
    const el = document.querySelector(trigger);
    if (!el) continue;

    const updateTheme = () => {
      gsap.to("body", {
        backgroundColor: color,
        duration: 1.2,
        ease: "power2.inOut",
      });
      if (nav) {
        if (theme === "dark") {
          nav.classList.remove("navbar--light");
          nav.classList.add("navbar--dark");
        } else {
          nav.classList.remove("navbar--dark");
          nav.classList.add("navbar--light");
        }
      }
    };

    ScrollTrigger.create({
      trigger: el,
      start: "top center",
      end: "bottom center",
      onEnter: updateTheme,
      onEnterBack: updateTheme,
    });
  }
}
