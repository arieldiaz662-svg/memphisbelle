// QR suelto para las mesas del local: lleva a la web (que abre directamente en la carta). Solo el QR, a medida
// exacta, para imprimir como pegatina. Sale en qr-mesas/ (no se sube al repositorio: depende del dominio).
//
// Uso:  npm run qr-mesas                      40 mm, con el dominio de worker/redireccion.js
//       npm run qr-mesas -- 40 https://otra.direccion.com
//
// No genera nada sin dominio: un QR impreso con una dirección provisional deja las pegatinas inservibles.
// Salida:  qr-mesas-<mm>mm.pdf (vectorial, el de imprenta), .png (600 ppp) y .svg
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
  console.log(`QR de ${mm} × ${mm} mm en ${resolve(SALIDA)}\n  enlace: ${enlace}`);
})();
