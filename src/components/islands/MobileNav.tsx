import { navGroups } from "@/components/nav/navConfig";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const socials = [
  {
    href: "https://instagram.com/entrenoestudio",
    icon: "/icons/instagram.svg",
    label: "Instagram",
  },
  { href: "https://tiktok.com/@entrenoestudio", icon: "/icons/tiktok.svg", label: "TikTok" },
  { href: "https://wa.me/5521973101451", icon: "/icons/whatsapp.svg", label: "WhatsApp" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  function toggleGroup(groupId: string) {
    setExpandedGroup((current) => (current === groupId ? null : groupId));
  }

  function handleLinkClick() {
    setOpen(false);
    setExpandedGroup(null);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="flex flex-col gap-[6px] bg-transparent border-none cursor-pointer p-1 md:hidden"
          type="button"
          aria-label="Abrir menu"
        >
          <span className="block w-6 h-[2px] bg-current rounded-sm transition-transform duration-300" />
          <span className="block w-6 h-[2px] bg-current rounded-sm transition-transform duration-300" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="border-none flex flex-col">
        <div className="mb-10 pt-4">
          <img
            src="/logos/logo-estudio-entre-claro.png"
            alt="Estúdio Entre"
            className="w-40 h-auto"
          />
        </div>

        <nav className="flex-1 flex flex-col" aria-label="Menu principal">
          {navGroups.map((group) => {
            const isExpanded = expandedGroup === group.id;

            return (
              <div key={group.id} className="border-b border-white/[0.08]">
                <button
                  type="button"
                  className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
                  aria-expanded={isExpanded}
                  onClick={() => toggleGroup(group.id)}
                >
                  <span className="font-display font-black text-xl uppercase tracking-wide text-[#f0ede8] opacity-90">
                    {group.label}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#f0ede8]/60 transition-transform duration-180 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-180 ease-out ${
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="flex flex-col pb-2">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={handleLinkClick}
                            className="flex min-h-11 items-center py-2 pl-4 font-body text-sm font-bold uppercase tracking-[0.12em] text-[#f0ede8]/75 transition-opacity hover:opacity-100"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 pb-4">
          <p className="font-display italic text-sm text-[rgba(240,237,232,0.4)] mb-6">
            onde a palavra vira encontro.
          </p>

          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                className="opacity-40 hover:opacity-100 transition-opacity"
                aria-label={social.label}
              >
                <img src={social.icon} alt="" className="w-5 h-5 invert" />
              </a>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
