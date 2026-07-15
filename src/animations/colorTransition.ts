import { ensureGsapRegistered, prefersReducedMotion } from "@/animations/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initColorTransitions(): void {
  ensureGsapRegistered();
  if (prefersReducedMotion()) return;

  const nav = document.querySelector(".navbar");

  const sections = document.querySelectorAll<HTMLElement>("[data-bg-color]");

  if (sections.length === 0) {
    const pageBg = document.body.dataset.pageBg;
    if (pageBg) {
      gsap.set("body", { backgroundColor: pageBg });
    }
    return;
  }

  for (const section of sections) {
    const bgColor = section.dataset.bgColor!;
    const navTheme = section.dataset.navTheme!;

    const updateTheme = () => {
      gsap.to("body", {
        backgroundColor: bgColor,
        duration: 1.2,
        ease: "power2.inOut",
      });
      if (nav) {
        if (navTheme === "dark") {
          nav.classList.remove("navbar--light");
          nav.classList.add("navbar--dark");
        } else {
          nav.classList.remove("navbar--dark");
          nav.classList.add("navbar--light");
        }
      }
    };

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: updateTheme,
      onEnterBack: updateTheme,
    });
  }
}
