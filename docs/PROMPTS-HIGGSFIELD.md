# Prompts para Higgsfield (versión 2)

Imágenes y vídeo para dar a la web de Memphis Belle un salto de calidad: que parezca una sesión de fotos de una coctelería de verdad y no una web con ilustraciones. Los prompts están en inglés porque los modelos responden mejor; las notas, en español.

## Qué cambia respecto a la versión 1

- **Una dirección de arte fija** (luz, lente, color, grano) que se repite en todos los prompts: es lo que hace que 12 imágenes parezcan de la misma noche y del mismo sitio.
- **Una imagen por cada hueco de la web**, con su formato exacto y el espacio libre donde irá el texto.
- **Vídeo de portada** en bucle, con su versión fija para móviles y "reducir movimiento".
- **Un orden de trabajo**: primero 3 imágenes de prueba para fijar el estilo, luego el resto.

## Reglas (no cambian)

1. **Ningún cóctel concreto de la carta con IA.** El cliente compararía la foto con lo que le sirven. La carta y el cóctel estrella van con fotos reales (ver el final). Aquí todo es **ambiente, oficio y época**.
2. **Nada generado presentado como el local real.** Nada de "nuestra terraza" o "nuestra fachada" inventadas.
3. **Sin texto dentro de la imagen.** El nombre, el logotipo y los rótulos los pone la web.
4. **Sin marcas ni personas reales.** Botellas sin etiqueta. La pin-up es un personaje original. Sin caras reconocibles en las fotos de oficio.
5. **Revisar cada imagen al 100 %**: manos, dedos, cristales, hélices (el B-17 tiene 3 palas por hélice y 4 motores), reflejos imposibles.

## Cómo trabajar en Higgsfield

1. **Modelo**: el más fotorrealista que tengas (por ejemplo *Soul* para foto). Para la pin-up, uno que domine pintura e ilustración.
2. **Si tu plan permite imagen de referencia o "estilo de referencia"**: genera primero la imagen **A1** (la barra) y úsala como referencia de estilo para todas las demás. Es el truco que más coherencia da.
3. **Mismo modelo, mismos ajustes** en toda la sesión. Si el modelo permite fijar la "seed", fíjala para variantes de la misma imagen.
4. **4 variantes por prompt**, máxima calidad, mínimo **2400 px** en el lado largo (portada: lo máximo que permita).
5. **Exporta PNG** o JPG al máximo. Yo las paso a WebP/AVIF ligeros y en varios tamaños.
6. **Nombra cada archivo** como en la tabla (`A1-barra.png`…) y envíamelos así.

## Dirección de arte (pégala al final de cada prompt de foto)

```
Shot on a full-frame cinema camera, 50mm lens at f/1.8, shallow depth of field. Low-key lighting from warm tungsten practical lamps at 2700K with soft amber falloff into deep shadow, subtle atmospheric haze catching the light. Color grade: warm amber highlights, rust and olive midtones, rich near-black shadows, muted saturation, like Kodak Portra 800 film pushed one stop, fine natural film grain. Moody, intimate 1940s speakeasy atmosphere, timeless and adult. Photorealistic, editorial photography for a high-end cocktail bar, ultra detailed, realistic textures.
```

**Prompt negativo** (si Higgsfield lo admite; si no, añade al final "no text, no logos, no people's faces"):

```
text, letters, numbers, words, watermark, logo, brand labels, signature, frame, border, modern objects, smartphones, LED lights, neon, plastic, cartoon, illustration, anime, 3d render, CGI look, oversaturated, HDR, overexposed, flat lighting, extra fingers, deformed hands, distorted glass, melted ice, floating objects, extra propeller blades, blurry, low resolution
```

## Plan de imágenes

| # | Archivo | Sección de la web | Formato | Prioridad |
|---|---|---|---|---|
| A1 | `A1-barra.png` | Fondo de "Reserva tu mesa" y **referencia de estilo** | 4:5 | **Hecha** (3:2, en la web) |
| P1 | `P1-portada-b17.png` | Portada, escritorio | 16:9 | 1 (prueba) |
| O1 | `O1-martini.png` | Fondo de "La carta" | 3:2 | 1 (prueba) |
| P2 | `P2-portada-b17-movil.png` | Portada, móvil | 4:5 | 2 |
| P3 | `P3-portada-pinup.png` | Variante de portada con pin-up en el morro | 16:9 | 2 |
| E1 | `E1-estrella-fondo.png` | Fondo del cóctel estrella (sin cóctel) | 16:9 | 3 |
| R1 | `R1-recuerdos.png` | Instagram y redes del bar | 4:5 | 3 |
| O2 | `O2-hielo.png` | Instagram y redes del bar | 4:5 | 3 |
| O3 | `O3-twist.png` | Instagram y redes del bar | 4:5 | 3 |
| S1 | `S1-compartir.png` | Imagen al compartir el enlace | 1200×630 | 3 |
| V1 | `V1-portada.mp4` | Vídeo de portada (opcional) | 16:9, 6 s | 4 |

