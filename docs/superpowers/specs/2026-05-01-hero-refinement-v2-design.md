# Hero Section Refinement — Logo, Imagem e CTAs

## Objetivo
Ajustar a hero section para destacar a logo, simplificar a imagem e adicionar segundo CTA.

## Mudanças

### 1. Logo
- Tamanho: `w-[40vw]` (proporcional ao viewport)
- Remover breakpoints fixos (`w-[240px] md:w-[320px]`)

### 2. Hierarquia de Texto
Ordem vertical:
1. Eyebrow: "Hub Cultural Independente · Méier, RJ"
2. Logo (40vw)
3. Tagline: "onde a palavra vira encontro."
4. CTAs (dois botões)

### 3. Imagem
- Remover `BlobMask`
- `<img>` direta com `rounded-2xl`
- Tamanho: `w-[35vw]` (proporcional à logo)
- Manter `object-cover` e `h-full`

### 4. CTAs
- Primário (existente): `bg-cream text-orange` — "Próximos encontros"
- Secundário (novo): `border-2 border-cream text-cream bg-transparent` com hover `bg-cream/10` — "Conheça o estúdio"

### 5. Animações
- Manter `animateHero()` — funciona com os novos tamanhos sem ajuste
- Reduzir delays de entrada dos elementos — atualmente demoram demais após animação inicial

## Arquivo
- `src/components/sections/Hero.astro`
- `src/animations/hero.ts`
