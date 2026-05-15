# Relatório de limpeza e sanitização - 2026-05-15

## Estado inicial do repositório

```text
## feature/cleanup-sanitization
?? docs/superpowers/reports/

7936035 fix(lint): preserve agenda filter animation dependencies
78e7714 fix(lint): restore biome baseline
7ebac5a docs(cleanup): add sanitization implementation plan
e973aad docs(cleanup): document project sanitization design
c8cf50c feat(ui): refine homepage flow, update operating hours and enhance gallery and contact sections
```

## Worktrees antes da limpeza

```text
/home/devguimaraes/Projetos/estudio-entre/estudio-entre                                  7ebac5a [develop]
/home/devguimaraes/Projetos/estudio-entre/estudio-entre/.worktrees/cleanup-sanitization  7936035 [feature/cleanup-sanitization]
/home/devguimaraes/Projetos/estudio-entre/estudio-entre/.worktrees/m2-hero-sobre-eixos   1b0a6d3 [feature/m2-hero-sobre-eixos]
/home/devguimaraes/Projetos/estudio-entre/estudio-entre/.worktrees/redesign-layout       20a9c97 [feature/redesign-layout]
```

### `/home/devguimaraes/Projetos/estudio-entre/estudio-entre/.worktrees/m2-hero-sobre-eixos`

```text
## feature/m2-hero-sobre-eixos...origin/feature/m2-hero-sobre-eixos
 M astro.config.mjs
 M src/animations/agenda.ts
 M src/animations/colorTransition.ts
 M src/animations/contato.ts
 M src/animations/cursor.ts
 M src/animations/eixos.ts
 M src/animations/espaco.ts
 M src/animations/footer.ts
 M src/animations/hero.ts
 M src/animations/init.ts
 M src/animations/navbar.ts
 M src/animations/sobre.ts
 M src/components/islands/AgendaFilter.tsx
 M src/components/islands/ContatoForm.tsx
 M src/components/islands/EventCard.module.css
 M src/components/islands/EventCard.tsx
 M src/components/islands/GaleriaEspaco.tsx
 M src/components/islands/Lightbox.tsx
 M src/layouts/BaseLayout.astro
 M src/pages/api/contato.ts
 M src/pages/index.astro
 M src/sanity/schema/index.ts
 M src/styles/global.css
?? .codex
?? docs/NOTAS-OTIMIZACAO-IMAGENS.md

1b0a6d3 fix: corrigir hash links, reduced motion e fallback de imagem
c825511 feat(footer): implementar rodapé com logo, navegação, contato e redes sociais
83576a2 feat(contato): implementar seção de contato com formulário, WhatsApp e redes sociais
```

### `/home/devguimaraes/Projetos/estudio-entre/estudio-entre/.worktrees/redesign-layout`

```text
## feature/redesign-layout...origin/feature/redesign-layout

20a9c97 fix(agenda): align home and month labels with event timezone
e9b3c8f fix(agenda): keep global navigation links working
659129d feat(agenda): link navigation to agenda page
```

## Maiores arquivos e pastas antes da limpeza

