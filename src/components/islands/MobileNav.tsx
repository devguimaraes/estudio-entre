import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#pilares", label: "Pilares" },
  { href: "#agenda", label: "Agenda" },
  { href: "#galeria", label: "Espaço" },
  { href: "#contato", label: "Contato" },
];

const socials = [
  { href: "https://instagram.com/estudioentre", icon: "/icons/spark.svg", label: "Instagram" },
  { href: "https://tiktok.com/@estudioentre", icon: "/icons/tiktok.svg", label: "TikTok" },
  { href: "#", icon: "/icons/whatsapp.svg", label: "WhatsApp" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

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
        {/* Logo */}
        <div className="mb-10 pt-4">
          <img
            src="/logos/Logo_Estudio Entre - Claro 2.png"
            alt="Estúdio Entre"
            className="w-40 h-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 py-4 border-b border-white/[0.08]"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-[rgba(240,237,232,0.3)] font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display font-black text-2xl uppercase tracking-wide text-[#f0ede8] opacity-80 group-hover:opacity-100 transition-opacity">
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Footer: tagline + socials */}
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
