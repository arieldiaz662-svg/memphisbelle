// Genera los QR y las pegatinas de las mesas: carta (en español e inglés, en la propia página) y reseña de
// Google. Salida en pegatinas/ (no se sube al repositorio: depende del dominio).
//
// Uso:  npm run pegatinas -- https://tudominio.com
//       PUBLIC_BASE_URL=https://tudominio.com npm run pegatinas
//
// No genera nada sin dirección: un QR impreso con una dirección provisional deja las pegatinas inservibles
// (el QR no se puede cambiar una vez impreso). Usa el dominio propio y definitivo.
//
// Salida:  qr-carta.svg, qr-resena.svg            QR sueltos, vectoriales (para imprentas y Canva)
//          pegatina-carta.pdf / .png               70 × 90 mm, PDF vectorial y PNG a 300 ppp
//          pegatina-resena.pdf / .png
//
// Los QR van en negro sobre blanco y con margen de 4 módulos: con poca luz, es lo que mejor se lee.
// Necesita Playwright con Chromium (como npm run og-image).
const { execSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const QRCode = require('qrcode');

const RAIZ = join(__dirname, '..');
const SALIDA = join(RAIZ, 'pegatinas');
const FUENTES = pathToFileURL(join(RAIZ, 'public', 'fonts')).href;

const base = (process.argv[2] || process.env.PUBLIC_BASE_URL || '').replace(/\/+$/, '');
if (!/^https:\/\/[^/\s]+\.[^/\s]+/.test(base)) {
  console.error('Falta la dirección definitiva de la web, con https://. Ejemplo:\n  npm run pegatinas -- https://memphisbelle.com');
  process.exit(1);
}

const qrSvg = (url) => QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'Q', margin: 4, color: { dark: '#000000', light: '#FFFFFF' } });
// Dirección corta para escribir bajo el QR, por si no se puede escanear.
const corta = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const pegatina = ({ qr, kicker, titulo, subtitulo, pie, estrellas }) => `<!doctype html>
<html lang="es"><meta charset="utf-8">
<style>
@font-face { font-family: "DM Serif Display"; src: url("${FUENTES}/dm-serif-display.woff2") format("woff2"); }
@font-face { font-family: "Yellowtail"; src: url("${FUENTES}/yellowtail.woff2") format("woff2"); }
@font-face { font-family: "Instrument Sans"; src: url("${FUENTES}/instrument-sans.woff2") format("woff2-variations"), url("${FUENTES}/instrument-sans.woff2") format("woff2"); font-weight: 400 700; }
@page { size: 70mm 90mm; margin: 0; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 70mm; height: 90mm; }
body { background: #160E0B; color: #F1E4CB; font-family: "Instrument Sans", sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 5mm 5mm 4.5mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.marca { display: flex; align-items: baseline; gap: 1.6mm; }
.marca b { font: 400 5.6mm/1 "DM Serif Display", serif; }
.marca i { font: 400 8.6mm/1 "Yellowtail", cursive; color: #E8BE45; transform: rotate(-5deg); }
.texto { text-align: center; }
.kicker { font-size: 2.5mm; letter-spacing: .06em; color: #C0AA90; margin-bottom: .8mm; }
.titulo { font: 400 5.2mm/1.1 "DM Serif Display", serif; }
.estrellas { color: #E8BE45; letter-spacing: 1.2mm; font-size: 4mm; margin-bottom: 1mm; }
.qr { width: 46mm; height: 46mm; background: #fff; border-radius: 2.5mm; overflow: hidden; }
.qr svg { display: block; width: 100%; height: 100%; }
.sub { font-size: 2.7mm; color: #C0AA90; text-align: center; }
.url { font-size: 3mm; font-weight: 600; color: #F1E4CB; letter-spacing: .01em; }
</style>
<body>
  <div class="marca"><b>Memphis</b><i>Belle</i></div>
  <div class="texto">
    ${estrellas ? '<div class="estrellas">★★★★★</div>' : ''}
    <div class="kicker">${kicker}</div>
    <div class="titulo">${titulo}</div>
  </div>
  <div class="qr">${qr}</div>
  <div class="texto"><div class="sub">${subtitulo}</div><div class="url">${pie}</div></div>
</body></html>`;

(async () => {
  const [{ site }, { reviewUrl }] = await Promise.all([import(pathToFileURL(join(RAIZ, 'src/content/site.js')).href), import(pathToFileURL(join(RAIZ, 'src/views/html.js')).href)]);
  const urls = { carta: `${base}/carta`, resena: reviewUrl(site) };
  mkdirSync(SALIDA, { recursive: true });

  const svgs = { carta: await qrSvg(urls.carta), resena: await qrSvg(urls.resena) };
  for (const [nombre, svg] of Object.entries(svgs)) writeFileSync(join(SALIDA, `qr-${nombre}.svg`), svg);

  const paginas = {
    carta: pegatina({ qr: svgs.carta, kicker: 'CARTA &nbsp;/&nbsp; MENU', titulo: 'Escanea para ver la carta<br><span style="font-size:.78em;color:#C0AA90">Scan to see the menu</span>', subtitulo: 'La carta, en español e inglés', pie: corta(urls.carta) }),
    resena: pegatina({ qr: svgs.resena, estrellas: true, kicker: '¿TE HA GUSTADO? &nbsp;/&nbsp; ENJOYED IT?', titulo: 'Déjanos una reseña en Google<br><span style="font-size:.78em;color:#C0AA90">Leave us a Google review</span>', subtitulo: 'Tarda un minuto y nos ayuda mucho', pie: 'Gracias / Thank you' }),
  };

  let playwright;
  try { playwright = require('playwright'); } catch { playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
  const browser = await playwright.chromium.launch();
  for (const [nombre, html] of Object.entries(paginas)) {
    const archivo = join(SALIDA, `.pegatina-${nombre}.html`);
    writeFileSync(archivo, html);
    // PDF vectorial a tamaño real (70 × 90 mm).
    const pdf = await browser.newPage();
    await pdf.goto(pathToFileURL(archivo).href); await pdf.evaluate(() => document.fonts.ready);
    await pdf.pdf({ path: join(SALIDA, `pegatina-${nombre}.pdf`), width: '70mm', height: '90mm', printBackground: true });
    await pdf.close();
    // PNG a 300 ppp: 70 mm = 827 px; 96 ppp de CSS x 3,125 = 300 ppp.
    const png = await browser.newPage({ viewport: { width: 265, height: 340 }, deviceScaleFactor: 300 / 96 });
    await png.goto(pathToFileURL(archivo).href); await png.evaluate(() => document.fonts.ready);
    await png.screenshot({ path: join(SALIDA, `pegatina-${nombre}.png`) });
    await png.close();
  }
  await browser.close();
  console.log(`Pegatinas en ${resolve(SALIDA)}\n  carta : ${urls.carta}\n  reseña: ${urls.resena}`);
})();
