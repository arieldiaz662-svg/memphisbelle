import { resumen } from '../../public/js/horario.js';
import { NAV, esc, instagramUrl, layout, reviewUrl, rodar } from './html.js';
import { SELLO_INTRO } from './ilustraciones.js';
import { structuredData } from './schema.js';

export { NAV };
export const NAV_EN = [
  { id: 'carta', label: 'The menu' },
  { id: 'bar', label: 'The bar' },
  { id: 'visitanos', label: 'Visit us' },
];

// Textos fijos de la portada en cada idioma (los de contenido, del bar, están en site.js; en inglés, en site.en).
const TXT = {
  es: {
    verCarta: 'Ver la carta en pantalla completa', otraCarta: 'Menu in English', cartaOtra: 'carta-en.html', otraLang: 'en',
    horario: 'Horario', ubicacion: 'Ubicación', contacto: 'Contacto', local: 'El local', maps: 'Cómo llegar',
    acciones: 'Acciones rápidas', portada: 'Portada', cartaCompleta: 'Toda la carta', alergenos: 'Alérgenos', desde: 'Precio',
    mapaTitulo: 'Mapa de Google con la ubicación de Memphis Belle', mapaVer: 'Ver el mapa', mapaAviso: 'Al verlo se carga Google Maps y Google puede guardar cookies. Más información en la', mapaCookies: 'política de cookies',
  },
  en: {
    verCarta: 'View the full-screen menu', otraCarta: 'Carta en español', cartaOtra: 'carta.html', otraLang: 'es',
    horario: 'Opening hours', ubicacion: 'Location', contacto: 'Contact', local: 'The venue', maps: 'Get directions',
    acciones: 'Quick actions', portada: 'Home', cartaCompleta: 'The full menu', alergenos: 'Allergens', desde: 'Price',
    mapaTitulo: 'Google map showing the location of Memphis Belle', mapaVer: 'Show the map', mapaAviso: 'Showing it loads Google Maps and Google may store cookies. More information in the', mapaCookies: 'cookies policy',
  },
};

// Mezcla el contenido en inglés (site.en) sobre el español: objetos, y listas de objetos elemento a elemento.
const mezclar = (base, extra) => {
  if (extra === undefined) return base;
  if (Array.isArray(base) && Array.isArray(extra)) return base.map((item, i) => (item && typeof item === 'object' && extra[i] ? mezclar(item, extra[i]) : (extra[i] ?? item)));
  if (base && typeof base === 'object' && extra && typeof extra === 'object' && !Array.isArray(extra)) {
    return { ...base, ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, mezclar(base[k], v)])) };
  }
  return extra;
};
export const localizar = (site, idioma) => {
  if (idioma !== 'en') return site;
  const { en, ...resto } = site;
  return mezclar(resto, en);
};

// Retardo escalonado de las entradas al hacer scroll: data-s="i1".. (reglas en site.css; sin estilos en línea por la CSP).
const d = (n) => ` data-s="i${n}"`;
const flecha = '<svg class="flecha" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4"/></svg>';
const enlaceExterno = '<svg class="flecha" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 11 11 3M5 3h6v6"/></svg>';

// Titular de sección. El HTML (<em>) viene de site.js, que es contenido propio.
const titular = (html, clase = '') => `<h2 class="gigante${clase}" data-reveal>${html}</h2>`;

// Imagen en WebP y JPG en varios anchos: el navegador elige el más ligero que le sirve. "lazy" porque va bajo la
// portada; prioridad: para la portada (es lo primero que se ve), se descarga enseguida, sin "lazy".
const fondo = (image, clase, { prioridad = false, sizes = '100vw', alt = '' } = {}) => {
  const srcset = (ext) => image.widths.map((w) => `assets/${esc(image.src)}-${w}.${ext} ${w}w`).join(', ');
  const medio = image.widths[Math.floor(image.widths.length / 2)];
  return `<picture${clase ? ` class="${clase}"` : ''}>
    <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">
    <img src="assets/${esc(image.src)}-${medio}.jpg" srcset="${srcset('jpg')}" sizes="${sizes}" alt="${esc(alt)}" width="${image.width}" height="${image.height}" ${prioridad ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
  </picture>`;
};

