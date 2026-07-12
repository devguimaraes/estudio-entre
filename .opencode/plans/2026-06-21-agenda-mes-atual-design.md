# Spec: Timeline de Meses — Hierarquia Visual Reforçada

**Data:** 2026-06-21
**Escopo:** Página Agenda — seletor de meses
**Arquivo afetado:** `src/components/islands/AgendaPageFilter.tsx`

---

## Problema

A página `/agenda` tem uma timeline de meses para filtrar eventos. O código já seleciona o mês atual ao carregar (`getInitialMonth`). Porém:

1. Meses não selecionados têm opacidade 25% — ilegíveis, difícil escanear.
2. Nenhum indicador visual do mês atual quando outro mês está selecionado.
3. Timeline não faz scroll automático ao carregar — o mês selecionado pode estar fora da viewport.

## Objetivo

- Hierarquia visual de 3 níveis: selecionado > atual > demais.
- Scroll automático ao montar para mostrar o mês selecionado.
- Implementação localizada, sem alterar queries, tipos ou utilitários.

---

## Design

### 1. Hierarquia visual

| Estado | Tratamento |
|--------|-----------|
| **Selecionado** | `text-forest scale-110` + underline laranja (mantido) |
| **Mês atual** (não selecionado) | `text-forest/60` + pill outline laranja (`border border-orange/40 rounded-full px-4 py-1 bg-orange/5`) + badge "atual" abaixo |
| **Demais meses** | `text-forest/40 hover:text-forest/60` |

### 2. Pill de destaque

- Aparece apenas no mês corrente **não selecionado**.
- Quando selecionado, o underline + scale-110 bastam.

### 3. Badge "atual"

- Texto `atual` abaixo do nome do mês corrente não selecionado.
- `text-[8px] font-black uppercase tracking-[0.3em] text-orange/70`.
- Posicionado via `absolute -bottom-5 left-1/2 -translate-x-1/2`.

### 4. Scroll automático

- `useEffect` na montagem (dependências `[]`) que seleciona o botão via `data-month` e chama `scrollIntoView({ behavior: "smooth", inline: "center" })`.
- Container da timeline ganha `scroll-smooth` para transições suaves.

### 5. Refatoração do markup dos botões

- Adicionar atributo `data-month={month}` em cada botão.
- Extrair lógica condicional de classes para os 3 estados.
- Mover underline laranja para dentro de condicional (só renderiza quando selecionado).

---

## Implementação

### Arquivo: `src/components/islands/AgendaPageFilter.tsx`

**Nova constante** (nível de módulo):
```ts
const currentMonthKey = getCurrentMesKey();
```

**Novo ref:**
```tsx
const monthNavRef = useRef<HTMLDivElement>(null);
```

**Novo useEffect** (após os `useMemo` existentes):
```tsx
useEffect(() => {
  if (!monthNavRef.current) return;
  const btn = monthNavRef.current.querySelector(`[data-month="${selectedMonth}"]`);
  if (btn instanceof HTMLElement) {
    btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
}, []); // eslint-disable-line react-hooks/exhaustive-deps
```

**Container da timeline** (linha ~189):
```tsx
<div ref={monthNavRef} className="flex items-center border-b border-forest/10 pb-5 overflow-x-auto no-scrollbar scroll-smooth mb-8 md:mb-10 md:pb-6">
```

**Botões de mês** (linhas ~191-205):
```tsx
{monthKeys.map((month) => {
  const isSelected = selectedMonth === month;
  const isCurrentNotSelected = month === currentMonthKey && !isSelected;

  return (
    <button
      key={month}
      type="button"
      data-month={month}
      onClick={() => setSelectedMonth(month)}
      className={`group relative pb-4 text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all
        ${isSelected
          ? "text-forest scale-110"
          : isCurrentNotSelected
            ? "text-forest/60 border border-orange/40 rounded-full px-4 py-1 bg-orange/5"
            : "text-forest/40 hover:text-forest/60"}
      `}
    >
      {formatMonthLabel(month)}
      {isSelected && (
        <div className="absolute bottom-[-1px] left-0 h-[3px] w-full bg-orange" />
      )}
      {isCurrentNotSelected && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-[0.3em] text-orange/70 whitespace-nowrap">
          atual
        </span>
      )}
    </button>
  );
})}
```

---

## Verificação

1. `bun run check`
2. `bun run build`
3. Teste manual em `/agenda`:
   - Entrar na página → mês atual visível e selecionado.
   - Clicar em outro mês → mês atual ganha pill + badge "atual".
   - Clicar no mês atual → pill e badge somem (selecionado tem underline).
   - Scroll manual entre meses → transição suave.

---

## Não muda

- Query `eventosFuturosQuery`
- `getInitialMonth()` e `normalizeEventos()`
- Tipos, categorias, utilitários
- Animações GSAP
- Layout mobile — classes Tailwind são responsivas por natureza
