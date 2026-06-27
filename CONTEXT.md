# CONTEXT.md — Glossário de Domínio

Glossário canônico do **Estúdio Entre**. Define a linguagem do negócio, não a implementação.

---

## Identidade

### Estúdio Entre

Hub Cultural Independente localizado na Rua Maria Calmon, 100 — Méier, Rio de Janeiro.
"Entre palavras, entre pessoas, é só entrar."

Ver também: [[Entre]], [[Espaço]], [[Eixos]].

### Entre

Conceito central da experiência: o usuário "entra" no Estúdio — não "acessa um site".
A travessia é o convite. A marca vive no espaço entre: entre livros e beats, entre cultura e cuidado, entre o analógico e o digital.

Ver também: [[Estúdio Entre]].

---

## Estrutura do Negócio

### Eixos

Os dois eixos estratégicos que organizam todos os serviços do Estúdio Entre.

Ver também: [[Eixo 1 - Cultura, Ensino e Cuidado]], [[Eixo 2 - Produção, Áudio e Conteúdo]].

### Eixo 1 — Cultura, Ensino e Cuidado

Serviços voltados para encontro, formação e bem-estar:

- **Biblioterapia** — mediação afetiva pela literatura. Rodas de leitura guiada conduzidas por profissional especializado. Não é terapia clínica.
- **Oficinas Criativas** — oficinas práticas de leitura, escrita, escuta e processos de criação. Linguagem acessível, foco em experiência.
- **Sarau** — chamada aberta para artistas de música, poesia, literatura, performance e experimentação. Sem classificação de estilo.
- **Encontros "Entre ao Vivo"** — série de ocupação progressiva do [[Espaço]] antes da inauguração. Música, conversa, bar aberto. Ingresso gratuito com contribuição colaborativa.
- **Exposição** — mostras com texto curatorial, ficha técnica e galeria de imagens. Ver [[Exposição]].
- **Palestras** — eventos de palestra no espaço.

Ver também: [[Eixos]], [[Eixo 2 - Produção, Áudio e Conteúdo]], [[Exposição]], [[Evento]].

### Eixo 2 — Produção, Áudio e Conteúdo

Serviços voltados para criação e produção sonora:

- **Gravação de Podcasts e Entrevistas** — estrutura profissional para gravação de podcasts, entrevistas e programas de conversa.
- **DJ Sessions e Audições** — sets de DJs e audições musicais como experiência de escuta crítica e experimentação sonora.
- **Produção e Pós de Áudio** — captação, edição e finalização de áudio para podcasts, entrevistas, registros de eventos e conteúdos musicais.

Ver também: [[Eixos]], [[Eixo 1 - Cultura, Ensino e Cuidado]].

### Serviço

Oferta contínua do negócio (ex: "o Estúdio oferece Biblioterapia"). Um [[Evento]] pode *materializar* um serviço em uma data específica.

Ver também: [[Evento]], [[Eixos]].

---

## Entidades

### Evento

Ocorrência com data, hora e local. É a *instância* de um [[Serviço]] ou atividade acontecendo.

Um Evento pertence a uma [[CategoriaEvento]] e é exibido na [[Agenda]].

Ver também: [[CategoriaEvento]], [[Agenda]], [[Serviço]], [[Exposição]].

### CategoriaEvento

Classificação de um [[Evento]]. Valores canônicos:

- `show`
- `oficina`
- `roda-de-conversa`
- `lancamento`
- `sarau`
- `exposicao`
- `biblioterapia`
- `dj-session`

Ver também: [[Evento]].

### Exposição

Entidade autônoma com texto curatorial, ficha técnica (artista, curadoria, técnica, apoio) e ciclo de vida próprio.
**Não é um tipo de [[Evento]]**, mesmo que a [[CategoriaEvento]] inclua `exposicao`.

Ciclo de vida: **em cartaz** (vigente), **futura** (anunciada), **passada** (encerrada).

Pode estar vinculada a um [[Álbum]] com fotos do período expositivo.

Ver também: [[Álbum]], [[Evento]], [[Eixo 1 - Cultura, Ensino e Cuidado]].

### Álbum

Coleção de fotos de um [[Evento]] ou [[Exposição]] que já aconteceu. Registro documental, não promocional.

Ver também: [[Galeria]], [[Exposição]], [[Evento]].

### Galeria

Termo genérico para qualquer conjunto visual de imagens. **Não é um termo canônico** — prefira [[Espaço]] (para fotos do imóvel) ou [[Álbum]] (para registro de eventos passados).

Ver também: [[Espaço]], [[Álbum]].

---

## Canais

### Agenda

Programação de [[Evento|Eventos]] futuros do Estúdio Entre. "Programação" é um label visual, não o termo canônico.

Ver também: [[Evento]], [[CategoriaEvento]].

### Espaço

O imóvel físico do Estúdio Entre na Rua Maria Calmon, 100 — Méier, Rio de Janeiro.
Fotos do ambiente, tour visual, informações de localização e horários de funcionamento.

Horários: quarta a sexta 10h–18h, sábado 10h–15h.

Ver também: [[Estúdio Entre]], [[Visitação]].

### Visitação

Ação de agendar uma visita presencial ao [[Espaço]]. Não é um [[Serviço]] dos [[Eixos]] — é uma funcionalidade transversal de conversão.

Ver também: [[Espaço]].

### Sebo

Catálogo de livros usados com curadoria do Estúdio Entre. Venda informal. Serviço do [[Eixo 1 - Cultura, Ensino e Cuidado]].

Ver também: [[Lojinha]], [[Eixo 1 - Cultura, Ensino e Cuidado]].

### Lojinha

Loja virtual de produtos oficiais do Estúdio Entre (camisetas, ecobags, etc.). E-commerce estruturado. Fonte de receita independente dos [[Eixos]].

Ver também: [[Sebo]].

---

## Marca

### A Chave

Símbolo central da marca. Cabeça com elemento de bússola/olho de quatro pontas. Cabo com três dentes, representando a tríade: Ensino, Coletividade, Acolhimento.
O "E" de Estúdio Entre está embutido no desenho.

Ver também: [[Estúdio Entre]], [[Entre]].

### Buvera

Família tipográfica exclusiva da marca. Usada em títulos, displays e no logotipo.

### Dongra Script

Fonte secundária cursiva. Usada para destaque na primeira letra "E" de "ENTRE" no [[Entre|conceito de travessia]].

### Personas

Perfis de público do Estúdio Entre:

- **Criador Local** (22–35 anos) — músico, DJ, escritor, poeta, performer. Busca espaço para criar.
- **Consumidor Cultural Independente** (25–45 anos) — frequenta eventos alternativos, estética indie, coletivos culturais.
- **Quem Busca Bem-Estar Criativo** (28–50 anos) — interessado em terapias alternativas não-clínicas, autoconhecimento.
- **Morador do Entorno** (18–60 anos) — curioso com o espaço novo no bairro.

Ver também: [[Estúdio Entre]].