// "de 18:00 a 02:00" no se parte entre dos líneas en el móvil.
const horasJuntas = (texto) => texto.replace(/de (\d\d:\d\d) a (\d\d:\d\d)/, 'de&nbsp;$1&nbsp;a&nbsp;$2');
const horarioJson = (site) => esc(JSON.stringify(site.hours.days));

// Estado "Abierto ahora / Cerrado": lo rellena el navegador con la hora de Canarias (public/js/site.js).
// Sin JavaScript queda oculto y se ve el horario en texto.
export const estadoAhora = (site, extraClass = '') => `<p class="estado ${extraClass}" data-horario="${horarioJson(site)}" hidden><span class="estado-punto" aria-hidden="true"></span><span class="estado-texto"></span></p>`;

// Pantalla de intro: el sello MB dibuja su aro, sube el nombre y se levanta como un telón (solo la primera vez
// por visita; la decide public/js/ini.js y la cierra site.js).
export const introHtml = () => `<div class="intro-pantalla" aria-hidden="true">
  <div class="intro-contenido">
    ${SELLO_INTRO}
    <p class="intro-marca"><span>Memphis <em>Belle</em></span></p>
  </div>
</div>`;

// Portada: la foto del B-17 a pantalla completa, con "Coctelería" arriba a la izquierda y "de verdad" en cursiva abajo a la derecha.
function hero(site, idioma) {
  const { hero: h } = site;
  const t = TXT[idioma];
  return `<section class="hero" id="inicio" aria-label="${t.portada}">
  ${h.image ? fondo(h.image, 'hero-foto', { prioridad: true, sizes: '100vw', alt: h.imageAlt }) : ''}
  <div class="hero-velo" aria-hidden="true"></div>
  <div class="wrap hero-contenido">
    <h1 class="sr">${esc(site.fullName)}</h1>
    <div class="hero-pie" data-reveal${d(3)}>
      <div class="hero-lectura">
        ${estadoAhora(site, 'estado-hero')}
        <p class="hero-sub">${esc(h.lead)}</p>
        <div class="hero-ctas">
          <a class="btn btn-claro" href="#carta">${rodar(h.cta)}${flecha}</a>
          <a class="btn btn-borde" href="${esc(site.googleMapsUrl)}" rel="noopener noreferrer" target="_blank">${rodar(h.secondary)}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="cinta" aria-hidden="true">
  <div class="cinta-pista">
    ${[0, 1].map(() => site.cinta.map((x) => `<span>${esc(x)}</span><i></i>`).join('')).join('\n    ')}
  </div>
</div>`;
}

// Alérgenos de la normativa de la UE. Las claves son las que se usan en `allergens` de site.js.
export const ALERGENOS = {
  gluten: ['gluten', 'gluten'], crustaceos: ['crustáceos', 'crustaceans'], huevos: ['huevos', 'eggs'],
  pescado: ['pescado', 'fish'], cacahuetes: ['cacahuetes', 'peanuts'], soja: ['soja', 'soy'],
  lacteos: ['lácteos', 'milk'], frutos_secos: ['frutos de cáscara', 'tree nuts'], apio: ['apio', 'celery'],
  mostaza: ['mostaza', 'mustard'], sesamo: ['sésamo', 'sesame'], sulfitos: ['sulfitos', 'sulphites'],
  altramuces: ['altramuces', 'lupin'], moluscos: ['moluscos', 'molluscs'],
};

// "con fruta" / "with fruit" en cursiva y oro al final del nombre.
const nombrePlato = (nombre) => {
  const m = /^(.*?)\s+(con fruta|with fruit)$/.exec(nombre);
  return m ? `${esc(m[1])} <em>${esc(m[2])}</em>` : esc(nombre);
};

