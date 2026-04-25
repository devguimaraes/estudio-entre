import gsap from "gsap";

export const PRELOADER_COMPLETE_EVENT = "estudio:preloader-complete";

declare global {
  interface Window {
    __estudioPreloaderDone?: boolean;
    __estudioPreloaderHardFallback?: number;
    __estudioPreloaderPromise?: Promise<void>;
  }
}

function completePreloader(): void {
  if (window.__estudioPreloaderDone) return;

  window.__estudioPreloaderDone = true;
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-loaded");
  document.dispatchEvent(new CustomEvent(PRELOADER_COMPLETE_EVENT));
}

export function onPreloaderComplete(callback: () => void): void {
  if (window.__estudioPreloaderDone || document.body.classList.contains("is-loaded")) {
    requestAnimationFrame(callback);
    return;
  }

  document.addEventListener(PRELOADER_COMPLETE_EVENT, callback, { once: true });
}

export function initPreloader(): Promise<void> {
  if (window.__estudioPreloaderPromise) return window.__estudioPreloaderPromise;

  const preloaderAlreadyFinished =
    window.__estudioPreloaderDone ||
    document.body.classList.contains("preloader-failed") ||
    document.body.classList.contains("is-loaded");

  if (preloaderAlreadyFinished) {
    window.__estudioPreloaderPromise = new Promise((resolve) => {
      const preloader = document.querySelector<HTMLElement>("#site-preloader");

      if (window.__estudioPreloaderHardFallback) {
        window.clearTimeout(window.__estudioPreloaderHardFallback);
        window.__estudioPreloaderHardFallback = undefined;
      }

      document.body.classList.remove("is-loading");
      document.body.classList.add("is-loaded");
      if (preloader) gsap.set(preloader, { autoAlpha: 0, display: "none" });
      completePreloader();
      resolve();
    });

    return window.__estudioPreloaderPromise;
  }

  window.__estudioPreloaderPromise = new Promise((resolve) => {
    const preloader = document.querySelector<HTMLElement>("#site-preloader");
    const markWrap = document.querySelector<HTMLElement>(".preloader__mark-wrap");
    const mark = document.querySelector<HTMLElement>(".preloader__mark");
    const progress = document.querySelector<HTMLElement>(".preloader__progress-fill");
    const meta = document.querySelectorAll<HTMLElement>(".preloader__meta span");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.body.classList.add("is-loading");

    let isFinished = false;
    const failsafeTimeout = window.setTimeout(() => finish(), 4500);

    const finish = () => {
      if (isFinished) return;

      isFinished = true;
      if (window.__estudioPreloaderHardFallback) {
        window.clearTimeout(window.__estudioPreloaderHardFallback);
        window.__estudioPreloaderHardFallback = undefined;
      }
      window.clearTimeout(failsafeTimeout);
      if (preloader) gsap.set(preloader, { autoAlpha: 0, display: "none" });
      completePreloader();
      resolve();
    };

    if (!preloader || prefersReducedMotion) {
      if (preloader) gsap.set(preloader, { autoAlpha: 0, display: "none" });
      finish();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: finish,
    });

    tl.set(preloader, { autoAlpha: 1 })
      .fromTo(
        markWrap,
        { autoAlpha: 0, scale: 0.72, rotate: -8 },
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.1 },
      )
      .fromTo(
        mark,
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.9 },
        "-=0.75",
      )
      .fromTo(
        meta,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.75 },
        "-=0.55",
      )
      .to(progress, { scaleX: 1, duration: 1.25, ease: "power3.inOut" }, "-=0.85")
      .to(markWrap, { scale: 1.18, duration: 0.5, ease: "power2.inOut" })
      .to(
        preloader,
        { clipPath: "inset(0 0 100% 0)", duration: 0.95, ease: "expo.inOut" },
        "-=0.05",
      )
      .set(preloader, { display: "none" });
  });

  return window.__estudioPreloaderPromise;
}
