#!/usr/bin/env node

/**
 * Font Converter TTF to WOFF2
 *
 * Script automatizado para converter arquivos TTF para WOFF2
 * com otimização de performance e compatibilidade com navegadores
 *
 * Uso:
 *   node index.js
 *   node index.js --watch
 *   node index.js --output dist/fonts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ttf2woff2 from 'ttf2woff2';
import chalk from 'chalk';
import ora from 'ora';

// Obter __dirname em módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calcular raiz do projeto (scripts/convert-fonts -> raiz)
const projectRoot = path.resolve(__dirname, '../../');

// ============ CONFIGURAÇÕES ============
const config = {
  sourceDir: path.resolve(projectRoot, 'src/assets/fonts'),
  outputDir: path.resolve(projectRoot, 'public/fonts'),
  logFile: path.resolve(__dirname, 'conversion-log.json'),
  extensions: ['.ttf'],
  recursiveSearch: true,
};

// ============ VARIÁVEIS GLOBAIS ============
let conversionData = {
  timestamp: new Date().toISOString(),
  conversions: [],
  skipped: [],
  errors: [],
};

// ============ FUNÇÕES AUXILIARES ============

/**
 * Verifica se um arquivo já foi convertido
 */
function isAlreadyConverted(ttfPath, woff2Path) {
  if (!fs.existsSync(woff2Path)) {
    return false;
  }

  try {
    const ttfStat = fs.statSync(ttfPath);
    const woff2Stat = fs.statSync(woff2Path);

    // Se o WOFF2 é mais recente que o TTF, já foi convertido
    return woff2Stat.mtime > ttfStat.mtime;
  } catch (error) {
    return false;
  }
}

/**
 * Obtém o peso da fonte a partir do nome do arquivo
 */
function extractFontWeight(filename) {
  const weights = {
    'thin': 100,
    'extralight': 200,
    'light': 300,
    'regular': 400,
    'medium': 500,
    'semibold': 600,
    'bold': 700,
    'extrabold': 800,
    'black': 900,
  };

  const lowerFilename = filename.toLowerCase();

  for (const [key, value] of Object.entries(weights)) {
    if (lowerFilename.includes(key)) {
      return value;
    }
  }

  return 400; // Default: regular
}

/**
 * Detecta se a fonte é itálica
 */
function isItalic(filename) {
  return /italic|oblique|it|ital/i.test(filename);
}

/**
 * Extrai nome da família de fontes
 */
function extractFontFamily(filename) {
  // Remove extensão
  let name = path.basename(filename, path.extname(filename));

  // Remove variações de peso e estilo
  name = name
    .replace(/[-\s]*(thin|extralight|light|regular|medium|semibold|bold|extrabold|black)/i, '')
    .replace(/[-\s]*(italic|oblique|it|ital)/i, '')
    .replace(/[-\s]+/g, ' ')
    .trim();

  return name;
}

/**
 * Busca recursivamente por arquivos TTF
 */
