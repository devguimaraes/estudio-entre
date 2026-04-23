import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import type { FotoEspaco } from "@/types/foto";
import Lightbox from "./Lightbox";

const FOTOS: FotoEspaco[] = [
  { id: "1", titulo: null, legenda: "Onde as palavras ganham eco", imagem: "https://picsum.photos/seed/entre1/960/768" },
  { id: "2", titulo: null, legenda: "Entre livros e vozes", imagem: "https://picsum.photos/seed/entre2/960/768" },
  { id: "3", titulo: null, legenda: "Cada canto um convite", imagem: "https://picsum.photos/seed/entre3/960/768" },
  { id: "4", titulo: null, legenda: "A obra segue viva", imagem: "https://picsum.photos/seed/entre4/960/768" },
  { id: "5", titulo: null, legenda: "O som que preenche o silêncio", imagem: "https://picsum.photos/seed/entre5/960/768" },
  { id: "6", titulo: null, legenda: "Um lugar para estar", imagem: "https://picsum.photos/seed/entre6/960/768" },
  { id: "7", titulo: null, legenda: "Luz que conta histórias", imagem: "https://picsum.photos/seed/entre7/960/768" },
  { id: "8", titulo: null, legenda: "O espaço que nos escolheu", imagem: "https://picsum.photos/seed/entre8/960/768" },
];

const DRAG_THRESHOLD = 5;
const INERTIA_FRICTION = 0.92;

export default function GaleriaEspaco() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    scrollStart: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    animationId: 0,
  });

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  const startInertia = useCallback((initialVelocity: number) => {
    const el = scrollRef.current;
    if (!el) return;

    let vel = initialVelocity;

    const animate = () => {
      const ds = dragState.current;
      el.scrollLeft -= vel;
      vel *= INERTIA_FRICTION;
      updateProgress();

      if (Math.abs(vel) > 0.5) {
        ds.animationId = requestAnimationFrame(animate);
      }
    };

    dragState.current.animationId = requestAnimationFrame(animate);
  }, [updateProgress]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    cancelAnimationFrame(dragState.current.animationId);

    const ds = dragState.current;
    ds.isDragging = false;
    ds.startX = e.clientX;
    ds.scrollStart = el.scrollLeft;
    ds.velocity = 0;
    ds.lastX = e.clientX;
    ds.lastTime = Date.now();
  };

  const handleFotoClick = (index: number) => {
    if (!dragState.current.isDragging) {
      setLightboxIndex(index);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    const ds = dragState.current;
    if (!el) return;

    const dx = ds.startX - e.clientX;

    if (Math.abs(dx) > DRAG_THRESHOLD) {
      ds.isDragging = true;
    }

    if (!ds.isDragging) return;

    el.scrollLeft = ds.scrollStart + dx;

    const now = Date.now();
    const dt = now - ds.lastTime;
    if (dt > 0) {
      ds.velocity = (ds.lastX - e.clientX) / dt * 16;
    }
    ds.lastX = e.clientX;
    ds.lastTime = now;
    updateProgress();
  };

  const handlePointerUp = () => {
    const ds = dragState.current;
    if (ds.isDragging) {
      startInertia(ds.velocity);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateProgress();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [updateProgress]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("espaco:hydrated"));
  }, []);

  useEffect(() => {
    if (lightboxIndex !== null) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const items = scrollRef.current?.querySelectorAll<HTMLElement>("[data-foto-item]");
    if (!items?.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  }, [lightboxIndex]);

  return (
    <>
      <div className="espaco__gallery-wrapper">
        <div
          ref={scrollRef}
          className="espaco__gallery"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {FOTOS.map((foto, i) => (
            <button
              key={foto.id}
              type="button"
              data-foto-item
              className="espaco__foto"
              onClick={() => handleFotoClick(i)}
              aria-label={foto.legenda ?? "Ver foto do espaço"}
              data-cursor="VER"
            >
              <div className="espaco__foto-image-wrapper">
                <img
                  className="espaco__foto-image"
                  src={`${foto.imagem}?w=960&h=768&fit=crop&auto=format`}
                  alt={foto.legenda ?? foto.titulo ?? "Foto do espaço"}
                  loading={i === 0 ? "eager" : "lazy"}
                  width={960}
                  height={768}
                  fetchPriority={i === 0 ? "high" : "low"}
                />
                <div className="espaco__foto-halftone" aria-hidden="true">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <filter id={`halftone-${foto.id}`}>
                      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter={`url(#halftone-${foto.id})`} />
                  </svg>
                </div>
              </div>
              {foto.legenda && (
                <span className="espaco__foto-legenda">{foto.legenda}</span>
              )}
            </button>
          ))}
        </div>
        <div className="espaco__progress">
          <div
            className="espaco__progress-bar"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          fotos={FOTOS}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </>
  );
}
