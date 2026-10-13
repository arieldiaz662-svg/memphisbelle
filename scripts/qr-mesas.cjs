// QR suelto para las mesas del local: lleva a la web (que abre directamente en la carta). Solo el QR, a medida
// exacta, para imprimir como pegatina. Sale en qr-mesas/ (no se sube al repositorio: depende del dominio).
//
// Uso:  npm run qr-mesas                      40 mm, con el dominio de worker/redireccion.js
//       npm run qr-mesas -- 40 https://otra.direccion.com
//
// No genera nada sin dominio: un QR impreso con una dirección provisional deja las pegatinas inservibles.
// Salida:  qr-mesas-<mm>mm.pdf/.png/.svg           solo el QR (mm × mm)
//          pegatina-mesas-<mm>x<mm+10>mm.pdf/.png   el QR con "MENÚ · MENU" encima (franja de 10 mm), PDF vectorial
const { execSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const QRCode = require('qrcode');
const { pdfQr } = require('./qr-pdf.cjs');

const RAIZ = join(__dirname, '..');
const SALIDA = join(RAIZ, 'qr-mesas');
const MARGEN = 4; // módulos en blanco alrededor (dentro de los mm): con poca luz y sobre mesas oscuras es lo que mejor se lee
const NIVEL = 'Q';
const FRANJA = 10; // mm de la franja con el texto, encima del QR
const FUENTES = pathToFileURL(join(RAIZ, 'public', 'fonts')).href;

// Pegatina: franja de texto + QR. Chromium redondea el tamaño de página hacia arriba, así que se recorta el PDF al
// tamaño exacto (la caja de página va anclada a la esquina superior izquierda del contenido).
async function pegatina({ svg, mm, base }) {
  const alto = mm + FRANJA;
  let playwright;
  try { playwright = require('playwright'); } catch { playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
  const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: "Geist"; src: url("${FUENTES}/geist.woff2") format("woff2"); font-weight: 100 900; }
@page { size: ${mm}mm ${alto}mm; margin: 0 }
* { margin: 0; box-sizing: border-box }
html, body { width: ${mm}mm; height: ${alto}mm; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact }
.franja { height: ${FRANJA}mm; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1.2mm; font: 800 ${(mm * 0.105).toFixed(2)}mm/1 "Geist", sans-serif; letter-spacing: .05em; color: #000; white-space: nowrap }
.franja i { font-style: normal; font-weight: 500; opacity: .75; padding: 0 .35em }
svg { display: block; width: ${mm}mm; height: ${mm}mm }
</style><div class="franja">MENÚ<i>·</i>MENU</div>${svg}`;
  const archivo = `${base}.html`;
  writeFileSync(archivo, html);
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(archivo).href); await page.evaluate(() => document.fonts.ready);
  const buf = await page.pdf({ width: `${mm}mm`, height: `${alto}mm`, printBackground: true });
  await browser.close();
  require('node:fs').rmSync(archivo);
  // Recorta la MediaBox al tamaño exacto.
  let pdf = buf.toString('latin1');
  const pt = (v) => ((v / 25.4) * 72).toFixed(4);
  pdf = pdf.replace(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/g, (_, x0, y0, x1, y1) => `/MediaBox [0 ${(Number(y1) - (alto / 25.4) * 72).toFixed(4)} ${pt(mm)} ${Number(y1).toFixed(4)}]`);
  writeFileSync(`${base}.pdf`, Buffer.from(pdf, 'latin1'));
  try { execSync(`pdftoppm -r 600 -png -singlefile "${base}.pdf" "${base}"`); } catch { /* sin pdftoppm no hay PNG */ }
}

(async () => {
  const mm = Number(process.argv[2] || 40);
  const { DOMINIO } = await import(pathToFileURL(join(RAIZ, 'worker/redireccion.js')).href);
  const enlace = (process.argv[3] || (DOMINIO ? `https://${DOMINIO}/` : '')).replace(/([^/])$/, '$1/');
  if (!/^https:\/\/[^/\s]+\.[^/\s]+/.test(enlace) || !(mm > 0)) {
    console.error('Falta el dominio definitivo (DOMINIO en worker/redireccion.js) o el tamaño no es válido.');
    process.exit(1);
  }
  mkdirSync(SALIDA, { recursive: true });
  const base = join(SALIDA, `qr-mesas-${mm}mm`);
  const svg = (await QRCode.toString(enlace, { type: 'svg', errorCorrectionLevel: NIVEL, margin: MARGEN, color: { dark: '#000000', light: '#FFFFFF' } }))
    .replace(/<svg ([^>]*?)width="[^"]*" height="[^"]*"/, '<svg $1').replace('<svg ', `<svg width="${mm}mm" height="${mm}mm" `);
  writeFileSync(`${base}.svg`, svg);
  writeFileSync(`${base}.pdf`, pdfQr(enlace, mm, { margen: MARGEN, nivel: NIVEL }));
  try { execSync(`pdftoppm -r 600 -png -singlefile "${base}.pdf" "${base}"`); } catch { console.warn('Sin pdftoppm: no se genera el PNG (usa el PDF o el SVG).'); }
  await pegatina({ svg, mm, base: join(SALIDA, `pegatina-mesas-${mm}x${mm + FRANJA}mm`) });
  console.log(`QR de ${mm} × ${mm} mm en ${resolve(SALIDA)}\n  enlace: ${enlace}`);
})();
