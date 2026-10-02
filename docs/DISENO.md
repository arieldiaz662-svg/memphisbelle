# Diseño: Memphis Belle

Notas de diseño para mantener la web coherente en futuros cambios.

## Idea

Una **barra de noche**. Fondo oscuro y cálido, luz de lámpara en la portada y la **carta como un papel impreso** sobre la barra: es el único elemento claro de la página y el que más se usa. El nombre viene del bombardero de los años 40; el guiño es discreto: la estrella de las insignias de la época (dibujo propio) y una serif de cartelería. Nada de aviones, camuflaje ni pin-ups.

Público: gente que busca dónde tomar una copa en Santa Cruz, casi siempre desde el móvil y a menudo ya en la calle. Lo que necesitan, en orden: si está abierto ahora, la carta con precios, cómo llegar y reservar.

## Tokens (`public/css/site.css` → `:root`)

| Token | Valor | Uso |
|---|---|---|
| `--noche` | `#15120E` | Fondo de la página y color de la barra de estado del móvil |
| `--barra` | `#1F1A15` | Secciones alternas y formulario |
| `--crema` | `#EFE6D3` | Texto principal |
| `--humo` | `#B5A891` | Texto secundario (contraste AA sobre `--noche`) |
| `--laton` | `#D9AE55` | Solo la acción principal (Reservar) y detalles de marca |
| `--carmin` | `#B33A2E` | Acento puntual: "Cerrado" y avisos |
| `--oliva` | `#8FA35B` | "Abierto ahora" |
| `--papel` / `--tinta` | `#F3EBDA` / `#221B14` | La carta |

Tipografía: **DM Serif Display** (títulos, nombre de los cócteles) e **Instrument Sans** (texto). Las dos OFL y alojadas en `public/fonts/`.

## Movimiento (skills de Emil Kowalski)

- Portada: entrada escalonada de 600 ms una sola vez al cargar (60 ms entre elementos). Con "reducir movimiento" no se mueve nada.
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
- Más de un color de acento por pantalla.

## Pendiente

- Fotos propias del local (barra, terraza, cócteles). Las de la ficha de Google suelen ser de clientes y no se pueden usar sin permiso.
- Logotipo real del bar, si existe, en lugar de la estrella.
