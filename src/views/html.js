import { readFileSync } from 'node:fs';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Enlace para dejar una reseña en Google: el directo de la ficha de Google Business si ya está en
// site.js; si no, la ficha del bar en Google Maps.
export function reviewUrl(site) {
  return (site.reviewCta && site.reviewCta.writeUrl) || site.googleMapsUrl;
}

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

// Teléfono para mostrar: espacios de no separación para que el número no se parta entre dos líneas.
export function escPhone(phone) {
  return esc(phone).replace(/ /g, '&nbsp;');
}

export function whatsappUrl(number, text) {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export const instagramUrl = (user) => `https://www.instagram.com/${user}/`;

// Logotipo: "Belle" rotulado a mano en amarillo, como en el mural del local. Se genera desde
// public/img/logo-belle.svg (trazado de la letra Yellowtail) y se incrusta en línea con el color del texto.
export const LOGO = readFileSync(new URL('../../public/img/logo-belle.svg', import.meta.url), 'utf8')
  .trim()
  .replace('<svg ', '<svg class="marca-belle" aria-hidden="true" ')
  .replace(' role="img" aria-label="Belle"', '')
  .replace('fill="#E8BE45"', 'fill="currentColor"');

// El aviso legal solo se publica cuando están los datos del titular (site.legal.owner).
export function hasLegalNotice(site) {
  return Boolean(site.legal && site.legal.owner && site.legal.owner.trim());
}

// Política de seguridad de contenidos. Va como <meta> en cada página (vale en cualquier alojamiento, también
// en la vista previa local) y _headers la repite como cabecera para Cloudflare.
export const STATIC_CSP = "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'; form-action 'self'; object-src 'none'; base-uri 'self'";

// Color de la parte de arriba de la página (barra de estado del móvil). La web es oscura siempre.
export const THEME_COLOR = '#160E0B';

// Rutas de enlaces y recursos, relativas y con .html para que la web funcione en cualquier subcarpeta
// o dominio. assetVersions añade ?v=<hash> a CSS y JS para evitar cachés antiguas.
export function links(config) {
  return {
    home: './', legal: 'aviso-legal.html', privacy: 'privacidad.html', cookies: 'cookies.html',
    asset: (file) => `assets/${file}${config.assetVersions && config.assetVersions[file] ? `?v=${config.assetVersions[file]}` : ''}`,
    page: (path) => (path === '/' ? '' : `${path.slice(1)}.html`),
  };
}

const FONTS = ['fonts/dm-serif-display.woff2', 'fonts/instrument-sans.woff2', 'fonts/yellowtail.woff2'];

// baseHref: para páginas que se sirven desde cualquier ruta (la página 404), fija la base de los
// enlaces relativos en la raíz de la web. head: HTML extra para <head> (p. ej. datos estructurados).
// after: HTML tras el pie (la barra fija de reservar del móvil).
// Textos fijos del pie en cada idioma.
const PIE = {
  es: { alcohol: 'Bebe con moderación. No servimos alcohol a menores de 18 años.', legal: 'Aviso legal', privacidad: 'Privacidad', cookies: 'Cookies', info: 'Información legal', resena: (s) => s.reviewCta.button },
  en: { alcohol: 'Please drink responsibly. We do not serve alcohol to anyone under 18.', legal: 'Legal notice', privacidad: 'Privacy', cookies: 'Cookies', info: 'Legal information', resena: (s) => s.reviewCta.buttonEn },
};

// lang: idioma de la página ("es" o "en"). cabecera: HTML propio para la cabecera (la página de la
// carta usa una mínima, sin menú ni "Reservar mesa", con el selector de idioma).
export function layout({ site, config, title, description, path = '/', nav = [], body, scripts = [], baseHref = '', head = '', after = '', lang = 'es', cabecera = '' }) {
  const to = links(config);
  // og:image necesita URL absoluta: solo se añade cuando se conoce la dirección pública.
  const ogImage = config.publicBaseUrl && site.ogImage ? `${config.publicBaseUrl}/assets/${site.ogImage}` : '';
  const canonical = config.publicBaseUrl ? `${config.publicBaseUrl}/${to.page(path)}` : '';
  const year = new Date().getFullYear();
  const home = path === '/' ? '' : to.home;
  const t = PIE[lang];
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${baseHref ? `<base href="${esc(baseHref)}">
` : ''}<meta http-equiv="Content-Security-Policy" content="${STATIC_CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">
<meta property="og:url" content="${esc(canonical)}">
` : ''}<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:locale" content="${lang === 'en' ? 'en_GB' : 'es_ES'}">
<meta property="og:site_name" content="${esc(site.fullName)}">
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.ogImageAlt || title)}">
<meta name="twitter:card" content="summary_large_image">
` : ''}<meta name="color-scheme" content="dark">
<meta name="theme-color" content="${THEME_COLOR}">
<link rel="icon" href="${to.asset('img/favicon.svg')}" type="image/svg+xml">
${FONTS.map((font) => `<link rel="preload" href="${to.asset(font)}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<link rel="stylesheet" href="${to.asset('css/site.css')}">
${head}</head>
<body>

${cabecera || `<header class="nav">
  <div class="wrap">
    <a class="marca" href="${home}#inicio" aria-label="${esc(site.fullName)}, inicio">
      <span class="marca-memphis" aria-hidden="true">Memphis</span>
      ${LOGO}
    </a>
    <ul>
      ${nav.map((item) => `<li><a href="${home}#${esc(item.id)}">${esc(item.label)}</a></li>`).join('\n      ')}
    </ul>
    <a class="btn btn-mostaza btn-nav" href="${home}#reservar">Reservar mesa</a>
  </div>
</header>`}

${body}

<footer>
  <div class="wrap">
    <div class="pie-marca">
      <strong>${esc(site.fullName)}</strong>
      <span>${esc(site.address.street)}, ${esc(site.address.postalCode)} ${esc(site.address.city)}</span>
    </div>
    <p class="pie-alcohol">${esc(t.alcohol)}</p>
    <p class="pie-resena"><a href="${esc(reviewUrl(site))}" rel="noopener" target="_blank">${esc(t.resena(site))}</a></p>
    <nav aria-label="${esc(t.info)}">
      ${hasLegalNotice(site) ? `<a href="${to.legal}">${esc(t.legal)}</a>` : ''}
      <a href="${to.privacy}">${esc(t.privacidad)}</a>
      <a href="${to.cookies}">${esc(t.cookies)}</a>
    </nav>
    <div class="pie-año">© ${year} ${esc(site.fullName)}</div>
  </div>
</footer>
${after}${scripts.map((file) => `<script type="module" src="${esc(to.asset(file))}"></script>`).join('\n')}
</body>
</html>`;
}

// Página sencilla para errores (404).
export function messagePage({ site, config, title, heading, text, baseHref = '' }) {
  return layout({
    site, config, title: `${title} | ${site.fullName}`, description: text, path: '/', baseHref,
    body: `<main class="pagina-simple"><div class="wrap">
  <h1>${esc(heading)}</h1>
  <p>${esc(text)}</p>
  <p><a class="btn btn-mostaza" href="${links(config).home}">Volver al inicio</a></p>
</div></main>`,
  });
}
