# Skills de diseño y animación

Copiadas de [emilkowalski/skill](https://github.com/emilkowalski/skill) (commit `d16ebe6`), licencia MIT
(`LICENSE-emilkowalski`). Solo las que sirven para una web estática:

| Skill | Para qué |
|---|---|
| `emil-design-eng` | Criterio general de pulido de interfaz y animación |
| `mobile-native` | Que la web se sienta nativa en el móvil (tap, hover, viewport, inputs) |
| `find-animation-opportunities` | Dónde merece la pena animar y dónde no (solo propone) |
| `animate` | Construir una animación concreta con la curva y duración correctas |
| `review-animations` | Revisar animaciones con criterio estricto |
| `improve-animations` | Auditar todas las animaciones y planificar mejoras |
| `animation-vocabulary` | Nombre exacto de un efecto de movimiento |
| `apple-design` | Principios de diseño y movimiento de Apple, para la web |

Se omiten las de Swift, Expo/React Native, Sonner y selección de librerías de React: la web no usa esas tecnologías.
Para actualizarlas, vuelve a copiar las carpetas desde el repositorio original.

## Taste Skill

`taste-skill/SKILL.md` copiada de [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (commit `ce26fc2`), licencia MIT
(`LICENSE-tasteskill`). Solo la skill principal (`design-taste-frontend`): criterio "anti-plantilla" para landings (lectura del
encargo, diales de variedad/movimiento/densidad, patrones prohibidos y comprobación final).

Cómo encaja con las de Emil en esta web:

- **Stack**: taste propone React + Tailwind + Motion por defecto, pero admite CSS nativo cuando el encargo es una estética y no
  un sistema de diseño. Esta web sigue siendo HTML estático con CSS propio.
- **Movimiento**: manda Emil (cuándo y cómo animar). De taste se aplican los diales y la regla de que cada animación tenga motivo.
- **Composición, imágenes, textos y paleta**: manda taste.
