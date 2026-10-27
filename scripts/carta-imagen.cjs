// Genera la carta de Memphis Belle como imágenes para la ficha de Google Business Profile y las redes:
// 2 páginas verticales de 1080 × 1350 px (formato 4:5), JPG y PNG, con los precios y textos de src/content/site.js
// en verde militar con letra marfil y amarillo (se regeneran cuando cambia la carta). Incluye un QR a la carta de la web.
// Uso: node scripts/carta-imagen.cjs [https://dirección-de-la-web]     Salida: tarjetas/carta-imagen/
const { execSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const QRCode = require('qrcode');

const RAIZ = join(__dirname, '..');
const SALIDA = join(RAIZ, 'tarjetas', 'carta-imagen');
const FUENTES = pathToFileURL(join(RAIZ, 'public', 'fonts')).href;
const base = (process.argv[2] || 'https://memphisbelle.alcanceisleno.com').replace(/\/+$/, '');
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const qr = QRCode.create(`${base}/carta.html`, { errorCorrectionLevel: 'Q' });
const N = qr.modules.size;
let celdas = '';
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (qr.modules.get(x, y)) celdas += `M${x} ${y}h1v1h-1z`;
const qrSvg = `<svg viewBox="-3 -3 ${N + 6} ${N + 6}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><rect x="-3" y="-3" width="${N + 6}" height="${N + 6}" fill="#F2EDE4"/><path fill="#2A2E18" d="${celdas}"/></svg>`;

const CSS = `
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif.woff2") format("woff2"); font-style: normal; }
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif-italic.woff2") format("woff2"); font-style: italic; }
@font-face { font-family: "Poppins"; src: url("${FUENTES}/poppins-500.woff2") format("woff2"); font-weight: 500; }
@font-face { font-family: "Geist"; src: url("${FUENTES}/geist.woff2") format("woff2"); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
:root { --tinta: #F2EDE4; --tinta2: rgba(242, 237, 228, .78); --laton: #E8BE45; --rojo: #D8C98A; }
html, body { width: 1080px; background: #000; }
.hoja { position: relative; width: 1080px; height: 1350px; overflow: hidden; padding: 70px 76px 64px; color: var(--tinta);
  background: radial-gradient(ellipse 110% 75% at 50% 0%, #5A6638, #46512C 55%, #333D20); display: flex; flex-direction: column; }
.hoja::before { content: ""; position: absolute; inset: 26px; border: 2px solid rgba(232, 190, 69, .7); pointer-events: none; }
.hoja::after { content: ""; position: absolute; inset: 36px; border: 1px solid rgba(232, 190, 69, .35); pointer-events: none; }
.cab { text-align: center; }
.marca { font: 400 96px/1 "Instrument Serif", serif; letter-spacing: -.02em; }
.marca em { color: var(--laton); font-style: italic; }
.sub { margin-top: 14px; font: 500 20px/1 "Poppins", sans-serif; letter-spacing: .42em; padding-left: .42em; text-transform: uppercase; color: var(--rojo); }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 64px; margin-top: 52px; flex: 1; }
.sec h2 { font: italic 400 58px/1 "Instrument Serif", serif; color: var(--laton); }
.sec .intro { margin: 8px 0 22px; font: 500 15px/1.3 "Poppins", sans-serif; letter-spacing: .14em; text-transform: uppercase; color: var(--tinta2); }
.plato { margin-bottom: 20px; }
.linea { display: flex; align-items: baseline; gap: 10px; }
.nombre { font: 400 31px/1.05 "Instrument Serif", serif; }
.nombre em { color: var(--laton); font-style: italic; }
.puntos { flex: 1; min-width: 14px; border-bottom: 3px dotted rgba(242, 237, 228, .4); transform: translateY(-6px); }
.precio { font: 400 31px/1.05 "Instrument Serif", serif; white-space: nowrap; }
.desc { margin-top: 3px; font: 400 19px/1.3 "Geist", sans-serif; color: var(--tinta2); }
.barril { margin-top: 6px; font: 400 19px/1.35 "Geist", sans-serif; color: var(--tinta2); }
.barril b { font: 500 15px/1 "Poppins", sans-serif; letter-spacing: .14em; text-transform: uppercase; color: var(--laton); margin-right: 6px; }
.pie { display: flex; align-items: center; justify-content: space-between; gap: 30px; padding-top: 22px; border-top: 2px solid rgba(232, 190, 69, .45); }
.pie .datos { font: 400 20px/1.5 "Geist", sans-serif; color: var(--tinta2); }
.pie .datos b { font: 500 16px/1 "Poppins", sans-serif; letter-spacing: .16em; text-transform: uppercase; color: var(--rojo); margin-right: 8px; }
.pie .qr { display: flex; align-items: center; gap: 16px; }
.pie .qr svg { width: 124px; height: 124px; border-radius: 6px; }
.pie .qr p { max-width: 150px; font: 500 15px/1.35 "Poppins", sans-serif; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta2); }
.nota { margin-top: 14px; font: 400 18px/1.4 "Geist", sans-serif; color: var(--tinta2); text-align: center; }
`;

const nombrePlato = (n) => {
  const m = /^(.*?)\s+(con fruta)$/.exec(n);
  return m ? `${esc(m[1])} <em>${esc(m[2])}</em>` : esc(n);
};
const seccion = (s, extra = '') => `<section class="sec">
  <h2>${esc(s.name)}</h2><p class="intro">${esc(s.intro || '')}</p>
  ${s.items.map((i) => `<div class="plato"><div class="linea"><span class="nombre">${nombrePlato(i.name)}</span><span class="puntos"></span><span class="precio">${esc(i.price)}</span></div>${i.text ? `<p class="desc">${esc(i.text)}</p>` : ''}</div>`).join('\n  ')}${extra}
</section>`;

(async () => {
  const { site } = await import(pathToFileURL(join(RAIZ, 'src', 'content', 'site.js')).href);
  const S = Object.fromEntries(site.menu.sections.map((s) => [s.id, s]));
  const barril = `<p class="barril"><b>${esc(site.menu.barril.label)}</b>${esc(site.menu.barril.text)}</p>`;
  const cabecera = '<div class="cab"><div class="marca">Memphis <em>Belle</em></div><div class="sub">Coctelería · La carta</div></div>';
  const pagina1 = `<div class="hoja">${cabecera}<div class="cols">${seccion(S.refrescantes)}${seccion(S.sour)}</div>
    <p class="nota">Precios con IGIC incluido. Bebe con moderación: no servimos alcohol a menores de 18 años.</p></div>`;
  const dias = 'Miércoles a domingo, de 18:00 a 02:00';
  const pagina2 = `<div class="hoja">${cabecera}<div class="cols">${seccion(S.intensos)}${seccion(S.copas, barril)}</div>
    <div class="pie"><div class="datos"><div><b>Dirección</b>${esc(site.address.street)}, ${esc(site.address.city)}</div><div><b>Horario</b>${dias}</div><div><b>Instagram</b>@${esc(site.instagram)}</div></div>
    <div class="qr">${qrSvg}<p>Carta completa y alérgenos en la web</p></div></div>
    <p class="nota">Si tienes alguna alergia o intolerancia, dínoslo antes de pedir.</p></div>`;

  let playwright;
  try { playwright = require('playwright'); } catch { playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
  mkdirSync(SALIDA, { recursive: true });
  const browser = await playwright.chromium.launch();
  for (const [n, html] of [[1, pagina1], [2, pagina2]]) {
    const archivo = join(SALIDA, `carta-${n}.html`);
    writeFileSync(archivo, `<!doctype html><html lang="es"><meta charset="utf-8"><style>${CSS}</style>${html}</html>`);
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(archivo).href);
    await page.evaluate(() => document.fonts.ready);
    const desborda = await page.evaluate(() => { const h = document.querySelector('.hoja'); return [...h.querySelectorAll('*')].some((e) => e.getBoundingClientRect().bottom > h.getBoundingClientRect().bottom - 30 && !e.matches('.hoja::after')) ; });
    await page.screenshot({ path: join(SALIDA, `carta-${n}.png`) });
    await page.screenshot({ path: join(SALIDA, `carta-${n}.jpg`), type: 'jpeg', quality: 92 });
    if (desborda) console.warn(`Aviso: el contenido de la página ${n} llega al borde inferior`);
    await page.close();
  }
  await browser.close();
  console.log(`Imágenes de la carta en ${SALIDA}`);
})();