// La carta: una hoja de papel (color distinto al de la web, para leer bien nombres y precios) con todas las secciones
// seguidas, sin pestañas. Cada sección lleva su nombre a un lado y sus cócteles al otro, con puntos guía hasta el precio.
// idioma: "es" o "en". titulo: "h2" en la portada, "h1" en la página de la carta. El inglés usa nameEn/textEn/introEn
// y, si falta, el español.
export function menuHtml(site, { idioma = 'es', titulo = 'h2', enlaces = '', intro = '' } = {}) {
  const { menu: m } = site;
  const en = idioma === 'en';
  const t = TXT[idioma];
  const nombre = (x) => (en && x.nameEn) || x.name;
  const texto = (x) => (en && x.textEn) || x.text;
  const tituloMenu = (en && m.titleEn) || m.title;
  const hs = titulo === 'h1' ? 'h2' : 'h3';
  const alergenos = (item) => (item.allergens && item.allergens.length
    ? `<p class="plato-alergenos"><span>${t.alergenos}:</span> ${item.allergens.map((k) => esc(ALERGENOS[k][en ? 1 : 0])).join(', ')}</p>` : '');
  const indice = m.sections.map((s) => `<a href="#carta-${esc(s.id)}">${esc(nombre(s))}</a>`).join('\n        ');
  const secciones = m.sections.map((s) => `<section class="carta-seccion" id="carta-${esc(s.id)}" aria-labelledby="carta-${esc(s.id)}-t">
        <div class="carta-lado">
          <${hs} class="carta-nombre" id="carta-${esc(s.id)}-t">${esc(nombre(s))}</${hs}>
          ${s.intro ? `<p class="panel-intro">${esc((en && s.introEn) || s.intro)}</p>` : ''}
        </div>
        <ul class="platos">
          ${s.items.map((item) => `<li><div class="plato-linea"><span class="plato-nombre">${nombrePlato(nombre(item))}</span><span class="plato-precio">${esc(item.price)}</span></div>${texto(item) ? `<p class="plato-texto">${esc(texto(item))}</p>` : ''}${alergenos(item)}</li>`).join('\n          ')}
        </ul>
        ${s.id === 'copas' && m.barril ? `<p class="barril"><b>${esc(en ? m.barril.labelEn : m.barril.label)}</b> ${esc(en ? m.barril.textEn : m.barril.text)}</p>` : ''}
      </section>`).join('\n\n      ');
  return `<section class="seccion carta" id="carta">
  <div class="wrap">
    <div class="carta-cab">
      <${titulo} class="carta-titulo" data-reveal>${esc(tituloMenu)}</${titulo}>
      ${intro ? `<p class="carta-intro" data-reveal${d(1)}>${esc(intro)}</p>` : ''}
      <nav class="carta-indice" aria-label="${t.cartaCompleta}" data-reveal${d(2)}>
        ${indice}
      </nav>
    </div>
    <div class="carta-hoja menu" id="menu-completo">
      ${secciones}
    </div>
    ${titulo === 'h2' && (en ? m.allergensNoteEn : m.allergensNote) ? `<p class="carta-nota">${esc(en ? m.allergensNoteEn : m.allergensNote)}</p>` : ''}
    ${enlaces}
  </div>
</section>`;
}

// Fotos bajo la carta (sobre el fondo oscuro de la web).
function fotosCarta(site) {
  const fotos = (site.menu.photos || []).filter((f) => f.src);
  if (!fotos.length) return '';
  return `<section class="carta-fotos" aria-label="${esc(site.menu.title)}">
  <ul class="wrap carta-fotos-fila">
    ${fotos.map((f, n) => `<li class="carta-foto" data-reveal${d(n % 5)}>${fotoCarta(f)}</li>`).join('\n    ')}
  </ul>
</section>`;
}
const fotoCarta = (f) => fondo(f, '', { sizes: '(max-width: 760px) 50vw, 25vw', alt: f.alt });

// Carta de la portada: toda la carta en la hoja, las fotos debajo y el enlace a la versión de pantalla completa.
function menu(site, idioma) {
  const t = TXT[idioma];
  const c = site.carta;
  return menuHtml(site, {
    idioma,
    intro: c.intro,
    enlaces: `<p class="carta-enlaces"><a href="${idioma === 'en' ? 'carta-en.html' : 'carta.html'}">${t.verCarta}</a><a href="${t.cartaOtra}" lang="${t.otraLang}" hreflang="${t.otraLang}">${t.otraCarta}</a></p>`,
  }) + '\n' + fotosCarta(site);
}

