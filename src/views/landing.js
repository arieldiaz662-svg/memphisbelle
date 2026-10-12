import { resumen } from '../../public/js/horario.js';
import { BOMBARDERO } from './bombardero.js';
import { NAV, esc, escPhone, instagramUrl, layout, reviewUrl, rodar } from './html.js';
import { ANIMS, HUMO, ICONOS, SELLO, SELLO_INTRO } from './ilustraciones.js';
import { structuredData } from './schema.js';

export { NAV };
export const NAV_EN = [
  { id: 'bar', label: 'The bar' },
  { id: 'oficio', label: 'The craft' },
  { id: 'carta', label: 'The menu' },
  { id: 'galeria', label: 'Gallery' },
  { id: 'visitanos', label: 'Visit us' },
];

// Textos fijos de la portada en cada idioma (los de contenido, del bar, están en site.js; en inglés, en site.en).
const TXT = {
  es: {
    desliza: 'Sigue bajando ↓', pausar: 'Pausar animaciones',
    verCarta: 'Ver la carta en pantalla completa', otraCarta: 'Menu in English', cartaOtra: 'carta-en.html', otraLang: 'en',
    horario: 'Horario', ubicacion: 'Ubicación', contacto: 'Contacto', local: 'El local', tel: 'Teléfono', llamar: 'Llamar', maps: 'Cómo llegar',
    acciones: 'Acciones rápidas', portada: 'Portada', galeria: 'Galería del local', cartaCompleta: 'Toda la carta',
    alergenos: 'Alérgenos',
  },
  en: {
    desliza: 'Scroll ↓', pausar: 'Pause animations',
    verCarta: 'View the full-screen menu', otraCarta: 'Carta en español', cartaOtra: 'carta.html', otraLang: 'es',
    horario: 'Opening hours', ubicacion: 'Location', contacto: 'Contact', local: 'The venue', tel: 'Phone', llamar: 'Call', maps: 'Get directions',
    acciones: 'Quick actions', portada: 'Home', galeria: 'Venue gallery', cartaCompleta: 'The full menu',
    alergenos: 'Allergens',
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

// Línea de apertura de sección (el filete fino de la parte de arriba), con un botón opcional a la derecha.
const cabeceraSeccion = (extra = '') => `<div class="cabecera-seccion">${extra}</div>`;

// Titular que sube desde detrás de una máscara. El HTML (<em>) viene de site.js, que es contenido propio.
const titular = (html, clase = '') => `<h2 class="mascara${clase}" data-reveal="mascara"><span>${html}</span></h2>`;
// La última palabra de un título, en cursiva y en oro.
const enfasis = (texto) => { const i = texto.lastIndexOf(' '); return i < 0 ? `<em>${esc(texto)}</em>` : `${esc(texto.slice(0, i))} <em>${esc(texto.slice(i + 1))}</em>`; };

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
export const introHtml = (site) => `<div class="intro-pantalla" aria-hidden="true">
  <div class="intro-contenido">
    ${SELLO_INTRO}
    <p class="intro-marca"><span>Memphis <em>Belle</em></span></p>
    <span class="intro-sub etiqueta">${esc(site.hero.kicker)}</span>
  </div>
</div>`;

function hero(site, idioma) {
  const { hero: h } = site;
  const t = TXT[idioma];
  return `<section class="hero" id="inicio" aria-label="${t.portada}">
  <div class="wrap">
    <div class="hero-meta">
      <span class="etiqueta" data-reveal>${esc(h.kicker)}</span>
      <span class="etiqueta" data-reveal${d(1)}>${esc(h.kickerRight)}</span>
    </div>
    <div class="hero-texto">
      <h1>${h.title.map((linea, n) => `<span class="linea"><span${d(n)}>${n ? `<em>${esc(linea)}</em>` : esc(linea)}</span></span>`).join('')}</h1>
      <p class="hero-sub" data-reveal${d(4)}>${esc(h.lead)}</p>
      <div class="hero-ctas" data-reveal${d(5)}>
        <a class="btn btn-claro" href="#carta">${rodar(h.cta)}${flecha}</a>
        <a class="btn btn-borde" href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">${rodar(h.secondary)}</a>
      </div>
    </div>
    <figure class="hero-figura${h.image ? '' : ' vectorial'}">
      ${h.image ? fondo(h.image, 'hero-foto', { prioridad: true, sizes: '(max-width: 980px) 100vw, 45vw', alt: h.imageAlt }) : BOMBARDERO}
      ${h.imageCaption ? `<figcaption class="etiqueta">${esc(h.imageCaption)}</figcaption>` : ''}
    </figure>
    <div class="hero-pie etiqueta" data-reveal${d(6)}>
      ${estadoAhora(site, 'estado-hero')}
      ${h.foot.map((x) => `<span>${esc(x)}</span>`).join('\n      ')}
      <a href="#bar">${t.desliza}</a>
    </div>
  </div>
</section>

<div class="cinta" aria-hidden="true">
  <div class="cinta-pista">
    ${[0, 1].map(() => site.cinta.map((x) => `<span>${esc(x)} <i>·</i></span>`).join('')).join('\n    ')}
  </div>
</div>`;
}

// Foto en WebP y JPG a su ancho (las fotos de cócteles solo existen a 640 px, su tamaño real).
const fotoPar = (src, alt, extra = '') => `<picture><source type="image/webp" srcset="assets/${esc(src)}-640.webp"><img${extra} src="assets/${esc(src)}-640.jpg" alt="${esc(alt)}" width="640" height="1100" loading="lazy" decoding="async"></picture>`;

// 01 · El bar: texto fijo a la izquierda y mosaico de cuatro fotos de cócteles a la derecha.
function bar(site) {
  const b = site.bar;
  const fig = (f, i) => `<figure class="foto" data-reveal="foto"${d(i)}><div class="marco">${fotoPar(f.src, f.alt, f.pos ? ` class="pos-${esc(f.pos)}"` : '')}</div><figcaption class="etiqueta">${esc(f.caption)}</figcaption></figure>`;
  const col = (par) => b.photos.map((f, i) => [f, i]).filter(([, i]) => i % 2 === par).map(([f, i]) => fig(f, i)).join('\n          ');
  return `<section id="bar">
  <div class="wrap">
    ${cabeceraSeccion()}
    <div class="bar-grid">
      <div class="bar-texto">
        ${titular(b.title)}
        <p class="declaracion" data-reveal${d(1)}>${esc(b.declaration)}</p>
        <p data-reveal${d(2)}>${esc(b.text)}</p>
      </div>
      <div class="mosaico-fotos">
        <div class="columna">
          ${col(0)}
        </div>
        <div class="columna">
          ${col(1)}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

// 02 · El oficio: escenas de barra dibujadas. Se mueven solo mientras se ven y se pueden pausar todas.
function oficio(site, idioma) {
  const o = site.oficio;
  const t = TXT[idioma];
  const dibujo = (item) => (item.id === 'humo' ? HUMO : ANIMS[item.id]).replace(/aria-label="[^"]*"/, `aria-label="${esc(item.aria)}"`);
  return `<section id="oficio">
  <div class="wrap">
    ${cabeceraSeccion(`<button class="pausa-anim" type="button" aria-pressed="false" hidden>${t.pausar}</button>`)}
    <div class="titulo-fila">
      ${titular(o.title)}
      <p data-reveal${d(1)}>${esc(o.text)}</p>
    </div>
    <div class="oficio-grid">
      ${o.items.map((item, n) => `<figure class="oficio-item${n === 0 ? ' destacado' : ''}" data-reveal${d(n)}>
        <div class="lienzo">${dibujo(item)}</div>
        <figcaption class="oficio-pie"><span class="etiqueta"><b>0${n + 1}</b></span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></figcaption>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// Alérgenos de la normativa de la UE. Las claves son las que se usan en `allergens` de site.js.
export const ALERGENOS = {
  gluten: ['gluten', 'gluten'], crustaceos: ['crustáceos', 'crustaceans'], huevos: ['huevos', 'eggs'],
  pescado: ['pescado', 'fish'], cacahuetes: ['cacahuetes', 'peanuts'], soja: ['soja', 'soy'],
  lacteos: ['lácteos', 'milk'], frutos_secos: ['frutos de cáscara', 'tree nuts'], apio: ['apio', 'celery'],
  mostaza: ['mostaza', 'mustard'], sesamo: ['sésamo', 'sesame'], sulfitos: ['sulfitos', 'sulphites'],
  altramuces: ['altramuces', 'lupin'], moluscos: ['moluscos', 'molluscs'],
};

// "Los imprescindibles": tres clásicos con su icono y su precio.
function destacados(site) {
  return `<ol class="carta-destacada">
      ${site.highlights.map((h, n) => `<li class="carta-fila" data-reveal${d(n)}>
        <span class="etiqueta">0${n + 1}</span>
        ${ICONOS[h.icon]}
        <div class="carta-nombre"><h3>${esc(h.name)}</h3><p>${esc(h.text)}</p></div>
        <span class="etiqueta carta-ingredientes">${esc(h.ingredients)}</span>
        <span class="carta-precio">${esc(h.price)}</span>
      </li>`).join('\n      ')}
    </ol>`;
}

// "con fruta" / "with fruit" en cursiva y oro al final del nombre.
const nombrePlato = (nombre) => {
  const m = /^(.*?)\s+(con fruta|with fruit)$/.exec(nombre);
  return m ? `${esc(m[1])} <em>${esc(m[2])}</em>` : esc(nombre);
};

// La carta en pestañas (sin JavaScript se ven todas las secciones seguidas). idioma: "es" o "en". titulo: etiqueta
// del encabezado (h2 en la portada, h1 en la página de la carta). El inglés usa nameEn/textEn/introEn y, si
// falta, el español. cabecera/antes/intro: piezas propias de la portada (filete, "Los imprescindibles", texto).
export function menuHtml(site, { idioma = 'es', titulo = 'h2', enlaces = '', cabecera = '', antes = '', intro = '' } = {}) {
  const { menu: m } = site;
  const en = idioma === 'en';
  const t = TXT[idioma];
  const nombre = (x) => (en && x.nameEn) || x.name;
  const texto = (x) => (en && x.textEn) || x.text;
  const tituloMenu = (en && m.titleEn) || m.title;
  const hs = titulo === 'h1' ? 'h2' : 'h3'; // sin saltarse niveles de encabezado
  const hp = titulo === 'h1' ? 'h3' : 'h4';
  const alergenos = (item) => (item.allergens && item.allergens.length
    ? `<p class="plato-alergenos"><span>${t.alergenos}:</span> ${item.allergens.map((k) => esc(ALERGENOS[k][en ? 1 : 0])).join(', ')}</p>` : '');
  const tabs = m.sections.map((s, i) => `<button class="pestana" role="tab" type="button" id="tab-${esc(s.id)}" aria-controls="panel-${esc(s.id)}" aria-selected="${i === 0}"${i === 0 ? '' : ' tabindex="-1"'}>${esc(nombre(s))} <small>${s.items.length}</small></button>`).join('\n          ');
  const panels = m.sections.map((s) => `<div class="panel" role="tabpanel" id="panel-${esc(s.id)}" aria-labelledby="tab-${esc(s.id)}" tabindex="0">
        <${hp} class="panel-titulo">${esc(nombre(s))}</${hp}>
        ${s.intro ? `<p class="panel-intro etiqueta">${esc((en && s.introEn) || s.intro)}</p>` : ''}
        <ul class="platos">
          ${s.items.map((item) => `<li><div class="plato-linea"><span class="plato-nombre">${nombrePlato(nombre(item))}</span><span class="relleno" aria-hidden="true"></span><span class="plato-precio">${esc(item.price)}</span></div>${texto(item) ? `<p>${esc(texto(item))}</p>` : ''}${alergenos(item)}</li>`).join('\n          ')}
        </ul>
        ${s.id === 'copas' && m.barril ? `<p class="barril"><span class="etiqueta"><b>${esc(en ? m.barril.labelEn : m.barril.label)}</b></span> ${esc(en ? m.barril.textEn : m.barril.text)}</p>` : ''}
      </div>`).join('\n\n      ');
  return `<section class="carta" id="carta">
  <div class="wrap">
    ${cabecera}
    <div class="titulo-fila">
      <${titulo} class="mascara" data-reveal="mascara"><span>${enfasis(tituloMenu)}</span></${titulo}>
      ${intro ? `<p data-reveal${d(1)}>${esc(intro)}</p>` : ''}
    </div>
    ${antes}
    <div class="menu" data-reveal>
      <div class="menu-cabecera">
        <${hs} class="subtitulo-carta etiqueta" id="toda-la-carta">${t.cartaCompleta}</${hs}>
        <div class="pestanas" role="tablist" aria-labelledby="toda-la-carta">
          ${tabs}
          <span class="pestana-marca" aria-hidden="true"></span>
        </div>
      </div>

      ${panels}
      ${enlaces}
    </div>
  </div>
</section>`;
}

// Carta de la portada: "Los imprescindibles" y toda la carta en pestañas, con enlace a la versión de pantalla completa.
function menu(site, idioma) {
  const t = TXT[idioma];
  const c = site.carta;
  return menuHtml(site, {
    idioma,
    cabecera: cabeceraSeccion(),
    intro: c.intro,
    antes: `<h3 class="subtitulo-carta etiqueta" data-reveal>${esc(c.imprescindibles)}</h3>\n    ${destacados(site)}`,
    enlaces: `<p class="carta-enlaces"><a href="${idioma === 'en' ? 'carta-en.html' : 'carta.html'}">${t.verCarta}</a> <a href="${t.cartaOtra}" lang="${t.otraLang}" hreflang="${t.otraLang}">${t.otraCarta}</a></p>`,
  });
}

// Galería del local: tres fotos, sin título ni pie. Hace de pausa entre la carta y la visita.
function galeria(site, idioma) {
  const t = TXT[idioma];
  const fotos = (site.local.gallery || []).filter((g) => g.src);
  if (!fotos.length) return '';
  return `<section id="galeria" aria-label="${t.galeria}">
  <div class="wrap">
    <div class="galeria-grid">
      ${fotos.map((g, n) => `<figure class="foto" data-reveal="foto"${d(n)}><div class="marco">${fondo(g, '', { sizes: '(max-width: 860px) 50vw, 33vw', alt: g.alt })}</div></figure>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// Visítanos: "¿Vienes a Memphis Belle?" con cómo llegar y los datos de la ficha (ubicación,
// horario agrupado con "Abierto ahora", contacto). No hay reservas: el bar no admite reservas.
function visit(site, idioma) {
  const { address: a, visit: v } = site;
  const t = TXT[idioma];
  return `<section id="visitanos">
  <div class="wrap">
    ${cabeceraSeccion()}
    <div class="contacto-grid">
      <div class="contacto-titulo">
        ${titular(v.title)}
        ${SELLO}
      </div>
      <div class="contacto-detalle">
        <p data-reveal>${esc(v.text)}</p>
        <div class="contacto-ctas" data-reveal${d(1)}>
          <a class="btn btn-claro" href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">${rodar(v.mapsText)}${enlaceExterno}</a>
        </div>
        <dl class="datos-contacto" data-reveal${d(2)}>
          <div><dt class="etiqueta">${t.ubicacion}</dt><dd><address>${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}</address></dd></div>
          <div><dt class="etiqueta">${t.horario}</dt><dd>${estadoAhora(site, 'estado-info')}<ul class="horario-lineas">
            ${resumen(site.hours.days, idioma).map((linea) => `<li>${horasJuntas(esc(linea))}</li>`).join('\n            ')}
          </ul></dd></div>
          <div><dt class="etiqueta">${t.contacto}</dt><dd><ul class="contacto">
            <li><a href="tel:+${esc(site.phone)}">${escPhone(site.phoneDisplay)}</a></li>
            <li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
            <li><a href="${esc(instagramUrl(site.instagram))}" rel="noopener" target="_blank">@${esc(site.instagram)}</a></li>
          </ul></dd></div>
          <div><dt class="etiqueta">${t.local}</dt><dd>${esc(v.place)}</dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>`;
}

// Franja "Déjanos una reseña en Google": siempre visible, justo antes de "Visítanos".
export function reviewCta(site, idioma = 'es') {
  const c = site.reviewCta;
  const en = idioma === 'en';
  return `<section class="opinion" id="opinion" aria-labelledby="opinion-titulo">
  <div class="wrap opinion-grid">
    <div>
      <h2 id="opinion-titulo">${esc(en ? c.titleEn : c.title)}</h2>
      <p>${esc(en ? c.textEn : c.text)}</p>
    </div>
    <a class="btn btn-borde btn-resena" href="${esc(reviewUrl(site))}" rel="noopener" target="_blank"><span class="estrellas" aria-hidden="true">★★★★★</span>${esc(en ? c.buttonEn : c.button)}</a>
  </div>
</section>`;
}

// Reseñas: solo si hay valoración de Google copiada de la ficha. Las citas son opcionales (reales y
// con su autor). Sin valoración, la sección no existe.
function reviews(site, idioma = 'es') {
  const { reviews: r } = site;
  const en = idioma === 'en';
  if (!r.rating) return '';
  return `<section class="resenas" id="resenas">
  <div class="wrap resenas-grid">
    <div class="resenas-nota">
      <h2 class="sr">${en ? 'Reviews' : 'Reseñas'}</h2>
      <p class="nota-google"><strong>${esc(r.rating)}</strong> ${en ? 'out of 5 on Google' : 'de 5 en Google'}</p>
      ${r.count ? `<p class="suave">${esc(r.count)} ${en ? 'reviews' : 'reseñas'}</p>` : ''}
      <a class="btn btn-borde" href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">${en ? 'Read the reviews' : 'Leer las reseñas'}</a>
    </div>
    ${(r.quotes || []).slice(0, 3).map((q) => `<blockquote class="cita"><p>${esc(q.text)}</p><footer>${esc(q.author)}, ${en ? 'on Google' : 'en Google'}</footer></blockquote>`).join('\n    ')}
  </div>
</section>`;
}

// Barra fija del móvil: cómo llegar y llamar siempre a mano. En pantallas grandes no se muestra.
function barraMovil(site, idioma) {
  const t = TXT[idioma];
  return `<nav class="barra-movil" aria-label="${t.acciones}">
  <a class="btn btn-borde" href="tel:+${esc(site.phone)}">${t.llamar}</a>
  <a class="btn btn-claro" href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">${t.maps}</a>
</nav>
`;
}

// Portada en español (index.html) o en inglés (en.html). El inglés mezcla site.en sobre el español.
export function renderLanding({ site: original, config, idioma = 'es' }) {
  const en = idioma === 'en';
  const site = localizar(original, idioma);
  const body = `<main id="contenido" tabindex="-1">
${hero(site, idioma)}
${bar(site)}
${oficio(site, idioma)}
${menu(site, idioma)}
${galeria(site, idioma)}
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
    intro: introHtml(site),
    scripts: ['js/site.js'], head: alternativas + structuredData({ site: original, config }), after: barraMovil(site, idioma),
    alterno: en ? { href: './', lang: 'es', texto: 'ES', etiqueta: 'Ver en español' } : { href: 'en.html', lang: 'en', texto: 'EN', etiqueta: 'View in English' },
  });
}
