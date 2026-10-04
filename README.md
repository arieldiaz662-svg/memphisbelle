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

## Carta para el QR de las mesas

- `carta.html` (español) y `carta-en.html` (inglés): solo la carta, sin portada ni reservas, y al final el enlace para dejar una reseña en Google. El QR apunta a `/carta`; el cambio de idioma está en la propia página.
- Alérgenos: cada plato admite `allergens: ['gluten', 'sulfitos', …]` en `src/content/site.js` (14 de la normativa UE, claves en `ALERGENOS`) y la carta los muestra en el idioma de la página. Falta rellenarlos con los datos reales.
- Pegatinas: `npm run pegatinas -- https://tudominio.com` genera en `pegatinas/` (no se sube a git) los QR en SVG y las pegatinas de 70 × 90 mm (PDF vectorial y PNG a 300 ppp): una de carta y otra de reseña.
- **No imprimas nada hasta tener el dominio propio y definitivo**: un QR impreso no se puede cambiar. Con `*.workers.dev` o un dominio provisional, las pegatinas quedan inservibles si cambia.
- La pegatina de reseña usa `reviewCta.writeUrl`; sin él, usa la ficha de Google Maps (QR más denso, más difícil de leer con poca luz). Conviene poner el enlace corto de «Pedir reseñas» de Google Business.

## Antes de publicar

Los datos que no se han podido confirmar llevan `pendiente` en `src/content/site.js`. **Mientras quede alguno, Cloudflare no publica la web**: su comando de construcción ejecuta los tests con `CHECK_PUBLICACION=1`, y `test/publicacion.test.js` falla si queda alguno. Los marcados con `revisar` conviene completarlos, pero no bloquean. `npm run pendientes` los lista.

## Publicación

**Cloudflare Workers**: conectar el Worker `memphisbelle` a este repositorio. Toda la configuración está en `wrangler.jsonc`: pasa los tests (si alguno falla, no se publica), construye y publica `dist/`, sirve `404.html` en rutas inexistentes y aplica las cabeceras de `_headers`. Sin dominio propio, la web queda en `memphisbelle.<cuenta>.workers.dev`.

Al tener dominio: añadirlo en `worker/redireccion.js` (`DOMINIO`) y en `wrangler.jsonc` (`routes` con el dominio y `www`, y `PUBLIC_BASE_URL=https://<dominio>` en el comando de construcción). Un test comprueba que coinciden. Con `PUBLIC_BASE_URL` se generan el canonical, el sitemap, la imagen al compartir y los datos estructurados para Google.

GitHub Actions (`.github/workflows/ci.yml`) pasa los tests en cada push y pull request.

## Qué editar

| Qué | Dónde |
|---|---|
| Carta, precios y secciones | `src/content/site.js` → `menu` |
| Horario (una franja por día, hora de Canarias) | `src/content/site.js` → `hours` (debe coincidir con la ficha de Google) |
| Teléfono, WhatsApp, email, Instagram, dirección | `src/content/site.js` |
| Fotos y textos de "El local" (mosaico de 3) | `src/content/site.js` → `local.items` (cada uno con `image` opcional) |
| Foto de la fachada en "Visítanos" | `src/content/site.js` → `visit.image` |
| Valoración y citas de Google (la sección solo aparece si hay valoración) | `src/content/site.js` → `reviews` |
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
