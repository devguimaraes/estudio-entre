import gsap from "gsap";

/**
 * Animações da seção Eixos
 * - Bloco reveal lateral (esquerda/direita) via ScrollTrigger
 * - Cards stagger com fade up
 * - Suporte a prefers-reduced-motion
 */
export function animateEixos(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const section = document.querySelector<HTMLElement>(".eixos");
  const blocoCultura = document.querySelector<HTMLElement>(
    ".eixos__bloco--cultura",
  );
  const blocoProducao = document.querySelector<HTMLElement>(
    ".eixos__bloco--producao",
  );
  const cardsCultura =
    document.querySelectorAll<HTMLElement>(
      ".eixos__bloco--cultura .eixos__card",
    );
  const cardsProducao =
    document.querySelectorAll<HTMLElement>(
      ".eixos__bloco--producao .eixos__card",
    );

  if (!section) return;

  const ease = "power2.out";

  // Reduced motion: mostrar tudo sem animação
  if (prefersReducedMotion) {
    const all = [blocoCultura, blocoProducao];
    for (const el of all) {
      if (el) gsap.set(el, { opacity: 1 });
    }
    const allCards = [...Array.from(cardsCultura), ...Array.from(cardsProducao)];
    for (const c of allCards) {
      gsap.set(c, { opacity: 1 });
    }
    return;
  }

  // 1. Bloco reveal lateral
  if (blocoCultura) {
    gsap.fromTo(
      blocoCultura,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  if (blocoProducao) {
    gsap.fromTo(
      blocoProducao,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  // 2. Cards stagger (fade up)
  if (cardsCultura.length) {
    gsap.fromTo(
      cardsCultura,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  if (cardsProducao.length) {
    gsap.fromTo(
      cardsProducao,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }
}
