import { readFileSync } from 'node:fs';

// Ilustración del bombardero (un B-17 de los años 40, como el del mural del local) para el fondo de la
// portada. Dibujo propio en SVG, de perfil y mirando hacia el texto. Va en línea en el HTML para que
// el CSS pueda animar las hélices y el vuelo (public/css/site.css → "Bombardero").
// El nombre del morro es el mismo trazado que el logotipo (public/img/logo-belle.svg).

const logo = readFileSync(new URL('../../public/img/logo-belle.svg', import.meta.url), 'utf8');
const [, logoX, logoY, logoW] = /viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(logo).map(Number);
const logoPath = /<path[^>]* d="([^"]+)"/.exec(logo)[1];
const BELLE_ANCHO = 74; // ancho del nombre pintado en el morro
const belleEscala = BELLE_ANCHO / logoW;

// Hélice vista de canto: un disco translúcido y dos palas que "giran" (ver .pala en el CSS).
const helice = (x, y, r) => `<g class="helice" transform="translate(${x} ${y})">
      <ellipse class="helice-disco" rx="6" ry="${r}"/>
      <rect class="pala" x="-2.5" y="${-r}" width="5" height="${r * 2}" rx="2.5"/>
      <rect class="pala pala-2" x="-2.5" y="${-r}" width="5" height="${r * 2}" rx="2.5"/>
      <circle class="buje" r="6"/>
    </g>`;

export const BOMBARDERO = `<div class="bombardero" aria-hidden="true">
  <svg class="bombardero-svg" viewBox="0 0 1000 420" focusable="false">
    <g class="bombardero-vuelo">
      <!-- Estabilizador horizontal y ala del lado lejano, más oscuros -->
      <path class="oliva-sombra" d="M808 226 L972 222 L976 236 L820 244 Z"/>
      <path class="oliva-sombra" d="M372 226 L512 222 L520 232 L380 236 Z"/>

      <!-- Deriva (cola alta del B-17) -->
      <path class="oliva" d="M640 182 C720 150 800 96 852 50 C872 33 900 28 912 36 C926 46 938 96 944 140 L950 196 L700 198 Z"/>
      <path class="timon" d="M906 40 C920 50 932 98 938 142 L944 196 L918 196 L912 120 Z"/>

      <!-- Fuselaje -->
      <path class="oliva" d="M40 232 C46 214 70 200 104 196 L150 194 C170 184 196 174 228 170 L560 172 C640 174 760 182 900 196 L978 222 C980 230 976 236 966 238 L900 242 C760 250 620 258 480 264 L170 266 C110 266 60 258 40 232 Z"/>
      <!-- Luz de arriba y sombra de abajo -->
      <path class="oliva-luz" d="M150 194 C170 184 196 174 228 170 L560 172 C640 174 760 182 900 196 L898 204 C760 192 640 184 560 182 L232 180 C200 184 176 192 156 202 Z"/>
      <path class="oliva-sombra" d="M60 248 C110 262 150 266 170 266 L480 264 C620 258 760 250 900 242 L966 238 C960 246 930 248 900 250 C760 258 620 266 480 272 L170 274 C120 272 80 262 60 248 Z"/>

      <!-- Morro acristalado y cabina -->
      <path class="cristal" d="M40 232 C46 214 70 200 104 196 L112 196 C104 214 104 244 116 262 C80 260 52 250 40 232 Z"/>
      <path class="marco" d="M60 210 L68 256 M84 200 L88 262 M104 196 L106 264"/>
      <path class="cristal-oscuro" d="M176 186 C192 178 212 174 232 172 L240 186 L184 192 Z"/>
      <path class="cristal" d="M252 172 C252 156 266 148 280 148 C294 148 306 156 306 172 Z"/>
      <rect class="cristal-oscuro" x="660" y="200" width="34" height="14" rx="3"/>
      <circle class="cristal-oscuro" cx="935" cy="226" r="9"/>

      <!-- Líneas de paneles -->
      <path class="paneles" d="M330 172 L330 266 M470 172 L470 264 M600 176 L600 258 M760 186 L760 250 M150 194 L170 266"/>

      <!-- Torreta inferior -->
      <circle class="oliva-sombra" cx="548" cy="266" r="15"/>
      <circle class="cristal-oscuro" cx="548" cy="270" r="8"/>

      <!-- Insignia de la época: estrella blanca sobre círculo azul, con barras -->
      <g transform="translate(720 222)">
        <rect class="insignia-barra" x="-34" y="-6" width="68" height="12"/>
        <circle class="insignia-azul" r="18"/>
        <path class="insignia-blanca" d="M0 -16 L4.7 -5.5 L15.2 -4.9 L7.3 2.4 L9.4 13 L0 7.4 L-9.4 13 L-7.3 2.4 L-15.2 -4.9 L-4.7 -5.5 Z"/>
      </g>

      <!-- "Belle" pintado en el morro -->
      <g transform="translate(124 236) rotate(-6) scale(${belleEscala.toFixed(5)}) translate(${-logoX} ${-logoY})">
        <path class="belle-morro" d="${logoPath}"/>
      </g>

      <!-- Motores y ala del lado cercano -->
      <path class="oliva-sombra" d="M262 236 L380 232 L384 252 L270 256 Z"/>
      <path class="oliva" d="M300 248 C300 238 312 232 326 232 L392 232 L392 266 L326 266 C312 266 300 260 300 248 Z"/>
      <path class="oliva" d="M226 262 C226 250 240 244 256 244 L330 246 L330 282 L256 282 C240 282 226 274 226 262 Z"/>
      <path class="oliva-luz" d="M228 256 C232 248 242 245 256 245 L330 247 L330 253 L256 252 C244 252 236 254 230 260 Z"/>
      <path class="oliva" d="M330 240 C420 236 520 236 560 240 L560 256 C520 262 420 266 330 268 Z"/>
      <path class="oliva-luz" d="M330 240 C420 236 520 236 560 240 L560 244 C520 242 420 242 330 246 Z"/>
      ${helice(298, 249, 34)}
      ${helice(224, 263, 40)}
    </g>
  </svg>
</div>`;
