// Lista los datos de src/content/site.js sin confirmar con el local o con la ficha de Google Business:
// "pendiente" (bloquea la publicación) y "revisar" (no la bloquea). Uso: npm run pendientes
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../src/content/site.js';

// Recorre el contenido y devuelve [{ donde: 'hours', que: '...' }] por cada campo con esa clave y texto.
export function pendientes(clave = 'pendiente', value = site, path = []) {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => (key === clave
    ? (child ? [{ donde: path.join('.') || '(raíz)', que: child }] : [])
    : pendientes(clave, child, [...path, key])));
}

const lista = (items) => items.map((p) => `- ${p.donde}: ${p.que}`).join('\n');

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const bloquean = pendientes('pendiente');
  const revisar = pendientes('revisar');
  console.log(bloquean.length
    ? `Pendientes antes de publicar (${bloquean.length}):\n${lista(bloquean)}`
    : 'Nada pendiente: la web se puede publicar.');
  if (revisar.length) console.log(`\nPara completar cuando se pueda (${revisar.length}):\n${lista(revisar)}`);
}
