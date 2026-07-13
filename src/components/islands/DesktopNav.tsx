import { type NavGroup, navGroups } from "@/components/nav/navConfig";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

function NavDropdownGroup({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const finePointer = useFinePointer();
  const menuId = useId();
  const containerRef = useRef<HTMLLIElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        containerRef.current?.querySelector<HTMLButtonElement>(".navbar__trigger")?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  function handleBlur(event: React.FocusEvent<HTMLLIElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      close();
    }
  }

  return (
    <li
      ref={containerRef}
      className={`navbar__group${open ? " is-open" : ""}`}
      onMouseEnter={finePointer ? () => setOpen(true) : undefined}
      onMouseLeave={finePointer ? () => setOpen(false) : undefined}
      onBlur={handleBlur}
    >
      <button
        type="button"
        className="navbar__trigger navbar__link"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{group.label}</span>
        <ChevronDown className="navbar__chevron" aria-hidden="true" />
      </button>

      <ul
        id={menuId}
        role="menu"
        className={`navbar__dropdown${open ? " is-open" : ""}`}
        aria-hidden={!open}
        onMouseEnter={finePointer ? () => setOpen(true) : undefined}
      >
        {group.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              role="menuitem"
              className="navbar__link navbar__dropdown-link"
              data-cursor={link.cursor}
              tabIndex={open ? 0 : -1}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function DesktopNav() {
  return (
    <ul className="navbar__links">
      {navGroups.map((group) => (
        <NavDropdownGroup key={group.id} group={group} />
      ))}
    </ul>
  );
}
