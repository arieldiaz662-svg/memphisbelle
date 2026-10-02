# Prompts para Higgsfield

Imágenes para la web de Memphis Belle generadas con IA. Los prompts están en inglés porque los modelos responden mejor; las notas, en español.

## Antes de generar: reglas

1. **Nada de cócteles concretos de la carta con IA.** Si la foto del Bloody Mary no es el Bloody Mary que sirve el bar, el cliente lo nota y lo dice en las reseñas. La carta y el cóctel estrella van con **fotos reales** del local (ver "Fotos reales" al final). Las de este documento son de **ambiente**: no prometen un producto concreto.
2. **No presentar como del local lo que no lo es.** Una barra o una terraza generadas son "ambiente", nunca "nuestra terraza". En la web van sin pie de foto que diga lo contrario.
3. **Sin texto dentro de la imagen.** La IA escribe mal las letras. El nombre "Belle" y los rótulos los pone la web por encima.
4. **Sin marcas ni personas reales.** Nada de etiquetas de botellas reconocibles ni caras que se parezcan a alguien. La pin-up es un personaje original.
5. **Revisar cada imagen a tamaño completo** antes de usarla: manos con dedos de más, hélices con cinco palas, cristales que atraviesan objetos, etc.

## Ajustes recomendados

- **Modelo**: el más fotorrealista que tengas disponible (en Higgsfield, por ejemplo, *Soul* para fotografía; para la ilustración de época, uno que domine pintura). Prueba 4 variantes por prompt y quédate con la mejor.
- **Calidad**: la máxima. Mínimo **2400 px** de ancho para la portada y **1600 px** para el resto.
- **Exportar**: PNG o JPG al máximo, sin compresión. Yo las paso a WebP y JPG ligeros para la web.
- **Nombres**: guarda cada imagen con el nombre de la tabla (p. ej. `portada-b17.png`) y envíamelas así.

## Estilo común

Pega este bloque al final de **todos** los prompts de fotografía, para que las imágenes parezcan de la misma sesión:

```
cinematic photography, warm amber and rust tones, deep shadows, low-key lighting, olive and brass accents, subtle 35mm film grain, shallow depth of field, moody 1940s speakeasy atmosphere, photorealistic, high detail
```

Y en **todos** los prompts, como prompt negativo (si Higgsfield lo permite; si no, añade al final "no text, no logos…"):

```
text, letters, words, watermark, logo, brand labels, signature, modern objects, smartphones, neon, plastic, cartoon, anime, oversaturated, extra fingers, deformed hands, distorted glass, extra propeller blades, blurry
```

## Imágenes

| # | Archivo | Dónde va | Formato |
|---|---|---|---|
| 1 | `portada-b17.png` | Fondo de la portada (sustituye a la ilustración actual) | 16:9 |
| 1b | `portada-b17-movil.png` | Portada en el móvil | 4:5 |
| 2 | `portada-pinup.png` | Variante de portada con la pin-up en el morro | 16:9 |
| 3 | `barra-ambiente.png` | Sección "El local" | 3:2 |
| 4 | `martini-proceso.png` | Fondo de la sección de la carta | 3:2 |
| 5 | `detalle-hielo.png` | Fondo de "Reserva tu mesa" | 3:2 |
| 6 | `compartir.png` | Imagen al compartir el enlace (WhatsApp, redes) | 1200×630 (≈1.91:1) |

### 1. Portada: el bombardero (sin pin-up)

Para sustituir la ilustración vectorial de la portada. El texto de la web va a la **izquierda**, así que el avión tiene que quedar a la **derecha** y la izquierda, oscura y despejada.

```
Close-up of the nose section of a 1943 Boeing B-17F Flying Fortress bomber in flight, three-quarter side view, nose pointing left, olive drab paint with worn and chipped edges, glazed plexiglass nose with metal frame, cockpit windows and top turret, two rows of small yellow bomb mission markings painted below the cockpit, white star with blue bars insignia, the inner engine propeller spinning with motion blur in the foreground, flying above a sea of golden sunset clouds, other B-17 bombers in formation far in the distance, the aircraft placed on the right half of the frame, the left half dark smoky sky with empty space for text, dramatic warm backlight from the setting sun
```
+ bloque de **estilo común**.

