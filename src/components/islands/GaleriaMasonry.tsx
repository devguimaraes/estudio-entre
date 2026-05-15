import type { GaleriaImagem } from "@/data/galeriaImagens";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import Lightbox from "./Lightbox";

gsap.registerPlugin(ScrollTrigger);

const TORN_PAPER_VARIANTS = [
  "polygon(1% 2%, 99% 1%, 98% 97%, 2% 99%)",
  "polygon(2% 1%, 98% 2%, 99% 98%, 1% 97%)",
  "polygon(1% 1%, 97% 2%, 100% 99%, 2% 98%)",
  "polygon(0% 2%, 98% 0%, 99% 98%, 1% 100%)",
];

const ROTATIONS = ["-1.5deg", "1.2deg", "-0.8deg", "2deg", "0.5deg", "-1.2deg", "1.5deg", "-2deg"];

function getRotation(i: number): string {
  return ROTATIONS[i % ROTATIONS.length];
}

function getVariant(i: number): string {
  return TORN_PAPER_VARIANTS[i % TORN_PAPER_VARIANTS.length];
}

interface GaleriaMasonryProps {
  imagens: GaleriaImagem[];
}

export default function GaleriaMasonry({ imagens }: GaleriaMasonryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const fotosForLightbox = imagens.map((img) => ({
    id: img.id,
    titulo: null,
    legenda: img.alt,
    imagem: img.src,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const changeIndex = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = grid.querySelectorAll<HTMLElement>("[data-masonry-item]");

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.fromTo(
      items,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      for (const st of ScrollTrigger.getAll()) {
        if (st.vars.trigger === grid) st.kill();
      }
    };
  }, []);

  return (
    <>
      <div
        ref={gridRef}
        className="galeria-masonry"
        style={{
          columns: "2",
          columnGap: "1.5rem",
          padding: "0 1.5rem",
        }}
      >
        {imagens.map((img, i) => (
          <button
            key={img.id}
            data-masonry-item
            type="button"
            onClick={() => openLightbox(i)}
            aria-label={`Abrir ${img.alt}`}
            className="group relative w-full mb-6 cursor-pointer bg-transparent border-none p-0"
            style={{ breakInside: "avoid" }}
          >
            <div
              className="relative p-2 md:p-3 bg-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              style={{
                clipPath: getVariant(i),
                transform: `rotate(${getRotation(i)})`,
                filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.12))",
              }}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                style={{
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/felt.png')",
                }}
              />
              <div
                className="relative w-full overflow-hidden"
                style={{ clipPath: "polygon(0.5% 0.5%, 99.5% 0.5%, 99.5% 99.5%, 0.5% 99.5%)" }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading={i < 4 ? "eager" : "lazy"}
                  className="w-full h-auto object-cover transition-transform duration-500 scale-[1.05] group-hover:scale-[1.1]"
                />
              </div>
            </div>

            {/* Hover label */}
            <div className="absolute inset-x-0 -bottom-2 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 translate-y-2 group-hover:translate-y-0 pointer-events-none">
              <span className="inline-block font-display italic text-[11px] uppercase tracking-widest text-bordo bg-cream/95 px-6 py-3 rounded-full shadow-xl border border-bordo/5">
                {img.alt}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Responsive column overrides */}
      <style>{`
        @media (min-width: 768px) {
          .galeria-masonry { columns: 3 !important; column-gap: 2rem !important; padding: 0 2rem !important; }
        }
        @media (min-width: 1024px) {
          .galeria-masonry { columns: 4 !important; column-gap: 2.5rem !important; padding: 0 3rem !important; }
        }
      `}</style>

      {lightboxIndex !== null && (
        <Lightbox
          fotos={fotosForLightbox}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onChangeIndex={changeIndex}
        />
      )}
    </>
  );
}
