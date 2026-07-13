/**
 * Navbar: active link tracking + scroll-triggered theme
 */

export function initNavbar(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".navbar__link[href]");
  const navGroups = document.querySelectorAll<HTMLLIElement>(".navbar__group");

  const sectionIds = ["sobre", "pilares", "espaco", "agenda", "agendar-visita", "contato"];

  function isLinkActive(href: string, pathname: string, activeHash: string): boolean {
    if (href.startsWith("/#")) {
      const hash = href.slice(2);
      return (pathname === "/" || pathname === "") && activeHash === hash;
    }

    if (href.startsWith("/")) {
      return pathname === href || (href.length > 1 && pathname.startsWith(`${href}/`));
    }

    return false;
  }

  function updateActiveLink(): void {
    const pathname = window.location.pathname;
    const scrollY = window.scrollY + window.innerHeight * 0.4;
    let activeHash = "";

    if (pathname === "/" || pathname === "") {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          activeHash = id;
        }
      }
    }

    for (const link of navLinks) {
      const href = link.getAttribute("href") ?? "";
      link.classList.toggle("is-active", isLinkActive(href, pathname, activeHash));
    }

    for (const group of navGroups) {
      const childLinks = group.querySelectorAll<HTMLAnchorElement>(".navbar__dropdown-link");
      const hasActiveChild = Array.from(childLinks).some((link) => {
        const href = link.getAttribute("href") ?? "";
        return isLinkActive(href, pathname, activeHash);
      });

      group.classList.toggle("is-active", hasActiveChild);

      const trigger = group.querySelector<HTMLButtonElement>(".navbar__trigger");
      trigger?.classList.toggle("is-active", hasActiveChild);
    }
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("popstate", updateActiveLink);
  updateActiveLink();
}
