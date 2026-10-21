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
import { STATIC_CSP, esc } from '../src/views/html.js';
import { CABECERAS_SEGURIDAD } from '../src/seguridad.js';
import { ALERGENOS, NAV, menuHtml } from '../src/views/landing.js';
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
    for (const file of ['index.html', 'en.html', 'carta.html', 'carta-en.html', 'privacidad.html', 'cookies.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers']) {
      assert.ok(statSync(join(outDir, file)).isFile(), file);
    }
    assert.ok(read('_headers').includes(`Content-Security-Policy: ${STATIC_CSP}; frame-ancestors 'none'`));
    assert.match(read('sitemap.xml'), new RegExp(`<loc>${BASE}/</loc>`));
    assert.match(read('404.html'), /<base href="\/">/);
  });

  test('no promete reservas en ninguna página (el local no las admite)', () => {
    for (const file of ['index.html', 'en.html', 'carta.html', 'carta-en.html', 'privacidad.html', 'cookies.html']) {
      const texto = read(file).replace(/sin reservas|no bookings|acceptsReservations/gi, '');
      assert.doesNotMatch(texto, /reserv|booking/i, file);
    }
    assert.match(index, /"acceptsReservations":\s*false/);
  });

  test('el pie lleva el crédito de la web con enlace en todas las páginas', () => {
    for (const file of ['index.html', 'en.html', 'carta.html', 'carta-en.html', 'privacidad.html', 'cookies.html']) {
      assert.ok(read(file).includes(`<a href="${site.credit.url}" rel="noopener noreferrer" target="_blank">${site.credit.name}</a>`), file);
    }
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
      assert.ok(config.routes.some((r) => r.pattern === DOMINIO && r.custom_domain === true));
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

  test('sabe qué días abre', () => {
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
      const nombre = esc(item.name).replace(/ (con fruta)$/, ' <em>$1</em>');
      assert.ok(index.includes(`<span class="plato-nombre">${nombre}</span><span class="plato-precio">${item.price}</span>`), item.name);
    }
  });

  test('precios con el formato de la carta ("9,50 €", "10 €" o un rango "10 / 12 €")', () => {
    for (const item of items) assert.ok(parsePrice(item.price) > 0, item.name);
    assert.equal(parsePrice('9,50 €'), 9.5);
    assert.equal(parsePrice('10 / 12 €'), 10);
    assert.throws(() => parsePrice('desde 9 €'));
  });

  test('la carta es una hoja con todas las secciones seguidas, con su índice de enlaces y sin pestañas', () => {
    for (const sec of site.menu.sections) {
      assert.match(index, new RegExp(`<section class="carta-seccion" id="carta-${sec.id}" aria-labelledby="carta-${sec.id}-t">`));
      assert.match(index, new RegExp(`<a href="#carta-${sec.id}">${escapeRe(sec.name)}</a>`));
    }
    assert.doesNotMatch(index, /role="tab/);
    assert.doesNotMatch(index, /class="pestana/);
  });

  test('es la carta real: sin aviso de ejemplo y con "De barril" en la sección de copas', () => {
    assert.ok(!site.menu.pendiente);
    assert.doesNotMatch(index, /aviso-ejemplo/);
    assert.ok(index.includes(`<b>${site.menu.barril.label}</b>`));
  });
});

describe('el local, visítanos y reseñas', () => {
  const seccion = (id, siguiente) => index.slice(index.indexOf(`id="${id}"`), index.indexOf(`id="${siguiente}"`));

  test('el bar: banda de foto a sangre y una fila con las fotos de los cócteles', () => {
    const bar = seccion('bar', 'opinion');
    assert.match(bar, /class="bar-foto"/);
    assert.equal((bar.match(/<figure class="foto"/g) || []).length, site.bar.photos.length);
    for (const f of site.bar.photos) assert.ok(bar.includes(`alt="${f.alt}"`), f.alt);
  });

  test('visítanos: dirección, Cómo llegar, horario con "Abierto ahora" y sin reservas', () => {
    const visita = index.slice(index.indexOf('id="visitanos"'), index.indexOf('</main>'));
    assert.ok(visita.includes(site.address.street));
    assert.ok(visita.includes(site.googleMapsUrl.replace(/&/g, '&amp;')));
    assert.doesNotMatch(visita, /tel:/);
    assert.doesNotMatch(visita, /wa\.me|WhatsApp/i);
    assert.match(visita, /class="estado estado-info" data-horario=/);
    assert.ok(visita.includes(site.visit.place));
    assert.doesNotMatch(index, /<form|id="reservar"|Reservar mesa/);
  });

  test('"Déjanos una reseña en Google": franja visible y enlace en el pie, hacia Google', () => {
    const esperado = site.reviewCta.writeUrl || site.googleMapsUrl;
    const franja = seccion('opinion', site.reviews.rating ? 'resenas' : 'visitanos');
    assert.ok(franja.includes(site.reviewCta.button));
    const enlace = (html) => new RegExp(`<a class="[^"]*" href="${escapeRe(esperado.replace(/&/g, '&amp;'))}" rel="noopener noreferrer" target="_blank"[ >]`).test(html);
    assert.ok(enlace(franja), 'la franja enlaza a Google');
    const pie = index.slice(index.indexOf('<footer>'));
    assert.ok(pie.includes(`href="${esperado.replace(/&/g, '&amp;')}" rel="noopener noreferrer" target="_blank">${site.reviewCta.button}`), 'el pie enlaza a Google');
    assert.match(esperado, /^https:\/\/(www\.google\.com\/maps|g\.page\/r\/|search\.google\.com\/local\/writereview|maps\.app\.goo\.gl|share\.google\/|maps\.google\.com)/);
    // Va tras el bar y antes de "Visítanos".
    assert.ok(index.indexOf('id="bar"') < index.indexOf('id="opinion"') && index.indexOf('id="opinion"') < index.indexOf('id="visitanos"'));
  });

  test('las reseñas solo aparecen si hay valoración de Google', () => {
    assert.equal(index.includes('id="resenas"'), Boolean(site.reviews.rating));
  });

  test('ya no queda la fila de tres columnas iguales, la tabla de horario ni el cóctel estrella', () => {
    assert.doesNotMatch(index, /class="(info-grid|rasgos|horario"|estrella")/);
  });
});

describe('portada y móvil', () => {
  test('el menú lleva a secciones que existen, en el mismo orden que la página', () => {
    const posiciones = NAV.map((item) => index.indexOf(`id="${item.id}"`));
    assert.ok(posiciones.every((p) => p > 0));
    assert.deepEqual([...posiciones].sort((a, b) => a - b), posiciones);
    for (const [, id] of index.matchAll(/href="#([^"]+)"/g)) assert.ok(index.includes(`id="${id}"`), id);
  });

  test('contacto: email, Instagram y Cómo llegar', () => {
    assert.doesNotMatch(index, /tel:/);
    assert.doesNotMatch(index, /wa\.me/);
    assert.ok(index.includes(`href="mailto:${site.email}"`));
    assert.ok(index.includes(`href="https://www.instagram.com/${site.instagram}/"`));
    assert.ok(index.includes(site.googleMapsUrl.replace(/&/g, '&amp;')));
  });

  test('se siente nativa en el móvil: hover solo con ratón, sin destello y zona segura', () => {
    const sinBloquesHover = css.replace(/@media \(hover: hover\) and \(pointer: fine\)(?: and \([a-z-]+: [a-z-]+\))? \{[\s\S]*?\n\}/g, '');
    const hoverFuera = sinBloquesHover.split('\n').filter((l) => l.includes(':hover'));
    assert.deepEqual(hoverFuera, []);
    assert.match(css, /-webkit-tap-highlight-color: transparent/);
    assert.match(css, /\.btn:active \{ transform: scale\(0\.97\)/);
    assert.match(index, /viewport-fit=cover/);
    assert.doesNotMatch(index, /user-scalable|maximum-scale/);
    assert.match(css, /env\(safe-area-inset-bottom/);
  });

  test('la portada: foto del B-17 (o, sin foto, el bombardero vectorial), decorativa y quieta si se pide', () => {
    const hero = index.slice(index.indexOf('id="inicio"'), index.indexOf('class="cinta"'));
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
    assert.match(reducido, /\.cinta-pista \{ animation: none; \}/);
    assert.match(reducido, /html\.js:not\(\.cargado\) \.hero-foto img \{ scale: 1; \}/);
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

  test('la web no guarda datos: no hay formularios y no hay cookies', () => {
    assert.doesNotMatch(index, /<form/);
    assert.match(read('cookies.html'), /no utiliza cookies/);
  });
});

describe('datos estructurados para Google', () => {
  const data = () => JSON.parse(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/.exec(index)[1]);
  const bar = () => data()['@graph'][0];

  test('describen el bar: nombre, dirección y mapa', () => {
    const b = bar();
    assert.equal(b['@type'], 'BarOrPub');
    assert.equal(b.name, site.fullName);
    assert.equal(b.telephone, undefined);
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
      assert.ok(es().includes(esc(item.name).replace(/ con fruta$/, ' <em>con fruta</em>')), item.name);
      assert.ok(en().includes(esc(item.nameEn || item.name).replace(/ with fruit$/, ' <em>with fruit</em>')), item.name);
      if (item.textEn) assert.ok(en().includes(esc(item.textEn)), item.name);
    }
    assert.equal((es().match(/class="plato-linea"/g) || []).length, items.length);
    assert.equal((en().match(/class="plato-linea"/g) || []).length, items.length);
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
    for (const f of ['instrument-serif', 'instrument-serif-italic', 'geist', 'poppins-500']) {
      assert.ok(statSync(join(outDir, 'assets/fonts', `${f}.woff2`)).isFile(), f);
      assert.match(index, new RegExp(`rel="preload" href="assets/fonts/${f}\\.woff2`));
      assert.ok(css.includes(`../fonts/${f}.woff2`), f);
    }
    assert.match(index, /<script src="assets\/js\/ini\.js/);
  });

  test('los retardos escalonados salen de reglas data-s del CSS y ya no hay sección de oficio ni ilustraciones animadas', () => {
    assert.doesNotMatch(index, /id="oficio"|pausa-anim|ilustracion-/);
    for (const n of new Set([...index.matchAll(/data-s="(i\d)"/g)].map((m) => m[1]))) assert.ok(css.includes(`[data-s="${n}"]`), n);
  });

  test('bajo la carta van las fotos de site.menu.photos y ya no hay copas animadas', () => {
    const fotos = index.slice(index.indexOf('class="carta-fotos"'), index.indexOf('id="bar"'));
    assert.equal((fotos.match(/class="carta-foto"/g) || []).length, site.menu.photos.length);
    for (const f of site.menu.photos) assert.ok(fotos.includes(`alt="${f.alt}"`), f.alt);
    assert.doesNotMatch(index, /coctel-icono|class="producto/);
  });

  test('la cinta de la portada es decorativa y sus nombres salen de site.js', () => {
    const cinta = index.slice(index.indexOf('class="cinta"'), index.indexOf('id="bar"'));
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
    assert.match(css, /@media \(max-width: 1100px\)[\s\S]*?\.principal \{ display: none; \}/);
  });

  test('objetivos táctiles de 44 px en marca y enlaces del pie', () => {
    assert.match(css, /\.marca \{[^}]*min-height: 44px/);
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

describe('selector de idioma: español / inglés', () => {
  const en = () => read('en.html');
  const ids = (html) => [...html.matchAll(/\sid="([a-z-]+)"/g)].map((m) => m[1]).filter((id) => !id.startsWith('tab-') && !id.startsWith('carta-') && !id.startsWith('mb-'));

  test('la portada tiene versión en inglés con su idioma, hreflang y sitemap', () => {
    assert.match(en(), /<html lang="en"/);
    assert.match(index, /<html lang="es"/);
    for (const html of [index, en()]) {
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="es" href="${escapeRe(BASE)}/">`));
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="en" href="${escapeRe(BASE)}/en\\.html">`));
    }
    assert.match(en(), new RegExp(`<link rel="canonical" href="${escapeRe(BASE)}/en\\.html">`));
    assert.match(read('sitemap.xml'), /en\.html/);
  });

  test('el selector está en la cabecera de las dos versiones y lleva a la otra', () => {
    assert.match(index, /<a class="idioma" href="en\.html" lang="en" hreflang="en" aria-label="View in English">EN<\/a>/);
    assert.match(en(), /<a class="idioma" href="\.\/" lang="es" hreflang="es" aria-label="Ver en español">ES<\/a>/);
  });

  test('en inglés se traduce el contenido y la interfaz, y la estructura es la misma', () => {
    const h = en();
    assert.ok(h.includes(site.en.hero.title[0]) && h.includes(site.en.hero.lead));
    assert.ok(h.includes(site.en.title));
    assert.ok(h.includes(`alt="${site.en.local.gallery[0].alt}"`));
    for (const t of ['See the menu', 'Get directions', 'Opening hours', 'Wednesday to Sunday, 18:00 to 02:00', 'The full menu', 'Moscow Mule', 'Vodka, ginger beer and lime']) assert.ok(h.includes(t), t);
    for (const sp of ['Ver la carta', 'Cómo llegar', 'De miércoles a domingo', 'Escríbenos', 'Toda la carta']) assert.ok(!h.includes(sp), `queda en español: ${sp}`);
    assert.deepEqual(ids(h), ids(index));
    assert.ok(h.includes('Leave us a Google review') && h.includes('href="carta-en.html"'));
  });

  test('cada elemento traducido de site.en corresponde a uno del español (mismo número de piezas)', () => {
    assert.equal(site.en.local.gallery.length, site.local.gallery.length);
    assert.equal(site.en.bar.photos.length, site.bar.photos.length);
    assert.equal(site.en.hero.foot.length, site.hero.foot.length);
    assert.equal(site.en.cinta.length, site.cinta.length);
  });

  test('el horario agrupado también sale en inglés', () => {
    assert.deepEqual(resumen(site.hours.days, 'en'), ['Wednesday to Sunday, 18:00 to 02:00', 'Monday and Tuesday, closed']);
  });
});

describe('diseño de la portada: intro, carta al abrir y pestañas', () => {
  const js = readFileSync(new URL('../public/js/site.js', import.meta.url), 'utf8');
  const ini = readFileSync(new URL('../public/js/ini.js', import.meta.url), 'utf8');

  test('la intro de marca solo está en la portada (es y en) y la activa ini.js, nunca con movimiento reducido', () => {
    for (const file of ['index.html', 'en.html']) {
      assert.match(read(file), /<html lang="\w\w" data-intro>/, file);
      assert.match(read(file), /<div class="intro-pantalla" aria-hidden="true">/, file);
    }
    for (const file of ['carta.html', 'carta-en.html', 'privacidad.html', 'cookies.html', '404.html']) {
      assert.doesNotMatch(read(file), /data-intro|intro-pantalla/, file);
    }
    assert.match(ini, /hasAttribute\('data-intro'\)/);
    assert.match(ini, /sessionStorage\.getItem\('mb-intro'\)/);
    assert.match(ini, /prefers-reduced-motion: reduce/);
    assert.match(css, /html\.intro \.intro-pantalla/);
    assert.match(css, /html\.js \[data-reveal\]:not\(\.visto\)/);
  });

  test('la intro lleva el nombre del bar', () => {
    assert.match(index, /class="intro-marca"><span>Memphis/);
    assert.match(read('en.html'), /class="intro-marca"><span>Memphis/);
  });

  test('la portada abre arriba (o en la sección del enlace), se puede saltar la intro y la carta no necesita JavaScript', () => {
    assert.match(js, /const carta = document\.querySelector\('\.hero'\) \? destino : null/);
    assert.match(js, /behavior: 'instant'/);
    assert.match(js, /setTimeout\(salir, 2100\)/);
    assert.match(js, /\['pointerdown', 'keydown', 'wheel', 'touchstart'\]/);
  });

  test('los CTA de la portada son "Ver la carta" y "Cómo llegar", sin reservas', () => {
    const hero = index.slice(index.indexOf('class="hero-ctas"'), index.indexOf('class="hero-figura'));
    assert.ok(hero.includes(`href="#carta"`) && hero.includes(site.hero.cta));
    assert.ok(hero.includes(site.googleMapsUrl.replace(/&/g, '&amp;')) && hero.includes(site.hero.secondary));
    assert.doesNotMatch(index, /Reservar|reservar/);
  });

  test('cada sección de la carta tiene su introducción y la de copas lleva "De barril"', () => {
    for (const sec of site.menu.sections) assert.ok(index.includes(`<p class="panel-intro">${sec.intro}</p>`), sec.id);
    assert.ok(site.menu.sections.flatMap((x) => x.items).length >= 23);
  });
});

describe('mapa de Google en "Visítanos"', () => {
  test('no hay iframe hasta que se pide: solo la previa, con el botón oculto sin JavaScript y el aviso de cookies', () => {
    for (const html of [index, read('en.html')]) {
      const visita = html.slice(html.indexOf('id="visitanos"'));
      assert.doesNotMatch(visita, /<iframe/);
      assert.match(visita, /class="mapa" data-mapa="https:\/\/www\.google\.com\/maps\?q=28\.468885,-16\.2608065&amp;z=17&amp;hl=(es|en)&amp;output=embed"/);
      assert.match(visita, /class="btn btn-claro mapa-cargar" type="button" hidden>/);
      assert.ok(visita.includes(`href="${site.googleMapsUrl.replace(/&/g, '&amp;')}"`)); // el botón "Cómo llegar" abre Maps
      assert.match(visita, /href="cookies\.html"/);
    }
  });
  test('la CSP solo admite google.com como marco y el JS crea el iframe al pulsar', () => {
    assert.match(STATIC_CSP, /frame-src https:\/\/www\.google\.com;/);
    assert.doesNotMatch(STATIC_CSP, /frame-src[^;]*\*/);
    assert.match(read('assets/js/site.js'), /createElement\('iframe'\)/);
    assert.match(read('cookies.html'), /Mapa de Google Maps/);
  });
});

describe('seguridad', () => {
  test('la CSP no admite nada externo salvo el marco de Google, ni scripts o estilos en línea, y exige Trusted Types', () => {
    assert.doesNotMatch(STATIC_CSP, /unsafe-inline|unsafe-eval|\*|http:/);
    assert.match(STATIC_CSP, /default-src 'self'/);
    assert.match(STATIC_CSP, /script-src 'self'(;|$)/);
    assert.match(STATIC_CSP, /require-trusted-types-for 'script'/);
    assert.match(STATIC_CSP, /object-src 'none'/);
    assert.match(STATIC_CSP, /base-uri 'self'/);
  });

  test('_headers lleva todas las cabeceras de seguridad (HSTS, nosniff, X-Frame-Options, COOP…) y la CSP completa', () => {
    const h = read('_headers');
    for (const nombre of Object.keys(CABECERAS_SEGURIDAD)) assert.ok(h.includes(`  ${nombre}: `), nombre);
    assert.match(h, /frame-ancestors 'none'; upgrade-insecure-requests/);
    assert.match(h, /Strict-Transport-Security: max-age=31536000/);
  });

  test('la meta CSP de las páginas no lleva upgrade-insecure-requests (rompería la vista previa local)', () => {
    assert.doesNotMatch(index, /upgrade-insecure-requests|frame-ancestors/);
  });

  test('todo enlace que abre otra pestaña lleva noopener noreferrer', () => {
    for (const file of ['index.html', 'en.html', 'carta.html', 'carta-en.html', 'privacidad.html', 'cookies.html']) {
      for (const [a] of read(file).matchAll(/<a [^>]*target="_blank"[^>]*>/g)) assert.match(a, /rel="noopener noreferrer"/, `${file}: ${a}`);
    }
  });

  test('el Worker rechaza métodos que no leen, redirige y pone las cabeceras en todas las respuestas', async () => {
    const { default: worker } = await import('../worker/index.js');
    const env = { ASSETS: { fetch: async () => new Response('<h1>ok</h1>', { status: 200, headers: { 'Content-Type': 'text/html', Server: 'x' } }) } };
    const post = await worker.fetch(new Request('https://memphisbelle.alcanceisleno.com/', { method: 'POST', body: 'x' }), env);
    assert.equal(post.status, 405);
    assert.equal(post.headers.get('X-Content-Type-Options'), 'nosniff');
    const ok = await worker.fetch(new Request('https://memphisbelle.alcanceisleno.com/'), env);
    assert.equal(ok.status, 200);
    assert.equal(ok.headers.get('X-Frame-Options'), 'DENY');
    assert.equal(ok.headers.get('Server'), null);
    assert.match(ok.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
    const redir = await worker.fetch(new Request('https://memphisbelle.workers.dev/carta'), env);
    assert.equal(redir.status, 301);
    assert.equal(redir.headers.get('Strict-Transport-Security'), 'max-age=31536000; includeSubDomains');
  });

  test('el JavaScript no usa vías de inyección (innerHTML, eval, document.write…)', () => {
    for (const f of ['site.js', 'horario.js', 'ini.js']) {
      const js = readFileSync(new URL(`../public/js/${f}`, import.meta.url), 'utf8');
      assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML|eval\(|new Function|document\.write|srcdoc/, f);
    }
  });
});

describe('alérgenos de la carta', () => {
  const conAlergenos = items.filter((i) => i.allergens && i.allergens.length);
  test('los platos con alérgenos los muestran en español e inglés, y solo con claves válidas de los 14', () => {
    assert.ok(conAlergenos.length >= 10);
    const validas = ['gluten', 'crustaceos', 'huevos', 'pescado', 'cacahuetes', 'soja', 'lacteos', 'frutos_secos', 'apio', 'mostaza', 'sesamo', 'sulfitos', 'altramuces', 'moluscos'];
    for (const i of conAlergenos) for (const k of i.allergens) assert.ok(validas.includes(k), `${i.name}: ${k}`);
    assert.equal((index.match(/class="plato-alergenos"/g) || []).length, conAlergenos.length);
    assert.equal((read('en.html').match(/class="plato-alergenos"/g) || []).length, conAlergenos.length);
    assert.match(index, /<span>Alérgenos:<\/span> sulfitos/);
    assert.match(read('en.html'), /<span>Allergens:<\/span> sulphites/);
  });
  test('la carta avisa de que los alérgenos son los de la receta base y de que se pregunte antes de pedir', () => {
    assert.ok(index.includes(`<p class="carta-nota">${site.menu.allergensNote}</p>`));
    assert.ok(read('en.html').includes('class="carta-nota"'));
    assert.match(site.menu.allergensNote, /dínoslo antes de pedir/);
  });
});
