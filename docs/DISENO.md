# Diseño: Memphis Belle

> **Diseño actual: editorial (híbrido).** Desde octubre de 2026 la web combina la propuesta editorial de la
> otra landing (negro cálido, marfil y oro viejo, titulares serif en grande, etiquetas mono, entradas al hacer
> scroll, "El oficio" con piezas dibujadas) con lo propio de este proyecto: el B-17 en la portada, la carta con
> precios y pestañas, los datos reales de la ficha de Google, el formulario de reserva por WhatsApp, la reseña de
> Google y la carta bilingüe para el QR. Las secciones de más abajo (Idea, Colores…) describen la primera
> versión (papel y amarillo del mural) y quedan como historia; lo vigente está aquí.

## Diseño vigente

- **Tipografía** (alojada, OFL): Instrument Serif (titulares, nombres de cócteles), Geist (texto) y Geist Mono
  (etiquetas, precios). Ficheros en `public/fonts/`.
- **Color**: fondo `#0B0A09`, marfil `#F2EDE4`, oro viejo `#C9A961` (acentos, precios, cursiva de los titulares) y
  el amarillo del mural `#E8BE45` solo para "Belle" del pie y las estrellas de la reseña. Tokens en `:root`.
- **Orden de la página**: portada (título, B-17, estado "Abierto ahora") → cinta → cóctel estrella → 01 El bar →
  02 El oficio → 03 La carta (clásicos con icono + carta completa con pestañas) → 04 El local (galería + datos) →
  05 Visítanos → Déjanos una reseña en Google → reseñas (si hay valoración) → 06 Reservas → pie.
- **Contenido** en `src/content/site.js` (`hero`, `cinta`, `bar`, `oficio`, `highlights`, `local.gallery`). Los
  textos de presentación (`bar`, `oficio`) están marcados `revisar`: hay que confirmarlos con el local.
- **Ilustraciones** de línea (cóctel ahumado, cuatro escenas de barra, iconos de la carta, sello): `src/views/ilustraciones.js`.
  Sus retardos van en atributos `data-s="N"` con reglas en el CSS, porque la CSP no admite estilos en línea.
- **Movimiento**: titulares con máscara, fotos con cortina, carta que se llena; todo se apaga con
  `prefers-reduced-motion`. Los bucles solo corren mientras se ven y hay un botón "Pausar animaciones".
  `ini.js` (en `<head>`) marca `html.js` para que sin JavaScript todo sea visible.
- **Fotos** (WebP + JPG): `public/img/ambiente/` (cócteles y local, a 640 px, su tamaño real; si se sustituyen por
  las del propio bar, conviene subirlas a 1024 px o más) y `public/img/portada/` (B-17).


Notas de diseño para mantener la web coherente en futuros cambios.

## Idea

La web sale del **mural del local**: la parte frontal del bombardero Memphis Belle pintada en la pared, sobre un cielo de atardecer (óxido y ámbar que se apagan en hollín), con **"Belle" rotulado a mano en amarillo**. Ese "Belle" es el logotipo del bar.

- **Portada** (`src/views/bombardero.js`, dibujo propio en SVG): es un **cartel de aviación de los años 40**, como el mural del local, con acabado realista y pensado para un público adulto y para el eslogan "Los mejores clásicos". Ilustración propia (no copia ningún cartel concreto): el B-17 de lado y en grande, recortado a la mitad del avión, con el morro de cristal, la cabina, la torreta, las **25 bombas de sus misiones** (dato histórico), "Belle" en el amarillo del logotipo, la estrella con barras y la hélice del motor interior girando en primer plano; detrás, un cielo de atardecer con nubes que pasan despacio y bombarderos en formación a lo lejos. Ocupa la mitad derecha de la portada, por debajo del título, y se funde con el fondo por la izquierda; en el móvil va por debajo de los botones. Con "reducir movimiento" todo queda quieto. **Sin pin-up**: una figura humana dibujada a mano en vectorial queda torpe; cuando haya una foto buena del mural del local (que sí la tiene), lo ideal es usarla aquí.
- **Logotipo**: "Memphis" en serif + "Belle" manuscrito en amarillo e inclinado, como en la pared. `public/img/logo-belle.svg` y el favicon (la "B") están trazados desde la letra Yellowtail, así que se ven igual aunque no cargue la tipografía. Cuando haya una foto de cerca de las letras del mural, se puede calcar el trazo original y sustituir el SVG.
- **Carta**: un papel impreso sobre la barra, el único elemento claro de la página.

Público: gente que busca dónde tomar una copa en Santa Cruz, casi siempre desde el móvil y a menudo ya en la calle. Lo que necesitan, en orden: si está abierto ahora, la carta con precios, cómo llegar y reservar.

## Estructura de la portada

Portada (cartel del B-17), Cóctel estrella, La carta, El local, Visítanos, Reseñas (solo si hay valoración de Google) y Reserva tu mesa. Sigue el boceto de `docs/boceto.html`:

