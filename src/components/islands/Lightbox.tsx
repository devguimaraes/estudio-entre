import { useEffect, useRef, useCallback } from "react";
import type { FotoEspaco } from "@/types/foto";

interface LightboxProps {
  fotos: FotoEspaco[];
  activeIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export default function Lightbox({
  fotos,
  activeIndex,
  onClose,
  onChangeIndex,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const foto = fotos[activeIndex];

  const goNext = useCallback(() => {
    if (activeIndex < fotos.length - 1) onChangeIndex(activeIndex + 1);
  }, [activeIndex, fotos.length, onChangeIndex]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) onChangeIndex(activeIndex - 1);
  }, [activeIndex, onChangeIndex]);

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    dialogRef.current?.showModal();
    return () => {
      triggerRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={foto?.legenda ?? "Visualização de foto"}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(26, 22, 18, 0.95)",
        border: "none",
        padding: 0,
        margin: 0,
        maxWidth: "none",
        maxHeight: "none",
        animation: "fadeIn 0.3s ease forwards",
      }}
    >
      <style>{"@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }"}</style>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          background: "none",
          border: "none",
          color: "#f0ede8",
          fontSize: "2rem",
          cursor: "pointer",
          opacity: 0.7,
          transition: "opacity 0.3s ease",
          fontFamily: "var(--font-body)",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}
      >
        &times;
      </button>

      {activeIndex > 0 && (
        <button
          type="button"
          onClick={goPrev}
          aria-label="Foto anterior"
          style={{
            position: "absolute",
            left: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#f0ede8",
            fontSize: "2rem",
            cursor: "pointer",
            opacity: 0.5,
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
        >
          &#8249;
        </button>
      )}

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        maxWidth: "90vw",
        maxHeight: "85vh",
        padding: "0 4rem",
      }}>
        {foto && (
          <>
            <img
              src={`${foto.imagem}?w=1200&h=900&fit=crop&auto=format`}
              alt={foto.legenda ?? foto.titulo ?? "Foto do espaço"}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
            {foto.legenda && (
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                color: "#f0ede8",
                opacity: 0.8,
                textAlign: "center",
                fontStyle: "italic",
              }}>
                {foto.legenda}
              </p>
            )}
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "#f0ede8",
              opacity: 0.4,
            }}>
              {activeIndex + 1} / {fotos.length}
            </span>
          </>
        )}
      </div>

      {activeIndex < fotos.length - 1 && (
        <button
          type="button"
          onClick={goNext}
          aria-label="Próxima foto"
          style={{
            position: "absolute",
            right: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#f0ede8",
            fontSize: "2rem",
            cursor: "pointer",
            opacity: 0.5,
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
        >
          &#8250;
        </button>
      )}
    </dialog>
  );
}
