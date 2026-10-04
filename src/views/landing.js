import { resumen } from '../../public/js/horario.js';
import { BOMBARDERO } from './bombardero.js';
import { NAV, esc, escPhone, instagramUrl, layout, reviewUrl, rodar, whatsappUrl } from './html.js';
import { ANIMS, HUMO, ICONOS, SELLO } from './ilustraciones.js';
import { structuredData } from './schema.js';

export { NAV };
export const NAV_EN = [
  { id: 'bar', label: 'The bar' },
  { id: 'oficio', label: 'The craft' },
  { id: 'carta', label: 'The menu' },
  { id: 'opinion', label: 'Opinion' },
  { id: 'visitanos', label: 'Visit us' },
  { id: 'local', label: 'The venue' },
];

// Textos fijos de la portada en cada idioma (los de contenido, del bar, están en site.js; en inglés, en site.en).
const TXT = {
  es: {
    desliza: 'Desliza ↓', lleva: 'Lleva', pausar: 'Pausar animaciones', completa: 'Carta completa', precios: 'Precios en euros',
    verCarta: 'Ver la carta en pantalla completa', otraCarta: 'Menu in English', cartaOtra: 'carta-en.html', otraLang: 'en',
    sec: { bar: ['El bar', 'Santa Cruz'], oficio: ['El oficio', ''], carta: ['La carta', 'Clásicos'], opinion: ['Tu opinión', 'Google'], visita: ['Visítanos', 'Calle de los Sueños'], local: ['El local', 'Santa Cruz'], reservas: ['Reservas', 'WhatsApp'] },
    horario: 'Horario', direccion: 'Dirección', contacto: 'Contacto', tel: 'Teléfono y WhatsApp', comoLlegar: 'Cómo llegar', llamar: 'Llamar', reservarMesa: 'Reservar mesa',
    acciones: 'Acciones rápidas', portada: 'Portada',
    form: { nombre: 'Tu nombre', personas: 'Personas', persona: 'persona', pers: 'personas', dia: 'Día', hora: 'Hora', comentario: 'Comentario', opcional: '(opcional)', placeholder: 'Terraza, cumpleaños, vamos con perro…', nota: 'Esta web no guarda tus datos: el mensaje solo se envía si tú lo mandas desde WhatsApp.' },
  },
  en: {
    desliza: 'Scroll ↓', lleva: 'Contains', pausar: 'Pause animations', completa: 'Full menu', precios: 'Prices in euros',
    verCarta: 'View the full-screen menu', otraCarta: 'Carta en español', cartaOtra: 'carta.html', otraLang: 'es',
    sec: { bar: ['The bar', 'Santa Cruz'], oficio: ['The craft', ''], carta: ['The menu', 'Classics'], opinion: ['Your opinion', 'Google'], visita: ['Visit us', 'Calle de los Sueños'], local: ['The venue', 'Santa Cruz'], reservas: ['Bookings', 'WhatsApp'] },
    horario: 'Opening hours', direccion: 'Address', contacto: 'Contact', tel: 'Phone and WhatsApp', comoLlegar: 'Get directions', llamar: 'Call', reservarMesa: 'Book a table',
    acciones: 'Quick actions', portada: 'Home',
    form: { nombre: 'Your name', personas: 'Guests', persona: 'guest', pers: 'guests', dia: 'Date', hora: 'Time', comentario: 'Comment', opcional: '(optional)', placeholder: 'Terrace, birthday, bringing a dog…', nota: 'This website does not store your data: the message is only sent if you send it from WhatsApp.' },
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

// Cabecera de sección: número, nombre y nota a la derecha.
const cabeceraSeccion = (n, [nombre, nota]) => `<div class="cabecera-seccion"><span class="etiqueta"><b>${n}</b> — ${nombre}</span>${nota ? `<span class="etiqueta">${nota}</span>` : ''}</div>`;

// Titular que sube desde detrás de una máscara. El HTML (<em>) viene de site.js, que es contenido propio.
const titular = (html, clase = '') => `<h2 class="mascara${clase}" data-reveal="mascara"><span>${html}</span></h2>`;

// Imagen de ambiente de fondo, decorativa (alt vacío): WebP y JPG en varios anchos, el navegador
// elige el más ligero que le sirve. "lazy" porque va bajo la portada.
// prioridad: para la portada (es lo primero que se ve): se descarga enseguida, sin "lazy".
const fondo = (image, clase, { prioridad = false, sizes = '100vw', alt = '' } = {}) => {
  const srcset = (ext) => image.widths.map((w) => `assets/${esc(image.src)}-${w}.${ext} ${w}w`).join(', ');
  const medio = image.widths[Math.floor(image.widths.length / 2)];
  return `<picture class="${clase}">
    <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">
    <img src="assets/${esc(image.src)}-${medio}.jpg" srcset="${srcset('jpg')}" sizes="${sizes}" alt="${esc(alt)}" width="${image.width}" height="${image.height}" ${prioridad ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
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

function hero(site, idioma) {
  const t = TXT[idioma];
  const { hero: h } = site;
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
        <a class="btn btn-claro" href="#reservar">${rodar(h.cta)}${flecha}</a>
        <a class="btn btn-borde" href="#carta">${rodar(h.secondary)}</a>
      </div>
    </div>
    <figure class="hero-figura${h.image ? '' : ' vectorial'}">
      ${h.image ? fondo(h.image, 'hero-foto', { prioridad: true, sizes: '(max-width: 980px) 100vw, 45vw', alt: h.imageAlt }) : BOMBARDERO}
      ${h.imageCaption ? `<figcaption class="etiqueta">${esc(h.imageCaption)}</figcaption>` : ''}
    </figure>
    <div class="hero-pie etiqueta" data-reveal${d(6)}>
      ${estadoAhora(site, 'estado-hero')}
      ${h.foot.map((t) => `<span>${esc(t)}</span>`).join('\n      ')}
      <a href="#bar">${t.desliza}</a>
    </div>
  </div>
</section>

<div class="cinta" aria-hidden="true">
  <div class="cinta-pista">
    ${[0, 1].map(() => site.cinta.map((t) => `<span>${esc(t)} <i>·</i></span>`).join('')).join('\n    ')}
  </div>
</div>`;
}

// Cóctel estrella: el precio sale de la carta, para que no pueda ser distinto en las dos secciones.
export function featuredItem(site) {
  return site.featured && site.menu.sections.flatMap((s) => s.items).find((i) => i.name === site.featured.name);
}

function featured(site, idioma) {
  const t = TXT[idioma];
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
      <h3>${t.lleva}</h3>
      <ul>
        ${f.ingredients.map((i) => `<li>${esc(i)}</li>`).join('\n        ')}
      </ul>
    </div>
  </div>
</section>`;
}

// Foto en WebP y JPG a su ancho (las fotos de cócteles solo existen a 640 px, su tamaño real).
const fotoPar = (src, alt, extra = '') => `<picture><source type="image/webp" srcset="assets/${esc(src)}-640.webp"><img${extra} src="assets/${esc(src)}-640.jpg" alt="${esc(alt)}" width="640" height="1100" loading="lazy" decoding="async"></picture>`;

// 01 · El bar: texto fijo a la izquierda y mosaico de cuatro fotos de cócteles a la derecha.
function bar(site, idioma) {
  const t = TXT[idioma];
  const b = site.bar;
  const fig = (f, i) => `<figure class="foto" data-reveal="foto"${d(i)}><div class="marco">${fotoPar(f.src, f.alt, f.pos ? ` class="pos-${esc(f.pos)}"` : '')}</div><figcaption class="etiqueta"><b>0${i + 1}</b> — ${esc(f.caption)}</figcaption></figure>`;
  const col = (par) => b.photos.map((f, i) => [f, i]).filter(([, i]) => i % 2 === par).map(([f, i]) => fig(f, i)).join('\n          ');
  return `<section id="bar">
  <div class="wrap">
    ${cabeceraSeccion('01', t.sec.bar)}
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
  const t = TXT[idioma];
  const o = site.oficio;
  const dibujo = (item) => (item.id === 'humo' ? HUMO : ANIMS[item.id]).replace(/aria-label="[^"]*"/, `aria-label="${esc(item.aria)}"`);
  return `<section id="oficio">
  <div class="wrap">
    <div class="cabecera-seccion"><span class="etiqueta"><b>02</b> — ${t.sec.oficio[0]}</span><button class="pausa-anim" type="button" aria-pressed="false" hidden>${t.pausar}</button></div>
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

// Clásicos destacados de la carta, con su icono. El precio sale de la carta para no repetirlo a mano.
function destacados(site, idioma) {
  const t = TXT[idioma];
  const todos = site.menu.sections.flatMap((s) => s.items);
  return `<ol class="carta-destacada">
      ${site.highlights.map((h, n) => `<li class="carta-fila" data-reveal${d(n)}>
        <span class="etiqueta">0${n + 1}</span>
        ${ICONOS[h.icon]}
        <div class="carta-nombre"><h3>${esc(h.name)}</h3><p>${esc(h.text)}</p></div>
        <span class="etiqueta carta-ingredientes">${esc(h.ingredients)}</span>
        <span class="etiqueta carta-epoca">${esc(h.epoch)} <b>· ${esc(todos.find((i) => i.name === h.name).price)}</b></span>
      </li>`).join('\n      ')}
    </ol>`;
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
export function menuHtml(site, { idioma = 'es', titulo = 'h2', enlaces = '', cabecera = '', antes = '', completa = '' } = {}) {
  const { menu: m } = site;
  const en = idioma === 'en';
  const t = TEXTOS_CARTA[idioma];
  const nombre = (x) => (en && x.nameEn) || x.name;
  const texto = (x) => (en && x.textEn) || x.text;
  const first = m.sections[0].id;
  const sub = titulo === 'h1' ? 'h2' : 'h3'; // sin saltarse niveles de encabezado
  const tabs = m.sections.map((s) => `<button type="button" role="tab" id="tab-${esc(s.id)}" aria-controls="carta-${esc(s.id)}" aria-selected="${s.id === first}"${s.id === first ? '' : ' tabindex="-1"'}>${esc(nombre(s))}</button>`).join('\n        ');
  const alergenos = (item) => (item.allergens && item.allergens.length
    ? `<p class="plato-alergenos"><span>${t.alergenos}:</span> ${item.allergens.map((k) => esc(ALERGENOS[k][en ? 1 : 0])).join(', ')}</p>` : '');
  const panels = m.sections.map((s) => `<div class="carta-panel" role="tabpanel" id="carta-${esc(s.id)}" aria-labelledby="tab-${esc(s.id)}" tabindex="0">
        <${sub} class="carta-seccion">${esc(nombre(s))}</${sub}>
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
    ${cabecera}
    <${titulo}>${esc((en && m.titleEn) || m.title)}</${titulo}>
    ${antes}
    ${completa}
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
function menu(site, idioma) {
  const t = TXT[idioma];
  return menuHtml(site, {
    idioma,
    cabecera: cabeceraSeccion('03', t.sec.carta),
    antes: destacados(site),
    completa: `<div class="cabecera-seccion cabecera-completa"><span class="etiqueta"><b>—</b> ${t.completa}</span><span class="etiqueta">${t.precios}</span></div>`, enlaces: `<p class="carta-enlaces"><a href="${idioma === 'en' ? 'carta-en.html' : 'carta.html'}">${t.verCarta}</a> <a href="${t.cartaOtra}" lang="${t.otraLang}" hreflang="${t.otraLang}">${t.otraCarta}</a></p>` });
}

// El local: galería de fotos y, debajo, tres datos (terraza, interior, mascotas). Si todavía no hay
// fotos, solo los tres datos, en versión tipográfica y sin cajas vacías.
function local(site, idioma) {
  const t = TXT[idioma];
  const { local: l } = site;
  const fotos = (l.gallery || []).filter((g) => g.src);
  return `<section class="local" id="local">
  <div class="wrap">
    ${cabeceraSeccion('06', t.sec.local)}
    <div class="titulo-fila">
      ${titular(l.title)}
    </div>
    ${fotos.length ? `<div class="galeria-grid">
      ${fotos.map((g, n) => `<figure class="foto" data-reveal="foto"${d(n)}><div class="marco">${fondo(g, '', { sizes: '(max-width: 860px) 50vw, 33vw', alt: g.alt }).replace('fetchpriority="high"', '')}</div><figcaption class="etiqueta"><b>0${n + 1}</b> — ${esc(g.caption)}</figcaption></figure>`).join('\n      ')}
    </div>` : ''}
    <div class="mosaico${fotos.length ? ' con-fotos' : ''}">
      ${l.items.map((item, i) => `<figure class="mosaico-item${i === 0 ? ' grande' : ''}" data-reveal${d(i)}>
        <figcaption><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></figcaption>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// Visítanos: horario agrupado en pocas líneas, "Abierto ahora", dirección y contacto. Con foto de la
// fachada, la foto ocupa la segunda columna; sin ella, el contacto.
function visit(site, idioma) {
  const t = TXT[idioma];
  const { address: a, visit: v } = site;
  const contacto = `<ul class="contacto">
        <li><span>${t.tel}</span><a href="tel:+${esc(site.phone)}">${escPhone(site.phoneDisplay)}</a></li>
        <li><span>Email</span><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
        <li><span>Instagram</span><a href="${esc(instagramUrl(site.instagram))}" rel="noopener" target="_blank">@${esc(site.instagram)}</a></li>
      </ul>`;
  const acciones = `<div class="visita-acciones">
        <a class="btn btn-borde" href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">${rodar(t.comoLlegar)}</a>
        <a class="btn btn-borde" href="tel:+${esc(site.phone)}">${t.llamar}</a>
        <a class="btn btn-borde" href="${esc(whatsappUrl(site.whatsapp.number))}" rel="noopener" target="_blank">WhatsApp</a>
      </div>`;
  return `<section class="visita" id="visitanos">
  <div class="wrap">
    ${cabeceraSeccion('05', t.sec.visita)}
  </div>
  <div class="wrap visita-grid${v.image ? ' con-foto' : ''}">
    <div class="visita-datos">
      <h2>${esc(v.title)}</h2>
      <div class="dato">
        <h3>${t.horario}</h3>
        ${estadoAhora(site, 'estado-info')}
        <ul class="horario-lineas">
          ${resumen(site.hours.days, idioma).map((linea) => `<li>${horasJuntas(esc(linea))}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="dato">
        <h3>${t.direccion}</h3>
        <address>${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}</address>
        <p class="suave">${esc(v.note)}</p>
      </div>
      ${v.image ? contacto : ''}
      ${acciones}
    </div>
    ${v.image ? foto(v.image, 'visita-foto') : `<div class="visita-contacto"><h3>${t.contacto}</h3>${contacto}</div>`}
  </div>
</section>`;
}

// Franja "Déjanos una reseña en Google": siempre visible, justo después de Visítanos.
export function reviewCta(site, idioma = 'es', { numero = '' } = {}) {
  const c = site.reviewCta;
  const en = idioma === 'en';
  return `<section class="opinion" id="opinion" aria-labelledby="opinion-titulo">
  ${numero ? `<div class="wrap">${cabeceraSeccion(numero, TXT[idioma].sec.opinion)}</div>
  ` : ''}<div class="wrap opinion-grid">
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
  const en = idioma === 'en';
  const { reviews: r } = site;
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

function booking(site, idioma) {
  const t = TXT[idioma];
  const { booking: b } = site;
  const personas = Array.from({ length: b.maxPeople }, (_, i) => i + 1)
    .map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n} ${n === 1 ? t.form.persona : t.form.pers}</option>`).join('');
  return `<section class="reservar${b.image ? ' con-imagen' : ''}" id="reservar">
  ${b.image ? fondo(b.image, 'reservar-fondo') : ''}
  <div class="wrap">
    ${cabeceraSeccion('07', t.sec.reservas)}
  </div>
  <div class="wrap reservar-grid">
    <div class="reservar-texto">
      ${titular(esc(b.title))}
      <p data-reveal${d(1)}>${esc(b.intro)}</p>
      <p class="suave">${esc(b.groupsNote)} <a href="tel:+${esc(site.phone)}">${escPhone(site.phoneDisplay)}</a></p>
      ${SELLO}
    </div>
    <form id="formulario" class="formulario" data-whatsapp="${esc(site.whatsapp.number)}" data-horario="${horarioJson(site)}" novalidate>
      <label>${t.form.nombre}
        <input type="text" name="nombre" autocomplete="given-name" required enterkeyhint="next">
      </label>
      <div class="fila">
        <label>${t.form.personas}
          <select name="personas">${personas}</select>
        </label>
        <label>${t.form.dia}
          <input name="dia" type="date" required>
        </label>
        <label>${t.form.hora}
          <input name="hora" type="time" step="900" value="21:00" required>
        </label>
      </div>
      <label><span>${t.form.comentario} <span class="suave">${t.form.opcional}</span></span>
        <input type="text" name="comentario" placeholder="${t.form.placeholder}" enterkeyhint="send">
      </label>
      <p class="form-aviso" id="form-aviso" role="alert" hidden></p>
      <button class="btn btn-claro" type="submit">${t.reservarMesa}</button>
      <p class="form-nota suave">${t.form.nota}</p>
    </form>
  </div>
</section>`;
}

// Barra fija del móvil: reservar y llamar siempre a mano. En pantallas grandes no se muestra.
function barraMovil(site, idioma) {
  const t = TXT[idioma];
  return `<nav class="barra-movil" aria-label="${t.acciones}">
  <a class="btn btn-borde" href="tel:+${esc(site.phone)}">${t.llamar}</a>
  <a class="btn btn-claro" href="#reservar">${t.reservarMesa}</a>
</nav>
`;
}

// Portada en español (index.html) o en inglés (en.html). El inglés mezcla site.en sobre el español.
export function renderLanding({ site: original, config, idioma = 'es' }) {
  const en = idioma === 'en';
  const site = localizar(original, idioma);
  const body = `<main id="contenido" tabindex="-1">
${hero(site, idioma)}
${featured(site, idioma)}
${bar(site, idioma)}
${oficio(site, idioma)}
${menu(site, idioma)}
${reviewCta(original, idioma, { numero: '04' })}
${visit(site, idioma)}
${local(site, idioma)}
${reviews(site, idioma)}
${booking(site, idioma)}
</main>`;
  const base = config.publicBaseUrl;
  const alternativas = base ? `<link rel="alternate" hreflang="es" href="${esc(`${base}/`)}">
<link rel="alternate" hreflang="en" href="${esc(`${base}/en.html`)}">
<link rel="alternate" hreflang="x-default" href="${esc(`${base}/`)}">
` : '';
  return layout({
    site, config, title: site.title, description: site.description, path: en ? '/en' : '/', lang: idioma, nav: en ? NAV_EN : NAV, body,
    scripts: ['js/site.js'], head: alternativas + structuredData({ site: original, config }), after: barraMovil(site, idioma),
    alterno: en ? { href: './', lang: 'es', texto: 'ES', etiqueta: 'Ver en español' } : { href: 'en.html', lang: 'en', texto: 'EN', etiqueta: 'View in English' },
  });
}
