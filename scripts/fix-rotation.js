import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const inputFolder = "novas-imagens-estudio-entre";
const outputFolder = "public/images/espaco";

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(inputFolder).sort();

  for (const file of files) {
    if (
      file.toLowerCase().endsWith(".jpg") ||
      file.toLowerCase().endsWith(".jpeg") ||
      file.toLowerCase().endsWith(".png")
    ) {
      const inputPath = path.join(inputFolder, file);
      const outputName = `${path
        .parse(file)
        .name.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")}.webp`;
      const outputPath = path.join(outputFolder, outputName);

      console.log(`Otimizando e Corrigindo Rotação: ${file} -> ${outputName}`);

      try {
        await sharp(inputPath)
          .rotate() // ESTA LINHA CORRIGE A ORIENTAÇÃO EXIF AUTOMATICAMENTE
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`✅ Sucesso: ${outputName}`);
      } catch (err) {
        console.error(`❌ Erro ao processar ${file}:`, err);
      }
    }
  }
}

optimizeImages().then(() => console.log("Otimização e correção de rotação concluídas."));
