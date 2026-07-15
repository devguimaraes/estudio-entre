import { buildWipeColors, ensureGsapRegistered, prefersReducedMotion } from "@/animations/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type WipeConfig = {
  trigger: string;
  prev: string;
  next: string;
  fallbacks: [string, string, string];
};

const WIPE_CONFIGS: WipeConfig[] = [
  {
    trigger: ".sobre",
    prev: ".hero",
    next: ".pilares",
    fallbacks: ["#EC6838", "#f0ede8", "#1A1612"],
  },
  {
    trigger: ".agenda",
    prev: ".espaco",
    next: ".sebo-home",
    fallbacks: ["#b9e4eb", "#1d432c", "#b9e4eb"],
  },
  {
    trigger: ".contato",
    prev: ".visitacao-cta",
    next: ".footer",
    fallbacks: ["#3D1020", "#f0ede8", "#1A1612"],
  },
  {
    trigger: ".footer",
    prev: ".contato",
    next: ".footer",
    fallbacks: ["#f0ede8", "#1A1612", "#1A1612"],
  },
];

function playWipe(panels: HTMLElement[], colors: [string, string, string]): void {
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
  ensureGsapRegistered();
  if (prefersReducedMotion()) return;

  const panels = Array.from(document.querySelectorAll<HTMLElement>(".section-wipes__panel"));

  if (panels.length === 0) return;

  gsap.set(panels, { xPercent: -110 });

  for (const config of WIPE_CONFIGS) {
    const trigger = document.querySelector<HTMLElement>(config.trigger);
    if (!trigger) continue;

    const colors = buildWipeColors(config.prev, config.trigger, config.next, config.fallbacks);

    ScrollTrigger.create({
      trigger,
      start: "top center",
      onEnter: () => playWipe(panels, colors),
      onEnterBack: () => playWipe(panels, colors),
    });
  }
}