**Orden**: haz primero **A1, P1 y O1**, mándamelas y fijamos el estilo antes de generar el resto.

**"El local" y "Visítanos" no llevan imágenes de IA**: sus textos ("Terraza", "Dentro", "Mascotas bienvenidas", la dirección) hablan del bar real, así que van con **fotos reales** (ver el final). Las imágenes de ambiente van solo donde no prometen nada concreto: portada, carta, cóctel estrella, reservas y redes.

---

## Portada

El texto de la web va a la **izquierda**: el avión a la **derecha**, la izquierda oscura y despejada.

### P1. Portada, escritorio (16:9)

```
Cinematic close-up of the nose section of a 1943 Boeing B-17F Flying Fortress in flight at golden hour, three-quarter side view, nose pointing left, olive drab paint weathered and chipped along the panel lines, rivets catching the light, glazed plexiglass nose with metal frame and reflections, cockpit windows and the top turret dome, two neat rows of small hand-painted yellow bomb mission markings below the cockpit, white star with blue bars insignia partly visible, the inner engine propeller spinning with realistic motion blur in the foreground. Flying above a sea of golden sunset clouds, three other B-17 bombers in loose formation far in the distance, softened by atmospheric haze. The aircraft occupies the right half of the frame; the left half is dark, smoky dusk sky with clean negative space for a headline. Dramatic warm backlight from the low sun, rim light on the fuselage, volumetric light through the clouds.
```
+ **dirección de arte** (cambia "50mm lens at f/1.8" por "85mm lens at f/4, air-to-air photography").

### P2. Portada, móvil (4:5)

El mismo prompt de P1 cambiando la última frase de composición por:
*"The aircraft occupies the lower half of the frame, nose toward the lower left; the upper half is dark, smoky dusk sky with clean negative space for a headline."*

### P3. Portada con pin-up en el morro (16:9)

Personaje **original**, elegante, sin desnudos. No pidas el estilo de ningún ilustrador concreto ni a ninguna persona real.

```
Cinematic close-up of the nose of a 1943 B-17 Flying Fortress bomber at golden hour, three-quarter side view, nose pointing left, weathered olive drab fuselage. On the side of the nose, original hand-painted 1940s wartime nose art, airbrushed: an elegant pin-up woman with victory rolls hairstyle and red lipstick, wearing a red one-piece swimsuit and red heels, sitting gracefully and smiling over her shoulder, paint slightly faded and chipped by weather. No lettering. Two rows of small yellow bomb mission markings below the cockpit, propeller with motion blur, golden sunset clouds behind, distant bombers in formation. The aircraft occupies the right half; dark empty sky on the left for a headline. Warm backlight, rim light on the metal.
```
+ **dirección de arte** (85mm, f/4).

> Si la pin-up sale con aspecto "IA" (cara de plástico, manos raras), descártala: mejor la portada P1 y, más adelante, una **foto del mural del bar**.

---

## Reserva tu mesa y estilo de referencia

### A1. La barra (4:5) · fondo de "Reserva tu mesa" y referencia de estilo

Una barra genérica, de ambiente: va de fondo, sin pie de foto y sin presentarla como el bar.

```
Interior of an intimate 1940s-inspired cocktail bar at night, no people. A long dark wooden bar top with a warm satin sheen and soft reflections, a single crystal coupe glass with a clear stirred drink and a lemon twist resting on the bar in the foreground, sharp. Behind, rows of unlabeled amber and clear spirit bottles on wooden shelves, softly out of focus, glowing from small warm lamps. Black industrial enamel pendant lamps with warm yellow light. Exposed old brick on one side, dark wood panelling on the other. Inviting, quiet, about to open. Dark negative space on the left for text.
```
+ **dirección de arte**.

## La carta y el oficio

### O1. Martini removido (3:2) · fondo de "La carta"

Muestra el oficio, no un cóctel concreto de la carta. Sin caras.

