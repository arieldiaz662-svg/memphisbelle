import { resumen } from '../../public/js/horario.js';
import { BOMBARDERO } from './bombardero.js';
import { esc, escPhone, instagramUrl, layout, reviewUrl, whatsappUrl } from './html.js';
import { structuredData } from './schema.js';

// Menú de la cabecera, en el orden de las secciones de la página.
export const NAV = [
  { id: 'carta', label: 'Carta' },
  { id: 'local', label: 'El local' },
  { id: 'visitanos', label: 'Visítanos' },
  { id: 'reservar', label: 'Reservar' },
];

// Imagen de ambiente de fondo, decorativa (alt vacío): WebP y JPG en varios anchos, el navegador
// elige el más ligero que le sirve. "lazy" porque va bajo la portada.
// prioridad: para la portada (es lo primero que se ve): se descarga enseguida, sin "lazy".
const fondo = (image, clase, { prioridad = false } = {}) => {
  const srcset = (ext) => image.widths.map((w) => `assets/${esc(image.src)}-${w}.${ext} ${w}w`).join(', ');
  const medio = image.widths[Math.floor(image.widths.length / 2)];
  return `<picture class="${clase}">
    <source type="image/webp" srcset="${srcset('webp')}" sizes="100vw">
    <img src="assets/${esc(image.src)}-${medio}.jpg" srcset="${srcset('jpg')}" sizes="100vw" alt="" width="${image.width}" height="${image.height}" ${prioridad ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
  </picture>`;
};

// "de 18:00 a 02:00" no se parte entre dos líneas en el móvil.
const horasJuntas = (texto) => texto.replace(/de (\d\d:\d\d) a (\d\d:\d\d)/, 'de&nbsp;$1&nbsp;a&nbsp;$2');

// Foto propia (public/img/...). Ancho y alto evitan saltos al cargar; "lazy" porque va bajo la portada.
const foto = (image, clase) => `<img class="${clase}" src="assets/${esc(image.src)}" alt="${esc(image.alt)}" width="${image.width || 1200}" height="${image.height || 900}" loading="lazy" decoding="async">`;
const horarioJson = (site) => esc(JSON.stringify(site.hours.days));

// Estado "Abierto ahora / Cerrado": lo rellena el navegador con la hora de Canarias (public/js/site.js).
// Sin JavaScript queda oculto y se ve el horario en texto.
export const estadoAhora = (site, extraClass = '') => `<p class="estado ${extraClass}" data-horario="${horarioJson(site)}" hidden><span class="estado-punto" aria-hidden="true"></span><span class="estado-texto"></span></p>`;

function hero(site) {
  const { hero: h } = site;
  return `<section class="hero${h.image ? ' con-foto' : ''}" id="inicio">
  ${h.image ? fondo(h.image, 'hero-foto', { prioridad: true }) : BOMBARDERO}
  <div class="wrap">
    <h1 class="hero-titulo">Memphis <span class="belle">Belle</span></h1>
    <p class="hero-lead">${esc(h.lead)}</p>
    ${estadoAhora(site)}
    <div class="hero-acciones">
      <a class="btn btn-mostaza" href="#reservar">${esc(h.cta)}</a>
      <a class="btn btn-linea" href="#carta">${esc(h.secondary)}</a>
    </div>
  </div>
</section>`;
}

// Cóctel estrella: el precio sale de la carta, para que no pueda ser distinto en las dos secciones.
export function featuredItem(site) {
  return site.featured && site.menu.sections.flatMap((s) => s.items).find((i) => i.name === site.featured.name);
}