```text
71M	src/assets
49M	src/assets/mockups
26M	public
20M	src/assets/mockups/Mockup_Placa.png
19M	public/images
16M	public/images/brand
15M	src/assets/textures
15M	src/assets/mockups/Mockup_Agenda.png
14M	docs
13M	docs/Guia_Estudio Entre.pdf
6.7M	src/assets/mockups/Mockup_Carimbo.png
5.6M	public/textures
5.5M	src/assets/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp
5.5M	public/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp
4.2M	src/assets/textures/abstract-grey-concrete-texture-background-top-view.webp
3.5M	src/assets/mockups/Mockup_Bloquinho.png
3.3M	src/assets/images
3.1M	src/assets/textures/dirty-photocopy-gray-paper-texture-background.webp
3.0M	src/assets/mockups/Mockup_Cartao de Visitas.png
2.7M	public/images/brand/espaco-sala.jpg
2.7M	public/images/brand/espaco-hub.jpg
2.5M	public/images/brand/espaco-detalhe-arte.jpg
2.4M	public/images/espaco
2.3M	public/images/brand/espaco-salao.jpg
1.8M	src/assets/logos
1.5M	src/assets/textures/old-paper-vintage-texture-surface-background-recycle-pale-brown-paper-crumpled-texture.webp
1.5M	src/assets/fonts
1.4M	src/assets/images/brand
1.2M	src/assets/fonts/[PRINCIPAL] Buvera
1.2M	public/images/brand/fundadoras-2026.jpg
1.1M	public/images/brand/espaco-estudio.jpg
1.1M	public/images/brand/detalhe-afeto.jpg
1004K	src/assets/mockups/Mockup_Sacola de Papel.png
988K	public/logos
876K	src/assets/textures/industrial-style-white-corrugated-cardboard-texture-background.webp
732K	src/assets/images/estudio-entre-3.png
528K	public/fonts
484K	public/fonts/[PRINCIPAL] Buvera
456K	src/assets/icons
384K	docs/superpowers
348K	public/icons
280K	public/images/espaco/7.webp
248K	docs/superpowers/plans
240K	src/assets/logos/Logo_Estudio Entre - Vinho 1.png
240K	public/logos/logo-hero.png
240K	public/logos/logo-hero-vinho.png
240K	public/logos/logo-estudio-entre-vinho.png
236K	src/assets/logos/Logo_Estudio Entre - Preto 1.png
232K	src/assets/logos/Logo_Estudio Entre - Claro 1.png
196K	src/assets/fonts/Helony - Cursiva do Logo
192K	src/assets/logos/Logo_Estudio Entre - Vinho 3.png
192K	src/assets/logos/Logo_Estudio Entre - Preto 3.png
192K	src/assets/fonts/Helony - Cursiva do Logo/Helony.otf
188K	src/assets/logos/Logo_Estudio Entre - Claro 3.png
188K	src/assets/images/Feed_Editorias_Estúdio Entre - Voo Literario.webp
188K	public/images/sobre-placeholder-1.webp
184K	src/assets/logos/Logo_Estudio Entre - Vinho 2.png
180K	src/assets/logos/Logo_Estudio Entre - Preto 2.png
180K	src/assets/logos/Logo_Estudio Entre - Claro 2.png
180K	public/logos/logo-estudio-entre-claro.png
```

## Referências a assets no código

