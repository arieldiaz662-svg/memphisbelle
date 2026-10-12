// Hoja de caso de éxito (A4, una página) para enseñar el trabajo a otros clientes.
// Uso:  npm run build && node scripts/caso-exito.cjs   → docs/caso-exito/caso-memphis-belle.pdf
// Las capturas salen de dist/ (la web real). No lleva cifras de resultados: solo lo que está hecho.
const { execSync } = require('node:child_process');
const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const http = require('node:http');
const { existsSync, statSync } = require('node:fs');

// La web usa módulos y fuentes: no carga desde file://, así que se sirve dist/ en local.
const TIPOS = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
const servidor = http.createServer((req, res) => {
  let f = join(__dirname, '..', 'dist', decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TIPOS[require('node:path').extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});

const RAIZ = join(__dirname, '..');
const SALIDA = join(RAIZ, 'docs', 'caso-exito');
const PUERTO = 4317;
const FUENTES = pathToFileURL(join(RAIZ, 'public', 'fonts')).href;
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }

async function captura(browser, { archivo, ancho, alto, ancla, salida, movil }) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 2, isMobile: !!movil, hasTouch: !!movil, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.addInitScript(() => sessionStorage.setItem('mb-intro', '1'));
  await p.goto(`http://127.0.0.1:${PUERTO}/${archivo}`);
  await p.evaluate(() => document.fonts.ready);
  // Los elementos aparecen al entrar en pantalla: recorre la página para que todo esté visible y vuelve a la sección.
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await p.evaluate(() => { document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('visto', 'listo')); document.querySelectorAll('img[loading]').forEach((i) => { i.loading = 'eager'; }); });
  await p.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await p.waitForTimeout(900);
  await p.evaluate((a) => { const el = a && document.querySelector(a); window.scrollTo(0, el ? el.getBoundingClientRect().top + scrollY : 0); }, ancla);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: join(SALIDA, salida) });
  await ctx.close();
}

