import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateSobre(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector<HTMLElement>(".sobre");
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set(
      [
        ".sobre__eyebrow",
        ".sobre__title-word",
        ".sobre__text",
        ".sobre__carousel-item",
        ".sobre__signature",
        ".sobre__watermark",
      ],
      { opacity: 1, y: 0, scale: 1, visibility: "visible" },
    );
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  // 1) Watermark reveal
  tl.fromTo(
    ".sobre__watermark",
    { opacity: 0, scale: 0.95 },
    { opacity: 0.03, scale: 1, duration: 2, ease: "power2.out" },
  );

  // 2) Eyebrow & Title reveal
  tl.fromTo(".sobre__eyebrow", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=1.5");

  tl.fromTo(
    ".sobre__title-word",
    { opacity: 0, y: "105%" },
    { opacity: 1, y: "0%", duration: 1.2, stagger: 0.1, ease: "expo.out" },
    "-=0.7",
  );

  // 3) Body text reveal
  tl.fromTo(
    ".sobre__text",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
    "-=0.9",
  );

  // 4) Carousel 3D Animation
  const container = document.querySelector<HTMLElement>(".sobre__carousel-container");
  const wheel = document.querySelector<HTMLElement>(".sobre__carousel-wheel");
  const carouselItems = document.querySelectorAll<HTMLElement>(".sobre__carousel-item");

  if (container && wheel && carouselItems.length > 0) {
    // Revelação inicial
    tl.fromTo(
      carouselItems,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: "back.out(1.7)" },
      "-=1.2",
    );

    // Rotação contínua
    const rotation = gsap.to(wheel, {
      rotationX: "-=360",
      duration: 25,
      repeat: -1,
      ease: "none",
      paused: false,
    });

    // Pause on Hover com suavidade
    container.addEventListener("mouseenter", () => {
      gsap.to(rotation, { timeScale: 0, duration: 0.8, ease: "power2.out" });
    });

    container.addEventListener("mouseleave", () => {
      gsap.to(rotation, { timeScale: 1, duration: 1.2, ease: "power2.in" });
    });
  }

  // 5) Signature reveal
  tl.fromTo(
    ".sobre__signature",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
    "-=0.8",
  );

  // --- Scroll Parallax for Watermark ---
  gsap.to(".sobre__watermark", {
    y: -80,
    rotate: -5,
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    },
  });
}
