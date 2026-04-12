#!/usr/bin/env node

/**
 * Font CSS Generator
 *
 * Gera automaticamente arquivos CSS com @font-face
 * baseado nos dados de conversão de fontes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calcular raiz do projeto
const projectRoot = path.resolve(__dirname, '../../');

// ============ CONFIGURAÇÕES ============
const config = {
  conversionLogPath: path.resolve(__dirname, 'conversion-log.json'),
  cssOutputDir: path.resolve(projectRoot, 'src/styles/fonts'),
  publicFontsPath: '/fonts',
};

// ============ FUNÇÕES ============

/**
 * Carrega dados de conversão do log
 */
function loadConversionLog() {
  try {
    if (!fs.existsSync(config.conversionLogPath)) {
      console.error(chalk.red('❌ Log de conversão não encontrado!'));
      console.error(chalk.gray('Execute "npm run convert" primeiro'));
      process.exit(1);
    }

    const logData = JSON.parse(fs.readFileSync(config.conversionLogPath, 'utf-8'));
    return logData;
  } catch (error) {
    console.error(chalk.red('❌ Erro ao ler log de conversão:'), error.message);
    process.exit(1);
  }
}

/**
 * Agrupa fontes por família
 */
function groupByFamily(conversions) {
  const grouped = {};

  conversions.forEach((item) => {
    if (!grouped[item.family]) {
      grouped[item.family] = [];
    }
    grouped[item.family].push(item);
  });

  return grouped;
}

/**
 * Gera CSS @font-face para uma família de fontes
 */
function generateFontFaceCSS(family, fonts) {
  let css = `/**\n * ${family}\n * Auto-generated font declarations\n */\n\n`;

  fonts.forEach((font) => {
    const fontStyle = font.italic ? 'italic' : 'normal';
    const fontWeight = font.weight;
    const fontPath = `${config.publicFontsPath}/${font.outputPath}`;

    css += `@font-face {\n`;
    css += `  font-family: '${family}';\n`;
    css += `  src: url('${fontPath}') format('woff2');\n`;
    css += `  font-weight: ${fontWeight};\n`;
    css += `  font-style: ${fontStyle};\n`;
    css += `  font-display: swap;\n`;
    css += `  /* Original: ${font.originalFile} (${formatBytes(font.ttfSize)} → ${formatBytes(font.woff2Size)}) */\n`;
    css += `}\n\n`;
  });

  return css;
}

/**
 * Formata bytes para formato legível
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Gera arquivo CSS combinado com todas as fontes
 */
function generateCombinedFontCSS(groupedFonts) {
  let css = `/**
 * Auto-generated Font Face Declarations
 * Generated: ${new Date().toISOString()}
 *
 * Esta arquivo é gerado automaticamente pelo script convert-fonts
 * Não edite manualmente!
 */

/*
 * CSS Custom Properties (variáveis CSS) para uso fácil
 * Exemplo: font-family: var(--font-buvera);
 */
:root {\n`;

  // Gerar variáveis CSS
  for (const family of Object.keys(groupedFonts).sort()) {
    const cssVarName = family
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    css += `  --font-${cssVarName}: '${family}', sans-serif;\n`;
  }

  css += `}\n\n`;

  // Gerar @font-face para cada família
  for (const family of Object.keys(groupedFonts).sort()) {
    css += generateFontFaceCSS(family, groupedFonts[family]);
  }

  return css;
}

/**
 * Cria diretório se não existir
 */
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Salva arquivo CSS
 */
function saveCSS(filename, content) {
  try {
    ensureDirectory(config.cssOutputDir);
    const filePath = path.join(config.cssOutputDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
  } catch (error) {
    throw new Error(`Erro ao salvar ${filename}: ${error.message}`);
  }
}

/**
 * Função principal
 */
function main() {
  console.log(chalk.bold.cyan('\n🎨 GERADOR DE CSS @FONT-FACE'));
  console.log(chalk.gray('Criando declarações automáticas\n'));

  // Carregar dados de conversão
  console.log(chalk.yellow('📖 Carregando dados de conversão...'));
  const logData = loadConversionLog();

  if (logData.conversions.length === 0) {
    console.log(chalk.yellow('⚠️  Nenhuma fonte convertida encontrada!'));
    process.exit(0);
  }

  console.log(chalk.green(`✓ ${logData.conversions.length} fontes carregadas\n`));

  // Agrupar por família
  console.log(chalk.yellow('📊 Agrupando fontes por família...'));
  const groupedFonts = groupByFamily(logData.conversions);
  const familyCount = Object.keys(groupedFonts).length;
  console.log(chalk.green(`✓ ${familyCount} famílias de fontes identificadas\n`));

  // Gerar CSS combinado
  console.log(chalk.yellow('✍️  Gerando CSS...'));
  const combinedCSS = generateCombinedFontCSS(groupedFonts);
  const savedPath = saveCSS('fonts.css', combinedCSS);
  console.log(chalk.green(`✓ CSS gerado: ${chalk.cyan(savedPath)}\n`));

  // Gerar CSS individual para cada família (opcional)
  console.log(chalk.yellow('✍️  Gerando CSS individual por família...'));
  const individualFiles = [];
  for (const family of Object.keys(groupedFonts)) {
    const cssVarName = family
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    const filename = `_${cssVarName}.css`;
    const css = generateFontFaceCSS(family, groupedFonts[family]);
    const filePath = saveCSS(filename, css);
    individualFiles.push(filePath);
  }
  console.log(chalk.green(`✓ ${individualFiles.length} arquivo(s) individual(is) gerado(s)\n`));

  // Exibir resumo
  console.log(chalk.cyan('═'.repeat(60)));
  console.log(chalk.cyan('✅ CSS GERADO COM SUCESSO'));
  console.log(chalk.cyan('═'.repeat(60)));

  console.log(chalk.green('\n📝 Arquivos criados:'));
  console.log(chalk.cyan(`  • ${savedPath}`));
  individualFiles.forEach((file) => {
    console.log(chalk.cyan(`  • ${file}`));
  });

  console.log(chalk.green('\n💡 Como usar:'));
  console.log(chalk.gray('  // Em seu arquivo Astro/HTML:'));
  console.log(chalk.gray('  <link rel="stylesheet" href="/src/styles/fonts/fonts.css">'));
  console.log(chalk.gray(''));
  console.log(chalk.gray('  // Em seu CSS/Astro:'));
  console.log(chalk.gray('  body {'));
  console.log(chalk.gray('    font-family: var(--font-buvera);'));
  console.log(chalk.gray('  }'));

  console.log(chalk.green('\n🔗 Variáveis CSS disponíveis:'));
  Object.keys(groupedFonts)
    .sort()
    .forEach((family) => {
      const cssVarName = family
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      const variations = groupedFonts[family];
      const weights = variations.map((v) => `${v.weight}${v.italic ? 'i' : ''}`).join(', ');
      console.log(chalk.gray(`  --font-${cssVarName}: '${family}' (pesos: ${weights})`));
    });

  console.log(chalk.cyan('\n═'.repeat(60)) + '\n');
}

// ============ EXECUÇÃO ============
main();
