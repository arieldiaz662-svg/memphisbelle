import { readFileSync } from 'node:fs';

// Ilustración de la portada: un cartel de aviación de los años 40, como el mural del local. Dibujo
// propio en SVG (no copia ningún cartel concreto): el B-17 Memphis Belle de lado y en grande, recortado
// a la mitad del avión, con el morro de cristal, la cabina, la torreta, las 25 bombas de sus misiones
// (dato histórico), la estrella con barras y la hélice del motor interior en primer plano; detrás, un
// cielo de cartel con nubes y bombarderos en formación a lo lejos.
// Acabado realista: sin contornos, metal sombreado y la luz cálida del horizonte en la panza.
// El SVG cubre la mitad derecha de la portada (preserveAspectRatio "slice": recorta, nunca deforma;
// anclado abajo, así el avión siempre queda por debajo del título) y se funde con el fondo por la
// izquierda. Va en línea para que el CSS pueda animar la hélice, el avión
// y las nubes (public/css/site.css → "Bombardero"). El nombre del costado es el trazado del logotipo
// (public/img/logo-belle.svg).

const logo = readFileSync(new URL('../../public/img/logo-belle.svg', import.meta.url), 'utf8');
const [, logoX, logoY, logoW] = /viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(logo).map(Number);
const logoPath = /<path[^>]* d="([^"]+)"/.exec(logo)[1];
const BELLE_ANCHO = 250; // ancho del nombre pintado en el costado
const belleEscala = BELLE_ANCHO / logoW;

const MISIONES = 25; // el Memphis Belle completó 25 misiones en 1943

// Bomba pintada (marca de misión): cuerpo, punta y aletas.
const bomba = (x, y) => `<path d="M${x} ${y} h16 c4 0 7 2 7 4.5 s-3 4.5 -7 4.5 h-16 l-5 3 v-15 z"/>`;
const bombas = () => {
  const fila1 = Math.ceil(MISIONES / 2);
  return Array.from({ length: MISIONES }, (_, i) => {
    const fila = i < fila1 ? 0 : 1;
    const col = fila ? i - fila1 : i;
    return bomba(372 + col * 29 + fila * 14, 340 + fila * 24);
  }).join('');
};