```text
                src="/icons/play.svg"
import imgCultura from "@/assets/images/Feed_Editorias_Estúdio Entre - Oficinas.webp";
import imgProducao from "@/assets/images/Feed_Editorias_Estúdio Entre - Palestras.webp";
        <img src="/icons/olho.svg" class="w-8 h-8 invert opacity-50" alt="" />
        <img src="/icons/microfone.svg" class="w-8 h-8 invert opacity-50" alt="" />
import texturePaper from "@/assets/textures/old-paper-vintage-texture-surface-background-recycle-pale-brown-paper-crumpled-texture.webp";
  { src: "/images/espaco/v2-meier-02.webp", alt: "Acesso e Acolhimento" },
  { src: "/images/espaco/v2-meier-03.webp", alt: "Nossa Estrutura" },
  { src: "/images/espaco/v2-meier-04.webp", alt: "Arte no Méier" },
  { src: "/images/espaco/estudio-entre-salao.webp", alt: "O Hub" },
import texturePaper from "@/assets/textures/old-paper-vintage-texture-surface-background-recycle-pale-brown-paper-crumpled-texture.webp";
                <img src="/icons/instagram.svg" class="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all duration-500" alt="" />
                <img src="/icons/tiktok.svg" class="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all duration-500" alt="" />
                <img src="/icons/whatsapp.svg" class="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all duration-500" alt="" />
    src: "/images/brand/apresentacao-estudio-entre.jpg",
    src: "/images/brand/apresentacao-estudio-entre-2.jpg",
    src: "/images/brand/apresentacao-estudio-entre-3.jpg",
    src: "/images/brand/apresentacao-estudio-entre-4.jpg",
    src: "/images/brand/apresentacao-estudio-entre-5.jpg",
          src="/logos/logo-hero-vinho.png"
        <img src="/icons/spark.svg" class="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" alt="" />
    icon: "/icons/olho.svg",
    icon: "/icons/spark.svg",
    icon: "/icons/microfone.svg",
    icon: "/icons/play.svg",
    icon: "/icons/pin.svg",
import logoClaro from "@/assets/logos/Logo_Estudio Entre - Claro 1.png";
              <img src="/icons/instagram.svg" class="w-5 h-5 invert opacity-60 group-hover:opacity-100 transition-all duration-500" alt="" />
              <img src="/icons/tiktok.svg" class="w-5 h-5 invert opacity-60 group-hover:opacity-100 transition-all duration-500" alt="" />
              <img src="/icons/whatsapp.svg" class="w-5 h-5 invert opacity-60 group-hover:opacity-100 transition-all duration-500" alt="" />
              <img src="/icons/gmb.svg" class="w-5 h-5 invert opacity-60 group-hover:opacity-100 transition-all duration-500" alt="" />
    src: "/images/espaco/v2-meier-02.webp",
    src: "/images/espaco/v2-meier-03.webp",
    src: "/images/espaco/v2-meier-04.webp",
    src: "/images/espaco/img_0811.webp",
    src: "/images/espaco/img_0876.webp",
    src: "/images/espaco/apresentacao-estudio-entre.webp",
    src: "/images/espaco/apresentacao-no-estudio-entre.webp",
    src: "/images/espaco/art-logo-estudio-entre.webp",
    src: "/images/espaco/entre-palavras-e-afeto-estudio-entre.webp",
    src: "/images/espaco/estudio-entre-salao.webp",
    src: "/images/espaco/exposicao-estudio-entre.webp",
    src: "/images/espaco/exposicao-tapecaria-estudio-entre.webp",
    src: "/images/espaco/exposicao2-estudio-entre.webp",
    src: "/images/espaco/sala-estudio-entre.webp",
    src: "/images/espaco/salao-estudio-entre.webp",
    src: "/images/espaco/som-estudio-entre.webp",
    src: "/images/espaco/tapecaria-logo-estudio-entre.webp",
    src: "/images/espaco/tapecaria-logo-vertical-estudio-entre.webp",
    icon: "/icons/olho.svg",
    icon: "/icons/microfone.svg",
    icon: "/icons/calendario.svg",
    icon: "/icons/play.svg",
    icon: "/icons/pin.svg",
    icon: "/icons/spark.svg",
  <div class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style="background-image: url('https://www.transparenttextures.com/patterns/felt.png');"></div>
      <img src="/icons/olho.svg" alt="" width="48" height="34" aria-hidden="true" />
    icon: "/icons/instagram.svg",
  { href: "https://tiktok.com/@entrenoestudio", icon: "/icons/tiktok.svg", label: "TikTok" },
  { href: "https://wa.me/5521973101451", icon: "/icons/whatsapp.svg", label: "WhatsApp" },
            src="/logos/logo-estudio-entre-claro.png"
  { src: "/images/brand/apresentacao-estudio-entre.jpg", alt: "Espaço do Estúdio Entre" },
  { src: "/images/brand/apresentacao-estudio-entre-2.jpg", alt: "Thayná no Estúdio Entre" },
  { src: "/images/brand/apresentacao-estudio-entre-3.jpg", alt: "Encontros no Estúdio Entre" },
  { src: "/images/brand/apresentacao-estudio-entre-4.jpg", alt: "Valdete no Estúdio Entre" },
  { src: "/images/brand/apresentacao-estudio-entre-5.jpg", alt: "Detalhes do Estúdio Entre" },
                    <img src="/icons/chave.svg" className="w-20 opacity-10" alt="" />
                                <img src="/icons/chave.svg" className="w-16 opacity-10" alt="" />
  ogImage = "/og-default.png",
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      href="/fonts/[PRINCIPAL] Buvera/Buvera-Black.woff2"
      href="/fonts/[PRINCIPAL] Buvera/Buvera-Bold.woff2"
@import "./fonts/fonts.css";
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-VF.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-Black.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-BlackItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-Bold.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-BoldItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-ExtraBold.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-ExtraBoldItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-Medium.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-MediumItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-Regular.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-RegularItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-SemiBold.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-SemiBoldItalic.woff2") format("woff2");
  src: url("/fonts/Dongra - Cursiva Extra Teste/Dongra Script.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-Black.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-BlackItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-Bold.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-BoldItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-ExtraBold.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-ExtraBoldItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-Medium.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-MediumItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-Regular.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-RegularItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-SemiBold.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-SemiBoldItalic.woff2") format("woff2");
  src: url("/fonts/[PRINCIPAL] Buvera/Buvera-VF.woff2") format("woff2");
  src: url("/fonts/Dongra - Cursiva Extra Teste/Dongra Script.woff2") format("woff2");
```

