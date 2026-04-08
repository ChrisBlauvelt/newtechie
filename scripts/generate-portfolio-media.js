import { chromium } from 'playwright';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFile, unlink, mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = join(__dirname, '../static/portfolio');

const sites = [
  {
    url: 'https://bagelboyscafe.com',
    filename: 'bagelboyscafe.webm',
    type: 'video',
    duration: 10000,
  },
  {
    url: 'https://ricosworldkitchen.com',
    filename: 'ricos-world-kitchen.webp',
    type: 'screenshot',
  },
  {
    url: 'https://thebrunchapothecary.com',
    filename: 'brunch-apothecary.webm',
    type: 'video',
    duration: 10000,
  },
  {
    url: 'https://theartisanagatheringplace.com',
    filename: 'artisan-gathering.webm',
    type: 'video',
  },
];

async function captureVideo(browser, site) {
  const tmpDir = await mkdtemp(join(tmpdir(), 'pw-video-'));
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: tmpDir, size: { width: 1280, height: 800 } },
  });
  const page = await context.newPage();

  await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
  // Let hero animations play
  await page.waitForTimeout(site.duration || 5000);

  await context.close(); // Finalizes the video file

  const videoPath = await page.video().path();
  const outputPath = join(outputDir, site.filename);
  await copyFile(videoPath, outputPath);
  await unlink(videoPath);
  console.log(`✓ Recorded video: ${site.filename}`);
}

async function captureScreenshot(browser, site) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const buffer = await page.screenshot({ type: 'png' });
  await sharp(buffer).webp({ quality: 80 }).toFile(join(outputDir, site.filename));
  await context.close();
  console.log(`✓ Captured screenshot: ${site.filename}`);
}

async function main() {
  const browser = await chromium.launch();

  for (const site of sites) {
    try {
      console.log(`Capturing ${site.url}...`);
      if (site.type === 'video') {
        await captureVideo(browser, site);
      } else {
        await captureScreenshot(browser, site);
      }
    } catch (error) {
      console.error(`✗ Failed: ${site.url}`, error.message);
    }
  }

  await browser.close();
  console.log('Portfolio media generation complete!');
}

main().catch(console.error);
