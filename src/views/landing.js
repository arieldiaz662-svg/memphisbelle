import { DIAS, NOMBRES } from '../../public/js/horario.js';
import { esc, escPhone, instagramUrl, layout, whatsappUrl } from './html.js';
import { structuredData } from './schema.js';

// Menú de la cabecera, en el orden de las secciones de la página.
export const NAV = [
  { id: 'carta', label: 'Carta' },
  { id: 'horario', label: 'Horario' },
  { id: 'local', label: 'El local' },
  { id: 'reservar', label: 'Reservar' },
];

const capital = (text) => `${text[0].toUpperCase()}${text.slice(1)}`;
const horarioJson = (site) => esc(JSON.stringify(site.hours.days));

// Estado "Abierto ahora / Cerrado": lo rellena el navegador con la hora de Canarias (public/js/site.js).
// Sin JavaScript queda oculto y se ve el horario en texto.
const estadoAhora = (site, extraClass = '') => `<p class="estado ${extraClass}" data-horario="${horarioJson(site)}" hidden><span class="estado-punto" aria-hidden="true"></span><span class="estado-texto"></span></p>`;

function hero(site) {
  const { hero: h } = site;
  return `<section class="hero" id="inicio">
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

function menu(site) {
  const { menu: m } = site;
  const first = m.sections[0].id;
  const tabs = m.sections.map((s) => `<button type="button" role="tab" id="tab-${esc(s.id)}" aria-controls="carta-${esc(s.id)}" aria-selected="${s.id === first}"${s.id === first ? '' : ' tabindex="-1"'}>${esc(s.name)}</button>`).join('\n        ');
  const panels = m.sections.map((s) => `<div class="carta-panel" role="tabpanel" id="carta-${esc(s.id)}" aria-labelledby="tab-${esc(s.id)}" tabindex="0">
        <h3 class="carta-seccion">${esc(s.name)}</h3>
        <ul>
          ${s.items.map((item) => `<li>
            <div class="plato"><span class="plato-nombre">${esc(item.name)}</span><span class="guia" aria-hidden="true"></span><span class="importe">${esc(item.price)}</span></div>
            ${item.text ? `<p class="plato-texto">${esc(item.text)}</p>` : ''}
          </li>`).join('\n          ')}
        </ul>
      </div>`).join('\n      ');
  return `<section class="carta" id="carta">
  <div class="wrap">
    <h2>${esc(m.title)}</h2>
    <div class="papel">
      ${m.pendiente ? '<p class="aviso-ejemplo">Carta de ejemplo: pendiente de la carta real del local.</p>' : ''}
      <div class="carta-tabs" role="tablist" aria-label="Secciones de la carta" hidden>
        ${tabs}
      </div>
      ${panels}
      <p class="carta-nota">${esc(m.note)}</p>
    </div>
  </div>
</section>`;
}

function info(site) {
  const filas = DIAS.map((d) => {
    const f = site.hours.days[d];
    return `<tr data-dia="${d}"><th scope="row">${capital(NOMBRES[d])}</th><td>${f ? `${esc(f[0])} a ${esc(f[1])}` : 'Cerrado'}</td></tr>`;
  }).join('\n          ');
  const { address: a } = site;
  return `<section class="info" id="horario">
  <div class="wrap info-grid">
    <div>
      <h2>Horario</h2>
      ${estadoAhora(site, 'estado-info')}
      <table class="horario">
        <caption class="sr">Horario de apertura, hora de Canarias</caption>
        <tbody>
          ${filas}
        </tbody>
      </table>
    </div>
    <div>
      <h2>Dónde estamos</h2>
      <address>
        ${esc(a.street)}<br>
        ${esc(a.postalCode)} ${esc(a.city)}
      </address>
      <p class="suave">En el centro de Santa Cruz.</p>
      <a class="btn btn-linea" href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">Cómo llegar</a>
    </div>
    <div>
      <h2>Contacto</h2>
      <ul class="contacto">
        <li><span>Teléfono</span><a href="tel:+${esc(site.phone)}">${escPhone(site.phoneDisplay)}</a></li>
        <li><span>WhatsApp</span><a href="${esc(whatsappUrl(site.whatsapp.number))}" rel="noopener" target="_blank">${escPhone(site.phoneDisplay)}</a></li>
        <li><span>Email</span><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
        <li><span>Instagram</span><a href="${esc(instagramUrl(site.instagram))}" rel="noopener" target="_blank">@${esc(site.instagram)}</a></li>
      </ul>
    </div>
  </div>
</section>`;
}

function local(site) {
  const { local: l, reviews: r } = site;
  return `<section class="local" id="local">
  <div class="wrap">
    <h2>${esc(l.title)}</h2>
    <ul class="rasgos">
      ${l.features.map((f) => `<li><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join('\n      ')}
    </ul>
    ${r.rating ? `<p class="valoracion"><strong>${esc(r.rating)}</strong> de 5 en Google${r.count ? `, ${esc(r.count)} reseñas` : ''}. <a href="${esc(site.googleMapsUrl)}" rel="noopener" target="_blank">Leer las reseñas</a></p>` : ''}
  </div>
</section>`;
}

function booking(site) {
  const { booking: b } = site;
  const personas = Array.from({ length: b.maxPeople }, (_, i) => i + 1)
    .map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n} ${n === 1 ? 'persona' : 'personas'}</option>`).join('');
  return `<section class="reservar" id="reservar">
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
${info(site)}
${local(site)}
${booking(site)}
</main>`;
  return layout({
    site, config, title: site.title, description: site.description, path: '/', nav: NAV, body,
    scripts: ['js/site.js'], head: structuredData({ site, config }), after: barraMovil(site),
  });
}

