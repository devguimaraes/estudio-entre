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

export function animateLocacaoExposicoes(): void {
  ensureGsapRegistered();
  const section = document.querySelector(".locacao-exposicoes");

  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([
      ".locacao-exposicoes__eyebrow",
      ".locacao-exposicoes__title",
      ".locacao-exposicoes__text",
      ".locacao-exposicoes__cta",
      ".locacao-exposicoes__image",
    ]);
    return;
  }

  const tl = createSectionTimeline(section);

  revealSectionHeader(tl, {
    eyebrow: ".locacao-exposicoes__eyebrow",
    title: ".locacao-exposicoes__title",
    eyebrowOpacity: 1,
  });

  tl.fromTo(
    ".locacao-exposicoes__text",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
    "-=0.35",
  );

  tl.fromTo(
    ".locacao-exposicoes__cta",
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
    "-=0.3",
  );

  tl.fromTo(
    ".locacao-exposicoes__image",
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
    "-=0.45",
  );
}

export function animateLocacaoParcerias(): void {
  ensureGsapRegistered();
  const section = document.querySelector(".locacao-parcerias");

  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([
      ".locacao-parcerias__eyebrow",
      ".locacao-parcerias__title",
      ".locacao-parcerias__card",
    ]);
    return;
  }

  const tl = createSectionTimeline(section);

  revealSectionHeader(tl, {
    eyebrow: ".locacao-parcerias__eyebrow",
    title: ".locacao-parcerias__title",
    eyebrowOpacity: 1,
  });

  tl.fromTo(
    ".locacao-parcerias__card",
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "expo.out" },
    "-=0.2",
  );
}

export function animateLocacaoEspacos(): void {
  ensureGsapRegistered();
  const section = document.querySelector(".locacao-espacos");

  if (!section) return;

  if (prefersReducedMotion()) {
    setElementsVisible([
      ".locacao-espacos__eyebrow",
      ".locacao-espacos__title",
      ".locacao-espacos__card",
      ".locacao-espacos__pricing-title",
      ".locacao-espacos__pricing-card",
      ".locacao-espacos__table-row",
    ]);
    return;
  }

  const tl = createSectionTimeline(section);

  revealSectionHeader(tl, {
    eyebrow: ".locacao-espacos__eyebrow",
    title: ".locacao-espacos__title",
    eyebrowOpacity: 1,
  });

  tl.fromTo(
    ".locacao-espacos__card",
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "expo.out" },
    "-=0.2",
  );

  tl.fromTo(
    ".locacao-espacos__pricing-title",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
    "-=0.15",
  );

  tl.fromTo(
    ".locacao-espacos__pricing-card, .locacao-espacos__table-row",
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "expo.out" },
    "-=0.25",
  );
}
