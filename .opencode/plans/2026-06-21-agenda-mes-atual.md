# Agenda — Timeline de Meses com Hierarquia Visual Reforçada: Plano de Implementação

> **Para agentes de implementação:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Passos usam checkbox (`- [ ]`) para tracking.

**Goal:** Reformular a timeline de meses da página Agenda com hierarquia visual de 3 níveis (selecionado > atual > demais), badge "atual" e scroll automático ao carregar.

**Architecture:** Mudança localizada em `AgendaPageFilter.tsx` — nova constante de módulo, novo ref, novo useEffect, e refatoração condicional do JSX dos botões de mês.

**Tech Stack:** React 19 + TypeScript + Tailwind CSS v4

---

### Task 1: Adicionar constante de módulo, ref e useEffect de scroll

**Files:**
- Modify: `src/components/islands/AgendaPageFilter.tsx:56-82`

- [ ] **Step 1: Adicionar `currentMonthKey` como constante de módulo**

Após a definição de `getCurrentMesKey()` (linha ~56), adicionar:

```ts
const currentMonthKey = getCurrentMesKey();
```

- [ ] **Step 2: Adicionar ref para o container da timeline**

Dentro do componente `AgendaPageFilter`, após `const containerRef = useRef<HTMLDivElement>(null)` (linha ~81):

```tsx
const monthNavRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 3: Adicionar useEffect de scroll automático**

Após o `useEffect` existente que reseta `expandedCards` (linha ~162), adicionar:

```tsx
useEffect(() => {
  if (!monthNavRef.current) return;
  const btn = monthNavRef.current.querySelector(`[data-month="${selectedMonth}"]`);
  if (btn instanceof HTMLElement) {
    btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
}, []); // eslint-disable-line react-hooks/exhaustive-deps
```

- [ ] **Step 4: Rodar check e build para verificar que não quebrou**

```bash
bun run check && bun run build
```

Esperado: check limpo, build sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/components/islands/AgendaPageFilter.tsx
git commit -m "feat(agenda): adicionar scroll automático para mês selecionado ao carregar"
```

---

### Task 2: Reformular botões de mês com hierarquia de 3 níveis

**Files:**
- Modify: `src/components/islands/AgendaPageFilter.tsx:189-207`

- [ ] **Step 1: Substituir o container da timeline com ref e scroll-smooth**

Substituir a div na linha ~189:

De:
```tsx
<div className="flex items-center border-b border-forest/10 pb-5 overflow-x-auto no-scrollbar mb-8 md:mb-10 md:pb-6">
```

Para:
```tsx
<div ref={monthNavRef} className="flex items-center border-b border-forest/10 pb-5 overflow-x-auto no-scrollbar scroll-smooth mb-8 md:mb-10 md:pb-6">
```

- [ ] **Step 2: Substituir o mapeamento de botões com hierarquia de 3 níveis**

Substituir o bloco `{monthKeys.map((month) => (...))}` (linhas ~191-205):

De:
```tsx
{monthKeys.map((month) => (
  <button
    key={month}
    type="button"
    onClick={() => setSelectedMonth(month)}
    className={`group relative pb-4 text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all
      ${selectedMonth === month ? "text-forest scale-110" : "text-forest/25 hover:text-forest/50"}`}
  >
    {formatMonthLabel(month)}
    <div
      className={`absolute bottom-[-1px] left-0 h-[3px] w-full bg-orange transition-transform duration-500
        ${selectedMonth === month ? "scale-x-100" : "scale-x-0 group-hover:scale-x-30"}`}
    />
  </button>
))}
```

Para:
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

- [ ] **Step 3: Rodar check e build**

```bash
bun run check && bun run build
```

Esperado: check limpo, build sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/components/islands/AgendaPageFilter.tsx
git commit -m "feat(agenda): hierarquia visual de 3 níveis na timeline de meses com badge 'atual'"
```

---

### Task 3: Verificação final

- [ ] **Step 1: Rodar check e build uma última vez**

```bash
bun run check && bun run build
```

- [ ] **Step 2: Checklist de verificação manual (em `/agenda`)**

- [ ] Entrar na página → mês atual visível e selecionado (scroll centralizado)
- [ ] Clicar em outro mês → mês atual ganha pill laranja + badge "atual"
- [ ] Clicar no mês atual → pill e badge somem, underline laranja aparece
- [ ] Verificar que meses não selecionados estão legíveis (40% opacidade)
- [ ] Testar em viewport mobile (375px) — scroll horizontal e badge visíveis
- [ ] Verificar `prefers-reduced-motion` — scrollIntoView com `behavior: "smooth"` é respeitado pelo navegador

---

### Resumo de mudanças

| Alteração | Linhas |
|-----------|--------|
| Constante `currentMonthKey` | +1 |
| Ref `monthNavRef` | +1 |
| `useEffect` scroll | +7 |
| Container com `ref` + `scroll-smooth` | ~1 (modificada) |
| Botões com 3 níveis + badge + `data-month` | ~25 (modificadas) |
| **Total** | **~35 linhas** |
