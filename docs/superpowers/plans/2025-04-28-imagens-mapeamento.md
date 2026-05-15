# Mapeamento de Imagens da Marca para Seções

## Imagens copiadas para `src/assets/images/brand/`

| Arquivo | Descrição | Seção | Uso |
|---------|-----------|-------|-----|
| `apresentacao-estudio-entre.jpg` | Mãe e filha com raios amarelos, outline laranja | **Sobre** | Imagem principal das fundadoras com recorte orgânico |
| `apresentacao-estudio-entre-2.jpg` | Thayná (perfil) — SUBURBANA FUTURISTA | **Sobre / Espaço** | Foto da fundadora no ambiente |
| `apresentacao-estudio-entre-3.jpg` | Valdete (perfil) — EDUCADORA BAILARINA | **Sobre / Espaço** | Foto da fundadora no ambiente |
| `apresentacao-estudio-entre-4.jpg` | Estante de livros do espaço | **Pilares > Biblioterapia** ou **Espaço** | Ambiente físico |
| `apresentacao-estudio-entre-5.jpg` | Mãe e filha sentadas — CTA | **Hero** (background sutil) ou **Contato/Footer** | CTA "Entre com a gente" |
| `onde-a-palavra-vira-encontro.jpg` | Tagline com halftone, fundo terracota | **Hero** ou **Pilares > Encontros** | Elemento de impacto visual |
| `sobre-estudio-entre.jpg` | Sofá com halftone — espaço cultural | **Pilares > Estúdio** | Representação do espaço físico |
| `sobre-estudio-entre-2.jpg` | Livro aberto com halftone | **Pilares > Biblioterapia** | Representação de leitura |
| `sobre-estudio-entre-3.jpg` | Microfone + mão com notas | **Pilares > Palestras** | Representação de áudio/palestras |
| `sobre-estudio-entre-4.jpg` | Interrogações — "Afinal, o que é?" | **Sobre** (transição) | Elemento de curiosidade/engajamento |

## Decisões de design

### Hero
- Manter logo + chave como elementos principais
- Usar `onde-a-palavra-vira-encontro.jpg` ou `apresentacao-estudio-entre-5.jpg` como **background layer** com opacidade muito baixa (0.05-0.08) ou como textura sutil
- Elementos decorativos flutuantes (raios, estrelas) por cima

### Sobre
- Substituir a imagem atual (`estudio-entre-3.png`) por `apresentacao-estudio-entre.jpg`
- Aplicar **BlobMask variant 3** no recorte da foto
- Manter a textura halftone sutil ao redor
- Adicionar `sobre-estudio-entre-4.jpg` como elemento secundário de curiosidade

### Pilares (nova seção)
Cada pilar terá uma **imagem de fundo** com halftone + máscara orgânica:

1. **Biblioterapia** (terracota): `sobre-estudio-entre-2.jpg` (livro aberto)
2. **Oficinas** (lilás): `onde-a-palavra-vira-encontro.jpg`
3. **Palestras** (cyan): `sobre-estudio-entre-3.jpg` (microfone)
4. **Estúdio** (amarelo): `sobre-estudio-entre.jpg` (sofá)
5. **Encontros** (laranja): `apresentacao-estudio-entre-4.jpg` (estante)

As imagens aparecerão como **background com máscara orgânica** ou como **elemento lateral** dentro de cada faixa, com tratamento halftone.

### Espaço
- Usar `apresentacao-estudio-entre-2.jpg` e `apresentacao-estudio-entre-3.jpg` nas fotos da galeria
- Manter as imagens atuais do Sanity também
- Adicionar máscaras orgânicas e overlay halftone

### Contato / Footer
- `apresentacao-estudio-entre-5.jpg` como background sutil do contato ou elemento decorativo