function findTTFFiles(dir) {
  let ttfFiles = [];

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        if (config.recursiveSearch) {
          ttfFiles = ttfFiles.concat(findTTFFiles(fullPath));
        }
      } else if (config.extensions.includes(path.extname(file.name).toLowerCase())) {
        ttfFiles.push(fullPath);
      }
    }
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao ler diretório ${dir}:`), error.message);
  }

  return ttfFiles;
}

/**
 * Cria diretório de saída se não existir
 */
function ensureOutputDirectory(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Converte um arquivo TTF para WOFF2
 */
async function convertFont(ttfPath) {
  try {
    const ttfBuffer = fs.readFileSync(ttfPath);
    const woff2Buffer = ttf2woff2(ttfBuffer);
    return woff2Buffer;
  } catch (error) {
    throw new Error(`Erro ao converter: ${error.message}`);
  }
}

/**
 * Processa um arquivo de fonte
 */
async function processFontFile(ttfPath) {
  const relativePath = path.relative(config.sourceDir, ttfPath);
  const outputPath = path.join(config.outputDir, relativePath.replace(/\.ttf$/i, '.woff2'));

  try {
    // Verificar se já foi convertido
    if (isAlreadyConverted(ttfPath, outputPath)) {
      conversionData.skipped.push({
        file: relativePath,
        reason: 'Arquivo WOFF2 mais recente que TTF',
      });
      return {
        status: 'skipped',
        message: `⏭️  ${relativePath} (já convertido)`,
      };
    }

    // Garantir que o diretório de saída existe
    ensureOutputDirectory(outputPath);

    // Converter arquivo
    const woff2Buffer = await convertFont(ttfPath);

    // Salvar arquivo
    fs.writeFileSync(outputPath, woff2Buffer);

    const ttfSize = fs.statSync(ttfPath).size;
    const woff2Size = fs.statSync(outputPath).size;
    const reduction = ((1 - woff2Size / ttfSize) * 100).toFixed(2);

    const fontInfo = {
      originalFile: path.basename(ttfPath),
      originalPath: relativePath,
      outputPath: path.relative(config.outputDir, outputPath),
      ttfSize: ttfSize,
      woff2Size: woff2Size,
      sizeReduction: `${reduction}%`,
      weight: extractFontWeight(ttfPath),
      italic: isItalic(ttfPath),
      family: extractFontFamily(ttfPath),
      timestamp: new Date().toISOString(),
    };

    conversionData.conversions.push(fontInfo);

    return {
      status: 'success',
      message: `✅ ${relativePath} (${formatBytes(ttfSize)} → ${formatBytes(woff2Size)}, -${reduction}%)`,
      info: fontInfo,
    };
  } catch (error) {
    conversionData.errors.push({
      file: relativePath,
      error: error.message,
      timestamp: new Date().toISOString(),
    });

    return {
      status: 'error',
      message: `❌ ${relativePath} - ${error.message}`,
    };
  }
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
 * Salva log de conversão
 */
function saveConversionLog() {
  try {
    fs.writeFileSync(config.logFile, JSON.stringify(conversionData, null, 2));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Erro ao salvar log:'), error.message);
    return false;
  }
}

/**
 * Exibe resumo de conversão
 */
function displaySummary() {
  console.log('\n' + chalk.cyan('═'.repeat(60)));
  console.log(chalk.cyan('📊 RESUMO DA CONVERSÃO'));
  console.log(chalk.cyan('═'.repeat(60)));

  console.log(chalk.green(`✅ Convertidos: ${conversionData.conversions.length}`));
  console.log(chalk.yellow(`⏭️  Pulados: ${conversionData.skipped.length}`));
  console.log(chalk.red(`❌ Erros: ${conversionData.errors.length}`));

  if (conversionData.conversions.length > 0) {
    const totalReduction = conversionData.conversions.reduce((sum, item) => {
      return sum + (item.ttfSize - item.woff2Size);
    }, 0);

    console.log(
      chalk.green(`\n💾 Espaço economizado: ${formatBytes(totalReduction)}`)
    );

    if (conversionData.conversions.length <= 10) {
      console.log(chalk.cyan('\n📝 Detalhes:'));
      conversionData.conversions.forEach((item) => {
        console.log(
          chalk.gray(`  • ${item.family} (${item.weight}${item.italic ? 'i' : ''})`)
        );
        console.log(chalk.gray(`    ${item.outputPath}`));
      });
    }
  }

  console.log(chalk.cyan('\n📁 Diretório de saída:'), config.outputDir);
  console.log(chalk.cyan('📋 Log salvo em:'), config.logFile);
  console.log(chalk.cyan('═'.repeat(60)) + '\n');
}

/**
 * Função principal
 */
async function main() {
  console.log(chalk.bold.cyan('\n🎨 CONVERSOR DE FONTES TTF → WOFF2'));
  console.log(chalk.gray('Performance & Web Optimization\n'));

  // Verificar se diretório de origem existe
  if (!fs.existsSync(config.sourceDir)) {
    console.error(chalk.red(`❌ Diretório de origem não encontrado: ${config.sourceDir}`));
    process.exit(1);
  }

  // Buscar arquivos TTF
  console.log(chalk.yellow(`🔍 Procurando por arquivos .ttf em: ${config.sourceDir}`));
  const ttfFiles = findTTFFiles(config.sourceDir);

  if (ttfFiles.length === 0) {
    console.log(chalk.yellow('⚠️  Nenhum arquivo .ttf encontrado!'));
    process.exit(0);
  }

  console.log(chalk.green(`✓ Encontrados ${ttfFiles.length} arquivo(s) .ttf\n`));

  // Converter cada arquivo
  const spinner = ora('Convertendo fontes...').start();
  let completed = 0;

  for (const ttfPath of ttfFiles) {
    try {
      const result = await processFontFile(ttfPath);
      completed++;

      spinner.text = `Convertendo fontes... ${completed}/${ttfFiles.length}`;

      if (result.status === 'error') {
        console.log(chalk.red(result.message));
      } else if (result.status === 'skipped') {
        console.log(chalk.yellow(result.message));
      }
    } catch (error) {
      console.error(chalk.red(`Erro inesperado em ${ttfPath}:`), error.message);
    }
  }

  spinner.succeed(chalk.green(`Conversão concluída! (${completed}/${ttfFiles.length})`));

  // Salvar log
  if (saveConversionLog()) {
    console.log(chalk.green('✓ Log salvo com sucesso'));
  }

  // Exibir resumo
  displaySummary();

  // Exportar dados para uso em outros scripts
  return conversionData;
}

// ============ EXECUÇÃO ============
main().catch((error) => {
  console.error(chalk.red('❌ Erro fatal:'), error);
  process.exit(1);
});

export default conversionData;
