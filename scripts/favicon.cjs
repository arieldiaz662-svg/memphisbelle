// Genera los iconos de la web a partir de public/img/favicon.svg: PNG 32, 180 (iPhone), 192 y 512 (instalable)
// y favicon.ico en la raíz. Uso: node scripts/favicon.cjs   (necesita Playwright con Chromium y Pillow de Python para el .ico)
const { execSync } = require('node:child_process');
const { readFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');
const RAIZ = join(__dirname, '..');
(async () => {
  let playwright;
  try { playwright = require('playwright'); } catch { playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
  const svg = readFileSync(join(RAIZ, 'public/img/favicon.svg'), 'utf8');
  const browser = await playwright.chromium.launch();
  for (const [nombre, px] of [['favicon-32', 32], ['favicon-48', 48], ['apple-touch-icon', 180], ['icon-192', 192], ['icon-512', 512]]) {
    const page = await browser.newPage({ viewport: { width: px, height: px } });
    await page.setContent(`<body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${px}" height="${px}" `)}</body>`);
    await page.screenshot({ path: join(RAIZ, 'public/img', `${nombre}.png`), omitBackground: true });
    await page.close();
  }
  await browser.close();
  mkdirSync(join(RAIZ, 'public/raiz'), { recursive: true });
  execSync(`python3 -I -c "from PIL import Image; a=Image.open('public/img/favicon-48.png'); b=Image.open('public/img/favicon-32.png'); a.save('public/raiz/favicon.ico', sizes=[(48,48),(32,32)], append_images=[b])"`, { cwd: RAIZ });
  console.log('Iconos generados en public/img y public/raiz/favicon.ico');
})();
