// Genera tres modelos de tarjeta de visita de Memphis Belle (85 × 55 mm, con 3 mm de sangrado: 91 × 61 mm), por las dos caras.
// Salida en tarjetas/visita/modelo-N-nombre/: tarjeta-visita.pdf (2 páginas: frente y reverso) y PNG a 300 ppp de cada cara.
//
// Uso:  node scripts/tarjeta-visita.cjs [https://dirección-de-la-web]
//       (por defecto, https://memphisbelle.alcanceisleno.com)
//
// El QR lleva a la web: no se puede cambiar una vez impresa la tarjeta. Si el bar va a tener dominio propio,
// pasarlo aquí ANTES de imprimir. Necesita Playwright con Chromium (como npm run og-image).
const { execSync } = require('node:child_process');
const { mkdirSync, writeFileSync, rmSync, readFileSync } = require('node:fs');
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

// Emblema del local (scripts/logo.py): dos cucharas de bar cruzadas, coctelera y copa, como el cartel de la puerta.
const emblema = (variante, clase) => readFileSync(join(RAIZ, 'public', 'img', 'logo', `emblema-${variante}.svg`), 'utf8').replace('<svg ', `<svg class="${clase}" `);
const MURAL = pathToFileURL(join(RAIZ, 'public', 'img', 'portada', 'mural-1600.jpg')).href;
const PAPEL = { fondo: '#EDE4D0', tinta: '#2A1412', etiqueta: '#6B2A1E', belle: '#8F6208', qr: '#2A1412' };

const base = `
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif.woff2") format("woff2"); font-style: normal; }
@font-face { font-family: "Instrument Serif"; src: url("${FUENTES}/instrument-serif-italic.woff2") format("woff2"); font-style: italic; }
@font-face { font-family: "Poppins"; src: url("${FUENTES}/poppins-500.woff2") format("woff2"); font-weight: 500; }
@font-face { font-family: "Geist"; src: url("${FUENTES}/geist.woff2") format("woff2"); font-weight: 100 900; }
@page { size: 91mm 61mm; margin: 0; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 91mm; text-rendering: geometricPrecision; font-kerning: normal; background: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.cara { position: relative; width: 91mm; height: 61mm; overflow: hidden; break-after: page; color: ${C.crema}; }
.cara:last-child { break-after: auto; }
.marca { font-family: "Instrument Serif", serif; line-height: 1; letter-spacing: -.01em; white-space: nowrap; }
.marca em { color: ${C.amarillo}; font-style: italic; }
.tipo { font: 500 2.4mm/1 "Poppins", sans-serif; letter-spacing: .42em; padding-left: .42em; text-transform: uppercase; opacity: .86; }
.dato { font: 400 2.5mm/1.35 "Geist", sans-serif; }
.dato b { display: block; font: 500 1.9mm/1 "Poppins", sans-serif; letter-spacing: .2em; text-transform: uppercase; margin-bottom: .8mm; }
.qr { display: flex; flex-direction: column; align-items: center; gap: 1.6mm; }
.qr svg { display: block; width: 100%; height: 100%; }
.qr p { font: 500 1.8mm/1.25 "Poppins", sans-serif; letter-spacing: .12em; text-transform: uppercase; text-align: center; opacity: .9; }
.fondo { position: absolute; inset: 0; }
.cabm { display: flex; align-items: center; gap: 2.2mm; margin-bottom: .6mm; } .cabm .marca { margin: 0 !important; } .embp { width: 8.5mm; height: 8.5mm; flex: none; }
`;

const datosHtml = (extra = '') => `<div class="dato"><b>Dirección</b>Calle de los Sueños, 1<br>38006 Santa Cruz de Tenerife</div>
    <div class="dato"><b>Horario</b>Miércoles a domingo<br>de 18:00 a 02:00</div>
    <div class="dato"><b>Instagram</b>@memphisbelle_cocteleria</div>${extra}`;

const marco = (inset, color, op = 1) => { // marco de doble línea con esquinas cortadas
  const rect = (i, w) => { const x = i, y = i, X = 91 - i, Y = 61 - i, c = 2.6; return `<path d="M${x + c} ${y}H${X - c}L${X} ${y + c}V${Y - c}L${X - c} ${Y}H${x + c}L${x} ${Y - c}V${y + c}Z" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="miter" opacity="${op}"/>`; };
  return `<svg class="fondo" viewBox="0 0 91 61" xmlns="http://www.w3.org/2000/svg">${rect(inset, .3)}${rect(inset + 1.3, .15)}</svg>`;
};