**1b. Versión móvil (4:5):** el mismo prompt cambiando *"the aircraft placed on the right half of the frame, the left half dark smoky sky with empty space for text"* por *"the aircraft in the lower half of the frame, the upper half dark smoky sky with empty space for text"*.

### 2. Portada: variante con la pin-up en el morro

Personaje **original**: no pidas el estilo de ningún ilustrador concreto ni a ninguna modelo real. Elegante, para un público adulto, sin desnudos.

```
Close-up of the nose of a 1943 B-17 Flying Fortress bomber, three-quarter side view, olive drab fuselage with weathered paint, original hand-painted 1940s nose art on the side of the nose: an elegant pin-up woman with victory rolls hairstyle, red one-piece swimsuit and red heels, sitting gracefully, painted in classic airbrushed wartime style, no lettering, two rows of small yellow bomb mission markings below the cockpit, propeller with motion blur, golden sunset clouds behind, the aircraft on the right half of the frame, dark empty sky on the left for text, dramatic warm backlight
```
+ bloque de **estilo común**.

> Si la ves demasiado "IA", la alternativa más auténtica sigue siendo una **foto del mural del bar**.

### 3. Ambiente de la barra

```
Dimly lit vintage cocktail bar counter at night, warm wooden bar top with soft reflections, black industrial pendant lamps with warm yellow light, rows of unlabeled amber and clear spirit bottles softly out of focus on wooden shelves, exposed brick wall, a blurred painted mural of a vintage aircraft on the wall in the background, a single coupe glass catching the light on the bar, no people, inviting and intimate
```
+ bloque de **estilo común**.

### 4. Proceso: un Martini removido (fondo de la carta)

Muestra el oficio, no un cóctel concreto de la carta. Sin caras.

```
Bartender's hands stirring a crystal mixing glass full of clear ice with a long bar spoon, close-up, on a dark wooden bar, a chilled coupe glass and a strip of lemon peel next to it, condensation on the glass, warm pendant light from above, dark background, no face visible, elegant and precise
```
+ bloque de **estilo común**.

### 5. Detalle: hielo y licor (fondo de reservas)

```
Macro shot of a large clear ice cube in a heavy crystal rocks glass, amber whiskey being poured over it, droplets and reflections, dark moody background, warm rim light, extremely detailed
```
+ bloque de **estilo común**.

### 6. Imagen para compartir (1200×630)

```
The nose of a 1943 B-17 Flying Fortress bomber in olive drab, three-quarter side view, propeller with motion blur, golden sunset clouds, the aircraft on the right side of the frame and dark empty space on the left side, wide horizontal composition
```
+ bloque de **estilo común**. Encima, la web añade el nombre y el eslogan.

## Vídeo (opcional, más adelante)

Higgsfield también genera vídeo. Un bucle corto en la portada impresiona, pero **pesa** (gasta datos en el móvil y retrasa la carga). Si se usa: 5-6 s, sin sonido, en bucle, máximo ~2 MB, y con la imagen 1 como respaldo y para "reducir movimiento".

```
Slow cinematic push-in on the nose of a 1943 B-17 Flying Fortress bomber flying above golden sunset clouds, propellers spinning, gentle turbulence, clouds drifting past, other bombers far behind, seamless loop
```

## Fotos reales (las que no debe hacer la IA)

Para la **carta** y el **cóctel estrella**, una sesión de una hora en el bar, con el móvil:

- Cada cóctel tal cual se sirve, con su vaso y su guarnición de verdad.
- Luz lateral de una ventana o una lámpara, **sin flash**.
- Fondo oscuro: la barra o una pared.
- Encuadre vertical 4:5, el vaso centrado y algo de aire alrededor.
- El mural completo, de frente, con buena luz y sin reflejos, y un detalle de las letras "Belle" de cerca (para calcar el logotipo original).

Con eso, la web queda auténtica: lo que ve el cliente es lo que le sirven.
