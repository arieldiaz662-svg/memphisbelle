// Tarjeta de "Déjanos una reseña en Google" para enseñar a los clientes (80 × 125 mm, dos caras: español e inglés),
// con NFC y un QR de respaldo. Salida en tarjetas/ (se sube a git: el enlace de reseñas no depende del dominio).
//
// Uso:  npm run tarjeta
//
// Qué lleva: marca, cinco estrellas, titular, aviso de NFC y QR. El QR (y la etiqueta NFC, que se programa
// aparte con el mismo enlace) usa reviewCta.writeUrl de src/content/site.js; sin él, la ficha de Google Maps.
// Conviene poner el enlace corto de "Pedir reseñas" de Google Business: el QR sale mucho más sencillo y se lee
// mejor con poca luz.
//
// Salida:  tarjeta-resena-es.png / -en.png      300 ppp, cada cara
//          tarjeta-resena.pdf                    PDF a tamaño real, 2 páginas (cara ES y cara EN), esquinas redondeadas
//          qr-resena.svg                         el QR suelto, vectorial
//          tarjeta-resena-es.html / -en.html     las caras (editables)
// Necesita Playwright con Chromium (como npm run og-image).
const { execSync } = require('node:child_process');
const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const QRCode = require('qrcode');

const RAIZ = join(__dirname, '..');
const SALIDA = join(RAIZ, 'tarjetas');
const FUENTES = pathToFileURL(join(RAIZ, 'public', 'fonts')).href;
const BELLE = readFileSync(join(RAIZ, 'public', 'img', 'logo-belle.svg'), 'utf8').trim().replace(/ role="img" aria-label="Belle"/, ' class="belle"');

// Estrella de cinco puntas (la misma de la web), centrada en 0,0 y de radio 10.
const estrella = (() => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 4.1 : 10;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
  });
  return `<polygon points="${pts.join(' ')}"/>`;
})();
const ESTRELLAS = `<svg class="estrellas" viewBox="-12 -12 124 24" aria-hidden="true">${[0, 25, 50, 75, 100].map((x) => `<g transform="translate(${x} 0)">${estrella}</g>`).join('')}</svg>`;

// Símbolo NFC: un punto y tres ondas.
const NFC = `<svg class="nfc" viewBox="0 0 60 60" aria-hidden="true"><circle cx="9" cy="30" r="4.2"/>${[12, 22, 32].map((r) => {
  const a = (Math.PI / 180) * 38;
  const x = (30 - 21) + 0; // el centro de las ondas es el punto
  const cx = 9; const cy = 30;
  return `<path d="M${(cx + r * Math.cos(-a)).toFixed(2)} ${(cy + r * Math.sin(-a)).toFixed(2)} A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}" fill="none" stroke-width="4.2" stroke-linecap="round"/>`;
}).join('')}</svg>`;

const TEXTOS = {
  es: { lang: 'es', kicker: 'Tu opinión nos importa', titulo: 'Déjanos tu reseña<br>en <em>Google</em>', nfc: 'Acerca tu móvil', qr: 'o escanea el código', pie: 'Gracias por venir' },
  en: { lang: 'en', kicker: 'Your opinion matters', titulo: 'Leave us a<br>review on <em>Google</em>', nfc: 'Tap your phone', qr: 'or scan the code', pie: 'Thank you for coming' },
};