## Duplicatas exatas por hash em assets

```text

51356fda06e9d7faebebad75373d582b9eeead8ace5a0a8f614c5d54b8786165  public/icons/microfone.svg
51356fda06e9d7faebebad75373d582b9eeead8ace5a0a8f614c5d54b8786165  src/assets/icons/microfone.svg


792daa94100cab661a65154223e01561d4dc42b57309efbb09e2bd55171efa7e  public/icons/fone.svg
792daa94100cab661a65154223e01561d4dc42b57309efbb09e2bd55171efa7e  src/assets/icons/fone.svg


6616283e3dea6d415784867e3b355961bff4f65ba1fcc17e5c6434417bcf9f22  public/images/brand/sobre-estudio-entre.jpg
6616283e3dea6d415784867e3b355961bff4f65ba1fcc17e5c6434417bcf9f22  src/assets/images/brand/sobre-estudio-entre.jpg


8e1a755e0a70d69f63663fd22c2cb109b204d1c487b500152bb675ff7c8a7925  public/icons/play.svg
8e1a755e0a70d69f63663fd22c2cb109b204d1c487b500152bb675ff7c8a7925  src/assets/icons/play.svg


c655866c86efa1e0e32b482ba2aa8e6cd5765fe72a029f51e6ac337bc7ce2f8e  public/icons/tiktok.svg
c655866c86efa1e0e32b482ba2aa8e6cd5765fe72a029f51e6ac337bc7ce2f8e  src/assets/icons/tik-tok.svg


b9e1bb3b54434d378a385902a34a380933b5db4b3f56d4fe46c5373e0ead0250  public/images/sobre-placeholder-1.webp
b9e1bb3b54434d378a385902a34a380933b5db4b3f56d4fe46c5373e0ead0250  src/assets/images/Feed_Editorias_Estúdio Entre - Voo Literario.webp


3cf46f6f6196b2b534edcabd442c82f9c91a779b8a6ab7625644f2fe94cd1d00  public/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp
3cf46f6f6196b2b534edcabd442c82f9c91a779b8a6ab7625644f2fe94cd1d00  src/assets/textures/vertical-banner-social-media-flyers-posters-online-ads-brochures-digital-presentations-etc.webp


10f34e1c25ad6d3a8a3153ffc349aa2325b350bd11a355be853f44bc5705d3ce  public/images/brand/sobre-estudio-entre-4.jpg
10f34e1c25ad6d3a8a3153ffc349aa2325b350bd11a355be853f44bc5705d3ce  src/assets/images/brand/sobre-estudio-entre-4.jpg


4474997591f99eb69a3d935d7714cccd83a320c6e89e9389f9ab64878e6425a5  public/icons/fechadura.svg
4474997591f99eb69a3d935d7714cccd83a320c6e89e9389f9ab64878e6425a5  src/assets/icons/fechadura.svg


1115331e9eedce6c20071777d7949bb69fdc68c84613d56978d04890ef78ff93  public/logos/logo-estudio-entre-claro.png
1115331e9eedce6c20071777d7949bb69fdc68c84613d56978d04890ef78ff93  src/assets/logos/Logo_Estudio Entre - Claro 2.png


58e111f958142b360f4548119bf1604d38f0d9062e08fcd595d9806c46b85a6b  public/logos/logo-estudio-entre-vinho.png
58e111f958142b360f4548119bf1604d38f0d9062e08fcd595d9806c46b85a6b  public/logos/logo-hero-vinho.png
58e111f958142b360f4548119bf1604d38f0d9062e08fcd595d9806c46b85a6b  public/logos/logo-hero.png
58e111f958142b360f4548119bf1604d38f0d9062e08fcd595d9806c46b85a6b  src/assets/logos/Logo_Estudio Entre - Vinho 1.png


eb733ba7855e8bf46d8090975d472bd5a165882c062934f52b740c3dd63f4670  public/images/brand/espaco-hub.jpg
eb733ba7855e8bf46d8090975d472bd5a165882c062934f52b740c3dd63f4670  public/images/brand/espaco-sala.jpg


335cc01026c0209b5c96922215e488d028e16b1999d96ff00da3ce5d781f118b  public/images/brand/sobre-estudio-entre-3.jpg
335cc01026c0209b5c96922215e488d028e16b1999d96ff00da3ce5d781f118b  src/assets/images/brand/sobre-estudio-entre-3.jpg


5abb75f5645ca90e3f5017a0b274bd9225c98fcb779ba16d22c213c02ff286d0  public/images/brand/apresentacao-estudio-entre-4.jpg
5abb75f5645ca90e3f5017a0b274bd9225c98fcb779ba16d22c213c02ff286d0  public/images/brand/fundadora-detalhe.jpg
5abb75f5645ca90e3f5017a0b274bd9225c98fcb779ba16d22c213c02ff286d0  public/images/brand/fundadora-valdete.jpg
5abb75f5645ca90e3f5017a0b274bd9225c98fcb779ba16d22c213c02ff286d0  src/assets/images/brand/apresentacao-estudio-entre-4.jpg


62c9a509e80ec0418d5254fd89797755d186a44c3abac02c98f295136f827305  public/images/brand/apresentacao-estudio-entre-5.jpg
62c9a509e80ec0418d5254fd89797755d186a44c3abac02c98f295136f827305  public/images/brand/estudio-detalhes.jpg
62c9a509e80ec0418d5254fd89797755d186a44c3abac02c98f295136f827305  src/assets/images/brand/apresentacao-estudio-entre-5.jpg


28a2448495922ed128321bc8d148fff3836a2e2f6da6f216b8ebc02f5ca381a0  public/images/brand/apresentacao-estudio-entre.jpg
28a2448495922ed128321bc8d148fff3836a2e2f6da6f216b8ebc02f5ca381a0  public/images/brand/fundadoras-mae-filha.jpg
28a2448495922ed128321bc8d148fff3836a2e2f6da6f216b8ebc02f5ca381a0  src/assets/images/brand/apresentacao-estudio-entre.jpg


7f9d93719bcea1cabbc13bccc38d1a0f4387ee4a10d4b35e4433626cf7b69af2  public/icons/calendario.svg
7f9d93719bcea1cabbc13bccc38d1a0f4387ee4a10d4b35e4433626cf7b69af2  src/assets/icons/calendario.svg


f16a61bbab07d4a08d0313973b7781f8c79e5135e9c1257ab01f1265efbdb009  public/images/espaco/estudio-entre-salao.webp
f16a61bbab07d4a08d0313973b7781f8c79e5135e9c1257ab01f1265efbdb009  public/images/espaco/sala-estudio-entre.webp


f8ae438535cf156e96537375043fde1cc728c924dfaa8dcfb0c6349c60f0e09a  public/images/brand/apresentacao-estudio-entre-2.jpg
f8ae438535cf156e96537375043fde1cc728c924dfaa8dcfb0c6349c60f0e09a  public/images/brand/fundadora-thayna.jpg
f8ae438535cf156e96537375043fde1cc728c924dfaa8dcfb0c6349c60f0e09a  src/assets/images/brand/apresentacao-estudio-entre-2.jpg


93035429b806c8bf3696c5b5de008937271f4281918368f0d85cc69087305494  public/icons/spark.svg
93035429b806c8bf3696c5b5de008937271f4281918368f0d85cc69087305494  src/assets/icons/spark.svg


260581641c0c082015102e41f4d258af286ece8078d19bd8dd316361510ba1d8  public/icons/whatsapp.svg
260581641c0c082015102e41f4d258af286ece8078d19bd8dd316361510ba1d8  src/assets/icons/whatsapp.svg


8419a61f5dcfd09557624f78f474f4ac80e6540081d84c7012d6140fc4ee6e34  public/images/brand/apresentacao-estudio-entre-3.jpg
8419a61f5dcfd09557624f78f474f4ac80e6540081d84c7012d6140fc4ee6e34  public/images/brand/fundadoras-encontro.jpg
8419a61f5dcfd09557624f78f474f4ac80e6540081d84c7012d6140fc4ee6e34  src/assets/images/brand/apresentacao-estudio-entre-3.jpg


bf0b06dfda2d512da3cbe115049d364407671154df97ecde6a7d9d3a63066ea7  public/images/brand/sobre-estudio-entre-2.jpg
bf0b06dfda2d512da3cbe115049d364407671154df97ecde6a7d9d3a63066ea7  src/assets/images/brand/sobre-estudio-entre-2.jpg


e9719f2697d26534a9bd3f5866aced776283e1bf3abff62ba9693a565e0e1771  public/icons/pin.svg
e9719f2697d26534a9bd3f5866aced776283e1bf3abff62ba9693a565e0e1771  src/assets/icons/pin.svg


1d13d67e06526253a56871539d6961a5233a0fa4d8f1a2da547399f341cf66fd  public/icons/olho.svg
1d13d67e06526253a56871539d6961a5233a0fa4d8f1a2da547399f341cf66fd  src/assets/icons/olho.svg


7b855e15c3efaf489e9ebcb774795b6c657bc95509f982c45a7d2725c2470988  public/images/brand/onde-a-palavra-vira-encontro.jpg
7b855e15c3efaf489e9ebcb774795b6c657bc95509f982c45a7d2725c2470988  src/assets/images/brand/onde-a-palavra-vira-encontro.jpg

```

