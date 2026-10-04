// Tests de la web estática (lo que se publica en Cloudflare).
// Los valores esperados se toman de src/content/site.js siempre que es posible, para que un cambio
// de redacción no rompa los tests y un error de coherencia (carta, horario, enlaces) sí lo haga.
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, test } from 'node:test';

import { DIAS, abreEseDia, estado, resumen, textoEstado } from '../public/js/horario.js';
import { buildStatic } from '../scripts/build-static.js';
import { pendientes } from '../scripts/pendientes.js';
import { site } from '../src/content/site.js';
import { STATIC_CSP } from '../src/views/html.js';
import { ALERGENOS, NAV, featuredItem, menuHtml } from '../src/views/landing.js';
import { parsePrice, structuredDataObject } from '../src/views/schema.js';
import worker from '../worker/index.js';
import { DOMINIO, redireccion, sinExtension } from '../worker/redireccion.js';

const BASE = 'https://ejemplo.com/memphisbelle';
const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const outDir = mkdtempSync(join(tmpdir(), 'memphis-static-'));
let index;
const read = (file) => readFileSync(join(outDir, file), 'utf8');
const css = readFileSync(new URL('../public/css/site.css', import.meta.url), 'utf8');
const items = site.menu.sections.flatMap((s) => s.items);

before(() => {
  buildStatic({ outDir, publicBaseUrl: `${BASE}/` });
  index = read('index.html');
});
after(() => rmSync(outDir, { recursive: true, force: true }));

