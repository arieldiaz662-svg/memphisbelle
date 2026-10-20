// Worker mínimo delante de la web estática: redirige (301) las direcciones secundarias al dominio
// principal, rechaza todo lo que no sea leer (GET, HEAD u OPTIONS) y el resto lo sirven los recursos
// estáticos de dist/ (página 404 incluida). Las cabeceras de seguridad (src/seguridad.js) se ponen en
// todas las respuestas, también en redirecciones y errores.
import { CABECERAS_SEGURIDAD } from '../src/seguridad.js';
import { redireccion, sinExtension } from './redireccion.js';

const METODOS = ['GET', 'HEAD', 'OPTIONS'];

export function conCabeceras(respuesta) {
  const cabeceras = new Headers(respuesta.headers);
  for (const [nombre, valor] of Object.entries(CABECERAS_SEGURIDAD)) cabeceras.set(nombre, valor);
  cabeceras.delete('Server');
  cabeceras.delete('X-Powered-By');
  return new Response(respuesta.body, { status: respuesta.status, statusText: respuesta.statusText, headers: cabeceras });
}

export async function atender(request, env) {
  if (!METODOS.includes(request.method)) {
    return new Response('Método no permitido', { status: 405, headers: { Allow: METODOS.join(', '), 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { Allow: METODOS.join(', ') } });
  const destino = redireccion(new URL(request.url));
  if (destino) return Response.redirect(destino, 301);
  const recurso = sinExtension(new URL(request.url));
  return env.ASSETS.fetch(recurso ? new Request(recurso, request) : request);
}

export default {
  async fetch(request, env) {
    return conCabeceras(await atender(request, env));
  },
};
