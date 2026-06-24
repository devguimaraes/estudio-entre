import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type WipeConfig = {
  trigger: string;
  colors: [string, string, string];
};

const WIPE_CONFIGS: WipeConfig[] = [
  { trigger: ".sobre", colors: ["#ec6838", "#f0ede8", "#3d1020"] },
  { trigger: ".agenda", colors: ["#8e8100", "#dec72c", "#3d1020"] },
  { trigger: ".contato", colors: ["#1a1612", "#777bde", "#ec6838"] },
  { trigger: ".footer", colors: ["#f0ede8", "#c4a54b", "#1a1612"] },
];

function playWipe(panels: HTMLElement[], colors: WipeConfig["colors"]): void {
  gsap.killTweensOf(panels);

  for (const [index, panel] of panels.entries()) {
    panel.style.backgroundColor = colors[index];
  }

  gsap
    .timeline()
    .set(panels, { xPercent: -110 })
    .to(panels, {
      xPercent: 0,
      duration: 0.42,
      stagger: 0.055,
      ease: "power3.inOut",
    })
    .to(
      panels,
      {
        xPercent: 110,
        duration: 0.72,
        stagger: 0.06,
        ease: "expo.inOut",
      },
      "+=0.04",
    )
    .set(panels, { xPercent: -110 });
}

export function initSectionWipes(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  const panels = Array.from(document.querySelectorAll<HTMLElement>(".section-wipes__panel"));

  if (panels.length === 0) return;

  gsap.set(panels, { xPercent: -110 });

  for (const config of WIPE_CONFIGS) {
    const trigger = document.querySelector<HTMLElement>(config.trigger);
    if (!trigger) continue;

    ScrollTrigger.create({
      trigger,
      start: "top center",
      onEnter: () => playWipe(panels, config.colors),
      onEnterBack: () => playWipe(panels, config.colors),
    });
  }
}
