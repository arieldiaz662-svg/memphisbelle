// Genera la web en dist/ (o en la carpeta indicada). Es 100 % estática: se puede subir tal cual a
// Cloudflare (Workers o Pages) o Netlify.
//
// Uso:  npm run build
//       PUBLIC_BASE_URL=https://ejemplo.com npm run build   (añade canonical, sitemap y datos para Google)
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../src/content/site.js';
import { STATIC_CSP, hasLegalNotice, messagePage } from '../src/views/html.js';
import { renderCarta } from '../src/views/carta.js';
import { renderLanding } from '../src/views/landing.js';
import { renderCookies, renderLegalNotice, renderPrivacy } from '../src/views/legal.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// CSS y JS con versión según su contenido (?v=...). horario.js no la lleva porque lo importa site.js
// por su nombre; site.js cambia de versión cuando cambia su propio código.
const VERSIONED = ['css/site.css', 'js/site.js'];

export function buildStatic({
  outDir = join(ROOT, 'dist'),
  publicBaseUrl = process.env.PUBLIC_BASE_URL || '',
} = {}) {
  const version = (file) => createHash('sha256').update(readFileSync(join(ROOT, 'public', file))).digest('hex').slice(0, 10);
  const config = {
    assetVersions: Object.fromEntries(VERSIONED.map((file) => [file, version(file)])),
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ''),
  };

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const pages = {
    'index.html': renderLanding({ site, config }),
    'carta.html': renderCarta({ site, config, idioma: 'es' }),
    'carta-en.html': renderCarta({ site, config, idioma: 'en' }),
    ...(hasLegalNotice(site) ? { 'aviso-legal.html': renderLegalNotice({ site, config }) } : {}),
    'en.html': renderLanding({ site, config, idioma: 'en' }),
    'privacidad.html': renderPrivacy({ site, config }),
    'cookies.html': renderCookies({ site, config }),
    // Cloudflare sirve 404.html en cualquier ruta inexistente: <base href="/"> hace que estilos y enlaces
    // funcionen también en rutas con subcarpetas.
    '404.html': messagePage({
      site, config, title: 'Página no encontrada', heading: 'Esta página no existe',
      text: 'Puede que el enlace esté mal escrito o que la página se haya movido.',
      baseHref: '/',
    }),
  };
  for (const [file, html] of Object.entries(pages)) writeFileSync(join(outDir, file), html);

  for (const folder of ['css', 'js', 'img', 'fonts']) {
    cpSync(join(ROOT, 'public', folder), join(outDir, 'assets', folder), { recursive: true });
  }
  // Archivos que deben estar en la raíz del dominio, tal cual (p. ej. la verificación de Google Search Console).
  cpSync(join(ROOT, 'public', 'raiz'), outDir, { recursive: true });

  const sitemapUrls = Object.keys(pages)
    .filter((file) => file !== '404.html')
    .map((file) => (file === 'index.html' ? '' : file));
  writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n${
    config.publicBaseUrl ? `Sitemap: ${config.publicBaseUrl}/sitemap.xml\n` : ''}`);
  if (config.publicBaseUrl) {
    writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((path) => `  <url><loc>${config.publicBaseUrl}/${path}</loc></url>`).join('\n')}
</urlset>
`);
  }

  // Cabeceras de seguridad para Cloudflare y Netlify.
  writeFileSync(join(outDir, '_headers'), `/*
  Content-Security-Policy: ${STATIC_CSP}; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/assets/*
  Cache-Control: public, max-age=86400
`);

  return { outDir, files: Object.keys(pages) };
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const { outDir, files } = buildStatic({ outDir: process.argv[2] ? resolve(process.argv[2]) : undefined });
  console.log(`Web estática generada en ${outDir}: ${files.join(', ')}`);
}
