// Comprobación antes de publicar: solo se ejecuta con CHECK_PUBLICACION=1 (lo pone wrangler.jsonc al
// publicar en Cloudflare). Mientras quede algún dato "pendiente" en site.js (carta de ejemplo, horario
// sin confirmar...), falla y Cloudflare no publica. En GitHub Actions y en local no se ejecuta, para
// poder trabajar con la web a medias.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { pendientes } from '../scripts/pendientes.js';

test('no queda ningún dato pendiente antes de publicar', { skip: process.env.CHECK_PUBLICACION !== '1' && 'solo al publicar (CHECK_PUBLICACION=1)' }, () => {
  const lista = pendientes('pendiente');
  assert.deepEqual(lista, [], `Faltan datos antes de publicar:\n${lista.map((p) => `- ${p.donde}: ${p.que}`).join('\n')}`);
});
