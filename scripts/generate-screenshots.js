import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateScreenshots() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1280, height: 800 });
  
  // Increase timeout to 60 seconds
  page.setDefaultNavigationTimeout(60000);
  
  const sites = [
    {
      url: 'https://ricosworldkitchen.com',
      filename: 'ricos-world-kitchen.webp'
    },
    {
      url: 'https://thebrunchapothecary.com',
      filename: 'brunch-apothecary.webp'
    },
    {
      url: 'https://theartisanagatheringplace.com',
      filename: 'artisan-gathering.webp'
    }
  ];
  
  for (const site of sites) {
    try {
      console.log(`Generating screenshot for ${site.url}...`);
      
      // Try to navigate with a more lenient wait condition
      await page.goto(site.url, { 
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 60000
      });
      
      // Wait a bit for any dynamic content
      await page.waitForTimeout(2000);
      
      await page.screenshot({
        path: join(__dirname, '../static/portfolio', site.filename),
        type: 'webp',
        quality: 80
      });
      console.log(`✓ Generated screenshot for ${site.url}`);
    } catch (error) {
      console.error(`✗ Failed to generate screenshot for ${site.url}:`, error);
      
      // Try one more time with a different approach
      try {
        console.log(`Retrying ${site.url} with alternative approach...`);
        await page.goto(site.url, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
        await page.waitForTimeout(5000);
        
        await page.screenshot({
          path: join(__dirname, '../static/portfolio', site.filename),
          type: 'webp',
          quality: 80
        });
        console.log(`✓ Generated screenshot for ${site.url} on retry`);
      } catch (retryError) {
        console.error(`✗ Failed to generate screenshot for ${site.url} on retry:`, retryError);
      }
    }
  }
  
  await browser.close();
  console.log('Screenshot generation complete!');
}

generateScreenshots().catch(console.error); 