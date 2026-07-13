import { ensureGsapRegistered, prefersReducedMotion } from "@/animations/motion";
import type { AlbumFoto } from "@/types/album";
import gsap from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "./Lightbox";

const TORN_PAPER_VARIANTS = [
  "polygon(1% 2%, 99% 1%, 98% 97%, 2% 99%)",
  "polygon(2% 1%, 98% 2%, 99% 98%, 1% 97%)",
  "polygon(1% 1%, 97% 2%, 100% 99%, 2% 98%)",
  "polygon(0% 2%, 98% 0%, 99% 98%, 1% 100%)",
];

const ROTATIONS = ["-1.5deg", "1.2deg", "-0.8deg", "2deg", "0.5deg", "-1.2deg", "1.5deg", "-2deg"];

interface AlbumDetalheProps {
  fotos: AlbumFoto[];
}

export default function AlbumDetalhe({ fotos }: AlbumDetalheProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const fotosForLightbox = useMemo(
    () =>
      fotos.map((f) => ({
        id: f.id,
        titulo: null,
        legenda: f.alt,
        imagem: f.src,
      })),
    [fotos],
  );

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const changeIndex = useCallback((index: number) => setLightboxIndex(index), []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    ensureGsapRegistered();
    const items = grid.querySelectorAll<HTMLElement>("[data-masonry-item]");

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <>
      <div
        ref={gridRef}
        className="galeria-masonry columns-2 gap-6 px-6 md:columns-3 md:gap-8 md:px-8 lg:columns-4 lg:gap-10 lg:px-12"
      >
        {fotos.map((foto, i) => (
          <button
            key={foto.id}
            data-masonry-item
            type="button"
            onClick={() => openLightbox(i)}
            aria-label={`Abrir ${foto.alt}`}
            className="group relative w-full mb-6 cursor-pointer bg-transparent border-none p-0"
            style={{ breakInside: "avoid" }}
          >
            <div
              className="relative p-2 md:p-3 bg-cream shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              style={{
                clipPath: TORN_PAPER_VARIANTS[i % TORN_PAPER_VARIANTS.length],
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]})`,
                filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.12))",
              }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ clipPath: "polygon(0.5% 0.5%, 99.5% 0.5%, 99.5% 99.5%, 0.5% 99.5%)" }}
              >
                <img
                  src={foto.src}
                  alt={foto.alt}
                  width={foto.width}
                  height={foto.height}
                  loading={i < 4 ? "eager" : "lazy"}
                  className="w-full h-auto object-cover transition-transform duration-500 scale-[1.05] group-hover:scale-[1.1]"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

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
