import {
  createSectionTimeline,
  ensureGsapRegistered,
  prefersReducedMotion,
  revealSectionHeader,
  setElementsVisible,
} from "@/animations/motion";

export function animateLocacaoHero(): void {
  ensureGsapRegistered();
  const section = document.querySelector(".locacao-hero");

  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([
      ".locacao-hero__eyebrow",
      ".locacao-hero__title",
      ".locacao-hero__subtitle",
      ".locacao-hero__ctas",
    ]);
    return;
  }

  const tl = createSectionTimeline(section, "top 85%");

  revealSectionHeader(tl, {
    eyebrow: ".locacao-hero__eyebrow",
    title: ".locacao-hero__title",
    eyebrowOpacity: 0.5,
    titleY: 32,
  });

  tl.fromTo(
    ".locacao-hero__subtitle",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
    "-=0.35",
  );

  tl.fromTo(
    ".locacao-hero__ctas",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
    "-=0.4",
  );
}

export function animateLocacaoSobre(): void {
  ensureGsapRegistered();
  const section = document.querySelector(".locacao-sobre");

  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([
      ".locacao-sobre__eyebrow",
      ".locacao-sobre__title",
      ".locacao-sobre__text",
      ".locacao-sobre__stat",
    ]);
    return;
  }

  const tl = createSectionTimeline(section);

  revealSectionHeader(tl, {
    eyebrow: ".locacao-sobre__eyebrow",
    title: ".locacao-sobre__title",
    eyebrowOpacity: 1,
  });

  tl.fromTo(
    ".locacao-sobre__text",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
    "-=0.35",
  );

  tl.fromTo(
    ".locacao-sobre__stat",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "expo.out" },
    "-=0.25",
  );
}

export function animateLocacaoContato(): void {
  ensureGsapRegistered();
  const section = document.querySelector(".locacao-contato");

  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([
      ".locacao-contato__eyebrow",
      ".locacao-contato__title",
      ".locacao-contato__details",
      ".locacao-contato__ctas",
      ".locacao-contato__image",
    ]);
    return;
  }

  const tl = createSectionTimeline(section);

  revealSectionHeader(tl, {
    eyebrow: ".locacao-contato__eyebrow",
    title: ".locacao-contato__title",
    eyebrowOpacity: 1,
  });

  tl.fromTo(
    ".locacao-contato__details",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
    "-=0.35",
  );

  tl.fromTo(
    ".locacao-contato__ctas",
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
    "-=0.3",
  );

  tl.fromTo(
    ".locacao-contato__image",
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
    "-=0.45",
  );
}
