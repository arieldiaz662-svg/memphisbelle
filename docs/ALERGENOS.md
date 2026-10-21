# Alérgenos de la carta (propuesta para confirmar con el local)

**Estado: borrador.** Sale solo de lo que dice la carta de cada cóctel (`src/content/site.js`) y del conocimiento general de cada ingrediente. **No sustituye a las etiquetas de las botellas ni a la receta real del local.** Hasta que el dueño o la persona responsable de seguridad alimentaria lo confirme, **no está publicado en la web** (la carta solo lleva el aviso «Si tienes alguna alergia o intolerancia, dínoslo antes de pedir»).

Marco: Reglamento (UE) 1169/2011 y Real Decreto 126/2015 obligan a informar por escrito de los 14 alérgenos también en alimentos sin envasar. Para bebidas de más de 1,2 % vol. se puede omitir la lista de ingredientes, pero **no los alérgenos**. Conviene que lo valide un profesional.

## Regla que se ha seguido

- Los **destilados** (ron, whisky, bourbon, ginebra, vodka, tequila, mezcal, pisco, cachaza) **no declaran alérgenos**, aunque partan de cereales: el propio Anexo II del reglamento los excluye.
- **Sulfitos:** vino, cava y **vermut** (más de 10 mg/l, siempre).
- **Huevos:** la **clara** de los sour.
- **Gluten:** **cerveza** (cebada) y la **salsa Perrins** (Worcestershire: vinagre de malta).
- **Pescado:** la salsa Perrins (anchoas).
- **Frutos de cáscara:** el **amaretto** (almendra o hueso de albaricoque, según marca).
- Zumos, licores de frutas, sirope, agave, lima, limón, naranja, Campari, Aperol, Cointreau, triple seco, St-Germain, Passoa y angostura: **ninguno** de los 14 salvo que la etiqueta diga otra cosa.

## Propuesta por cóctel

Claves = las de `ALERGENOS` en `src/views/landing.js` (`allergens` en `site.js`).

| Cóctel | Alérgenos propuestos | A confirmar |
|---|---|---|
| **Refrescantes** | | |
| St-Germain (St-Germain y cava) | `sulfitos` | |
| Moscow Mule | — | Marca de la cerveza de jengibre: algunas llevan sulfitos |
| Caipiriña | — | |
| Caipiriña con fruta | — | Si la fruta es congelada o en puré, mirar conservantes (sulfitos) |
| Mojito | — | |
| Mojito con fruta | — | Igual que arriba |
| Tom Collins | — | |
| Garibaldi | — | Si el zumo de naranja es envasado, puede llevar sulfitos |
| Long Island | — | Refresco de cola: ninguno |
| **Ácidos y sour** | | |
| Margarita | — | |
| Pisco Sour | `huevos` | |
| Whisky Sour | `huevos` | |
| Amaretto Sour | `huevos`, `frutos_secos` | Marca del amaretto (almendra o albaricoque) |
| Mezcalita | — | |
| Hemingway Daiquiri con fruta | — | Si lleva marrasquino: ninguno. Fruta congelada: ver arriba |
| Porn Star Martini | — | El clásico se sirve con un chupito de espumoso: si el local lo hace, `sulfitos` |
| **Intensos** | | |
| Dry Martini | `sulfitos` | |
| Manhattan | `sulfitos` | |
| Negroni | `sulfitos` | |
| Boulevardier | `sulfitos` | |
| Old Fashioned | — | |
| Chefa | — | |
| Bloody Mary | `gluten`, `pescado` | Zumo de tomate o sal con **apio** (`apio`) y si lleva mostaza o salsas picantes con sulfitos |
| **Copas y cañas** | | |
| Copa de combinado | — | Depende del refresco y la bebida; ver etiquetas |
| Copa premium | — | Igual |
| Caña Dorada Especial | `gluten` | |
| Caña Guinness | `gluten` | |

## Resumen para quien lo lee en la barra

- **Sin ningún alérgeno (según carta):** Caipiriña, Mojito, Tom Collins, Long Island, Margarita, Mezcalita, Old Fashioned, Chefa, Garibaldi, Moscow Mule, Hemingway Daiquiri, Porn Star Martini*, y las copas de combinado.
- **Sulfitos:** St-Germain, Dry Martini, Manhattan, Negroni, Boulevardier.
- **Huevo:** Pisco Sour, Whisky Sour, Amaretto Sour.
- **Frutos de cáscara:** Amaretto Sour.
- **Gluten:** cañas (Dorada y Guinness) y Bloody Mary.
- **Pescado:** Bloody Mary.

\* ver «A confirmar».

## Cómo publicarlo (cuando el dueño lo confirme)

1. Ajustar la tabla con lo que diga el local (marca de amaretto, ginger beer, zumos…).
2. En `src/content/site.js`, añadir en cada plato `allergens: ['sulfitos']`, etc. La web ya los muestra bajo cada plato y los traduce al inglés (`ALERGENOS` en `src/views/landing.js`).
3. Quitar la línea `revisar` de `menu` en `site.js` y pasar `npm test`.

Sin estos pasos, la web **no** debe sugerir que un cóctel «no lleva alérgenos». Mientras tanto vale el aviso que ya hay en la carta.
