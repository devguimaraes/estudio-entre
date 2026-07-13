import { describe, expect, test } from "bun:test";
import {
  espacosLocaveis,
  exposicoesResidentes,
  locacaoContato,
  locacaoHero,
  locacaoSeo,
  locacaoSobre,
  locacaoStats,
  mensagensWhatsApp,
  parcerias,
  tabelaValoresResumo,
} from "@/content/locacao";
import { buildWaLink } from "@/utils/whatsapp";

describe("locacao content", () => {
  test("cobre os 4 EspaçosLocáveis com capacidade e tarifas", () => {
    expect(espacosLocaveis).toHaveLength(4);
    const nomes = espacosLocaveis.map((e) => e.nome);
    expect(nomes).toEqual([
      "Sala Expositiva Multidisciplinar",
      "Sala Multidisciplinar — 2º Pavimento",
      "Estúdio de Podcast",
      "Espaço Completo",
    ]);

    const salaExpositiva = espacosLocaveis[0];
    expect(salaExpositiva.capacidade).toBe(20);
    expect(salaExpositiva.tarifas.hora).toBe(80);
    expect(salaExpositiva.tarifas.turno).toBe(300);
    expect(salaExpositiva.tarifas.diaria).toBe(500);

    const espacoCompleto = espacosLocaveis[3];
    expect(espacoCompleto.capacidade).toBe(50);
    expect(espacoCompleto.tarifas.hora).toBeNull();
    expect(espacoCompleto.tarifas.turno).toBeNull();
    expect(espacoCompleto.tarifas.diaria).toBe(600);
  });

  test("Estúdio de Podcast indica edição de áudio à parte", () => {
    const podcast = espacosLocaveis.find((e) => e.id === "estudio-podcast");
    expect(podcast?.observacoes).toContain(
      "Edição de áudio é serviço à parte, negociado direto com o operador conforme demanda.",
    );
  });

  test("Espaço Completo indica captação de vídeo não inclusa", () => {
    const completo = espacosLocaveis.find((e) => e.id === "espaco-completo");
    expect(completo?.observacoes?.some((o) => o.includes("Captação de vídeo"))).toBe(true);
  });

  test("SEO da página /locacao tem title e description dedicados", () => {
    expect(locacaoSeo.title).toContain("Locação");
    expect(locacaoSeo.description.length).toBeGreaterThan(40);
  });

  test("hero expõe CTAs comercial WhatsApp e âncora #espacos", () => {
    expect(locacaoHero.ctaPrimarioLabel).toBeTruthy();
    expect(locacaoHero.ctaSecundarioLabel).toBeTruthy();
    expect(locacaoHero.ctaSecundarioAnchor).toBe("#espacos");
    expect(buildWaLink(locacaoHero.ctaPrimario)).toContain("wa.me/5521973101451");
  });

  test("bloco Sobre tem texto institucional para a página", () => {
    expect(locacaoSobre.eyebrow).toBeTruthy();
    expect(locacaoSobre.titulo).toBeTruthy();
    expect(locacaoSobre.texto.length).toBeGreaterThan(40);
  });

  test("stats do bloco Sobre cobrem capacidade, preço e suporte", () => {
    expect(locacaoStats).toHaveLength(4);
    const valores = locacaoStats.map((s) => s.valor);
    expect(valores).toContain("20");
    expect(valores).toContain("50");
    expect(valores).toContain("R$80");
    expect(valores).toContain("100%");
  });

  test("tabela resumo espelha tarifas dos espaços", () => {
    expect(tabelaValoresResumo).toHaveLength(4);
    expect(tabelaValoresResumo[0]).toMatchObject({
      nome: "Sala Expositiva Multidisciplinar",
      capacidade: 20,
      hora: 80,
      turno: 300,
      diaria: 500,
    });
    expect(tabelaValoresResumo[3]).toMatchObject({
      nome: "Espaço Completo",
      capacidade: 50,
      hora: null,
      turno: null,
      diaria: 600,
    });
  });

  test("exposições residentes descreve duração, abertura e contrato", () => {
    expect(exposicoesResidentes.titulo).toBeTruthy();
    expect(exposicoesResidentes.texto).toContain("1 mês");
    expect(exposicoesResidentes.texto).toContain("contrato");
    expect(exposicoesResidentes.imagem.src).toBe("/images/locacao/exposicoes.webp");
  });

  test("dois modelos de Parceria conforme spec", () => {
    expect(parcerias).toHaveLength(2);
    expect(parcerias.map((p) => p.titulo)).toEqual([
      "Cocriação de Atividades",
      "Parceria com Criadores de Conteúdo",
    ]);
  });

  test("contato usa e-mail canônico e endereço do Estúdio", () => {
    expect(locacaoContato.email).toBe("contato@estudioentre.com.br");
    expect(locacaoContato.endereco).toContain("Rua Maria Calmon, 100");
    expect(locacaoContato.whatsapp).toBe("5521973101451");
  });

  test("templates WhatsApp geram links wa.me com contexto", () => {
    const heroUrl = buildWaLink(mensagensWhatsApp.hero);
    expect(heroUrl).toContain("https://wa.me/5521973101451?text=");

    const espacoUrl = buildWaLink(mensagensWhatsApp.espaco("Sala Expositiva Multidisciplinar"));
    expect(decodeURIComponent(espacoUrl)).toContain("Sala Expositiva Multidisciplinar");

    const exposicaoUrl = buildWaLink(mensagensWhatsApp.exposicao);
    expect(decodeURIComponent(exposicaoUrl)).toContain("exposição");

    const parceriaUrl = buildWaLink(mensagensWhatsApp.parceria("Cocriação de Atividades"));
    expect(decodeURIComponent(parceriaUrl)).toContain("Cocriação de Atividades");
  });

  test("cada EspaçoLocável gera link WhatsApp com nome do espaço", () => {
    for (const espaco of espacosLocaveis) {
      const url = buildWaLink(mensagensWhatsApp.espaco(espaco.nome));
      expect(url).toContain("wa.me/5521973101451");
      expect(decodeURIComponent(url)).toContain(espaco.nome);
    }
  });

  test("cada espaço referencia imagem WebP em assets públicos", () => {
    for (const espaco of espacosLocaveis) {
      expect(espaco.imagem.src).toMatch(/^\/images\/locacao\/[\w-]+\.webp$/);
      expect(espaco.imagem.alt.length).toBeGreaterThan(0);
    }
  });
});
