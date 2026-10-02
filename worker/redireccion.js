// Dominio propio de la web. Mientras esté vacío, la web se publica solo en la dirección de workers.dev.
// Cuando haya dominio: ponerlo aquí y en wrangler.jsonc (routes y PUBLIC_BASE_URL). Un test comprueba
// que coinciden.
export const DOMINIO = '';

// www y la dirección de workers.dev se redirigen al dominio principal, para que solo haya una dirección
// de la web. Va en su propio módulo porque un Worker solo puede exportar manejadores.
export function redireccion(url, dominio = DOMINIO) {
  if (!dominio) return null;
  const host = url.hostname;
  if (host !== `www.${dominio}` && !host.endsWith('.workers.dev')) return null;
  return `https://${dominio}${url.pathname}${url.search}`;
}

// Cloudflare redirige /pagina.html a /pagina. Para que las direcciones con .html (enlaces, sitemap y
// canonical) respondan directamente sin redirección, se pide el recurso sin la extensión, que
// Cloudflare sirve desde pagina.html.
export function sinExtension(url) {
  if (!url.pathname.endsWith('.html') || url.pathname.endsWith('/index.html')) return null;
  const destino = new URL(url);
  destino.pathname = url.pathname.slice(0, -'.html'.length);
  return destino;
}
