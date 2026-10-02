# Memphis Belle Coctelería

Web de **Memphis Belle Coctelería** (Calle de los Sueños, 1, Santa Cruz de Tenerife): carta digital, horario con "Abierto ahora", ubicación, contacto y reservas por WhatsApp.

Es una web **100 % estática**: sin servidor, sin base de datos y sin cookies. El formulario de reservas no guarda datos, solo abre WhatsApp con el mensaje ya escrito. Se aloja gratis en Cloudflare Workers. Misma base técnica que la web de Alcance Isleño.

- Diseño y criterios visuales: [docs/DISENO.md](docs/DISENO.md)
- Skills de diseño y animación (Emil Kowalski): [.claude/skills/README.md](.claude/skills/README.md)

## Uso

Requisitos: Node.js 22 o superior. No hay dependencias que instalar.

```bash
npm run build        # genera la web en dist/
npm run preview      # la sirve en http://localhost:4000 para revisarla
npm test             # comprueba la web generada (carta, horario, enlaces, textos legales…)
npm run pendientes   # lista los datos sin confirmar con el local o la ficha de Google
npm run og-image     # regenera la imagen para compartir (tras cambiar la portada; necesita Playwright)
```

## Antes de publicar

Los datos que no se han podido confirmar llevan `pendiente` en `src/content/site.js`. **Mientras quede alguno, Cloudflare no publica la web**: su comando de construcción ejecuta los tests con `CHECK_PUBLICACION=1`, y `test/publicacion.test.js` falla si queda alguno. Los marcados con `revisar` conviene completarlos, pero no bloquean. `npm run pendientes` los lista.

## Publicación

**Cloudflare Workers**: conectar el Worker `memphisbar` a este repositorio. Toda la configuración está en `wrangler.jsonc`: pasa los tests (si alguno falla, no se publica), construye y publica `dist/`, sirve `404.html` en rutas inexistentes y aplica las cabeceras de `_headers`. Sin dominio propio, la web queda en `memphisbar.<cuenta>.workers.dev`.

Al tener dominio: añadirlo en `worker/redireccion.js` (`DOMINIO`) y en `wrangler.jsonc` (`routes` con el dominio y `www`, y `PUBLIC_BASE_URL=https://<dominio>` en el comando de construcción). Un test comprueba que coinciden. Con `PUBLIC_BASE_URL` se generan el canonical, el sitemap, la imagen al compartir y los datos estructurados para Google.

GitHub Actions (`.github/workflows/ci.yml`) pasa los tests en cada push y pull request.

## Qué editar

| Qué | Dónde |
|---|---|
| Carta, precios y secciones | `src/content/site.js` → `menu` |
| Horario (una franja por día, hora de Canarias) | `src/content/site.js` → `hours` (debe coincidir con la ficha de Google) |
| Teléfono, WhatsApp, email, Instagram, dirección | `src/content/site.js` |
| Valoración de Google | `src/content/site.js` → `reviews` |
| Datos del titular para el aviso legal | `src/content/site.js` → `legal` (mientras esté vacío, el aviso legal no se publica) |
| Colores y tipografía | `public/css/site.css` → `:root` |

## Estructura

```
src/content/site.js     contenido editable (una sola fuente de textos, carta y horario)
src/views/              plantillas: portada (landing.js), base (html.js), legales (legal.js), datos para Google (schema.js)
public/js/horario.js    "Abierto ahora" en hora de Canarias; lo usan el navegador, la construcción y los tests
public/js/site.js       pestañas de la carta, estado del horario y formulario de reservas
public/                 CSS, tipografías (OFL) e imágenes
scripts/                construcción, vista previa, imagen al compartir y lista de pendientes
test/                   tests de la web generada y comprobación de publicación
worker/                 Worker de Cloudflare (dirección única y páginas .html sin redirección)
```
