# Traspaso de la web al dueño del bar (dominio, Cloudflare y código)

Objetivo: que la web **no dependa de Alcance Isleño**. El dueño es titular del dominio, de la cuenta de Cloudflare y del
repositorio; Alcance Isleño queda como administrador invitado para mantenerla (y puede dejar de serlo cuando se acuerde).

> Hazlo **antes de imprimir** las pegatinas de las mesas: el QR lleva la dirección de la web y no se puede cambiar una vez impreso.

## 1. Dominio (lo hace el dueño)
1. Elegir el dominio (por ejemplo `memphisbelle.com` o `.es`) y comprarlo **a su nombre y con su correo**. Cloudflare Registrar lo vende
   a precio de coste (unos 10 € al año); vale cualquier registrador. Conviene activar la renovación automática.
2. Si lo compra en otro registrador, añadir el dominio a su cuenta de Cloudflare (gratis) y cambiar los servidores de nombres (nameservers)
   a los que indique Cloudflare. Si lo compra en Cloudflare, no hace falta.

## 2. Cuenta de Cloudflare (la crea el dueño)
1. Crear una cuenta gratuita en cloudflare.com con el correo del dueño y activar la verificación en dos pasos.
2. Invitar a Alcance Isleño como **miembro administrador** (Manage Account → Members), para mantener la web sin ser sus dueños.

## 3. Repositorio de GitHub
1. Pasar el repositorio a la cuenta del dueño: Settings → Transfer ownership (o crear una copia en su cuenta). Alcance Isleño sigue como colaborador.
2. En la cuenta de Cloudflare del dueño: Workers & Pages → Create → Import a repository, elegir el repositorio y llamar al Worker `memphisbelle`.
   La configuración (tests, construcción y publicación de `dist/`) ya está en `wrangler.jsonc`.

## 4. Cambiar la dirección en el código (lo hace Alcance Isleño)
```
node scripts/cambiar-dominio.js midominio.com
npm test
```
Cambia `DOMINIO` en `worker/redireccion.js` y `routes` y `PUBLIC_BASE_URL` en `wrangler.jsonc`. Con dominio raíz se enruta también `www`
(redirige al principal). Después hacer `git commit` y `git push`: Cloudflare publica solo.

## 5. Conectar el dominio al Worker (lo hace el dueño o el administrador)
Worker `memphisbelle` → Settings → Domains & Routes → el dominio queda enlazado con la ruta de `wrangler.jsonc`. Si no se crea solo, añadirlo ahí
(Add → Custom domain).

## 6. QR y enlaces
```
npm run qr-mesas                      QR de las mesas (40 mm) y pegatina con "MENÚ · MENU"
npm run pegatinas -- https://midominio.com
```
Probar el QR con un móvil real antes de imprimir. Actualizar también el enlace de la web en la ficha de Google Business.

## 7. Antes de publicar
`npm run pendientes` debe salir sin "Pendientes antes de publicar" (datos legales del titular).

## Qué pasa con `memphisbelle.alcanceisleno.com`
Si ya se hubieran impreso QR con esa dirección, se puede dejar activa como redirección al dominio nuevo; pero eso mantiene una dependencia de
Alcance Isleño. Lo recomendable es no imprimir con ella.

## Acuerdo sencillo (por escrito, un correo basta)
- Quién renueva el dominio cada año y con qué tarjeta.
- Que Alcance Isleño mantiene la web como administrador invitado, y qué pasa si deja de hacerlo (se retira de la cuenta y no se pierde nada).
- Que el código, el dominio y las cuentas son del bar.
