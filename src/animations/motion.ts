import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let gsapRegistered = false;

export const EDITORIAL_EASE = "expo.out";
export const SECTION_ENTRY_START = "top 75%";

export function ensureGsapRegistered(): void {
  if (gsapRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  gsapRegistered = true;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setElementsVisible(
  selectors: string[],
  props: gsap.TweenVars = { opacity: 1, y: 0 },
): void {
  ensureGsapRegistered();
  gsap.set(selectors, props);
}

export function createSectionTimeline(
  trigger: Element | string,
  start = SECTION_ENTRY_START,
): gsap.core.Timeline {
  ensureGsapRegistered();
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      toggleActions: "play none none reverse",
    },
  });
}

export interface RevealSectionHeaderOptions {
  eyebrow: string;
  title: string | string[];
  eyebrowOpacity?: number;
  eyebrowDuration?: number;
  titleY?: number;
  titleDuration?: number;
  titleStagger?: number;
  overlap?: string;
}

export function revealSectionHeader(
  timeline: gsap.core.Timeline,
  {
    eyebrow,
    title,
    eyebrowOpacity = 0.5,
    eyebrowDuration = 0.6,
    titleY = 40,
    titleDuration = 0.8,
    titleStagger,
    overlap = "-=0.4",
  }: RevealSectionHeaderOptions,
): void {
  timeline.fromTo(
    eyebrow,
    { opacity: 0, y: 15 },
    { opacity: eyebrowOpacity, y: 0, duration: eyebrowDuration },
  );

  timeline.fromTo(
    title,
    { opacity: 0, y: titleY },
    {
      opacity: 1,
      y: 0,
      duration: titleDuration,
      stagger: titleStagger,
      ease: EDITORIAL_EASE,
    },
    overlap,
  );
}

export function revealSectionHeaderStandalone(
  trigger: Element | string,
  options: RevealSectionHeaderOptions,
  start = SECTION_ENTRY_START,
): void {
  const timeline = createSectionTimeline(trigger, start);
  revealSectionHeader(timeline, options);
}

export function getSectionBgColor(selector: string, fallback: string): string {
  const section = document.querySelector<HTMLElement>(selector);
  return section?.dataset.bgColor ?? fallback;
}

export function buildWipeColors(
  prevSelector: string,
  currentSelector: string,
  nextSelector: string,
  fallbacks: [string, string, string],
): [string, string, string] {
  return [
    getSectionBgColor(prevSelector, fallbacks[0]),
    getSectionBgColor(currentSelector, fallbacks[1]),
    getSectionBgColor(nextSelector, fallbacks[2]),
  ];
}
