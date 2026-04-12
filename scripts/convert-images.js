import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const folders = [
  'src/assets/images',
  'src/assets/textures'
];

async function convertToWebP() {
  for (const folder of folders) {
    const files = fs.readdirSync(folder);
    
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const inputPath = path.join(folder, file);
        const outputPath = path.join(folder, path.parse(file).name + '.webp');
        
        console.log(`Convertendo: ${inputPath} -> ${outputPath}`);
        
        try {
          await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);
            
          console.log(`Sucesso: ${outputPath}`);
        } catch (err) {
          console.error(`Erro ao converter ${inputPath}:`, err);
        }
      }
    }
  }
}

convertToWebP().then(() => console.log('Conversão finalizada.'));
