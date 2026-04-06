import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generatePlaceholders() {
  const images = [
    {
      input: 'ricos-world-kitchen.webp',
      output: 'ricos-world-kitchen-placeholder.webp'
    },
    {
      input: 'brunch-apothecary.webp',
      output: 'brunch-apothecary-placeholder.webp'
    },
    {
      input: 'artisan-gathering.webp',
      output: 'artisan-gathering-placeholder.webp'
    }
  ];

  for (const image of images) {
    try {
      console.log(`Generating placeholder for ${image.input}...`);
      await sharp(join(__dirname, '../static/portfolio', image.input))
        .resize(40, 40, { fit: 'inside' })
        .blur(5)
        .webp({ quality: 30 })
        .toFile(join(__dirname, '../static/portfolio', image.output));
      console.log(`✓ Generated ${image.output}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${image.output}:`, error);
    }
  }
}

generatePlaceholders().catch(console.error); 