const MODELOS = {
  // 1 · Tipográfico: el logotipo centrado sobre el degradado madera-bordó; reverso oscuro con el QR en una placa marfil.
  1: {
    nombre: 'Tipográfico',
    css: `
.f1 { background: radial-gradient(ellipse 85% 95% at 30% 20%, #7C3A26 0%, ${C.madera} 38%, #4F1B1F 100%); }
.r1 { background: radial-gradient(ellipse 90% 100% at 20% 0%, #5E2325 0%, ${C.bordo} 55%, ${C.bordoOscuro} 100%); }
.f1 .centro { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4.2mm; }
.f1 .emb { width: 19mm; height: 19mm; margin-bottom: -.5mm; } .f1 .centro { gap: 3.4mm; } .f1 .marca { font-size: 11.5mm; } .f1 .linea { width: 9mm; height: .35mm; background: ${C.amarillo}; opacity: .9; }
.r1 .rev { position: absolute; inset: 0; padding: 7mm; display: grid; grid-template-columns: 1fr 25mm; column-gap: 5mm; align-items: center; }
.r1 .datos { display: flex; flex-direction: column; gap: 3.6mm; } .r1 .datos .marca { font-size: 6.4mm; margin-bottom: .6mm; }
.r1 .dato b { color: ${C.amarillo}; } .r1 .placa { width: 25mm; height: 25mm; padding: 2mm; border-radius: 1.6mm; background: ${C.crema}; }`,
    frente: `<div class="cara f1"><div class="centro">${emblema('claro', 'emb')}<div class="marca">Memphis <em>Belle</em></div><div class="linea"></div><div class="tipo">Coctelería</div></div></div>`,
    reverso: (qr) => `<div class="cara r1"><div class="rev"><div class="datos"><div class="cabm">${emblema('claro', 'embp')}<div class="marca">Memphis <em>Belle</em></div></div>${datosHtml()}</div><div class="qr"><div class="placa">${qr(C.tinta)}</div><p>Carta, horario<br>y cómo llegar</p></div></div></div>`,
  },
  // 2 · Mural: panel madera-bordó con el logotipo en dos líneas y la foto real del avión pintado; reverso en papel crema (como la carta).
  2: {
    nombre: 'Mural',
    css: `
.f2 { background: #5A2320; }
.f2 .comp { position: absolute; top: 0; right: 0; width: 71mm; height: 61mm; }
.comp-origen { position: relative; width: 71mm; height: 61mm; background: #5A2320; }
.comp-origen .foto { position: absolute; inset: 0; background: url("${MURAL}") 92% 62% / auto 128% no-repeat; }
.comp-origen .vela { position: absolute; inset: 0; background: linear-gradient(to right, #5A2320 0%, #5A2320 12%, rgba(90,35,32,.55) 30%, rgba(90,35,32,0) 60%), linear-gradient(to top, rgba(58,18,22,.55), rgba(58,18,22,0) 45%); }
.f2 .texto { position: absolute; left: 7.5mm; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 2.4mm; }
.f2 .marca { font-size: 9.6mm; line-height: .92; } .f2 .marca em { display: block; font-size: 11.6mm; margin: 1.4mm 0 0 3.2mm; }
.f2 .emb { width: 15mm; height: 15mm; margin: 0 0 .6mm -1mm; }
.f2 .tipo { font-size: 2.1mm; letter-spacing: .36em; padding-left: 0; opacity: .9; margin-top: 1.2mm; }
.r2 { background: radial-gradient(ellipse 100% 90% at 50% 0%, #F3ECDB, ${PAPEL.fondo} 62%, #E3D8C0); color: ${PAPEL.tinta}; }
.r2 .rev { position: absolute; inset: 0; padding: 7mm; display: grid; grid-template-columns: 1fr 24mm; column-gap: 6mm; align-items: center; }
.r2 .datos { display: flex; flex-direction: column; gap: 3.6mm; } .r2 .marca { font-size: 6.4mm; margin-bottom: .6mm; color: ${PAPEL.tinta}; } .r2 .marca em { color: ${PAPEL.belle}; }
.r2 .dato b { color: ${PAPEL.etiqueta}; } .r2 .placa { width: 24mm; height: 24mm; }`,
    frente: `<div class="cara f2"><img class="comp" src="{{COMP}}" alt=""><div class="texto">${emblema('claro', 'emb')}<div class="marca">Memphis <em>Belle</em></div><div class="tipo">Coctelería</div></div></div>`,
    reverso: (qr) => `<div class="cara r2"><div class="rev"><div class="datos"><div class="cabm">${emblema('oscuro', 'embp')}<div class="marca">Memphis <em>Belle</em></div></div>${datosHtml()}</div><div class="qr"><div class="placa">${qr(PAPEL.qr)}</div><p>Carta, horario<br>y cómo llegar</p></div></div></div>`,
  },
  // 3 · Marco: doble filete dorado con esquinas cortadas, logotipo centrado y el mismo marco en el reverso sobre papel crema.
  3: {
    nombre: 'Marco',
    css: `
.f3 { background: radial-gradient(ellipse 80% 90% at 50% 40%, #6A2E22 0%, #54201F 55%, #3E1519 100%); }
.f3 .centro { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3mm; }
.f3 .emb { width: 15mm; height: 15mm; } .f3 .centro { gap: 2.2mm; } .f3 .marca { font-size: 9.8mm; } .f3 .rombo { width: 1.6mm; height: 1.6mm; background: ${C.amarillo}; transform: rotate(45deg); }
.f3 .tipo { font-size: 2.1mm; letter-spacing: .34em; padding-left: .34em; }
.r3 { background: radial-gradient(ellipse 100% 90% at 50% 0%, #F3ECDB, ${PAPEL.fondo} 62%, #E3D8C0); color: ${PAPEL.tinta}; }
.r3 .rev { position: absolute; inset: 0; padding: 10.5mm 11mm; display: grid; grid-template-columns: 1fr 21mm; column-gap: 5mm; align-items: center; }
.r3 .datos { display: flex; flex-direction: column; gap: 2.9mm; } .r3 .dato { font-size: 2.35mm; } .r3 .dato b { color: ${PAPEL.etiqueta}; } .r3 .placa { width: 21mm; height: 21mm; }
.r3 .qr p { font-size: 1.6mm; }`,
    frente: `<div class="cara f3">${marco(7.4, C.amarillo, .85)}<div class="centro">${emblema('claro', 'emb')}<div class="marca">Memphis <em>Belle</em></div><div class="tipo">Coctelería · Santa Cruz de Tenerife</div></div></div>`,
    reverso: (qr) => `<div class="cara r3">${marco(7.4, '#8A3A24', .9)}<div class="rev"><div class="datos">${datosHtml()}</div><div class="qr"><div class="placa">${qr(PAPEL.qr)}</div><p>Carta, horario<br>y cómo llegar</p></div></div></div>`,
  },
};

