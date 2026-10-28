// Cambia el dominio de la web en un solo paso (worker/redireccion.js y wrangler.jsonc: routes y PUBLIC_BASE_URL).
//
// Uso:  node scripts/cambiar-dominio.js midominio.com
//       node scripts/cambiar-dominio.js carta.midominio.com      (un subdominio: solo se enruta ese)
//
// Con un dominio raíz (midominio.com) se enrutan también www.midominio.com, que redirige al principal.
// Después: npm test, y volver a generar el QR de las mesas (npm run qr-mesas) y las pegatinas (npm run pegatinas).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dominio = (process.argv[2] || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
if (!/^(?!www\.)[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(dominio)) {
  console.error('Uso: node scripts/cambiar-dominio.js midominio.com  (sin https:// ni www)');
  process.exit(1);
}
// Dominio raíz: dos etiquetas (midominio.com) o sufijo de dos partes habitual (midominio.com.es, .co.uk).
const partes = dominio.split('.');
const esRaiz = partes.length === 2 || (partes.length === 3 && ['com', 'co', 'org', 'net'].includes(partes[1]) && partes[2].length === 2);

const editar = (archivo, pares) => {
  const ruta = join(raiz, archivo);
  let s = readFileSync(ruta, 'utf8');
  for (const [buscar, poner] of pares) {
    if (!buscar.test(s)) throw new Error(`No encuentro lo que debo cambiar en ${archivo}: ${buscar}`);
    s = s.replace(buscar, poner);
  }
  writeFileSync(ruta, s);
};

editar('worker/redireccion.js', [[/export const DOMINIO = '[^']*';/, `export const DOMINIO = '${dominio}';`]]);
const rutas = (esRaiz ? [dominio, `www.${dominio}`] : [dominio]).map((p) => `{ "pattern": "${p}", "custom_domain": true }`).join(', ');
// wrangler.jsonc puede estar sin dominio (sin routes ni PUBLIC_BASE_URL): se añaden si faltan.
editar('wrangler.jsonc', [
  [/"command": "CHECK_PUBLICACION=1 npm test && (PUBLIC_BASE_URL=https:\/\/[^ ]+ )?npm run build"/, `"command": "CHECK_PUBLICACION=1 npm test && PUBLIC_BASE_URL=https://${dominio} npm run build"`],
  [/(  "routes": \[[^\]]*\],\n)?  "assets"/, `  "routes": [${rutas}],\n  "assets"`],
]);
console.log(`Dominio cambiado a ${dominio}${esRaiz ? ' (con www)' : ''}.\nSiguiente: npm test · npm run qr-mesas · npm run pegatinas -- https://${dominio}`);