(async () => {
  mkdirSync(SALIDA, { recursive: true });
  await new Promise((ok) => servidor.listen(PUERTO, '127.0.0.1', ok));
  const browser = await playwright.chromium.launch();
  await captura(browser, { archivo: 'index.html', ancho: 1440, alto: 900, salida: 'escritorio.png', ancla: '#bar' });
  await captura(browser, { archivo: 'index.html', ancho: 390, alto: 844, salida: 'movil-portada.png', movil: true, ancla: '#hero' });
  await captura(browser, { archivo: 'index.html', ancho: 390, alto: 844, salida: 'movil-carta.png', movil: true, ancla: '#carta' });
  await captura(browser, { archivo: 'en.html', ancho: 390, alto: 844, salida: 'movil-visita-en.png', movil: true, ancla: '#visitanos' });
  const img = (f) => pathToFileURL(join(SALIDA, f)).href;
  const html = `<!doctype html><html lang="es"><meta charset="utf-8"><style>
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif.woff2") format("woff2"); }
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif-italic.woff2") format("woff2"); font-style: italic; }
@font-face { font-family: "Geist"; src: url("${FUENTES}/geist.woff2") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Geist Mono"; src: url("${FUENTES}/geist-mono.woff2") format("woff2"); font-weight: 100 900; }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 210mm; height: 297mm; background: #0B0A09; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { color: #F2EDE4; font: 400 3.5mm/1.5 "Geist", sans-serif; padding: 13mm 14mm 11mm; display: flex; flex-direction: column; gap: 9mm; overflow: hidden; }
.mono { font: 500 2.6mm/1 "Geist Mono", monospace; letter-spacing: .14em; text-transform: uppercase; color: rgba(242,237,228,.58); }
header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: .3mm solid rgba(242,237,228,.2); padding-bottom: 4mm; }
h1 { font: 400 17mm/.95 "Instrument Serif", serif; letter-spacing: -.02em; }
h1 em { color: #C9A961; }
.lead { font-size: 4.1mm; color: rgba(242,237,228,.78); max-width: 150mm; }
.shots { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 4.5mm; align-items: start; }
.shots figure { display: flex; flex-direction: column; gap: 2mm; }
.shots img { width: 100%; display: block; border: .3mm solid rgba(242,237,228,.22); border-radius: 2.4mm; }
.shots .m img { border-radius: 4mm; }
.cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8mm; }
h2 { font: 400 7.6mm/1.05 "Instrument Serif", serif; color: #C9A961; margin: 1.6mm 0 2.4mm; }
ul { list-style: none; padding: 0; display: grid; gap: 2.6mm; }
li { padding-left: 4mm; position: relative; color: rgba(242,237,228,.82); font-size: 3.8mm; }
li::before { content: ""; position: absolute; left: 0; top: 2.1mm; width: 1.6mm; height: 1.6mm; background: #C9A961; transform: rotate(45deg); }
footer { margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; border-top: .3mm solid rgba(242,237,228,.2); padding-top: 4mm; }
footer b { font: 400 6mm/1 "Instrument Serif", serif; }
</style><body>
<header><span class="mono">Caso · Alcance Isleño</span><span class="mono">Coctelería · Santa Cruz de Tenerife</span></header>
<div><h1>Memphis <em>Belle</em></h1>
<p class="lead" style="margin-top:4mm">Una coctelería de barrio necesitaba una web que se sintiera como su puerta: oscura, cálida, con la carta a un toque y sin trámites. Hicimos una web rápida, bilingüe y pensada para el móvil, que es donde la abre el cliente en la barra.</p></div>
<div class="shots">
<figure><img src="${img('escritorio.png')}" alt=""><span class="mono">Escritorio</span></figure>
<figure class="m"><img src="${img('movil-portada.png')}" alt=""><span class="mono">Portada</span></figure>
<figure class="m"><img src="${img('movil-carta.png')}" alt=""><span class="mono">Carta con precios</span></figure>
<figure class="m"><img src="${img('movil-visita-en.png')}" alt=""><span class="mono">Visita · inglés</span></figure>
</div>
<div class="cols">
<section><h2>El encargo</h2><ul>
<li>Presencia propia, más allá de la ficha de Google.</li>
<li>Carta digital con precios, fácil de leer en la barra.</li>
<li>Pedir reseñas a los clientes sin fricción.</li>
<li>Un local sin reservas: la web invita a entrar.</li></ul></section>
<section><h2>Lo que hicimos</h2><ul>
<li>Web en español e inglés con selector de idioma.</li>
<li>Carta real por pestañas, con QR para las mesas.</li>
<li>Tarjeta NFC y QR para dejar reseña en Google.</li>
<li>Horario con “Abierto ahora” en hora de Canarias.</li>
<li>Pantalla de entrada de marca y animaciones suaves.</li></ul></section>
<section><h2>Bajo el capó</h2><ul>
<li>100 % estática: sin servidor ni base de datos.</li>
<li>Sin cookies ni formularios; cumple RGPD.</li>
<li>Seguridad estricta (CSP) y accesibilidad revisada.</li>
<li>Datos estructurados para Google Maps y buscadores.</li>
<li>Todo el contenido sale de un único archivo, fácil de actualizar.</li></ul></section>
</div>
<footer><div><b>Alcance Isleño</b><div class="mono" style="margin-top:2mm">alcanceisleno.com</div></div><span class="mono">Web de Memphis Belle Coctelería · hecha a medida</span></footer>
</body></html>`;
  const archivo = join(SALIDA, 'caso-memphis-belle.html');
  writeFileSync(archivo, html);
  const pdf = await browser.newPage();
  await pdf.goto(pathToFileURL(archivo).href); await pdf.evaluate(() => document.fonts.ready);
  await pdf.pdf({ path: join(SALIDA, 'caso-memphis-belle.pdf'), width: '210mm', height: '297mm', printBackground: true });
  await browser.close();
  servidor.close();
  console.log('Listo: ' + join(SALIDA, 'caso-memphis-belle.pdf'));
})();
