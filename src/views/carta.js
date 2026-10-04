import { LOGO, esc, layout } from './html.js';
import { estadoAhora, menuHtml, reviewCta } from './landing.js';

// Página de la carta para el QR de las mesas, en español (carta.html) y en inglés (carta-en.html).
// Pensada para quien ya está sentado en el bar: la carta arriba, sin portada, sin reservas y sin menú; la
// reseña de Google al final. Ligera (sin fotos) para que cargue enseguida con poca cobertura.
// La dirección del QR es /carta (el selector de idioma está en la propia página).

const TEXTOS = {
  es: { titulo: 'Memphis Belle Coctelería | La carta', descripcion: 'La carta de Memphis Belle Coctelería, en Santa Cruz de Tenerife: cócteles clásicos, de la casa y sin alcohol, con precios.', inicio: 'Ir a la web', idioma: 'Idioma', enlace: 'carta-en.html', otro: 'English', otroLang: 'en', pagina: '/carta' },
  en: { titulo: 'Memphis Belle Cocktail Bar | The menu', descripcion: 'The menu at Memphis Belle cocktail bar in Santa Cruz de Tenerife: classic, house and alcohol-free cocktails, with prices.', inicio: 'Go to the website', idioma: 'Language', enlace: 'carta.html', otro: 'Español', otroLang: 'es', pagina: '/carta-en' },
};

function cabecera(site, idioma) {
  const t = TEXTOS[idioma];
  return `<header class="nav nav-carta">
  <div class="wrap">
    <a class="marca" href="./" aria-label="${esc(site.fullName)}, ${esc(t.inicio)}">
      <span class="marca-memphis" aria-hidden="true">Memphis</span>
      ${LOGO}
    </a>
    <nav class="idiomas" aria-label="${esc(t.idioma)}">
      <a href="${t.enlace}" lang="${t.otroLang}" hreflang="${t.otroLang}">${esc(t.otro)}</a>
    </nav>
  </div>
</header>`;
}

export function renderCarta({ site, config, idioma = 'es' }) {
  const t = TEXTOS[idioma];
  const en = idioma === 'en';
  const base = config.publicBaseUrl;
  const aviso = (en ? site.menu.allergensNoteEn : site.menu.allergensNote) || '';
  const body = `<main class="carta-pagina">
${menuHtml(site, { idioma, titulo: 'h1' })}
<section class="carta-extra">
  <div class="wrap">
    ${estadoAhora(site, 'estado-info')}
    ${aviso ? `<p class="alergenos-aviso">${esc(aviso)}</p>` : ''}
  </div>
</section>
${reviewCta(site, idioma)}
</main>`;
  // hreflang: solo con dirección pública (necesita URL absolutas).
  const alternativas = base ? `<link rel="alternate" hreflang="es" href="${esc(`${base}/carta.html`)}">
<link rel="alternate" hreflang="en" href="${esc(`${base}/carta-en.html`)}">
<link rel="alternate" hreflang="x-default" href="${esc(`${base}/carta.html`)}">
` : '';
  return layout({
    site, config, title: t.titulo, description: t.descripcion, path: en ? '/carta-en' : '/carta',
    lang: idioma, cabecera: cabecera(site, idioma), body, scripts: ['js/site.js'], head: alternativas,
  });
}