- **El local**: mosaico de 3 (el primero grande). Sin fotos, la misma composición en versión tipográfica; las fotos aparecen solas al añadirlas en `site.js`. Nunca cajas vacías ni tres columnas iguales.
- **Visítanos**: el horario agrupado en pocas líneas (`resumen()` en `public/js/horario.js`), "Abierto ahora", dirección y contacto, con Cómo llegar, Llamar y WhatsApp.

## Imágenes

- **Portada**: foto del B-17 al atardecer (P1, generada con Gemini a partir de `docs/PROMPTS-HIGGSFIELD.md`), decorativa (`alt` vacío) y con carga prioritaria. Un velo oscurece la izquierda y una sombra suave separa el título del morro, como en un cartel de cine. Movimiento: acercamiento de cámara muy lento (24 s, ida y vuelta); con "reducir movimiento", quieta. En el móvil, franja bajo los botones. WebP y JPG a 640, 1024 y 1376 px en `public/img/portada/`. Si se quita `hero.image` de `site.js`, vuelve la ilustración vectorial (`src/views/bombardero.js`).
- **Reserva tu mesa**: fondo con la imagen de ambiente A1 (una barra en penumbra con una copa, generada con ChatGPT a partir de `docs/PROMPTS-HIGGSFIELD.md`). No es el local: va con `alt` vacío y sin pie de foto. El texto y el formulario van sobre la zona oscura de la izquierda; un degradado fijo asegura el contraste. En el móvil, la foto es una franja arriba que se funde en el fondo. Versiones WebP y JPG a 640, 1024 y 1536 px en `public/img/ambiente/`.
- "El local" y "Visítanos" solo con fotos reales del bar.

## Colores (`public/css/site.css` → `:root`)

Tomados de la foto del mural y aclarados lo justo para leerse en pantalla. Un solo color de acción: el amarillo.

| Token | Valor | En el mural | Uso |
|---|---|---|---|
| `--hollin` | `#160E0B` | Bordes ahumados | Fondo de la página y barra de estado del móvil |
| `--pared` | `#24150F` | Sombra cálida | Secciones alternas y formulario |
| `--crema` | `#F1E4CB` | Luces pintadas | Texto principal |
| `--humo` | `#C0AA90` | | Texto secundario (contraste AA) |
| `--mostaza` | `#E8BE45` | Letra "Belle" y lámparas | Solo la acción principal (Reservar mesa) y el logotipo |
| `--oxido` / `--ambar` | `#A8431C` / `#D38B2C` | Cielo y horizonte | Solo en el fondo de la portada y de la carta |
| `--motor` | `#4C7A80` | Motor del avión | Un toque en el cielo de la portada |
| `--oliva` | `#9AA566` | Fuselaje | "Abierto ahora" |
| `--aviso` | `#E8896B` | | "Cerrado" y errores del formulario |
| `--papel` / `--tinta` | `#F2E5CC` / `#24160F` | | La carta |

Tipografía: **DM Serif Display** (títulos, "Memphis", nombres de cócteles), **Instrument Sans** (texto) y **Yellowtail** (solo "Belle"). Todas alojadas en `public/fonts/` (OFL y Apache 2.0).

## Movimiento (skills de Emil Kowalski)

- Portada: entrada escalonada de 600 ms una sola vez al cargar (60 ms entre elementos). Con "reducir movimiento" no se mueve nada.
- Cartel de la portada: hélice con giro continuo (160 ms por vuelta, linear; palas casi transparentes, como a velocidad real), balanceo muy lento del avión (10 s, curva senoidal `cubic-bezier(0.37, 0, 0.63, 1)` de easings.co) y nubes que pasan (90 s, linear, en bucle sin salto). Solo `transform`, en animaciones CSS fuera del hilo principal. Con "reducir movimiento", quieto.
- Pestañas de la carta: fundido de 180 ms. Es una acción frecuente, así que es corto y sin desplazamiento.
- Botones: `scale(0.97)` al pulsar. Los `:hover` solo con ratón (`(hover: hover) and (pointer: fine)`).
- Nada se anima al hacer scroll.

## Móvil

- Barra fija abajo con **Llamar** y **Reservar**, respetando la zona segura del iPhone. En el móvil la cabecera solo lleva la marca.
- Campos del formulario a 16 px (iOS no hace zoom), tipos nativos de fecha y hora, y aviso si se elige un día que está cerrado.
- "Abierto ahora" se calcula con la hora de Canarias, sea cual sea la zona del teléfono, y se actualiza al volver a la pestaña.

## Qué evitar

- Etiquetas en mayúsculas o "píldoras" encima de cada título.
- Separadores con punto medio ("A · B · C"), flechas "→" en botones.
- Fotos de banco de cócteles genéricos: mejor ninguna foto que una que no es del local.
- Más de un color de acción: el amarillo es solo para Reservar mesa y el logotipo.
- Más ilustraciones dibujadas a mano: el bombardero de la portada es la única.

## Pendiente

- Fotos propias del local (barra, terraza, cócteles). Las de la ficha de Google suelen ser de clientes y no se pueden usar sin permiso.
- Foto del mural en alta resolución para la portada, y una de cerca de las letras "Belle" para calcar el logotipo.
- Aplicar la estructura del boceto (`docs/boceto.html`) a la web.