function featured(site) {
  const f = site.featured;
  if (!f) return '';
  const item = featuredItem(site);
  return `<section class="estrella" id="estrella" aria-labelledby="estrella-titulo">
  <div class="wrap estrella-grid${f.image ? ' con-foto' : ''}">
    <div class="estrella-texto">
      <p class="estrella-etiqueta">${esc(f.label)}</p>
      <h2 id="estrella-titulo">${esc(f.name)}</h2>
      <p class="estrella-desc">${esc(f.text)}</p>
      <p class="estrella-precio">${esc(item.price)}</p>
    </div>
    ${f.image ? `<img class="estrella-foto" src="assets/${esc(f.image.src)}" alt="${esc(f.image.alt)}" width="800" height="1000" loading="lazy">` : ''}
    <div class="estrella-receta">
      <h3>Lleva</h3>
      <ul>
        ${f.ingredients.map((i) => `<li>${esc(i)}</li>`).join('\n        ')}
      </ul>
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

const TEXTOS_CARTA = {
  es: { secciones: 'Secciones de la carta', ejemplo: 'Carta de ejemplo: pendiente de la carta real del local.', alergenos: 'Alérgenos' },
  en: { secciones: 'Menu sections', ejemplo: 'Sample menu: the real menu is still to be added.', alergenos: 'Allergens' },
};

// La carta como un papel impreso, con pestañas. idioma: "es" o "en". titulo: etiqueta del encabezado
// (h2 en la portada, h1 en la página de la carta). El inglés usa nameEn/textEn/noteEn y, si falta, el español.
export function menuHtml(site, { idioma = 'es', titulo = 'h2', enlaces = '' } = {}) {
  const { menu: m } = site;
  const en = idioma === 'en';
  const t = TEXTOS_CARTA[idioma];
  const nombre = (x) => (en && x.nameEn) || x.name;
  const texto = (x) => (en && x.textEn) || x.text;
  const first = m.sections[0].id;
  const tabs = m.sections.map((s) => `<button type="button" role="tab" id="tab-${esc(s.id)}" aria-controls="carta-${esc(s.id)}" aria-selected="${s.id === first}"${s.id === first ? '' : ' tabindex="-1"'}>${esc(nombre(s))}</button>`).join('\n        ');
  const alergenos = (item) => (item.allergens && item.allergens.length
    ? `<p class="plato-alergenos"><span>${t.alergenos}:</span> ${item.allergens.map((k) => esc(ALERGENOS[k][en ? 1 : 0])).join(', ')}</p>` : '');
  const panels = m.sections.map((s) => `<div class="carta-panel" role="tabpanel" id="carta-${esc(s.id)}" aria-labelledby="tab-${esc(s.id)}" tabindex="0">
        <h3 class="carta-seccion">${esc(nombre(s))}</h3>
        <ul>
          ${s.items.map((item) => `<li>
            <div class="plato"><span class="plato-nombre">${esc(nombre(item))}</span><span class="guia" aria-hidden="true"></span><span class="importe">${esc(item.price)}</span></div>
            ${texto(item) ? `<p class="plato-texto">${esc(texto(item))}</p>` : ''}
            ${alergenos(item)}
          </li>`).join('\n          ')}
        </ul>
      </div>`).join('\n      ');
  return `<section class="carta" id="carta">
  <div class="wrap">
    <${titulo}>${esc((en && m.titleEn) || m.title)}</${titulo}>
    <div class="papel">
      ${m.pendiente ? `<p class="aviso-ejemplo">${t.ejemplo}</p>` : ''}
      <div class="carta-tabs" role="tablist" aria-label="${t.secciones}" hidden>
        ${tabs}
      </div>
      ${panels}
      <p class="carta-nota">${esc((en && m.noteEn) || m.note)}</p>
      ${enlaces}
    </div>
  </div>
</section>`;
}

// Carta de la portada: en español, con enlace a la versión para el móvil y al inglés.
function menu(site) {
  return menuHtml(site, { enlaces: '<p class="carta-enlaces"><a href="carta.html">Ver la carta en pantalla completa</a> <a href="carta-en.html" lang="en" hreflang="en">Menu in English</a></p>' });
}

// El local: mosaico de 3 (el primero grande) con el texto debajo de cada foto. Si todavía no hay
// fotos, la misma composición en versión tipográfica, sin cajas vacías.
function local(site) {
  const { local: l } = site;
  const conFotos = l.items.some((i) => i.image);
  return `<section class="local" id="local">
  <div class="wrap">
    <h2>${esc(l.title)}</h2>
    <div class="mosaico${conFotos ? ' con-fotos' : ''}">
      ${l.items.map((item, i) => `<figure class="mosaico-item${i === 0 ? ' grande' : ''}">
        ${item.image ? foto(item.image, 'mosaico-foto') : ''}
        <figcaption><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></figcaption>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// Visítanos: horario agrupado en pocas líneas, "Abierto ahora", dirección y contacto. Con foto de la
// fachada, la foto ocupa la segunda columna; sin ella, el contacto.
function visit(site) {
  const { address: a, visit: v } = site;
  const contacto = `<ul class="contacto">
        <li><span>Teléfono y WhatsApp</span><a href="tel:+${esc(site.phone)}">${escPhone(site.phoneDisplay)}</a></li>
        <li><span>Email</span><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
        <li><span>Instagram</span><a href="${esc(instagramUrl(site.instagram))}" rel="noopener" target="_blank">@${esc(site.instagram)}</a></li>
      </ul>`;
  const acciones = `<div class="visita-acciones">
        <a class="btn btn-linea" href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">Cómo llegar</a>
        <a class="btn btn-linea" href="tel:+${esc(site.phone)}">Llamar</a>
        <a class="btn btn-linea" href="${esc(whatsappUrl(site.whatsapp.number))}" rel="noopener" target="_blank">WhatsApp</a>
      </div>`;
  return `<section class="visita" id="visitanos">
  <div class="wrap visita-grid${v.image ? ' con-foto' : ''}">
    <div class="visita-datos">
      <h2>${esc(v.title)}</h2>
      <div class="dato">
        <h3>Horario</h3>
        ${estadoAhora(site, 'estado-info')}
        <ul class="horario-lineas">
          ${resumen(site.hours.days).map((linea) => `<li>${horasJuntas(esc(linea))}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="dato">
        <h3>Dirección</h3>
        <address>${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}</address>
        <p class="suave">${esc(v.note)}</p>
      </div>
      ${v.image ? contacto : ''}
      ${acciones}
    </div>
    ${v.image ? foto(v.image, 'visita-foto') : `<div class="visita-contacto"><h3>Contacto</h3>${contacto}</div>`}
  </div>
</section>`;
}

// Franja "Déjanos una reseña en Google": siempre visible, justo después de Visítanos.
export function reviewCta(site, idioma = 'es') {
  const c = site.reviewCta;
  const en = idioma === 'en';
  return `<section class="opinion" id="opinion" aria-labelledby="opinion-titulo">
  <div class="wrap opinion-grid">
    <div>
      <h2 id="opinion-titulo">${esc(en ? c.titleEn : c.title)}</h2>
      <p>${esc(en ? c.textEn : c.text)}</p>
    </div>
    <a class="btn btn-linea btn-resena" href="${esc(reviewUrl(site))}" rel="noopener" target="_blank"><span class="estrellas" aria-hidden="true">★★★★★</span>${esc(en ? c.buttonEn : c.button)}</a>
  </div>
</section>`;
}

// Reseñas: solo si hay valoración de Google copiada de la ficha. Las citas son opcionales (reales y
// con su autor). Sin valoración, la sección no existe.
function reviews(site) {
  const { reviews: r } = site;
  if (!r.rating) return '';
  return `<section class="resenas" id="resenas">
  <div class="wrap resenas-grid">
    <div class="resenas-nota">
      <h2 class="sr">Reseñas</h2>
      <p class="nota-google"><strong>${esc(r.rating)}</strong> de 5 en Google</p>
      ${r.count ? `<p class="suave">${esc(r.count)} reseñas</p>` : ''}
      <a class="btn btn-linea" href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">Leer las reseñas</a>
    </div>
    ${(r.quotes || []).slice(0, 3).map((q) => `<blockquote class="cita"><p>${esc(q.text)}</p><footer>${esc(q.author)}, en Google</footer></blockquote>`).join('\n    ')}
  </div>
</section>`;
}

function booking(site) {
  const { booking: b } = site;
  const personas = Array.from({ length: b.maxPeople }, (_, i) => i + 1)
    .map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n} ${n === 1 ? 'persona' : 'personas'}</option>`).join('');
  return `<section class="reservar${b.image ? ' con-imagen' : ''}" id="reservar">
  ${b.image ? fondo(b.image, 'reservar-fondo') : ''}
  <div class="wrap reservar-grid">
    <div>
      <h2>${esc(b.title)}</h2>
      <p>${esc(b.intro)}</p>
      <p class="suave">${esc(b.groupsNote)} <a href="tel:+${esc(site.phone)}">${escPhone(site.phoneDisplay)}</a></p>
    </div>
    <form id="formulario" class="formulario" data-whatsapp="${esc(site.whatsapp.number)}" data-horario="${horarioJson(site)}" novalidate>
      <label>Tu nombre
        <input name="nombre" autocomplete="given-name" required enterkeyhint="next">
      </label>
      <div class="fila">
        <label>Personas
          <select name="personas">${personas}</select>
        </label>
        <label>Día
          <input name="dia" type="date" required>
        </label>
        <label>Hora
          <input name="hora" type="time" step="900" value="21:00" required>
        </label>
      </div>
      <label><span>Comentario <span class="suave">(opcional)</span></span>
        <input name="comentario" placeholder="Terraza, cumpleaños, vamos con perro…" enterkeyhint="send">
      </label>
      <p class="form-aviso" id="form-aviso" role="alert" hidden></p>
      <button class="btn btn-mostaza" type="submit">Reservar mesa</button>
      <p class="form-nota suave">Esta web no guarda tus datos: el mensaje solo se envía si tú lo mandas desde WhatsApp.</p>
    </form>
  </div>
</section>`;
}

// Barra fija del móvil: reservar y llamar siempre a mano. En pantallas grandes no se muestra.
function barraMovil(site) {
  return `<nav class="barra-movil" aria-label="Acciones rápidas">
  <a class="btn btn-linea" href="tel:+${esc(site.phone)}">Llamar</a>
  <a class="btn btn-mostaza" href="#reservar">Reservar mesa</a>
</nav>
`;
}

export function renderLanding({ site, config }) {
  const body = `<main>
${hero(site)}
${featured(site)}
${menu(site)}
${local(site)}
${visit(site)}
${reviewCta(site)}
${reviews(site)}
${booking(site)}
</main>`;
  return layout({
    site, config, title: site.title, description: site.description, path: '/', nav: NAV, body,
    scripts: ['js/site.js'], head: structuredData({ site, config }), after: barraMovil(site),
  });
}

