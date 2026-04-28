import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Editorial Color Transition System
 * Morpha o background do body conforme o scroll atinge cada seção.
 */
export function initColorTransitions(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const sections = [
    { trigger: ".hero", color: "#ec6838", theme: "light" },
    { trigger: ".sobre", color: "#f0ede8", theme: "dark" },
    { trigger: ".servicos", color: "#f0ede8", theme: "dark" },
    { trigger: ".agenda", color: "#8e8100", theme: "light" },
    { trigger: ".espaco", color: "#3d1020", theme: "light" },
    { trigger: ".contato", color: "#1a1612", theme: "light" },
    { trigger: ".footer", color: "#f0ede8", theme: "dark" },
  ];

  const nav = document.querySelector(".navbar");

  for (const { trigger, color, theme } of sections) {
    const el = document.querySelector(trigger);
    if (!el) continue;

    const updateTheme = () => {
      gsap.to("body", { backgroundColor: color, duration: 1.2, ease: "power2.inOut" });
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