## Worktrees depois da limpeza

```text
/home/devguimaraes/Projetos/estudio-entre/estudio-entre                                  7ebac5a [develop]
/home/devguimaraes/Projetos/estudio-entre/estudio-entre/.worktrees/cleanup-sanitization  6799d8f [feature/cleanup-sanitization]
```

Worktrees removidos:
- `/home/devguimaraes/Projetos/estudio-entre/estudio-entre/.worktrees/m2-hero-sobre-eixos`
- `/home/devguimaraes/Projetos/estudio-entre/estudio-entre/.worktrees/redesign-layout`

## Arquivos versionados em src/assets/mockups

```text
src/assets/mockups/Mockup_Agenda.png
src/assets/mockups/Mockup_Bloquinho.png
src/assets/mockups/Mockup_Carimbo.png
src/assets/mockups/Mockup_Cartao de Visitas.png
src/assets/mockups/Mockup_Placa.png
src/assets/mockups/Mockup_Sacola de Papel.png
```

## Referências a mockups no código

```text
src/: nenhuma referência a Mockup_, src/assets/mockups ou @/assets/mockups

docs/: apenas menções no próprio relatório de auditoria (2026-05-15-cleanup-audit.md)
       e no plano de implementação (2026-05-15-limpeza-sanitizacao-projeto.md)
```

