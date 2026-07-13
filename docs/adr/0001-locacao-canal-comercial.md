# ADR 0001 — Locação como canal comercial

**Status:** Aceito  
**Data:** 2026-07-13

## Contexto

O site tinha [[Espaço]] (tour afetivo do imóvel na home) e [[Visitação]] (agendar visita cultural via Google Calendar), mas não um canal para aluguel comercial, exposições residentes ou parcerias com criadores.

## Decisão

1. **Locação** é um canal comercial **novo e distinto** de Espaço e Visitação.
2. Rota pública: `/locacao`.
3. Conteúdo tipado no repositório (sem Sanity nesta entrega) — mudanças via PR/deploy.
4. Conversão comercial via **WhatsApp** (`wa.me/5521973101451`) com mensagem pré-preenchida por contexto — não Google Calendar.
5. Navegação: grupo **Serviços** (O Entre / Programação / Serviços) com Locação ao lado de Sebo e Loja.
6. Tom de comunicação alinhado ao Espaço (travessia, acolhimento), sem hard-sell.

## Consequências

- Glossário ganha: Locação, EspaçoLocável, Parceria.
- Espaço e Visitação permanecem na home sem alteração de propósito.
- CMS para Locação fica fora de escopo até demanda editorial frequente.

## Alternativas consideradas

- **Evoluir Espaço** para incluir preços — rejeitado: mistura tour afetivo com comercial.
- **Sanity singleton** — adiado: conteúdo estável, edição infrequente.
- **Google Calendar na Locação** — rejeitado: visitação cultural ≠ negócio comercial.
