# Seguridad de la web

La web es estática (HTML, CSS y JavaScript ya generados, sin base de datos, sin formularios, sin cuentas ni API propias), así que casi no hay superficie de ataque. Lo que queda se cierra en capas. Todo está en `src/seguridad.js` y lo comprueban los tests (`describe('seguridad')`).

## Qué protege cada capa

| Capa | Qué evita |
|---|---|
| **CSP** (en cada página y como cabecera) | Todo es del propio dominio: sin scripts ni estilos en línea, sin tipografías, imágenes ni scripts de terceros. Solo un marco de `www.google.com` para el mapa. `require-trusted-types-for 'script'` bloquea la inyección de HTML/JS desde el DOM (XSS). `frame-ancestors 'none'` y `X-Frame-Options: DENY` impiden que otra web la meta en un marco (clickjacking). `upgrade-insecure-requests` fuerza HTTPS. |
| **HSTS** | El navegador solo habla con la web por HTTPS durante un año. |
| **`nosniff`, COOP, CORP, Permissions-Policy** | Sin adivinar tipos de archivo, sin ventanas cruzadas, sin que otras webs incrusten nuestros archivos, sin cámara, micrófono, ubicación ni pagos. |
| **Worker** (`worker/index.js`) | Solo atiende lectura (GET, HEAD, OPTIONS): un POST o un PUT recibe 405. Pone las cabeceras en todas las respuestas, también en redirecciones y errores, aunque el alojamiento no aplique `_headers`. |
| **Mapa de Google** | No se carga hasta que se pulsa; va en un `iframe` con `sandbox` y sin permisos de dispositivo. Antes de pulsar no se envía nada a Google. |
| **Enlaces externos** | `rel="noopener noreferrer"` en todos los que abren pestaña nueva. |
| **JavaScript propio** | Sin `innerHTML`, `eval`, `document.write` ni `srcdoc` (un test lo vigila). |
| **Dependencias** | Solo `qrcode` para generar las pegatinas (no va a la web publicada). `npm audit`: 0 vulnerabilidades. Dependabot avisa semanalmente. |

## Lo que no se puede resolver desde el código (cuentas)

- Cuenta de **Cloudflare** y de **GitHub**: activar la verificación en dos pasos (2FA) en todas las personas con acceso, y mejor con llave de seguridad.
- **GitHub**: proteger la rama `main` (exigir que pasen los tests) y no dar permisos de escritura a quien no los necesite.
- **Cloudflare**: el token de API, con el permiso mínimo (solo Workers y DNS de la zona), y revocarlo si cambia quien lo usa. No guardar tokens en el repositorio (`.env` está ignorado).
- **Dominio**: bloqueo de transferencia y renovación automática, con el correo de contacto del dueño al día.
- Si algún día se añade una cabecera de HSTS con `preload`, hay que estar seguros de que todo el dominio va por HTTPS.

## Si se cambia algo

- Una dirección o servicio externo nuevo (por ejemplo otro mapa o un vídeo) exige añadirlo a la CSP en `src/seguridad.js`; el test avisa si se abre demasiado (`*`, `unsafe-inline`…).
- Tras tocar `site.js`, `npm test` comprueba que no se ha roto nada de esto.
