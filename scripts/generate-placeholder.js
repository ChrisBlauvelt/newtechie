import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generatePlaceholder() {
  try {
    // Read the original image
    const image = sharp(join(__dirname, '../public/profile.webp'));
    
    // Get image metadata
    const metadata = await image.metadata();
    
    // Create a low-quality placeholder
    await image
      .resize(40, 40, { fit: 'inside' }) // Slightly larger size
      .blur(5) // Less blur
      .webp({ quality: 30 }) // Higher quality
      .toFile(join(__dirname, '../public/profile-placeholder.webp'));
    
    console.log('✓ Generated profile image placeholder');
  } catch (error) {
    console.error('✗ Failed to generate placeholder:', error);
  }
}

generatePlaceholder().catch(console.error); 