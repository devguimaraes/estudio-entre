/**
 * Configuração do Conversor de Fontes
 *
 * Personalize este arquivo conforme necessário para seu projeto
 */

export const fontConverterConfig = {
  // ========================
  // CAMINHOS
  // ========================

  // Diretório com arquivos .ttf de entrada
  sourceDir: './ESTÚDIO ENTRE/[IDENTIDADE]/Fontes',

  // Diretório onde os arquivos .woff2 serão salvos
  outputDir: './public/fonts',

  // Diretório onde os arquivos CSS serão salvos
  cssOutputDir: './src/styles/fonts',

  // Caminho público para referenciar fontes no CSS
  publicFontsPath: '/fonts',

  // Arquivo de log de conversão (JSON)
  logFile: './scripts/convert-fonts/conversion-log.json',

  // ========================
  // CONVERSÃO
  // ========================

  // Extensões de arquivo a procurar
  extensions: ['.ttf'],

  // Fazer busca recursiva em subdiretórios
  recursiveSearch: true,

  // Evitar reconversão de arquivos já processados
  skipIfAlreadyConverted: true,

  // ========================
  // OTIMIZAÇÃO
  // ========================

  // Comprimir WOFF2 (sempre ativado por padrão)
  compress: true,

  // Nível de compressão (0-11, recomendado: 6-8)
  // Valores mais altos = arquivo menor mas mais lento
  compressionLevel: 6,

  // ========================
  // CSS E VARIÁVEIS
  // ========================

  // Gerar arquivo CSS combinado (fonts.css)
  generateCombinedCSS: true,

  // Gerar arquivos CSS individuais por família de fonte
  generateIndividualCSS: true,

  // Gerar CSS custom properties (variáveis CSS)
  generateCSSVariables: true,

  // Usar font-display: swap para melhor performance
  // Valores: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  fontDisplay: 'swap',

  // ========================
  // LOGGING
  // ========================

  // Nível de verbosidade do log
  // Valores: 'silent' | 'error' | 'warn' | 'info' | 'debug'
  logLevel: 'info',

  // Salvar detalhes em arquivo JSON
  saveDetailedLog: true,

  // ========================
  // RECURSOS AVANÇADOS
  // ========================

  // Remover arquivos TTF originais após conversão (cuidado!)
  removeSourceAfterConversion: false,

  // Ignorar certos nomes de pasta (útil para excluir arquivos temporários)
  ignoreDirs: ['node_modules', '.git', 'temp', 'tmp'],

  // ========================
  // VARIAÇÕES DE FONTE
  // ========================

  // Detectar automaticamente pesos de fonte
  autoDetectWeights: true,

  // Detectar automaticamente estilos (italic, oblique)
  autoDetectStyles: true,

  // Mapa customizado de nomes para pesos (se autoDetect não funcionar)
  customWeightMap: {
    'thin': 100,
    'extralight': 200,
    'light': 300,
    'regular': 400,
    'medium': 500,
    'semibold': 600,
    'bold': 700,
    'extrabold': 800,
    'black': 900,
  },
};

/**
 * Presets de Configuração
 *
 * Use um preset alterando fontConverterConfig para um destes:
 *
 * - fontConverterPresets.development
 * - fontConverterPresets.production
 * - fontConverterPresets.optimization
 */
export const fontConverterPresets = {
  // Configuração para desenvolvimento (mais rápida)
  development: {
    ...fontConverterConfig,
    logLevel: 'debug',
    generateIndividualCSS: false,
    compressionLevel: 3,
  },

  // Configuração para produção (máxima otimização)
  production: {
    ...fontConverterConfig,
    logLevel: 'warn',
    generateIndividualCSS: true,
    compressionLevel: 8,
    saveDetailedLog: true,
  },

  // Configuração focada em máxima otimização
  optimization: {
    ...fontConverterConfig,
    logLevel: 'error',
    generateCombinedCSS: true,
    generateIndividualCSS: false,
    compressionLevel: 11,
    fontDisplay: 'optional',
    saveDetailedLog: false,
  },
};

export default fontConverterConfig;
