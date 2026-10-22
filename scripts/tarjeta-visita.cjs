// Genera la tarjeta de visita de Memphis Belle (85 × 55 mm, con 3 mm de sangrado: 91 × 61 mm), por las dos caras.
// Salida en tarjetas/visita/: tarjeta-visita.pdf (2 páginas: portada y reverso) y PNG a 300 ppp de cada cara.
//
// Uso:  node scripts/tarjeta-visita.cjs [https://dirección-de-la-web]
//       (por defecto, https://memphisbelle.alcanceisleno.com)
//
// El QR lleva a la web: no se puede cambiar una vez impresa la tarjeta. Si el bar va a tener dominio propio,
// pasarlo aquí ANTES de imprimir. Necesita Playwright con Chromium (como npm run og-image).
const { execSync } = require('node:child_process');
const { mkdirSync, writeFileSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const QRCode = require('qrcode');

const RAIZ = join(__dirname, '..');
const SALIDA = join(RAIZ, 'tarjetas', 'visita');
const FUENTES = pathToFileURL(join(RAIZ, 'public', 'fonts')).href;
const url = (process.argv[2] || 'https://memphisbelle.alcanceisleno.com').replace(/\/+$/, '');
if (!/^https:\/\/[^/\s]+\.[^/\s]+/.test(url)) { console.error('La dirección debe empezar por https://'); process.exit(1); }

// Entre el madera de whisky (#7A4420) y el bordó (#5B1423); el amarillo es el del mural (#E8BE45).
const C = { madera: '#68301F', bordo: '#4A1A1D', bordoOscuro: '#3A1216', crema: '#F2EDE4', amarillo: '#E8BE45', tinta: '#24100F' };

const qr = QRCode.create(url, { errorCorrectionLevel: 'Q' });
const N = qr.modules.size;
let celdas = '';
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (qr.modules.get(x, y)) celdas += `M${x} ${y}h1v1h-1z`;
const qrSvg = `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="${C.tinta}" d="${celdas}"/></svg>`;
const corta = url.replace(/^https?:\/\//, '');

const html = `<!doctype html>
<html lang="es"><meta charset="utf-8">
<style>
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif.woff2") format("woff2"); font-style: normal; }
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif-italic.woff2") format("woff2"); font-style: italic; }
@font-face { font-family: "Poppins"; src: url("${FUENTES}/poppins-500.woff2") format("woff2"); font-weight: 500; }
@font-face { font-family: "Geist"; src: url("${FUENTES}/geist.woff2") format("woff2"); font-weight: 100 900; }
@page { size: 91mm 61mm; margin: 0; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 91mm; text-rendering: geometricPrecision; font-kerning: normal; background: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.cara { position: relative; width: 91mm; height: 61mm; overflow: hidden; break-after: page; color: ${C.crema}; }
.cara:last-child { break-after: auto; }
/* Zona segura: 3 mm de sangrado + 4 mm de margen = 7 mm desde el borde del papel. */
.fondo-frente { background: radial-gradient(ellipse 85% 95% at 30% 20%, #7C3A26 0%, ${C.madera} 38%, #4F1B1F 100%); }
.fondo-reverso { background: radial-gradient(ellipse 90% 100% at 20% 0%, #5E2325 0%, ${C.bordo} 55%, ${C.bordoOscuro} 100%); }
.marca { font-family: "Instrument Serif", serif; line-height: 1; letter-spacing: -.01em; white-space: nowrap; }
.marca em { color: ${C.amarillo}; font-style: italic; }
.frente { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4.2mm; }
.frente .marca { font-size: 12.5mm; }
.frente .linea { width: 9mm; height: .35mm; background: ${C.amarillo}; opacity: .9; }
.frente .tipo { font: 500 2.4mm/1 "Poppins", sans-serif; letter-spacing: .42em; padding-left: .42em; text-transform: uppercase; color: ${C.crema}; opacity: .86; }
.reverso { position: absolute; inset: 0; padding: 7mm 7mm 7mm 7mm; display: grid; grid-template-columns: 1fr 25mm; column-gap: 5mm; align-items: center; }
.datos { display: flex; flex-direction: column; gap: 3.6mm; }
.datos .marca { font-size: 6.4mm; margin-bottom: .6mm; }
.dato { font: 400 2.5mm/1.35 "Geist", sans-serif; color: ${C.crema}; }
.dato b { display: block; font: 500 1.9mm/1 "Poppins", sans-serif; letter-spacing: .2em; text-transform: uppercase; color: ${C.amarillo}; margin-bottom: .8mm; }
.qr { display: flex; flex-direction: column; align-items: center; gap: 1.6mm; }
.qr .placa { width: 25mm; height: 25mm; padding: 2mm; border-radius: 1.6mm; background: ${C.crema}; }
.qr svg { display: block; width: 100%; height: 100%; }
.qr p { font: 500 1.8mm/1.25 "Poppins", sans-serif; letter-spacing: .12em; text-transform: uppercase; text-align: center; color: ${C.crema}; opacity: .9; }
</style>
<div class="cara fondo-frente"><div class="frente">
  <div class="marca">Memphis <em>Belle</em></div>
  <div class="linea"></div>
  <div class="tipo">Coctelería</div>
</div></div>
<div class="cara fondo-reverso"><div class="reverso">
  <div class="datos">
    <div class="marca">Memphis <em>Belle</em></div>
    <div class="dato"><b>Dirección</b>Calle de los Sueños, 1<br>38006 Santa Cruz de Tenerife</div>
    <div class="dato"><b>Horario</b>Miércoles a domingo<br>de 18:00 a 02:00</div>
    <div class="dato"><b>Instagram</b>@memphisbelle_cocteleria</div>
  </div>
  <div class="qr"><div class="placa">${qrSvg}</div><p>Carta, horario<br>y cómo llegar</p></div>
</div></div>
</html>`;

(async () => {
  let playwright;
  try { playwright = require('playwright'); } catch { playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
  mkdirSync(SALIDA, { recursive: true });
  const archivo = join(SALIDA, 'tarjeta-visita.html');
  writeFileSync(archivo, html);
  const browser = await playwright.chromium.launch();
  const px = 91 / 25.4 * 96; // 91 mm en píxeles CSS
  const page = await browser.newPage({ viewport: { width: Math.ceil(px), height: Math.ceil(61 / 25.4 * 96) }, deviceScaleFactor: 300 / 96 });
  await page.goto(pathToFileURL(archivo).href);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(SALIDA, 'tarjeta-visita.pdf'), width: '91mm', height: '61mm', printBackground: true, preferCSSPageSize: true });
  const caras = await page.$$('.cara');
  for (const [i, nombre] of ['frente', 'reverso'].entries()) {
    await caras[i].screenshot({ path: join(SALIDA, `tarjeta-${nombre}-con-sangrado.png`) });
    // Versión recortada (85 × 55 mm): sin los 3 mm de sangrado.
    const b = await caras[i].evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; });
    const m = 3 / 25.4 * 96;
    await page.screenshot({ path: join(SALIDA, `tarjeta-${nombre}.png`), clip: { x: b.x + m, y: b.y + m, width: b.width - 2 * m, height: b.height - 2 * m }, fullPage: true });
  }
  await browser.close();
  console.log(`Tarjeta generada en ${SALIDA} (QR → ${corta})`);
})();
