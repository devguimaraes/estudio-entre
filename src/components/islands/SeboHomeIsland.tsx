import { animateSeboHome } from "@/animations/sebo";
import type { LivroSebo } from "@/types/sebo";
import { CORES_GENERO } from "@/types/sebo";
import { fetchSeboCSV, parseSeboCSV } from "@/utils/sebo-sheets";
import { useLayoutEffect, useState } from "react";

function HalftoneBg({
  color,
  opacity,
  density,
  dotSize,
}: {
  color: string;
  opacity: number;
  density: number;
  dotSize: number;
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `radial-gradient(rgba(${color}, ${opacity}) ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${density}px ${density}px`,
      }}
    />
  );
}

function StarDecorative({
  color,
  size,
  className,
}: {
  color: string;
  size: number;
  className: string;
}) {
  return (
    <span className={`inline-block ${className}`} style={{ width: size, height: size, color }}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <title>Estrela decorativa</title>
        <path
          d="M20 0C20 11.05 11.05 20 0 20C11.05 20 20 28.95 20 40C20 28.95 28.95 20 40 20C28.95 20 20 11.05 20 0Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function DotsDecorative({
  color,
  size,
  className,
}: {
  color: string;
  size: number;
  className: string;
}) {
  return (
    <span className={`inline-block ${className}`} style={{ width: size, height: size, color }}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <title>Pontos decorativos</title>
        <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="20" cy="10" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="30" cy="10" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="10" cy="20" r="3" fill="currentColor" opacity="0.7" />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.9" />
        <circle cx="30" cy="20" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="10" cy="30" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="20" cy="30" r="3" fill="currentColor" opacity="0.7" />
        <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.3" />
      </svg>
    </span>
  );
}

export default function SeboHomeIsland() {
  const [destaques, setDestaques] = useState<LivroSebo[] | null>(null);

  useLayoutEffect(() => {
    let cancelled = false;

    fetchSeboCSV()
      .then(parseSeboCSV)
      .then((livros) => {
        if (!cancelled) setDestaques(livros.slice(-4));
      })
      .catch(() => {
        if (!cancelled) setDestaques([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!destaques || destaques.length === 0) return;
    animateSeboHome();
  }, [destaques]);

  if (destaques === null) {
    return (
      <section
        className="sebo-home relative overflow-hidden px-6 py-20 md:px-16 md:py-28"
        style={{ backgroundColor: "#b9e4eb", color: "#3d1020" }}
        data-bg-color="#b9e4eb"
        data-nav-theme="dark"
        id="sebo"
        aria-label="Sebo Entre"
      >
        <div className="relative z-10 mx-auto max-w-[1300px]">
          <div className="sebo-home__header mb-6 md:mb-12">
            <div className="mb-6 overflow-hidden">
              <p className="sebo-home__eyebrow font-display text-[10px] font-bold uppercase tracking-[0.4em] text-bordo/30">
                Catálogo de Livros Usados
              </p>
            </div>
            <h2 className="sebo-home__title flex flex-col md:flex-row md:flex-wrap md:items-end gap-x-8 gap-y-2">
              <span className="sebo-home__title-line block font-display text-[clamp(2rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-bordo">
                Garimpe no
              </span>
              <span className="sebo-home__title-line block font-display text-[clamp(2rem,5.5vw,5rem)] font-black italic uppercase leading-[0.9] text-orange">
                Sebo
              </span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders estáticos
                key={`skeleton-${i}`}
                className="animate-pulse rounded-[1.5rem] bg-white/50 p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-bordo/10" />
                  <div className="h-2.5 w-16 rounded bg-bordo/10" />
                </div>
                <div className="mb-2 h-5 w-3/4 rounded bg-bordo/10" />
                <div className="h-3 w-1/2 rounded bg-bordo/5" />
                <div className="mt-4 border-t border-bordo/[0.04] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-20 rounded bg-bordo/10" />
                    <div className="h-10 w-10 rounded-full bg-bordo/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center md:mt-16">
            <div className="h-12 w-44 animate-pulse rounded-full bg-white/50" />
          </div>
        </div>
      </section>
    );
  }

  if (destaques.length === 0) return null;

  return (
    <section
      className="sebo-home relative overflow-hidden px-6 py-20 md:px-16 md:py-28"
      style={{ backgroundColor: "#b9e4eb", color: "#3d1020" }}
      data-bg-color="#b9e4eb"
      data-nav-theme="dark"
      id="sebo"
      aria-label="Sebo Entre"
    >
      <HalftoneBg density={14} dotSize={1.5} color="61,16,32" opacity={0.04} />

      <div className="absolute right-[10%] top-[15%] z-0 opacity-15">
        <StarDecorative color="#3D1020" size={40} className="" />
      </div>
      <div className="absolute bottom-[20%] left-[5%] z-0 opacity-10">
        <DotsDecorative color="#3D1020" size={50} className="" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <div className="sebo-home__header mb-6 md:mb-12">
          <div className="mb-6 overflow-hidden">
            <p className="sebo-home__eyebrow font-display text-[10px] font-bold uppercase tracking-[0.4em] text-bordo/30">
              Catálogo de Livros Usados
            </p>
          </div>
          <h2 className="sebo-home__title flex flex-col md:flex-row md:flex-wrap md:items-end gap-x-8 gap-y-2">
            <span className="sebo-home__title-line block font-display text-[clamp(2rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-bordo">
              Garimpe no
            </span>
            <span className="sebo-home__title-line block font-display text-[clamp(2rem,5.5vw,5rem)] font-black italic uppercase leading-[0.9] text-orange">
              Sebo
            </span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {destaques.map((livro) => (
            <article
              key={`${livro.titulo}-${livro.autor}`}
              className="group rounded-[1.5rem] bg-white p-6 shadow-lg shadow-bordo/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: CORES_GENERO[livro.genero] ?? "#EC6838" }}
                />
                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-bordo/25">
                  {livro.genero}
                </span>
              </div>
              <h3 className="font-display text-base font-black uppercase leading-[1.05] text-near-black md:text-lg">
                {livro.titulo}
              </h3>
              <p className="mt-1.5 text-xs text-bordo/35">{livro.autor}</p>
              <div className="mt-4 flex items-center justify-between border-t border-bordo/[0.04] pt-4">
                <span className="font-display text-lg font-black text-orange md:text-xl">
                  {livro.valor}
                </span>
                <a
                  href={`https://wa.me/5521973101451?text=${encodeURIComponent(`Olá! Tenho interesse no livro: ${livro.titulo}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] transition-transform duration-300 hover:scale-110"
                  aria-label={`Comprar ${livro.titulo} via WhatsApp`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" role="img">
                    <title>WhatsApp</title>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center md:mt-16">
          <a
            href="/sebo"
            className="group inline-flex items-center gap-3 rounded-full border border-bordo/30 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-bordo transition-all duration-500 hover:bg-bordo hover:text-cream"
          >
            Ver acervo completo
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
