import gsap from "gsap";

/**
 * Animações de entrada da seção Hero
 * Timing cinematográfico (1.5-2s por elemento)
 */
export function animateHero(): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const logoMark = document.querySelector<HTMLElement>(".hero__logo-mark");
  const eyebrow = document.querySelector<HTMLElement>(".hero__eyebrow");
  const logo = document.querySelector<HTMLElement>(".hero__logo");
  const words = document.querySelectorAll<HTMLElement>(".hero__word");
  const ctas = document.querySelector<HTMLElement>(".hero__ctas");
  const scrollIndicator = document.querySelector<HTMLElement>(
    ".hero__scroll-indicator",
  );
  const key = document.querySelector<HTMLElement>(".hero__key");

  if (!logoMark || !logo || !ctas) return;

  // Reduced motion: mostrar tudo sem animação
  if (prefersReducedMotion) {
    const all = [logoMark, eyebrow, logo, ctas, scrollIndicator];
    for (const el of all) {
      if (el) gsap.set(el, { opacity: 1 });
    }
    for (const w of words) {
      gsap.set(w, { opacity: 1 });
    }
    return;
  }

  const ease = "power2.out";

  // 1. Logo mark (ícone chave)
  gsap.from(logoMark, {
    opacity: 0,
    duration: 1.2,
    ease,
    delay: 0.3,
  });

  // 2. Eyebrow
  if (eyebrow) {
    gsap.from(eyebrow, {
      opacity: 0,
      y: 30,
      duration: 1.5,
      ease,
      delay: 0.6,
    });
  }

  // 3. Logo principal
  gsap.from(logo, {
    opacity: 0,
    y: 30,
    duration: 1.8,
    ease,
    delay: 0.9,
  });

  // 4. Tagline (palavra por palavra)
  gsap.from(words, {
    opacity: 0,
    y: 20,
    duration: 0.9,
    stagger: 0.3,
    ease,
    delay: 1.6,
  });

  // 5. CTAs
  gsap.from(ctas, {
    opacity: 0,
    y: 30,
    duration: 1.8,
    ease,
    delay: 3.1,
  });

  // 6. Scroll indicator
  if (scrollIndicator) {
    gsap.from(scrollIndicator, {
      opacity: 0,
      y: 20,
      duration: 1.5,
      ease,
      delay: 3.5,
    });
  }

  // 7. Parallax da chave (desktop apenas)
  if (key && window.innerWidth > 1024) {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          key.style.transform = `translateX(-15%) translateY(${scrolled * 0.12}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}
