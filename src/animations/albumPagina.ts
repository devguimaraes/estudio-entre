import {
  ensureGsapRegistered,
  prefersReducedMotion,
  revealSectionHeaderStandalone,
  setElementsVisible,
} from "@/animations/motion";

export function animateAlbumPagina(): void {
  ensureGsapRegistered();

  if (prefersReducedMotion()) {
    setElementsVisible([".galeria-pagina__eyebrow", ".galeria-pagina__title"]);
    return;
  }

  revealSectionHeaderStandalone(".galeria-pagina", {
    eyebrow: ".galeria-pagina__eyebrow",
    title: ".galeria-pagina__title",
    eyebrowOpacity: 0.5,
  });
}
