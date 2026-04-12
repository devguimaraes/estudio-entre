# 🎨 Font Converter — TTF to WOFF2

Conversor automatizado de fontes TTF para WOFF2 com otimização para performance web e geração automática de CSS.

## 📋 O que este script faz?

✅ **Conversão Automática**
- Busca recursiva por arquivos `.ttf`
- Converte cada arquivo para `.woff2`
- Mantém a estrutura de pastas original

✅ **Otimização para Web**
- Compressão eficiente (reduz arquivo em 50-70%)
- Compatível com navegadores modernos
- Font display otimizado (swap)

✅ **Inteligência Integrada**
- Detecta peso da fonte (regular, bold, italic, etc)
- Evita reconversão de arquivos já processados
- Gerenciamento automático de pastas

✅ **CSS Automático**
- Gera `@font-face` declarations
- Cria variáveis CSS para uso fácil
- Arquivo combinado + individuais

✅ **Logs Detalhados**
- Monitoramento de progresso
- Relatório de tamanho economizado
- JSON com dados completos de cada fonte

---

## 🚀 Instalação

### 1. Instalar Dependências

```bash
cd scripts/convert-fonts
npm install
```

**Dependências necessárias:**
- `ttf2woff2` — Conversor TTF → WOFF2
- `chalk` — Colorização de terminal
- `ora` — Spinner de progresso

### 2. Verificar Instalação

```bash
npm list
```

Deve listar:
```
convert-fonts@1.0.0
├── ttf2woff2@5.0.0
├── chalk@5.3.0
└── ora@8.0.1
```

---

## 📖 Como Usar

### Uso Básico — Converter Todas as Fontes

```bash
npm run convert
```

**Saída esperada:**
```
🎨 CONVERSOR DE FONTES TTF → WOFF2
Performance & Web Optimization

🔍 Procurando por arquivos .ttf em: /path/to/Fontes
✓ Encontrados 5 arquivo(s) .ttf

✅ Convertidos: 5
⏭️  Pulados: 0
❌ Erros: 0

💾 Espaço economizado: 2.45 MB

🔗 Diretório de saída: /path/to/public/fonts
📋 Log salvo em: /path/to/scripts/convert-fonts/conversion-log.json
```

### Gerar CSS Automaticamente

Após converter as fontes:

```bash
npm run generate-css
```

**Cria dois tipos de arquivo:**

#### 1. **fonts.css** (arquivo completo)
```css
:root {
  --font-buvera: 'Buvera', sans-serif;
  --font-dongra: 'Dongra', sans-serif;
}

@font-face {
  font-family: 'Buvera';
  src: url('/fonts/[PRINCIPAL] Buvera/regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ... mais declarações ... */
```

#### 2. **_buvera.css** (arquivo individual)
```css
@font-face {
  font-family: 'Buvera';
  src: url('/fonts/[PRINCIPAL] Buvera/regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### Fazer Tudo de Uma Vez

```bash
npm run convert:full
```

Equivalente a:
```bash
npm run convert && npm run generate-css
```

---

## 🎯 Exemplos Práticos

### Usar Fontes em seu Projeto Astro

**1. Importar CSS em `src/layouts/Base.astro`:**

```astro
---
import '../styles/fonts/fonts.css';
---

<html>
  <head>
    <!-- CSS automático -->
  </head>
  <body>
    <!-- Conteúdo -->
  </body>
</html>
```

**2. Usar no CSS/Astro:**

```css
body {
  font-family: var(--font-buvera);
}

h1 {
  font-family: var(--font-buvera);
  font-weight: 700;
}

h2 {
  font-family: var(--font-dongra);
  font-weight: 600;
  font-style: italic;
}
```

### Uso com Tailwind CSS

**Em `tailwind.config.js`:**

```javascript
export default {
  theme: {
    fontFamily: {
      buvera: ['var(--font-buvera)', 'sans-serif'],
      dongra: ['var(--font-dongra)', 'sans-serif'],
    },
  },
};
```

**Em seus componentes:**

```astro
<h1 class="font-buvera text-3xl font-bold">Título</h1>
<p class="font-dongra italic">Texto em Dongra</p>
```

---

## 📊 Entendendo o Output

### Estrutura de Pastas Gerada

```
projeto/
├── public/
│   └── fonts/                          # 📁 Saída (WOFF2)
│       └── [IDENTIDADE]/Fontes/
│           ├── [PRINCIPAL] Buvera/
│           │   ├── regular.woff2
│           │   ├── bold.woff2
│           │   └── italic.woff2
│           └── Dongra - Cursiva/
│               ├── regular.woff2
│               └── italic.woff2
│
└── src/
    └── styles/
        └── fonts/                      # 📁 CSS Gerado
            ├── fonts.css               # Completo
            ├── _buvera.css             # Individual
            └── _dongra.css             # Individual
