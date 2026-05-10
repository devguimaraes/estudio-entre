# Design Spec: CTA de Visitação — Estúdio Entre

**Data:** 2026-05-09  
**Status:** Em Revisão  
**Autor:** Gemini CLI  

## 1. Visão Geral
Substituir a seção atual `VooLiterario.astro` por uma nova seção de **CTA (Call to Action)** dedicada ao agendamento de visitas no Estúdio Entre. O objetivo é converter o interesse despertado pela galeria em uma ação concreta de visita presencial.

## 2. Requisitos de Conteúdo
- **Título:** "Visitação Estúdio Entre"
- **Informação de Horário:** "Quarta a Sábado // 10h às 17h30"
- **Link de Ação:** [Agendar via Google Calendar](https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Bz-jHECZ5xwuy54rjp7tWskG334TA1hZ2nhVdiHEF95oiUmFYkbJXeirsKMVFsNBxH7drQg4t)
- **Texto do Botão:** "Agendar minha visita"

## 3. Design Visual (Opção A - Mural Informativo)
### Cores e Estilos
- **Fundo:** Creme (`#f0ede8`)
- **Tipografia:** 
  - Título: **Buvera Black**, cor Bordô (`#3d1020`), uppercase.
  - Horários: **Buvera Regular/Medium**, cor Laranja (`#ec6838`), uppercase.
- **Moldura:** Uma borda interna fina (2px) em cor Bordô com opacidade 20%, criando um "respiro" editorial.
- **Botão:** Bordô sólido, cantos arredondados (full), texto em Creme.

### Componentes UI
- Novo componente: `src/components/sections/VisitacaoCTA.astro`
- Ícone decorativo: Símbolo da **Chave** (Logo) posicionado de forma discreta e elegante.

## 4. Animações (GSAP)
- **Revelação de Moldura:** As bordas da seção se desenham ao entrar no viewport (ScrollTrigger).
- **Fade-in Up:** O título e as informações de horário aparecem com um leve deslocamento vertical de baixo para cima.
- **Micro-interação do Botão:** Ao passar o mouse (hover), o botão aumenta levemente de escala e o ícone da chave rotaciona ou "brilha".

## 5. Critérios de Aceitação
- [ ] O link do Google Calendar deve abrir em uma nova aba.
- [ ] A seção deve ser responsiva, funcionando perfeitamente em mobile (empilhamento centralizado).
- [ ] As cores devem seguir rigorosamente o manual de identidade visual.
- [ ] A antiga seção `VooLiterario` deve ser removida do `index.astro`.
