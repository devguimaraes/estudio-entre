import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateSobre(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  const section = document.querySelector<HTMLElement>(".sobre");
  if (!section) return;

  if (prefersReducedMotion || !isDesktop) {
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

  // 4) Carousel 3D Animation (Cinematic Drum Effect)
  const container = document.querySelector<HTMLElement>(".sobre__carousel-container");
  const wheel = document.querySelector<HTMLElement>(".sobre__carousel-wheel");
  const carouselItems = document.querySelectorAll<HTMLElement>(".sobre__carousel-item");

  if (container && wheel && carouselItems.length > 0) {
    const radius = 500; // Raio maior para evitar clipping e dar elegância
    const angleStep = 360 / carouselItems.length;

    // Configuração inicial dos itens no espaço 3D
    gsap.set(carouselItems, {
      transformOrigin: `50% 50% -${radius}px`,
      rotationX: (i) => i * angleStep,
      z: radius,
      opacity: 0,
    });

    // Revelação inicial
    tl.to(
      carouselItems,
      {
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
      },
      "-=1.2",
    );

    // Rotação principal com lógica de profundidade dinâmica
    const rotation = gsap.to(wheel, {
      rotationX: "-=360",
      duration: 30,
      repeat: -1,
      ease: "none",
      paused: false,
      onUpdate: function () {
        // Lógica para cada item: quanto mais longe do centro (Z), menor a opacidade e maior o blur
        const wheelRotation = gsap.getProperty(wheel, "rotationX") as number;

        carouselItems.forEach((item, i) => {
          const itemRotation = (i * angleStep + wheelRotation) % 360;
          // Normalizar ângulo para -180 a 180
          const normalizedAngle = ((itemRotation + 180) % 360) - 180;
          
          // Fator de proximidade (1 no topo/frente, 0 no fundo)
          const factor = Math.cos(normalizedAngle * (Math.PI / 180));
          const distanceFactor = (factor + 1) / 2; // 0 a 1

          gsap.set(item, {
            opacity: 0.1 + distanceFactor * 0.9,
            scale: 0.8 + distanceFactor * 0.2,
            filter: `blur(${(1 - distanceFactor) * 4}px)`,
            zIndex: Math.round(distanceFactor * 100),
          });
        });
      },
    });

    // Pause on Hover com desaceleração (Inertia feeling)
    container.addEventListener("mouseenter", () => {
      gsap.to(rotation, { timeScale: 0.05, duration: 1.5, ease: "power2.out" });
    });

    container.addEventListener("mouseleave", () => {
      gsap.to(rotation, { timeScale: 1, duration: 2, ease: "power2.inOut" });
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