```

### Arquivo de Log (conversion-log.json)

```json
{
  "timestamp": "2024-04-11T23:30:00.000Z",
  "conversions": [
    {
      "originalFile": "regular.ttf",
      "originalPath": "[PRINCIPAL] Buvera/regular.ttf",
      "outputPath": "[PRINCIPAL] Buvera/regular.woff2",
      "ttfSize": 340588,
      "woff2Size": 95200,
      "sizeReduction": "72.05%",
      "weight": 400,
      "italic": false,
      "family": "Buvera",
      "timestamp": "2024-04-11T23:30:00.000Z"
    }
  ],
  "skipped": [],
  "errors": []
}
```

---

## ⚙️ Configuração Avançada

### Personalizar Comportamento

Edite `config.js`:

```javascript
export const fontConverterConfig = {
  sourceDir: './ESTÚDIO ENTRE/[IDENTIDADE]/Fontes',
  outputDir: './public/fonts',
  cssOutputDir: './src/styles/fonts',
  publicFontsPath: '/fonts',
  
  // Compressão
  compressionLevel: 6,  // 0-11 (maior = mais comprimido)
  
  // CSS
  generateCombinedCSS: true,
  generateIndividualCSS: true,
  fontDisplay: 'swap',  // Melhor para performance
  
  // Logging
  logLevel: 'info',     // 'silent', 'error', 'warn', 'info', 'debug'
};
```

### Usar Presets

```javascript
import { fontConverterPresets } from './config.js';

// Para desenvolvimento (mais rápido)
// export const config = fontConverterPresets.development;

// Para produção (máxima otimização)
// export const config = fontConverterPresets.production;
```

---

## 🔍 Troubleshooting

### ❌ "Diretório de origem não encontrado"

**Problema:** Script não encontra a pasta de fontes

**Solução:**
1. Verifique se `ESTÚDIO ENTRE/[IDENTIDADE]/Fontes` existe
2. Confirme o caminho relativo está correto
3. Edite `config.js` se o caminho for diferente

```bash
# Teste o caminho
ls -la "ESTÚDIO ENTRE/[IDENTIDADE]/Fontes"
```

### ⚠️ "Nenhum arquivo .ttf encontrado"

**Problema:** Nenhuma fonte para converter

**Solução:**
1. Verifique se há arquivos `.ttf` na pasta
2. Confirme a extensão está em lowercase `.ttf` (não `.TTF`)
3. Habilite recursão em `config.js`: `recursiveSearch: true`

### 📦 "Command not found: npm"

**Problema:** Node.js/npm não instalado

**Solução:**
```bash
# Verificar instalação
node --version
npm --version

# Se não estiver instalado
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 🐌 "Conversão está lenta"

**Otimizações:**
```javascript
// Em config.js, reduzir compressão
compressionLevel: 3,  // Mais rápido, arquivo maior

// Ou limitar fontes (comentar fontes que não usa)
```

---

## 📈 Performance & Best Practices

### Tamanho de Arquivo

Redução típica ao converter TTF → WOFF2:

| Fonte | TTF | WOFF2 | Redução |
|-------|-----|-------|---------|
| Regular | 340 KB | 95 KB | -72% |
| Bold | 380 KB | 110 KB | -71% |
| Italic | 360 KB | 100 KB | -72% |

### Font Display

O script usa `font-display: swap` por padrão, que:

✅ Mostra fonte fallback imediatamente
✅ Troca para fonte custom quando carregada
✅ Melhor UX (texto não fica invisível)
⚠️ Pode ter "flash" entre fontes

### Boas Práticas

1. **Preload no HTML (opcional)**
```html
<link rel="preload" href="/fonts/buvera.woff2" as="font" type="font/woff2" crossorigin>
```

2. **Limitar variações**
   - Não inclua todos os pesos
   - Use weight/style específicos necessários

3. **Usar CSS Variables**
```css
:root {
  --font-primary: var(--font-buvera);
  --font-secondary: var(--font-dongra);
}

body { font-family: var(--font-primary); }
h2 { font-family: var(--font-secondary); }
```

---

## 🔗 Links Úteis

- [WOFF2 Spec](https://www.w3.org/TR/WOFF2/)
- [Font Display Playground](https://font-display.glitch.me/)
- [Web Font Optimization - Google](https://web.dev/optimize-webfont-loading/)

---

## 📝 Changelog

### v1.0.0 (2024-04-11)
- ✅ Conversor TTF → WOFF2
- ✅ Detecção automática de peso/estilo
- ✅ Gerador de CSS @font-face
- ✅ Variáveis CSS automáticas
- ✅ Sistema de logs JSON
- ✅ Documentação completa

---

## 📄 Licença

MIT © Estúdio Entre

---

## 🆘 Suporte

Dúvidas? Abra uma issue no repositório!

```bash
cd /home/devguimaraes/Projetos/estudios-entre
git log --oneline  # Ver histórico
npm run convert    # Executar conversão
```
