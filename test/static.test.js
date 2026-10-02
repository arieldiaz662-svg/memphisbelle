// Tests de la web estática (lo que se publica en Cloudflare).
// Los valores esperados se toman de src/content/site.js siempre que es posible, para que un cambio
// de redacción no rompa los tests y un error de coherencia (carta, horario, enlaces) sí lo haga.
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, test } from 'node:test';

import { DIAS, abreEseDia, estado, textoEstado } from '../public/js/horario.js';
import { buildStatic } from '../scripts/build-static.js';
import { pendientes } from '../scripts/pendientes.js';
import { site } from '../src/content/site.js';
import { STATIC_CSP } from '../src/views/html.js';
import { NAV, featuredItem } from '../src/views/landing.js';
import { parsePrice, structuredDataObject } from '../src/views/schema.js';
import worker from '../worker/index.js';
import { DOMINIO, redireccion, sinExtension } from '../worker/redireccion.js';

const BASE = 'https://ejemplo.com/memphisbelle';
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
    for (const file of ['index.html', 'privacidad.html', 'cookies.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers']) {
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

  test('la tabla de la web muestra el mismo horario que site.js', () => {
    for (const d of DIAS) {
      const fila = new RegExp(`<tr data-dia="${d}"><th scope="row">[^<]+</th><td>([^<]+)</td></tr>`).exec(index);
      assert.equal(fila[1], dias[d] ? `${dias[d][0]} a ${dias[d][1]}` : 'Cerrado', d);
    }
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
    const bloquesHover = [...css.matchAll(/@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*?\n\}/g)].map((m) => m[0]).join('');
    const hoverFuera = css.replace(bloquesHover, '').split('\n').filter((l) => l.includes(':hover'));
    assert.deepEqual(hoverFuera, []);
    assert.match(css, /-webkit-tap-highlight-color: transparent/);
    assert.match(css, /\.btn:active \{ transform: scale\(0\.97\)/);
    assert.match(css, /font: 400 16px/); // campos del formulario a 16 px
    assert.match(index, /viewport-fit=cover/);
    assert.doesNotMatch(index, /user-scalable|maximum-scale/);
    assert.match(css, /env\(safe-area-inset-bottom/);
  });

  test('el bombardero de la portada es decorativo y solo se mueve si el sistema lo permite', () => {
    const hero = index.slice(index.indexOf('id="inicio"'), index.indexOf('id="estrella"'));
    assert.match(hero, /<div class="bombardero" aria-hidden="true">/);
    assert.match(hero, /class="belle-morro"/); // el nombre del morro es el logotipo
    const animaciones = /@media \(prefers-reduced-motion: no-preference\) \{\s*\.bombardero-vuelo \{ animation: flotar/;
    assert.match(css, animaciones);
    // Fuera de ese bloque no hay ninguna animación del avión.
    const fuera = css.replace(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n\}/g, '');
    assert.doesNotMatch(fuera, /animation: (flotar|girar)/);
  });

  test('las animaciones respetan "reducir movimiento" y no se usa transition: all', () => {
    assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.hero/);
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