describe('construcción y publicación', () => {
  test('genera las páginas, el sitemap y las cabeceras de seguridad', () => {
    for (const file of ['index.html', 'carta.html', 'carta-en.html', 'privacidad.html', 'cookies.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers']) {
      assert.ok(statSync(join(outDir, file)).isFile(), file);
    }
    assert.ok(read('_headers').includes(`Content-Security-Policy: ${STATIC_CSP}; frame-ancestors 'none'`));
    assert.match(read('sitemap.xml'), new RegExp(`<loc>${BASE}/</loc>`));
    assert.match(read('404.html'), /<base href="\/">/);
  });

  test('sin recursos de terceros y con versión en CSS y JS', () => {
    for (const file of readdirSync(outDir).filter((f) => f.endsWith('.html'))) {
      const html = read(file);
      assert.ok(html.includes(`content="${STATIC_CSP}"`), `${file}: CSP`);
      const recursos = [...html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
      assert.ok(recursos.filter((r) => /^https?:/.test(r)).every((r) => r.startsWith(BASE)), `${file}: ${recursos}`);
    }
    assert.match(index, /assets\/css\/site\.css\?v=[0-9a-f]{10}/);
    assert.match(index, /<script type="module" src="assets\/js\/site\.js\?v=[0-9a-f]{10}">/);
  });

  test('los módulos que importa el navegador existen junto a site.js', () => {
    const js = readFileSync(join(outDir, 'assets/js/site.js'), 'utf8');
    for (const [, file] of js.matchAll(/from '\.\/([^']+)'/g)) assert.ok(statSync(join(outDir, 'assets/js', file)).isFile(), file);
  });

  test('wrangler.jsonc pasa los tests con la comprobación de publicación y publica dist/', () => {
    const config = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8').replace(/^\s*\/\/.*$/gm, ''));
    assert.equal(config.assets.directory, './dist');
    assert.equal(config.assets.not_found_handling, '404-page');
    assert.match(config.build.command, /^CHECK_PUBLICACION=1 npm test && /);
    // El dominio de worker/redireccion.js y el de wrangler.jsonc deben coincidir.
    if (DOMINIO) {
      assert.ok(config.build.command.includes(`PUBLIC_BASE_URL=https://${DOMINIO}`));
      assert.deepEqual(config.routes.map((r) => r.pattern), [DOMINIO, `www.${DOMINIO}`]);
    } else {
      assert.equal(config.routes, undefined);
    }
  });

  test('una sola dirección cuando haya dominio, y páginas .html sin redirección', async () => {
    assert.equal(redireccion(new URL('https://www.memphis.test/carta?a=1'), 'memphis.test'), 'https://memphis.test/carta?a=1');
    assert.equal(redireccion(new URL('https://memphisbelle.cuenta.workers.dev/'), 'memphis.test'), 'https://memphis.test/');
    assert.equal(redireccion(new URL('https://memphis.test/'), 'memphis.test'), null);
    assert.equal(redireccion(new URL('https://memphisbelle.cuenta.workers.dev/'), ''), null);
    assert.equal(sinExtension(new URL('https://memphis.test/privacidad.html')).pathname, '/privacidad');
    assert.equal(sinExtension(new URL('https://memphis.test/')), null);

    const env = { ASSETS: { fetch: async (req) => new Response(new URL(req.url).pathname) } };
    assert.equal(await (await worker.fetch(new Request('https://memphis.test/cookies.html'), env)).text(), '/cookies');
  });
});

describe('horario (hora de Canarias)', () => {
  const dias = site.hours.days;
  // Horario de prueba fijo, para que los casos no dependan de lo que ponga site.js.
  const tarde = { lunes: null, martes: null, miercoles: ['18:00', '02:00'], jueves: ['18:00', '02:00'], viernes: ['18:00', '02:00'], sabado: ['18:00', '02:00'], domingo: ['18:00', '02:00'] };
  const at = (iso) => estado(tarde, new Date(iso));

  test('abierto por la tarde y pasada la medianoche del día anterior', () => {
    assert.deepEqual(at('2026-10-02T19:50:00Z'), { abierto: true, cierra: '02:00' }); // viernes 20:50 (UTC+1)
    assert.deepEqual(at('2026-10-03T00:30:00Z'), { abierto: true, cierra: '02:00' }); // sábado 01:30, sigue el viernes
    assert.deepEqual(at('2026-10-05T00:30:00Z'), { abierto: true, cierra: '02:00' }); // lunes 01:30, sigue el domingo
  });

  test('cerrado: abre hoy, mañana o el próximo día de apertura', () => {
    assert.deepEqual(at('2026-10-03T01:30:00Z'), { abierto: false, abre: '18:00', cuando: 'hoy' }); // sábado 02:30
    assert.deepEqual(at('2026-10-06T12:00:00Z'), { abierto: false, abre: '18:00', cuando: 'mañana' }); // martes
    assert.deepEqual(at('2026-10-05T12:00:00Z'), { abierto: false, abre: '18:00', cuando: 'el miércoles' }); // lunes
  });

  test('usa la hora de Canarias también en invierno (UTC+0)', () => {
    assert.deepEqual(at('2026-12-04T18:30:00Z'), { abierto: true, cierra: '02:00' }); // viernes 18:30
    assert.deepEqual(at('2026-12-04T17:30:00Z'), { abierto: false, abre: '18:00', cuando: 'hoy' });
  });

  test('franjas que no pasan de medianoche y locales sin horario', () => {
    const mañanas = Object.fromEntries(DIAS.map((d) => [d, ['10:00', '14:00']]));
    assert.equal(estado(mañanas, new Date('2026-10-02T12:00:00Z')).abierto, true); // 13:00
    assert.deepEqual(estado(mañanas, new Date('2026-10-02T13:30:00Z')), { abierto: false, abre: '10:00', cuando: 'mañana' });
    assert.deepEqual(estado(Object.fromEntries(DIAS.map((d) => [d, null])), new Date()), { abierto: false });
    assert.equal(textoEstado({ abierto: true, cierra: '02:00' }), 'Abierto ahora, hasta las 02:00');
    assert.equal(textoEstado({ abierto: false, abre: '18:00', cuando: 'el miércoles' }), 'Cerrado. Abrimos el miércoles a las 18:00');
  });

  test('el formulario sabe qué días abre', () => {
    assert.equal(abreEseDia(tarde, '2026-10-06'), false); // martes
    assert.equal(abreEseDia(tarde, '2026-10-09'), true); // viernes
  });

  test('site.js tiene los siete días con franjas válidas', () => {
    assert.deepEqual(Object.keys(dias), DIAS);
    for (const franja of Object.values(dias).filter(Boolean)) {
      assert.equal(franja.length, 2);
      franja.forEach((h) => assert.match(h, /^([01]\d|2[0-3]):[0-5]\d$/));
    }
  });

  test('horario agrupado en pocas líneas: primero lo que abre, luego lo cerrado', () => {
    assert.deepEqual(resumen(tarde), ['De miércoles a domingo, de 18:00 a 02:00', 'Lunes y martes, cerrado']);
    const variado = { ...tarde, lunes: ['18:00', '02:00'], martes: null, miercoles: null, viernes: ['18:00', '03:00'] };
    assert.deepEqual(resumen(variado), ['Jueves, de 18:00 a 02:00', 'Viernes, de 18:00 a 03:00', 'De sábado a lunes, de 18:00 a 02:00', 'Martes y miércoles, cerrado']);
    assert.deepEqual(resumen(Object.fromEntries(DIAS.map((d) => [d, ['10:00', '14:00']]))), ['Todos los días, de 10:00 a 14:00']);
  });

  test('la web muestra el horario agrupado que sale de site.js', () => {
    const lineas = [...index.matchAll(/<ul class="horario-lineas">([\s\S]*?)<\/ul>/g)][0][1];
    assert.deepEqual([...lineas.matchAll(/<li>([^<]+)<\/li>/g)].map((m) => m[1].replace(/&nbsp;/g, ' ')), resumen(dias));
  });
});

describe('carta', () => {
  test('todos los platos de site.js aparecen con su precio', () => {
    for (const item of items) {
      assert.ok(index.includes(`<span class="plato-nombre">${item.name}</span><span class="guia" aria-hidden="true"></span><span class="importe">${item.price}</span>`), item.name);
    }
  });

  test('precios con el formato de la carta ("9,50 €")', () => {
    for (const item of items) assert.ok(parsePrice(item.price) > 0, item.name);
    assert.equal(parsePrice('9,50 €'), 9.5);
    assert.throws(() => parsePrice('desde 9 €'));
  });

  test('pestañas accesibles, una por sección, y sin JavaScript se ve todo', () => {
    for (const s of site.menu.sections) {
      assert.match(index, new RegExp(`role="tab" id="tab-${s.id}" aria-controls="carta-${s.id}"`));
      assert.match(index, new RegExp(`id="carta-${s.id}" aria-labelledby="tab-${s.id}"`));
    }
    assert.match(index, /role="tablist"[^>]*hidden/); // las pestañas solo aparecen con JavaScript
    assert.doesNotMatch(index, /role="tabpanel"[^>]*hidden/);
  });

  test('mientras la carta sea de ejemplo, se avisa en la propia carta', () => {
    assert.equal(index.includes('class="aviso-ejemplo"'), Boolean(site.menu.pendiente));
  });
});

describe('cóctel estrella', () => {
  test('está en la carta y la sección muestra el mismo precio', () => {
    if (!site.featured) return;
    const item = featuredItem(site);
    assert.ok(item, `"${site.featured.name}" debe estar en la carta`);
    const seccion = index.slice(index.indexOf('id="estrella"'), index.indexOf('id="carta"'));
    assert.ok(seccion.includes(`<h2 id="estrella-titulo">${site.featured.name}</h2>`));
    assert.ok(seccion.includes(`<p class="estrella-precio">${item.price}</p>`));
    for (const ingrediente of site.featured.ingredients) assert.ok(seccion.includes(`<li>${ingrediente}</li>`), ingrediente);
  });

  test('va justo después de la portada y sin foto no deja un hueco vacío', () => {
    if (!site.featured) return;
    assert.ok(index.indexOf('id="inicio"') < index.indexOf('id="estrella"'));
    assert.ok(index.indexOf('id="estrella"') < index.indexOf('id="carta"'));
    assert.equal(index.includes('class="estrella-foto"'), Boolean(site.featured.image));
  });
});

describe('el local, visítanos y reseñas', () => {
  const seccion = (id, siguiente) => index.slice(index.indexOf(`id="${id}"`), index.indexOf(`id="${siguiente}"`));

  test('el local: galería de fotos y tres datos debajo, sin cajas vacías', () => {
    const local = seccion('local', site.reviews.rating ? 'resenas' : 'reservar');
    const fotos = site.local.gallery.length;
    assert.equal((local.match(/<figure class="foto"/g) || []).length, fotos);
    assert.equal((local.match(/<img /g) || []).length, fotos);
    for (const g of site.local.gallery) assert.ok(local.includes(`alt="${g.alt}"`), g.alt);
    assert.equal((local.match(/class="mosaico-item/g) || []).length, site.local.items.length);
    assert.match(local, /class="mosaico-item grande"/);
    for (const item of site.local.items) assert.ok(local.includes(`<h3>${item.title}</h3>`), item.title);
    assert.ok(local.includes('mosaico con-fotos'));
  });

  test('visítanos: dirección, Cómo llegar, Llamar y WhatsApp, y "Abierto ahora"', () => {
    const visita = seccion('visitanos', 'local');
    assert.ok(visita.includes(site.address.street));
    assert.ok(visita.includes(site.googleMapsUrl.replace(/&/g, '&amp;')));
    assert.ok(visita.includes(`href="tel:+${site.phone}"`));
    assert.ok(visita.includes(`href="https://wa.me/${site.whatsapp.number}"`));
    assert.match(visita, /class="estado estado-info" data-horario=/);
    assert.equal(visita.includes('class="visita-foto"'), Boolean(site.visit.image));
  });

  test('"Déjanos una reseña en Google": franja visible y enlace en el pie, hacia Google', () => {
    const esperado = site.reviewCta.writeUrl || site.googleMapsUrl;
    const franja = seccion('opinion', 'visitanos');
    assert.ok(franja.includes(site.reviewCta.button));
    const enlace = (html) => new RegExp(`<a class="[^"]*" href="${escapeRe(esperado.replace(/&/g, '&amp;'))}" rel="noopener" target="_blank">`).test(html);
    assert.ok(enlace(franja), 'la franja enlaza a Google');
    const pie = index.slice(index.indexOf('<footer>'));
    assert.ok(pie.includes(`href="${esperado.replace(/&/g, '&amp;')}" rel="noopener" target="_blank">${site.reviewCta.button}`), 'el pie enlaza a Google');
    assert.match(esperado, /^https:\/\/(www\.google\.com\/maps|g\.page\/r\/|search\.google\.com\/local\/writereview|maps\.app\.goo\.gl|maps\.google\.com)/);
    // Es la sección 04: va entre la carta y "Visítanos".
    assert.ok(index.indexOf('id="carta"') < index.indexOf('id="opinion"') && index.indexOf('id="opinion"') < index.indexOf('id="visitanos"'));
    assert.match(franja, /<b>04<\/b> — Tu opinión/);
  });

  test('las reseñas solo aparecen si hay valoración de Google', () => {
    assert.equal(index.includes('id="resenas"'), Boolean(site.reviews.rating));
  });

  test('ya no queda la fila de tres columnas iguales ni la tabla de horario', () => {
    assert.doesNotMatch(index, /class="(info-grid|rasgos|horario")/);
  });
});

describe('portada y móvil', () => {
  test('el menú lleva a secciones que existen, en el mismo orden que la página', () => {
    const posiciones = NAV.map((item) => index.indexOf(`id="${item.id}"`));
    assert.ok(posiciones.every((p) => p > 0));
    assert.deepEqual([...posiciones].sort((a, b) => a - b), posiciones);
    for (const [, id] of index.matchAll(/href="#([^"]+)"/g)) assert.ok(index.includes(`id="${id}"`), id);
  });

  test('contacto: teléfono, WhatsApp, email, Instagram y Cómo llegar', () => {
    assert.ok(index.includes(`href="tel:+${site.phone}"`));
    assert.ok(index.includes(`href="https://wa.me/${site.whatsapp.number}"`));
    assert.ok(index.includes(`data-whatsapp="${site.whatsapp.number}"`));
    assert.ok(index.includes(`href="mailto:${site.email}"`));
    assert.ok(index.includes(`href="https://www.instagram.com/${site.instagram}/"`));
    assert.ok(index.includes(site.googleMapsUrl.replace(/&/g, '&amp;')));
  });

  test('se siente nativa en el móvil: hover solo con ratón, sin destello, sin zoom en campos y zona segura', () => {
    const sinBloquesHover = css.replace(/@media \(hover: hover\) and \(pointer: fine\)(?: and \([a-z-]+: [a-z-]+\))? \{[\s\S]*?\n\}/g, '');
    const hoverFuera = sinBloquesHover.split('\n').filter((l) => l.includes(':hover'));
    assert.deepEqual(hoverFuera, []);
    assert.match(css, /-webkit-tap-highlight-color: transparent/);
    assert.match(css, /\.btn:active \{ transform: scale\(0\.97\)/);
    assert.match(css, /font: 400 16px/); // campos del formulario a 16 px
    assert.match(index, /viewport-fit=cover/);
    assert.doesNotMatch(index, /user-scalable|maximum-scale/);
    assert.match(css, /env\(safe-area-inset-bottom/);
  });

  test('la portada: foto del B-17 (o, sin foto, el bombardero vectorial), decorativa y quieta si se pide', () => {
    const hero = index.slice(index.indexOf('id="inicio"'), index.indexOf('id="estrella"'));
    if (site.hero.image) {
      assert.match(hero, /<picture class="hero-foto">/);
      assert.match(hero, /<img [^>]*alt="[^"]*" [^>]*fetchpriority="high">/); // lo primero que se descarga
      assert.doesNotMatch(hero, /loading="lazy"/);
      assert.doesNotMatch(hero, /class="bombardero"/);
      for (const w of site.hero.image.widths) assert.ok(hero.includes(`${site.hero.image.src}-${w}.webp ${w}w`), w);
    } else {
      assert.match(hero, /<div class="bombardero" aria-hidden="true">/);
      const logoPath = /<path[^>]* d="([^"]+)"/.exec(readFileSync(new URL('../public/img/logo-belle.svg', import.meta.url), 'utf8'))[1];
      assert.ok(hero.includes(`d="${logoPath}"`), 'el nombre del morro es el trazado del logotipo');
    }
    // Ninguna animación de la portada fuera de "prefers-reduced-motion: no-preference".
    const fuera = css.replace(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n\}/g, '');
    assert.doesNotMatch(fuera, /animation: (flotar|girar 160ms|nubes|acercar)/);
  });

  test('las animaciones respetan "reducir movimiento" y no se usa transition: all', () => {
    const reducido = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
    assert.match(reducido, /\.cinta-pista, \.sello-anillo \{ animation: none; \}/);
    assert.match(reducido, /html\.js:not\(\.cargado\) \.hero-figura \{ clip-path: none; \}/);
    assert.doesNotMatch(css, /transition:\s*all/);
  });

  test('aviso de consumo responsable en todas las páginas', () => {
    for (const file of ['index.html', 'privacidad.html', 'cookies.html', '404.html']) assert.match(read(file), /menores de 18 años/);
  });
});

describe('textos legales', () => {
  test('sin datos del titular no se publica el aviso legal', () => {
    if (site.legal.owner) return;
    assert.doesNotMatch(index, /aviso-legal\.html/);
    assert.throws(() => statSync(join(outDir, 'aviso-legal.html')));
  });

  test('la web no guarda datos: el formulario solo abre WhatsApp y no hay cookies', () => {
    assert.doesNotMatch(index, /<form[^>]+action=/);
    assert.match(read('cookies.html'), /no utiliza cookies/);
  });
});

describe('datos estructurados para Google', () => {
  const data = () => JSON.parse(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/.exec(index)[1]);
  const bar = () => data()['@graph'][0];

  test('describen el bar: nombre, dirección, teléfono y mapa', () => {
    const b = bar();
    assert.equal(b['@type'], 'BarOrPub');
    assert.equal(b.name, site.fullName);
    assert.equal(b.telephone, `+${site.phone}`);
    assert.equal(b.address.streetAddress, site.address.street);
    assert.equal(b.geo.latitude, site.geo.lat);
    assert.equal(b.hasMap, site.googleMapsUrl);
  });

  test('el horario y la carta son los mismos que se ven en la web', () => {
    const b = bar();
    assert.equal(b.openingHoursSpecification.length, DIAS.filter((d) => site.hours.days[d]).length);
    const precios = b.hasMenu.hasMenuSection.flatMap((s) => s.hasMenuItem.map((i) => [i.name, i.offers.price]));
    assert.deepEqual(precios, items.map((i) => [i.name, parsePrice(i.price)]));
  });

  test('solo se generan si se conoce la dirección pública', () => {
    const dir = mkdtempSync(join(tmpdir(), 'memphis-sin-url-'));
    try {
      buildStatic({ outDir: dir, publicBaseUrl: '' });
      assert.doesNotMatch(readFileSync(join(dir, 'index.html'), 'utf8'), /application\/ld\+json/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
    assert.ok(structuredDataObject({ site, config: { publicBaseUrl: BASE } }));
  });
});

describe('datos pendientes', () => {
  test('se encuentran en cualquier nivel de site.js', () => {
    const encontrados = pendientes('pendiente', { a: { pendiente: 'x' }, b: [{ pendiente: '' }, { c: { pendiente: 'y' } }] });
    assert.deepEqual(encontrados, [{ donde: 'a', que: 'x' }, { donde: 'b.1.c', que: 'y' }]);
  });
});

describe('página de la carta (QR de las mesas)', () => {
  const es = () => read('carta.html');
  const en = () => read('carta-en.html');

  test('declara su idioma y enlaza con la otra versión', () => {
    assert.match(es(), /<html lang="es"/);
    assert.match(en(), /<html lang="en"/);
    assert.match(es(), /href="carta-en\.html"/);
    assert.match(en(), /href="carta\.html"/);
    for (const html of [es(), en()]) {
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="es" href="${escapeRe(BASE)}/carta\\.html">`));
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="en" href="${escapeRe(BASE)}/carta-en\\.html">`));
    }
    assert.match(read('sitemap.xml'), /carta-en\.html/);
  });

  test('es solo la carta: sin portada, reservas ni navegación de la web', () => {
    for (const html of [es(), en()]) {
      assert.doesNotMatch(html, /class="hero/);
      assert.doesNotMatch(html, /id="reservar"/);
      assert.doesNotMatch(html, /barra-movil/);
      assert.match(html, /<h1[^>]*>/);
    }
  });

  test('lleva todos los platos con su precio, en ambos idiomas', () => {
    for (const item of items) {
      assert.ok(es().includes(item.name), item.name);
      assert.ok(en().includes(item.nameEn || item.name), item.name);
      if (item.textEn) assert.ok(en().includes(item.textEn), item.name);
    }
    assert.equal((es().match(/class="plato"/g) || []).length, items.length);
    assert.equal((en().match(/class="plato"/g) || []).length, items.length);
  });

  test('termina con el enlace para dejar una reseña en Google', () => {
    for (const html of [es(), en()]) {
      assert.ok(html.includes(`href="${site.reviewCta.writeUrl || site.googleMapsUrl}"`));
    }
    assert.match(es(), /Déjanos una reseña en Google/);
    assert.match(en(), /Leave us a Google review/);
  });

  test('los alérgenos de cada plato salen en el idioma de la página', () => {
    const conAlergenos = { ...site, menu: { ...site.menu, sections: site.menu.sections.map((s, i) => (i ? s : { ...s, items: s.items.map((it, j) => (j ? it : { ...it, allergens: ['gluten', 'sulfitos'] })) })) } };
    const html = (idioma) => menuHtml(conAlergenos, { idioma, titulo: 'h1' });
    assert.ok(html('es').includes(ALERGENOS.gluten[0]) && html('es').includes(ALERGENOS.sulfitos[0]));
    assert.ok(html('en').includes(ALERGENOS.gluten[1]) && html('en').includes(ALERGENOS.sulfitos[1]));
  });

  test('el estado «abierto ahora» también está en inglés', () => {
    const e = estado(site.hours.days, new Date('2026-01-07T19:00:00Z'));
    assert.match(textoEstado(e, 'es'), /[AaCc]/);
    assert.notEqual(textoEstado(e, 'en'), textoEstado(e, 'es'));
  });
});

describe('diseño editorial (híbrido)', () => {
  test('sin estilos en línea ni scripts en línea: la CSP no los admite', () => {
    for (const file of ['index.html', 'carta.html', 'carta-en.html', 'privacidad.html', '404.html']) {
      const html = read(file);
      assert.doesNotMatch(html, /\sstyle="/, file);
      assert.doesNotMatch(html, /<style[\s>]/, file);
      assert.doesNotMatch(html, /<script(?![^>]*(?:\ssrc=|application\/ld\+json))[^>]*>/, file);
    }
  });

  test('las tipografías están alojadas en la web y precargadas', () => {
    for (const f of ['instrument-serif', 'instrument-serif-italic', 'geist', 'geist-mono']) {
      assert.ok(statSync(join(outDir, 'assets/fonts', `${f}.woff2`)).isFile(), f);
      assert.match(index, new RegExp(`rel="preload" href="assets/fonts/${f}\\.woff2`));
      assert.ok(css.includes(`../fonts/${f}.woff2`), f);
    }
    assert.match(index, /<script src="assets\/js\/ini\.js/);
  });

  test('los retardos de las ilustraciones salen de reglas data-s del CSS', () => {
    const usados = new Set([...index.matchAll(/data-s="(\d+)"/g)].map((m) => m[1]));
    assert.ok(usados.size > 0);
    for (const n of usados) assert.ok(css.includes(`[data-s="${n}"]`), `data-s=${n}`);
    for (const n of new Set([...index.matchAll(/data-s="(i\d)"/g)].map((m) => m[1]))) assert.ok(css.includes(`[data-s="${n}"]`), n);
  });

  test('El oficio: una escena por elemento de site.js y botón para pausar (oculto hasta que hay JavaScript)', () => {
    const oficio = index.slice(index.indexOf('id="oficio"'), index.indexOf('id="carta"'));
    assert.equal((oficio.match(/class="oficio-item/g) || []).length, site.oficio.items.length);
    assert.match(oficio, /class="pausa-anim"[^>]*hidden/);
    for (const item of site.oficio.items) assert.ok(oficio.includes(`<h3>${item.title}</h3>`), item.title);
    assert.equal((oficio.match(/<svg[^>]*role="img"[^>]*aria-label=/g) || []).length, site.oficio.items.length);
  });

  test('los clásicos destacados llevan el precio de la carta', () => {
    const carta = index.slice(index.indexOf('class="carta-destacada"'), index.indexOf('class="papel"'));
    for (const h of site.highlights) {
      const precio = items.find((i) => i.name === h.name).price;
      assert.ok(carta.includes(`<h3>${h.name}</h3>`), h.name);
      assert.ok(carta.includes(`· ${precio}`), `${h.name} ${precio}`);
    }
  });

  test('la cinta de la portada es decorativa y sus nombres salen de site.js', () => {
    const cinta = index.slice(index.indexOf('class="cinta"'), index.indexOf('id="estrella"'));
    assert.match(cinta, /class="cinta" aria-hidden="true"/);
    for (const t of site.cinta) assert.ok(cinta.includes(t), t);
  });

  test('las fotos existen en WebP y JPG', () => {
    const fotos = [...site.bar.photos.map((f) => ({ src: f.src, widths: [640] })), ...site.local.gallery];
    for (const f of fotos) for (const w of f.widths) for (const ext of ['webp', 'jpg']) assert.ok(statSync(join(outDir, 'assets', `${f.src}-${w}.${ext}`)).isFile(), `${f.src}-${w}.${ext}`);
  });

  test('menú móvil a pantalla completa y enlace para saltar al contenido', () => {
    assert.match(index, /class="saltar" href="#contenido"/);
    assert.match(index, /<main id="contenido"/);
    assert.match(index, /class="menu-movil" id="menu-movil"/);
    assert.match(index, /aria-controls="menu-movil"/);
    for (const item of NAV) assert.ok(index.includes(`class="enlace" data-s="i${NAV.indexOf(item)}" href="#${item.id}"`), item.id);
  });
});

describe('correcciones de la auditoría', () => {
  const niveles = (html) => [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  const sinSaltos = (html) => niveles(html).every((n, i, a) => i === 0 || n <= a[i - 1] + 1);

  test('los encabezados no se saltan niveles en ninguna página', () => {
    for (const file of ['index.html', 'carta.html', 'carta-en.html', 'privacidad.html', 'cookies.html', '404.html']) {
      assert.equal(niveles(read(file))[0], 1, `${file} empieza en h1`);
      assert.ok(sinSaltos(read(file)), `${file}: ${niveles(read(file)).join('')}`);
    }
    assert.equal((read('carta.html').match(/<h1[\s>]/g) || []).length, 1);
  });

  test('todas las páginas llevan el menú completo hacia la portada (también legales y 404)', () => {
    for (const file of ['privacidad.html', 'cookies.html', '404.html']) {
      const html = read(file);
      for (const item of NAV) assert.ok(html.includes(`href="#${item.id}"`) || html.includes(`#${item.id}"`), `${file} ${item.id}`);
      assert.equal((html.match(/class="enlace"/g) || []).length, NAV.length, file);
    }
  });

  test('los campos de texto del formulario declaran su tipo', () => {
    assert.doesNotMatch(index, /<input(?![^>]*\stype=)[^>]*>/);
  });

  test('el JavaScript marca como vistas las entradas que se saltan y deja fuera del menú el enlace de saltar', () => {
    const js = readFileSync(new URL('../public/js/site.js', import.meta.url), 'utf8');
    assert.match(js, /getBoundingClientRect\(\)\.bottom < 0/);
    assert.match(js, /querySelector\('\.saltar'\)/);
    assert.match(js, /min-width: 1101px/);
  });

  test('la cabecera pasa a menú móvil antes de que el menú choque con la marca', () => {
    assert.match(css, /@media \(max-width: 1100px\) \{\s*\.principal \{ display: none; \}/);
  });

  test('objetivos táctiles de 44 px en marca y enlaces del pie', () => {
    assert.match(css, /\.marca \{ min-height: 44px; \}/);
    assert.match(css, /\.pie-fila a \{ padding-block: \.95rem; \}/);
  });
});

describe('fotos de la galería y de los cócteles', () => {
  // Lee el tamaño de un JPG (marcador SOF) sin dependencias.
  const tamano = (file) => {
    const b = readFileSync(file);
    for (let i = 2; i < b.length;) {
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
    throw new Error(file);
  };

  test('cada versión de una foto tiene su ancho y la misma proporción que la declarada en site.js', () => {
    const fotos = [...site.local.gallery, ...site.bar.photos.map((f) => ({ ...f, widths: [640], width: 624, height: 1104 }))];
    for (const f of fotos) {
      for (const w of f.widths) {
        const { w: ancho, h } = tamano(join(outDir, 'assets', `${f.src}-${w}.jpg`));
        assert.ok(Math.abs(ancho - w) <= 16, `${f.src}-${w}.jpg mide ${ancho} px`);
        if (site.local.gallery.includes(f)) assert.ok(Math.abs(ancho / h - f.width / f.height) < 0.03, `${f.src}-${w}.jpg tiene otra proporción (${ancho}×${h}): ¿es otra foto?`);
      }
    }
  });
});
