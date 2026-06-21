interface SeboEmptyStateProps {
  variant: "empty" | "no-results";
  onClear?: () => void;
}

export default function SeboEmptyState({ variant, onClear }: SeboEmptyStateProps) {
  if (variant === "empty") {
    return (
      <div className="rounded-[2.5rem] border border-bordo/10 bg-cream/70 px-6 py-16 text-center">
        <p className="font-display text-3xl font-black italic uppercase text-bordo">
          Acervo vazio no momento.
        </p>
        <p className="mt-4 text-sm text-bordo/60">Em breve, novos livros entram no catálogo.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] border border-white/20 bg-white/30 px-5 py-16 text-center backdrop-blur-sm md:rounded-[3rem] md:px-6 md:py-24">
      <p className="font-display text-3xl font-black uppercase leading-none text-bordo/80 md:text-4xl">
        Nenhum livro <br />
        <span className="text-orange opacity-100">encontrado.</span>
      </p>
      <p className="mx-auto mt-6 max-w-xl text-sm font-medium leading-relaxed text-bordo/50 md:mt-8">
        Tente ajustar seus filtros ou buscar por outro termo.
      </p>
      {onClear && (
        <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12 md:gap-4">
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-bordo/20 px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] text-bordo/60 transition-all hover:border-bordo hover:text-bordo md:px-10 md:py-4 md:text-[10px]"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