// El bar: foto a sangre con la frase encima y una fila con las fotos de los cócteles.
function bar(site, idioma) {
  const b = site.bar;
  const g = (site.local.gallery || []).filter((x) => x.src)[0];
  const t = TXT[idioma];
  const foto = (f, i) => `<figure class="foto" data-reveal${d(i)}><div class="marco"><picture><source type="image/webp" srcset="assets/${esc(f.src)}-640.webp"><img src="assets/${esc(f.src)}-640.jpg" alt="${esc(f.alt)}" width="640" height="800" loading="lazy" decoding="async"></picture></div><figcaption>${esc(f.caption)}</figcaption></figure>`;
  return `<section class="bar" id="bar">
  ${g ? `<div class="bar-banda">${fondo(g, 'bar-foto', { sizes: '100vw', alt: g.alt })}<div class="bar-velo" aria-hidden="true"></div>
    <div class="wrap bar-texto">
      ${titular(b.title)}
      <p class="declaracion" data-reveal${d(1)}>${esc(b.declaration)}</p>
      <a class="btn btn-claro" href="${esc(site.googleMapsUrl)}" rel="noopener noreferrer" target="_blank" data-reveal${d(2)}>${rodar(t.maps)}${enlaceExterno}</a>
    </div></div>` : ''}
  <div class="wrap">
    <div class="cab-centrada cab-fotos"><p class="intro" data-reveal>${esc(b.text)}</p></div>
    <div class="fotos-fila">
      ${b.photos.map(foto).join('\n      ')}
    </div>
  </div>
</section>`;
}

// Franja "Déjanos una reseña en Google": titular centrado, texto y botón.
export function reviewCta(site, idioma = 'es') {
  const c = site.reviewCta;
  const en = idioma === 'en';
  return `<section class="opinion" id="opinion" aria-labelledby="opinion-titulo">
  <div class="wrap cab-centrada">
    <h2 class="gigante" id="opinion-titulo" data-reveal>${esc(en ? c.titleEn : c.title)}</h2>
    <p class="intro" data-reveal${d(1)}>${esc(en ? c.textEn : c.text)}</p>
    <a class="btn btn-borde btn-resena" href="${esc(reviewUrl(site))}" rel="noopener noreferrer" target="_blank" data-reveal${d(2)}><span class="estrellas" aria-hidden="true">★★★★★</span>${rodar(en ? c.buttonEn : c.button)}</a>
  </div>
</section>`;
}

// Reseñas: solo si hay valoración de Google copiada de la ficha. Sin valoración, la sección no existe.
function reviews(site, idioma = 'es') {
  const { reviews: r } = site;
  const en = idioma === 'en';
  if (!r.rating) return '';
  return `<section class="seccion resenas" id="resenas">
  <div class="wrap resenas-grid">
    <div class="resenas-nota">
      <h2 class="sr">${en ? 'Reviews' : 'Reseñas'}</h2>
      <p class="nota-google"><strong>${esc(r.rating)}</strong> ${en ? 'out of 5 on Google' : 'de 5 en Google'}</p>
      ${r.count ? `<p>${esc(r.count)} ${en ? 'reviews' : 'reseñas'}</p>` : ''}
      <a class="btn btn-borde" href="${esc(site.googleMapsUrl)}" rel="noopener noreferrer" target="_blank">${en ? 'Read the reviews' : 'Leer las reseñas'}</a>
    </div>
    ${(r.quotes || []).slice(0, 3).map((q) => `<blockquote class="cita"><p>${esc(q.text)}</p><footer>${esc(q.author)}, ${en ? 'on Google' : 'en Google'}</footer></blockquote>`).join('\n    ')}
  </div>
</section>`;
}

