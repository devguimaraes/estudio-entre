import { useCallback, useEffect, useRef, useState } from "react";

interface VideoRodaProps {
  src: string;
  poster: string;
  title: string;
  caption: string;
  badge?: string;
  className?: string;
}

export default function VideoRoda({
  src,
  poster,
  title,
  caption,
  badge = "VAL EXPLICA A RODA // 1 MIN",
  className = "",
}: VideoRodaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  const playMuted = useCallback(() => {
    const el = videoRef.current;
    if (!el || failed) return;
    el.muted = true;
    setMuted(true);
    el.play()
      .then(() => {
        setPlaying(true);
        setAutoplayFailed(false);
      })
      .catch(() => {
        setPlaying(false);
        setAutoplayFailed(true);
      });
  }, [failed]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(reduce);

    const el = videoRef.current;
    const frame = frameRef.current;
    if (!el || !frame) return;

    const tryAutoplay = () => {
      if (reduce || failed) return;
      el.muted = true;
      el.play()
        .then(() => {
          setPlaying(true);
          setAutoplayFailed(false);
        })
        .catch(() => {
          setPlaying(false);
          setAutoplayFailed(true);
        });
    };

    const onCanPlay = () => {
      if (!reduce) tryAutoplay();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          el.pause();
          return;
        }
        tryAutoplay();
      },
      { threshold: 0.25 },
    );

    io.observe(frame);
    el.addEventListener("canplay", onCanPlay);
    if (el.readyState >= 2) tryAutoplay();

    return () => {
      io.disconnect();
      el.removeEventListener("canplay", onCanPlay);
    };
  }, [failed]);

  const toggleSound = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const nextMuted = !el.muted;
    el.muted = nextMuted;
    setMuted(nextMuted);
    if (el.paused) {
      el.play().catch(() => {});
    }
  }, []);

  const showAssistir = !failed && !playing && (reduceMotion || autoplayFailed);
  const showSound = !failed && playing;
  const showPoster = !playing || failed;

  return (
    <figure className={`m-0 flex flex-col items-center lg:items-start ${className}`}>
      <div
        ref={frameRef}
        className="group relative mx-auto aspect-[9/16] h-[min(74svh,660px)] w-auto max-w-full overflow-hidden rounded-[2rem] bg-near-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] ring-1 ring-gold/30 lg:mx-0"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={title}
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
        />

        {showPoster && (
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_28%]"
          />
        )}

        {/* Top badge */}
        {badge && (
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-cream/20 bg-near-black/75 px-3 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange" aria-hidden="true" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-cream/90">
              {badge}
            </span>
          </div>
        )}

        {/* Play trigger when reduced-motion or autoplay failed */}
        {showAssistir && (
          <button
            type="button"
            onClick={playMuted}
            className="absolute bottom-5 left-5 z-10 flex min-h-11 items-center gap-2 rounded-full border border-cream/30 bg-orange px-6 py-2.5 font-display text-[11px] font-black uppercase tracking-widest text-bordo shadow-lg transition-[transform,background-color] duration-160 ease-[var(--ease-expo)] active:scale-[0.97] motion-reduce:active:scale-100 fine-hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lilas"
          >
            <span>▶ Assistir</span>
          </button>
        )}

        {/* Audio control button */}
        {showSound && (
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            className="absolute bottom-5 left-5 z-10 flex min-h-11 items-center gap-2 rounded-full border border-cream/25 bg-near-black/80 px-5 py-2.5 font-display text-[11px] font-black uppercase tracking-widest text-cream backdrop-blur-md shadow-lg transition-[transform,background-color] duration-160 ease-[var(--ease-expo)] active:scale-[0.97] motion-reduce:active:scale-100 fine-hover:bg-bordo focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lilas"
          >
            <span className="text-xs" aria-hidden="true">
              {muted ? "🔇" : "🔊"}
            </span>
            <span>{muted ? "Ligar som" : "Mudo"}</span>
          </button>
        )}
      </div>

      <figcaption className="mx-auto mt-4 max-w-xs px-2 text-center lg:mx-0 lg:text-left">
        <p className="font-display text-base font-extrabold text-cream md:text-lg">{title}</p>
        <p className="mt-1 text-sm leading-snug text-cream/70">{caption}</p>
        {reduceMotion && !playing && (
          <p className="mt-2 text-xs text-cream/60">O vídeo inicia com o seu clique.</p>
        )}
      </figcaption>
    </figure>
  );
}
