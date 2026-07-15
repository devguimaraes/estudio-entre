import type { EventoNormalizado } from "@/types/evento";

interface EventoExpandedPanelProps {
  evento: EventoNormalizado;
  /** "preview" = home (cream on forest); "full" = página agenda (forest on cream) */
  variant: "preview" | "full";
}

export default function EventoExpandedPanel({ evento, variant }: EventoExpandedPanelProps) {
  const isPreview = variant === "preview";

  return (
    <div
      className={
        isPreview
          ? "rounded-2xl bg-cream/[0.05] p-6 border border-cream/10"
          : "rounded-3xl bg-forest/[0.03] p-6 md:p-10 border border-forest/[0.05]"
      }
    >
      {isPreview && evento.local && (
        <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-4 pb-3 border-b border-cream/5">
          {evento.local}
        </p>
      )}

      {evento.descricao && (
        <p
          className={
            isPreview
              ? "text-sm md:text-base leading-relaxed text-cream/80 mb-8 whitespace-pre-line"
              : "whitespace-pre-line text-base md:text-lg leading-relaxed text-forest/80 max-w-2xl"
          }
        >
          {evento.descricao}
        </p>
      )}

      <div
        className={
          isPreview
            ? "flex flex-col gap-6"
            : "mt-10 flex flex-wrap items-center justify-between gap-8 border-t border-forest/10 pt-8"
        }
      >
        {evento.valor && (
          <div className="flex flex-col gap-1">
            <span
              className={
                isPreview
                  ? "text-[9px] font-bold uppercase tracking-widest text-cream/30"
                  : "text-[10px] font-black uppercase tracking-widest text-forest/40"
              }
            >
              Investimento
            </span>
            <span
              className={
                isPreview
                  ? "text-xl font-display font-black text-orange uppercase tracking-wider"
                  : "font-display text-2xl md:text-3xl font-black uppercase tracking-[0.05em] text-orange"
              }
            >
              {evento.valor}
            </span>
          </div>
        )}

        {evento.linkCompra && (
          <a
            href={evento.linkCompra}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isPreview
                ? "flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-black px-8 py-4 rounded-full bg-cream text-forest hover:bg-orange hover:text-cream transition-all duration-500 group/btn shadow-xl shadow-black/20"
                : "group/btn relative inline-flex items-center gap-4 rounded-full bg-forest px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-cream transition-all hover:bg-orange hover:shadow-2xl hover:shadow-orange/30"
            }
          >
            <span className={isPreview ? undefined : "relative z-10"}>Garantir vaga</span>
            <svg
              width={isPreview ? "12" : "14"}
              height={isPreview ? "12" : "14"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={
                isPreview
                  ? "transition-transform duration-300 group-hover/btn:translate-x-1"
                  : "relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
              }
              aria-hidden="true"
              focusable="false"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