// Visítanos: una banda cálida con el titular grande y tres columnas (ubicación, horario con "Abierto ahora" y contacto).
function visit(site, idioma) {
  const { address: a, visit: v } = site;
  const t = TXT[idioma];
  return `<section class="visita" id="visitanos">
  <div class="wrap visita-grid">
    <div class="visita-cab">
      ${titular(v.title)}
      <p class="intro" data-reveal${d(1)}>${esc(v.text)}</p>
      <div class="visita-ctas" data-reveal${d(2)}>
        <a class="btn btn-claro" href="${esc(site.googleMapsUrl)}" rel="noopener noreferrer" target="_blank">${rodar(v.mapsText)}${enlaceExterno}</a>
      </div>
    </div>
    <dl class="datos">
      <div class="dato" data-reveal${d(1)}><dt>${t.ubicacion}</dt><dd><address>${esc(a.street)}<br>${esc(a.postalCode)} ${esc(a.city)}</address></dd></div>
      <div class="dato" data-reveal${d(2)}><dt>${t.horario}</dt><dd>${estadoAhora(site, 'estado-info')}<ul class="horario-lineas">
        ${resumen(site.hours.days, idioma).map((linea) => `<li>${horasJuntas(esc(linea))}</li>`).join('\n        ')}
      </ul></dd></div>
      <div class="dato" data-reveal${d(3)}><dt>${t.contacto}</dt><dd><ul class="contacto">
        <li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
        <li><a href="${esc(instagramUrl(site.instagram))}" rel="noopener noreferrer" target="_blank">@${esc(site.instagram)}</a></li>
        <li>${esc(v.place)}</li>
      </ul></dd></div>
    </dl>
  </div>
  <div class="wrap mapa-caja" data-reveal${d(1)}>
    <div class="mapa" data-mapa="${esc(`https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=17&hl=${idioma}&output=embed`)}" data-titulo="${esc(t.mapaTitulo)}">
      <div class="mapa-previa">
        <svg class="mapa-pin" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" fill="currentColor"/></svg>
        <p class="mapa-direccion">${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}</p>
        <div class="mapa-acciones">
          <button class="btn btn-claro mapa-cargar" type="button" hidden>${rodar(t.mapaVer)}</button>
        </div>
        <p class="mapa-aviso">${esc(t.mapaAviso)} <a href="cookies.html">${esc(t.mapaCookies)}</a>.</p>
      </div>
    </div>
  </div>
</section>`;
}

// Barra fija del móvil: cómo llegar siempre a mano. En pantallas grandes no se muestra.
function barraMovil(site, idioma) {
  const t = TXT[idioma];
  return `<nav class="barra-movil" aria-label="${t.acciones}">
  <a class="btn btn-claro" href="${esc(site.googleMapsUrl)}" rel="noopener noreferrer" target="_blank">${t.maps}</a>
</nav>
`;
}

// Portada en español (index.html) o en inglés (en.html). El inglés mezcla site.en sobre el español.
export function renderLanding({ site: original, config, idioma = 'es' }) {
  const en = idioma === 'en';
  const site = localizar(original, idioma);
  const body = `<main id="contenido" tabindex="-1">
${hero(site, idioma)}
${menu(site, idioma)}
${bar(site, idioma)}
${reviewCta(site, idioma)}
${reviews(site, idioma)}
${visit(site, idioma)}
</main>`;
  const base = config.publicBaseUrl;
  const alternativas = base ? `<link rel="alternate" hreflang="es" href="${esc(`${base}/`)}">
<link rel="alternate" hreflang="en" href="${esc(`${base}/en.html`)}">
<link rel="alternate" hreflang="x-default" href="${esc(`${base}/`)}">
` : '';
  return layout({
    site, config, title: site.title, description: site.description, path: en ? '/en' : '/', lang: idioma, nav: en ? NAV_EN : NAV, body,
    intro: introHtml(),
    scripts: ['js/site.js'], head: alternativas + structuredData({ site: original, config }), after: barraMovil(site, idioma),
    alterno: en ? { href: './', lang: 'es', texto: 'ES', etiqueta: 'Ver en español' } : { href: 'en.html', lang: 'en', texto: 'EN', etiqueta: 'View in English' },
  });
}