// Nube de cartel: varias bolas superpuestas, con la base en sombra. Se dibuja en (x, y) a escala s.
const nube = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
        <ellipse class="nube-sombra" cx="0" cy="34" rx="150" ry="34"/>
        <circle class="nube" cx="-80" cy="10" r="46"/>
        <circle class="nube" cx="-20" cy="-18" r="64"/>
        <circle class="nube" cx="50" cy="-4" r="54"/>
        <circle class="nube" cx="110" cy="16" r="38"/>
        <ellipse class="nube" cx="10" cy="26" rx="150" ry="30"/>
      </g>`;

// Banda de nubes que se repite: dos copias seguidas para que el desplazamiento sea continuo.
const bandaNubes = `<g class="nubes-banda">
        ${nube(120, 640, 1)}${nube(470, 700, 0.8)}${nube(820, 630, 1.15)}${nube(1120, 690, 0.9)}
        ${nube(1320, 640, 1)}${nube(1670, 700, 0.8)}${nube(2020, 630, 1.15)}${nube(2320, 690, 0.9)}
      </g>`;

// Silueta pequeña de un B-17 de lado, para la formación del fondo.
const silueta = (x, y, s) => `<path class="formacion" transform="translate(${x} ${y}) scale(${s})" d="M0 12 C4 6 14 4 24 4 L110 2 C120 -10 128 -22 134 -24 L140 -22 L138 2 L150 6 L150 12 L110 16 L24 18 C12 18 2 16 0 12 Z M50 12 L96 12 L70 22 Z"/>`;

export const BOMBARDERO = `<div class="bombardero" aria-hidden="true">
  <svg class="bombardero-svg" viewBox="0 0 1200 1000" preserveAspectRatio="xMinYMax slice" focusable="false">
    <defs>
      <!-- Cielo de cartel: humo azulado arriba, ámbar en el horizonte. -->
      <linearGradient id="bm-cielo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2C2A26"/>
        <stop offset=".45" stop-color="#5B4A39"/>
        <stop offset=".8" stop-color="#A8804F"/>
        <stop offset="1" stop-color="#C79A5E"/>
      </linearGradient>
      <!-- Fuselaje como un cilindro: luz arriba, sombra abajo y el ámbar del horizonte en la panza. -->
      <linearGradient id="bm-fuselaje" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4A4E2F"/>
        <stop offset=".12" stop-color="#7C8253"/>
        <stop offset=".3" stop-color="#686E42"/>
        <stop offset=".72" stop-color="#454A2C"/>
        <stop offset=".92" stop-color="#2F311F"/>
        <stop offset="1" stop-color="#8E6436"/>
      </linearGradient>
      <linearGradient id="bm-cristal" x1="0" y1="0" x2=".5" y2="1">
        <stop offset="0" stop-color="#A9BCB4"/>
        <stop offset=".35" stop-color="#4A5E5C"/>
        <stop offset=".8" stop-color="#1D2627"/>
        <stop offset="1" stop-color="#7E5A34"/>
      </linearGradient>
      <linearGradient id="bm-cabina" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6E8380"/>
        <stop offset="1" stop-color="#151E1F"/>
      </linearGradient>
      <radialGradient id="bm-torreta" cx=".4" cy=".3" r=".75">
        <stop offset="0" stop-color="#B2C3BC"/>
        <stop offset=".5" stop-color="#46595A"/>
        <stop offset="1" stop-color="#1A2425"/>
      </radialGradient>
      <linearGradient id="bm-gondola" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#767C4D"/>
        <stop offset=".6" stop-color="#454A2C"/>
        <stop offset="1" stop-color="#8A6034"/>
      </linearGradient>
      <radialGradient id="bm-carenado" cx=".4" cy=".35" r=".7">
        <stop offset="0" stop-color="#3B362E"/>
        <stop offset="1" stop-color="#121010"/>
      </radialGradient>
      <radialGradient id="bm-disco" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#EDE4CF" stop-opacity="0"/>
        <stop offset=".7" stop-color="#EDE4CF" stop-opacity=".07"/>
        <stop offset=".95" stop-color="#EDE4CF" stop-opacity=".2"/>
        <stop offset="1" stop-color="#EDE4CF" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="1200" height="1000" fill="url(#bm-cielo)"/>

    <!-- Bombarderos en formación, lejos y en la bruma -->
    <g transform="translate(760 -170)">${silueta(70, 560, 0.75)}${silueta(220, 600, 0.55)}${silueta(10, 630, 0.45)}</g>

    <!-- Nubes que pasan despacio por detrás del avión -->
    <g class="nubes" transform="translate(0 270)">${bandaNubes}</g>

    <g class="bombardero-vuelo">
      <g transform="translate(40 330) rotate(-6 640 440)">
        <!-- Torreta superior (asoma por encima del fuselaje) -->
        <ellipse fill="url(#bm-torreta)" cx="700" cy="296" rx="62" ry="46"/>
        <path class="bm-reflejo" d="M666 284 C676 266 696 256 718 254 C702 266 690 278 684 292 Z"/>

        <!-- Fuselaje, cortado a la mitad del avión por el borde derecho -->
        <path fill="url(#bm-fuselaje)" d="M300 300 L1320 300 L1320 560 L170 556 C110 532 86 484 96 440 C112 372 190 316 300 300 Z"/>
        <!-- Joroba de la cabina y sus ventanas -->
        <path fill="url(#bm-fuselaje)" d="M330 304 C374 262 440 240 524 236 L612 238 L622 304 Z"/>
        <path fill="url(#bm-cabina)" d="M394 272 C420 256 452 248 488 246 L492 290 L404 296 Z"/>
        <path fill="url(#bm-cabina)" d="M504 246 L560 245 L566 290 L508 290 Z"/>
        <path class="bm-reflejo" d="M410 280 C426 266 446 258 470 254 L472 260 C450 264 432 272 418 284 Z"/>

        <!-- Morro acristalado -->
        <path fill="url(#bm-cristal)" d="M262 314 C196 326 132 372 108 436 C98 476 116 516 162 538 L246 548 C230 470 236 384 262 314 Z"/>
        <path class="bm-marco" d="M150 360 C170 420 186 480 200 544 M108 440 C150 446 200 452 250 456 M126 392 C170 396 214 400 256 404 M118 500 C160 502 200 504 244 506"/>
        <path class="bm-reflejo" d="M150 372 C170 350 196 334 226 326 C208 346 192 368 182 394 Z"/>
        <!-- Ventana de la mejilla con su ametralladora -->
        <ellipse fill="url(#bm-cabina)" cx="300" cy="470" rx="22" ry="16"/>
        <path class="bm-canon" d="M286 474 L214 498"/>

        <!-- Paneles y remaches -->
        <path class="bm-panel" d="M640 304 L640 560 M820 300 L820 560 M1010 300 L1010 560 M300 420 L1320 420"/>
        <path class="bm-remaches" d="M652 304 L652 560 M832 300 L832 560 M1022 300 L1022 560"/>

        <!-- Las 25 bombas de las misiones, pintadas bajo la cabina -->
        <g class="bm-bombas">${bombas()}</g>

        <!-- "Belle" pintado en el costado, en el amarillo del logotipo -->
        <g class="bm-pintura" transform="translate(360 418) rotate(-4) scale(${belleEscala.toFixed(5)}) translate(${-logoX} ${-logoY})">
          <path fill="#DDB040" d="${logoPath}"/>
        </g>

        <!-- Estrella con barras, al fondo del costado -->
        <g class="bm-pintura" transform="translate(1110 470)">
          <rect fill="#24365C" x="-130" y="-22" width="260" height="44" rx="2"/>
          <circle fill="#24365C" r="66"/>
          <path fill="#DCD5C3" d="M0 -56 L16.5 -19.3 L53.3 -17.2 L25.6 8.4 L32.9 45.5 L0 25.9 L-32.9 45.5 L-25.6 8.4 L-53.3 -17.2 L-16.5 -19.3 Z"/>
        </g>

        <!-- Motor interior bajo el ala, con la hélice girando en primer plano -->
        <path fill="url(#bm-gondola)" d="M860 556 L1320 548 L1320 640 L900 652 C870 646 856 610 860 556 Z"/>
        <ellipse fill="url(#bm-carenado)" cx="872" cy="604" rx="30" ry="50"/>
        <g transform="translate(846 604) scale(.2 1)">
          <circle fill="url(#bm-disco)" r="250"/>
          <g class="giro giro-4">
            <path class="bm-pala" d="M0 0 C28 -75 32 -195 0 -250 C-32 -195 -28 -75 0 0Z"/>
            <path class="bm-pala" d="M0 0 C28 -75 32 -195 0 -250 C-32 -195 -28 -75 0 0Z" transform="rotate(120)"/>
            <path class="bm-pala" d="M0 0 C28 -75 32 -195 0 -250 C-32 -195 -28 -75 0 0Z" transform="rotate(240)"/>
          </g>
        </g>
        <ellipse fill="#9C9884" cx="842" cy="604" rx="7" ry="14"/>
      </g>
    </g>
  </svg>
</div>`;
