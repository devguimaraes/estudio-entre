interface SeboSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SeboSearch({ value, onChange }: SeboSearchProps) {
  return (
    <div className="relative w-full">
      <label
        htmlFor="search-sebo"
        className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-bordo/50 md:text-[11px]"
      >
        Garimpar no acervo
      </label>
      <div className="relative group">
        <input
          id="search-sebo"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Título, autor ou editora..."
          className="w-full rounded-t-xl border-b-2 border-bordo/10 bg-bordo/[0.03] px-5 py-5 text-base font-medium text-bordo outline-none transition-all placeholder:text-bordo/30 focus:border-orange focus:bg-white md:py-6 md:text-lg"
        />
        <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within:opacity-50">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>
    </div>
  );
}
