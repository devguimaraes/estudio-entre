export function isLinkActive(href: string, pathname: string, activeHash: string): boolean {
  if (href.startsWith("/#")) {
    const hash = href.slice(2);
    return (pathname === "/" || pathname === "") && activeHash === hash;
  }

  if (href.startsWith("/")) {
    if (pathname === href || (href.length > 1 && pathname.startsWith(`${href}/`))) {
      return true;
    }

    if ((pathname === "/" || pathname === "") && href === "/agenda" && activeHash === "agenda") {
      return true;
    }

    return false;
  }

  return false;
}