## Remoções de assets aplicadas

```text
Arquivos removidos (git rm):

src/assets/mockups/                          ~49 MB
  Mockup_Placa.png                            20 MB
  Mockup_Agenda.png                           15 MB
  Mockup_Carimbo.png                           6.7 MB
  Mockup_Bloquinho.png                         3.5 MB
  Mockup_Cartao de Visitas.png                 3.0 MB
  Mockup_Sacola de Papel.png                1004 KB

src/assets/textures/                          5.5 MB
  vertical-banner-social-media-flyers-...      5.5 MB
  (duplicata exata de public/textures/; sem referência em src/)

src/assets/images/brand/                      1.4 MB (10 arquivos)
  apresentacao-estudio-entre.jpg              (duplicatas exatas de public/images/brand/)
  apresentacao-estudio-entre-2.jpg
  apresentacao-estudio-entre-3.jpg
  apresentacao-estudio-entre-4.jpg
  apresentacao-estudio-entre-5.jpg
  sobre-estudio-entre.jpg
  sobre-estudio-entre-2.jpg
  sobre-estudio-entre-3.jpg
  sobre-estudio-entre-4.jpg
  onde-a-palavra-vira-encontro.jpg
  (sem qualquer import/referência @/assets/images/brand em src/)

Total aproximado removido: ~56 MB

Decisões:
1. mockups removidos — zero referências de runtime em src/.
2. texture duplicada removida — hash idêntico, sem import em src/.
3. brand images removidas de src/assets/images/brand/ — duplicatas exatas,
   sem import em src/; public/images/brand/ mantido (referências via /images/brand/...).
4. public/images/brand/ NÃO removido — usado em src/ via caminhos públicos /images/brand/.
```

## Validação pós-remoção

```text
bun run check: PASS
bun run build: PASS
git status --short --branch: limpo (após commit)
```