```
Close-up of a bartender's hands in a crisp white shirt with rolled sleeves stirring a crystal mixing glass full of clear ice with a long silver bar spoon, on a dark wooden bar. Next to it a chilled crystal coupe glass with frost on the outside and a fresh strip of lemon peel on a small board. Condensation droplets, ice catching the light. Warm pendant light from above, dark background, generous dark negative space on the right side. No face visible. Precise, elegant, unhurried.
```
+ **dirección de arte**.

### O2. Hielo y licor (4:5) · redes

```
Macro shot of a large hand-cut crystal-clear ice cube in a heavy cut-glass rocks glass on a dark wooden bar, amber whiskey being poured over it in a thin stream, droplets suspended mid-air, reflections of a warm pendant lamp on the glass, dark moody background with negative space on the left.
```
+ **dirección de arte** (cambia "50mm lens at f/1.8" por "100mm macro lens at f/4").

### O3. El twist de limón (4:5) · redes

```
Extreme close-up of a bartender's fingers expressing a lemon peel over a crystal coupe glass, fine mist of citrus oil sparkling in a beam of warm light, dark background, the rim of the glass sharp and the rest softly out of focus.
```
+ **dirección de arte** (100mm macro, f/2.8).

---

## Cóctel estrella

### E1. Fondo del cóctel estrella (16:9)

Solo el **escenario**: la foto del cóctel será real y se coloca encima. Así la sección tiene la calidad de la sesión aunque la foto del cóctel la haga el bar con el móvil.

```
Empty dark wooden bar top at night seen at eye level, a soft pool of warm light in the center-right where a glass would stand, deep red and rust tones in the out-of-focus background suggesting bottles and a brick wall, haze in the air, lots of dark negative space on the left for text, no glass, no drink.
```
+ **dirección de arte**.

---

## Redes del bar (Instagram, historias)

Estas no van en la web: son contenido de ambiente para las redes, con el mismo estilo, para que el Instagram y la web se vean como una sola marca.

### R1. Recuerdos de aviación (4:5)

```
Still life on the corner of a dark wooden bar at night: a worn brown leather WWII bomber flight jacket draped over a bar stool, a pair of vintage aviator goggles and an old leather pilot cap resting on the bar next to a heavy crystal rocks glass with amber spirit and a large clear ice cube, an old folded aviation map partly visible. Warm pendant light from above, deep shadows around.
```
+ **dirección de arte**.

O2 y O3 (arriba) también sirven aquí en 4:5.

## Compartir en redes

### S1. Imagen al compartir el enlace (1200×630)

```
The nose of a 1943 B-17 Flying Fortress in olive drab at golden hour, three-quarter side view, propeller with motion blur, golden sunset clouds, the aircraft on the right side of a wide horizontal frame and dark empty sky on the left side.
```
+ **dirección de arte** (85mm, f/4). La web añade el nombre y el eslogan encima.

---

## Vídeo de portada (opcional)

Da muchísimo nivel, pero **pesa**: solo merece la pena si queda corto, limpio y en bucle. Requisitos: **6 s, sin sonido, en bucle perfecto, 1920×1080**, y que el primer y el último fotograma sean iguales. Yo lo comprimo por debajo de **2 MB** y, en el móvil o con "reducir movimiento", se muestra la imagen P1 fija en su lugar.

Genéralo a partir de la imagen **P1** (imagen a vídeo), con este prompt:

```
Slow, steady cinematic push-in on the nose of the B-17 bomber flying above golden sunset clouds, propellers spinning with motion blur, gentle natural turbulence, clouds drifting slowly past below, distant bombers holding formation, warm backlight flickering softly through the clouds, seamless loop, no camera shake, no cuts.
```

---

## Fotos reales (lo que no debe hacer la IA)

Para la **carta**, el **cóctel estrella**, **"El local"** y **"Visítanos"**, una sesión de una hora en el bar con el móvil, antes de abrir:

- Cada cóctel tal cual se sirve, con su vaso y su guarnición de verdad, sobre la barra.
- Luz lateral de una lámpara del bar o una ventana, **sin flash**, el fondo oscuro.
- Vertical 4:5, el vaso centrado, aire alrededor, el móvil a la altura del vaso.
- Modo retrato del móvil desactivado (el desenfoque falso deforma los bordes del cristal).
- El **mural completo**, de frente, sin reflejos, y un detalle de las letras "Belle" de cerca.
- Para el mosaico de **"El local"**: la **terraza** de noche con gente (sin caras en primer plano), el **interior con la barra y el mural**, y un **perro de cliente** en la terraza (con permiso del dueño).
- La **fachada** de noche, con las luces encendidas, para "Visítanos".

Yo las igualo de color con la dirección de arte de este documento, para que convivan con las imágenes de Higgsfield sin que se note la diferencia.
