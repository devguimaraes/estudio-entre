/**
 * Navbar: active link tracking + scroll-triggered theme
 */

export function initNavbar(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".navbar__link");

  // Active link tracking via scroll position
  const sectionIds = ["sobre", "pilares", "agenda", "galeria", "contato"];

  function updateActiveLink(): void {
    const scrollY = window.scrollY + window.innerHeight * 0.4;
    let activeId = "";

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        activeId = id;
      }
    }

    for (const link of navLinks) {
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
