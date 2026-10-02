import { readFileSync } from 'node:fs';

// Ilustración del bombardero (un B-17 de los años 40, como el del mural del local) para el fondo de la
// portada. Dibujo propio en SVG en vista de tres cuartos, como en el mural: viene de frente y en
// diagonal hacia el texto, con el morro y los motores de cara y el fuselaje alejándose de lado hacia
// la cola. Va en línea en el HTML para que el CSS pueda animar las hélices y el vuelo
// (public/css/site.css → "Bombardero"). El nombre del morro es el mismo trazado que el logotipo
// (public/img/logo-belle.svg).

const logo = readFileSync(new URL('../../public/img/logo-belle.svg', import.meta.url), 'utf8');
const [, logoX, logoY, logoW] = /viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(logo).map(Number);
const logoPath = /<path[^>]* d="([^"]+)"/.exec(logo)[1];
const BELLE_ANCHO = 92; // ancho del nombre pintado en el morro
const belleEscala = BELLE_ANCHO / logoW;

// Pala de hélice: estrecha en el buje, ancha en el centro y redondeada en la punta.
const pala = (r) => `M0 0 C${(r * 0.09).toFixed(1)} ${(-r * 0.3).toFixed(1)} ${(r * 0.1).toFixed(1)} ${(-r * 0.78).toFixed(1)} 0 ${-r} C${(-r * 0.1).toFixed(1)} ${(-r * 0.78).toFixed(1)} ${(-r * 0.09).toFixed(1)} ${(-r * 0.3).toFixed(1)} 0 0Z`;

// Motor visto de frente: carenado, hélice de tres palas que gira de cara (ver .giro en el CSS) y buje.
// "n" (1-4) desfasa cada hélice para que no giren al unísono; va en clases porque la CSP no admite
// estilos en línea.
// "fondo" es la góndola que se aleja hacia atrás, en la dirección del fuselaje.
const motor = ({ x, y, r, n }) => {
  const R = Math.round(r * 2.1); // radio de la hélice
  return `<g class="motor" transform="translate(${x} ${y})">
      <path class="oliva-sombra" d="M${-r * 0.8} ${-r * 0.55} L${r * 1.3} ${-r * 1.15} L${r * 1.5} ${r * 0.1} L${r * 0.2} ${r * 0.95} Z"/>
      <ellipse class="oliva" rx="${r * 0.86}" ry="${r}"/>
      <ellipse class="carenado" rx="${r * 0.66}" ry="${r * 0.78}"/>
      <g transform="scale(.86 1)">
        <circle class="helice-disco" r="${R}"/>
        <g class="giro giro-${n}">
          <path class="pala" d="${pala(R)}"/>
          <path class="pala" d="${pala(R)}" transform="rotate(120)"/>
          <path class="pala" d="${pala(R)}" transform="rotate(240)"/>
        </g>
      </g>
      <circle class="buje" r="${(r * 0.24).toFixed(1)}"/>
    </g>`;
};

export const BOMBARDERO = `<div class="bombardero" aria-hidden="true">
  <svg class="bombardero-svg" viewBox="0 0 1000 620" focusable="false">
    <defs>
      <linearGradient id="bombardero-fuselaje" gradientUnits="userSpaceOnUse" x1="560" y1="150" x2="610" y2="330">
        <stop offset="0" stop-color="#7B8550"/>
        <stop offset=".55" stop-color="#5E673B"/>
        <stop offset="1" stop-color="#3B4026"/>
      </linearGradient>
    </defs>
    <g class="bombardero-vuelo">
      <!-- Lado lejano: estabilizador, ala y sus dos motores (detrás del fuselaje) -->
      <path class="oliva-sombra" d="M842 158 L756 126 L766 118 L852 148 Z"/>
      <path class="oliva-sombra" d="M486 268 L118 178 L132 168 L512 240 Z"/>
      ${motor({ x: 236, y: 205, r: 24, n: 1 })}
      ${motor({ x: 376, y: 240, r: 29, n: 2 })}

      <!-- Deriva: la cola alta del B-17, al fondo -->
      <path class="oliva" d="M770 166 C790 128 812 86 832 62 C840 52 856 50 862 58 C868 72 872 110 874 146 Z"/>
      <path class="timon" d="M858 60 C866 76 870 112 872 146 L860 148 L852 96 Z"/>

      <!-- Fuselaje: se estrecha hacia la cola -->
      <path fill="url(#bombardero-fuselaje)" d="M268 276 C450 206 700 160 852 140 C866 138 876 150 870 166 C760 236 580 352 352 446 Z"/>
      <path class="paneles" d="M470 214 C478 260 486 300 492 336 M620 180 C626 210 630 240 634 270 M760 154 C762 168 764 182 766 196"/>
      <!-- Ventana lateral y torreta superior -->
      <path class="cristal-oscuro" d="M560 222 L600 210 L602 226 L562 238 Z"/>
      <ellipse class="cristal" cx="436" cy="214" rx="26" ry="17" transform="rotate(-20 436 214)"/>

      <!-- Insignia de la época, en perspectiva sobre el costado -->
      <g transform="translate(706 214) rotate(-20) scale(.78 1)">
        <rect class="insignia-barra" x="-36" y="-6" width="72" height="12"/>
        <circle class="insignia-azul" r="18"/>
        <path class="insignia-blanca" d="M0 -16 L4.7 -5.5 L15.2 -4.9 L7.3 2.4 L9.4 13 L0 7.4 L-9.4 13 L-7.3 2.4 L-15.2 -4.9 L-4.7 -5.5 Z"/>
      </g>

      <!-- Morro: el anillo delantero del fuselaje, el morro acristalado que viene hacia nosotros y la cabina -->
      <path fill="url(#bombardero-fuselaje)" d="M268 276 C232 296 202 340 196 384 C192 420 222 450 262 456 C296 460 330 454 352 446 Z"/>
      <path class="cristal" d="M232 300 C206 326 192 362 194 394 C196 426 226 448 266 452 C282 452 296 450 306 446 C286 406 260 352 232 300 Z"/>
      <path class="cristal-luz" d="M222 318 C210 338 204 360 204 380 C214 360 226 340 240 322 Z"/>
      <path class="marco" d="M232 300 C256 350 282 404 306 446 M210 336 C236 360 262 396 280 448 M196 392 C226 404 254 420 270 450"/>
      <circle class="cristal-oscuro" cx="228" cy="410" r="9"/>
      <path class="cristal-oscuro" d="M352 262 L400 242 L410 258 L362 280 Z"/>

      <!-- "Belle" pintado en el costado del morro -->
      <g transform="translate(350 392) rotate(-21) scale(${belleEscala.toFixed(5)}) translate(${-logoX} ${-logoY})">
        <path class="belle-morro" d="${logoPath}"/>
      </g>

      <!-- Lado cercano: estabilizador, ala y sus dos motores (delante del fuselaje) -->
      <path class="oliva" d="M866 168 L954 196 L960 186 L872 158 Z"/>
      <path class="oliva" d="M548 304 L966 400 L986 382 L590 274 Z"/>
      <path class="oliva-luz" d="M590 274 L986 382 L980 388 L584 282 Z"/>
      ${motor({ x: 812, y: 366, r: 38, n: 3 })}
      ${motor({ x: 668, y: 330, r: 46, n: 4 })}
    </g>
  </svg>
</div>`;