const qrCon = (color) => `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="${celdas}"/></svg>`;
const documento = (m, comp = '') => `<!doctype html><html lang="es"><meta charset="utf-8"><style>${base}${m.css}</style>${m.frente.replace('{{COMP}}', comp)}${m.reverso(qrCon)}</html>`;

(async () => {
  let playwright;
  try { playwright = require('playwright'); } catch { playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
  const browser = await playwright.chromium.launch();
  const px = (mm) => Math.ceil(mm / 25.4 * 96);
  for (const [n, m] of Object.entries(MODELOS)) {
    const dir = join(SALIDA, `modelo-${n}-${m.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()}`);
    mkdirSync(dir, { recursive: true });
    const archivo = join(dir, 'tarjeta.html');
    let comp = '';
    if (n === '2') {
      // Composición única de la foto con su degradado, a 300 ppp.
      const previo = join(dir, 'previo.html');
      writeFileSync(previo, `<!doctype html><meta charset="utf-8"><style>${base}${m.css}body{background:#5A2320}</style><div class="comp-origen"><div class="foto"></div><div class="vela"></div></div>`);
      const pg = await browser.newPage({ viewport: { width: px(71), height: px(61) }, deviceScaleFactor: 300 / 96 });
      await pg.goto(pathToFileURL(previo).href);
      comp = `data:image/png;base64,${(await (await pg.$('.comp-origen')).screenshot()).toString('base64')}`;
      await pg.close();
      rmSync(previo);
    }
    writeFileSync(archivo, documento(m, comp));
    const page = await browser.newPage({ viewport: { width: px(91), height: px(61) }, deviceScaleFactor: 300 / 96 });
    await page.goto(pathToFileURL(archivo).href);
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: join(dir, 'tarjeta-visita.pdf'), width: '91mm', height: '61mm', printBackground: true, preferCSSPageSize: true });
    const caras = await page.$$('.cara');
    for (const [i, nombre] of ['frente', 'reverso'].entries()) {
      await caras[i].screenshot({ path: join(dir, `${nombre}-con-sangrado.png`) });
      const b = await caras[i].evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; });
      const mm3 = 3 / 25.4 * 96;
      await page.screenshot({ path: join(dir, `${nombre}.png`), clip: { x: b.x + mm3, y: b.y + mm3, width: b.width - 2 * mm3, height: b.height - 2 * mm3 }, fullPage: true });
    }
    await page.close();
  }
  await browser.close();
  console.log(`Tarjetas generadas en ${SALIDA} (3 modelos; QR → ${corta})`);
})();