const cara = (t, qr, direccion) => `<!doctype html>
<html lang="${t.lang}"><meta charset="utf-8">
<style>
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif.woff2") format("woff2"); font-style: normal; }
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif-italic.woff2") format("woff2"); font-style: italic; }
@font-face { font-family: "Geist Mono"; src: url("${FUENTES}/geist-mono.woff2") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Geist"; src: url("${FUENTES}/geist.woff2") format("woff2"); font-weight: 100 900; }
@page { size: 80mm 125mm; margin: 0; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 80mm; height: 125mm; background: transparent; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.tarjeta { position: relative; width: 80mm; height: 125mm; border-radius: 6mm; overflow: hidden; background: #0B0A09; color: #F2EDE4; font-family: "Geist", sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8mm 7mm 7mm; }
/* Filete interior en oro viejo, como una placa grabada */
.tarjeta::before { content: ""; position: absolute; inset: 3mm; border: .35mm solid rgba(201, 169, 97, .55); border-radius: 3.6mm; pointer-events: none; }
.marca { display: flex; align-items: baseline; justify-content: center; gap: 1.4mm; }
.marca b { font: 400 6.6mm/1 "Instrument Serif", serif; letter-spacing: -.01em; }
.marca .belle { height: 8.6mm; width: auto; transform: rotate(-4deg) translateY(.6mm); }
.centro { text-align: center; }
.estrellas { width: 44mm; height: auto; fill: #E8BE45; display: block; margin: 0 auto 4.2mm; }
.kicker { font: 500 2.3mm/1.4 "Geist Mono", monospace; letter-spacing: .22em; text-transform: uppercase; color: #C9A961; margin-bottom: 2.6mm; }
h1 { font: 400 11.2mm/.98 "Instrument Serif", serif; letter-spacing: -.025em; }
h1 em { font-style: italic; color: #E8BE45; }
.acciones { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 4mm; width: 100%; padding: 0 2mm; }
.qr { width: 27mm; height: 27mm; background: #fff; border-radius: 2mm; padding: .6mm; }
.qr svg { display: block; width: 100%; height: 100%; }
.tocar { display: grid; justify-items: start; gap: 1.6mm; }
.nfc { width: 15mm; height: 15mm; fill: #E8BE45; stroke: #E8BE45; }
.tocar strong { font: 400 5mm/1 "Instrument Serif", serif; }
.tocar span { font: 500 2.3mm/1.3 "Geist Mono", monospace; letter-spacing: .14em; text-transform: uppercase; color: #C9A961; }
.pie span { color: rgba(242, 237, 228, .45); }
.pie { font: 500 2.3mm/1.7 "Geist Mono", monospace; letter-spacing: .18em; text-transform: uppercase; color: rgba(242, 237, 228, .7); text-align: center; }
</style>
<body>
<div class="tarjeta">
  <div class="marca"><b>Memphis</b>${BELLE}</div>
  <div class="centro">
    ${ESTRELLAS}
    <div class="kicker">${t.kicker}</div>
    <h1>${t.titulo}</h1>
  </div>
  <div class="acciones">
    <div class="qr">${qr}</div>
    <div class="tocar">${NFC}<strong>${t.nfc}</strong><span>${t.qr}</span></div>
  </div>
  <div class="pie">${t.pie}<br><span>${direccion}</span></div>
</div>
</body></html>`;

(async () => {
  const [{ site }, { reviewUrl }] = await Promise.all([import(pathToFileURL(join(RAIZ, 'src/content/site.js')).href), import(pathToFileURL(join(RAIZ, 'src/views/html.js')).href)]);
  const enlace = reviewUrl(site);
  mkdirSync(SALIDA, { recursive: true });
  // Negro sobre blanco y margen de 2 módulos (la tarjeta ya deja aire alrededor): es lo que mejor se lee.
  const qr = await QRCode.toString(enlace, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
  writeFileSync(join(SALIDA, 'qr-resena.svg'), qr);
  const direccion = `Calle de los Sueños ${site.address.street.match(/\d+/)[0]}`;

  let playwright;
  try { playwright = require('playwright'); } catch { playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
  const browser = await playwright.chromium.launch();
  const paginas = [];
  for (const [id, t] of Object.entries(TEXTOS)) {
    const html = cara(t, qr, direccion);
    const archivo = join(SALIDA, `tarjeta-resena-${id}.html`);
    writeFileSync(archivo, html);
    paginas.push(html);
    // PNG a 300 ppp (80 mm = 945 px) con las esquinas transparentes: 80 mm ≈ 302 px CSS; 300 ppp = x3,125.
    const png = await browser.newPage({ viewport: { width: 303, height: 473 }, deviceScaleFactor: 300 / 96 });
    await png.goto(pathToFileURL(archivo).href); await png.evaluate(() => document.fonts.ready);
    await png.screenshot({ path: join(SALIDA, `tarjeta-resena-${id}.png`), omitBackground: true, clip: { x: 0, y: 0, width: 302.36, height: 472.44 } });
    await png.close();
  }
  // PDF de dos páginas (cara ES y cara EN) a tamaño real.
  const cuerpo = (h) => h.match(/<body>([\s\S]*)<\/body>/)[1];
  const estilo = paginas[0].match(/<style>[\s\S]*?<\/style>/)[0];
  const doble = `<!doctype html><meta charset="utf-8">${estilo.replace('</style>', '.tarjeta { break-after: page; } .tarjeta:last-of-type { break-after: auto; }\n</style>')}<body>${paginas.map(cuerpo).join('')}</body>`;
  const archivoPdf = join(SALIDA, '.pdf-doble.html');
  writeFileSync(archivoPdf, doble);
  const pdf = await browser.newPage();
  await pdf.goto(pathToFileURL(archivoPdf).href); await pdf.evaluate(() => document.fonts.ready);
  await pdf.pdf({ path: join(SALIDA, 'tarjeta-resena.pdf'), width: '80mm', height: '125mm', printBackground: true });
  await browser.close();
  require('node:fs').rmSync(archivoPdf);
  console.log(`Tarjeta en ${resolve(SALIDA)}\n  enlace del QR (y de la etiqueta NFC): ${enlace}`);
})();
