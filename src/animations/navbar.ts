import gsap from "gsap";

/**
 * Navbar: drawer mobile animado + active link tracking
 * - Drawer abre/fecha com gsap (xPercent)
 * - Links âncora funcionam com Lenis smooth scroll
 * - Link ativo destacado via scroll position
 */

export function initNavbar(): void {
  const hamburger = document.querySelector<HTMLButtonElement>(".navbar__hamburger");
  const drawer = document.querySelector<HTMLElement>(".navbar__drawer");
  const overlay = document.querySelector<HTMLElement>(".navbar__overlay");
  const drawerLinks = document.querySelectorAll<HTMLAnchorElement>(".navbar__drawer-link");
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".navbar__link");

  if (!hamburger || !drawer || !overlay) return;

  let isOpen = false;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Set initial state for GSAP
  gsap.set(drawer, { xPercent: -100 });

  // Drawer open/close
  hamburger.addEventListener("click", () => {
    isOpen ? closeDrawer() : openDrawer();
  });

  // Close on overlay click
  overlay.addEventListener("click", () => {
    if (isOpen) closeDrawer();
  });

  function openDrawer(): void {
    isOpen = true;
    hamburger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");

    gsap.to(drawer, {
      xPercent: 0,
      duration: prefersReducedMotion ? 0 : 0.4,
      ease: "power2.out",
    });
  }

  function closeDrawer(): void {
    isOpen = false;
    hamburger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");

    gsap.to(drawer, {
      xPercent: -100,
      duration: prefersReducedMotion ? 0 : 0.3,
      ease: "power2.in",
    });
  }

  // Close drawer on link click
  for (const link of drawerLinks) {
    link.addEventListener("click", () => {
      if (isOpen) closeDrawer();
    });
  }

  // Active link tracking via scroll position
  const sectionIds = ["sobre", "eixos", "agenda", "espaco", "contato"];
  const allLinks = [...Array.from(navLinks), ...Array.from(drawerLinks)];

  function updateActiveLink(): void {
    const scrollY = window.scrollY + window.innerHeight * 0.4;
    let activeId = "";

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        activeId = id;
      }
    }

    for (const link of allLinks) {
      const href = link.getAttribute("href");
      if (href === `#${activeId}`) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    }
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
}
