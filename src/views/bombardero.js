import { readFileSync } from 'node:fs';

// Ilustración del bombardero (un B-17 de los años 40, como el del mural del local) para el fondo de la
// portada. Dibujo propio en SVG, totalmente de frente y recortado: solo la parte delantera, del morro
// acristalado a las hélices, con las alas saliendo del encuadre. Va en línea en el HTML para que el
// CSS pueda animar las hélices y el vuelo (public/css/site.css → "Bombardero"). El nombre del morro es
// el mismo trazado que el logotipo (public/img/logo-belle.svg).

const logo = readFileSync(new URL('../../public/img/logo-belle.svg', import.meta.url), 'utf8');
const [, logoX, logoY, logoW] = /viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(logo).map(Number);
const logoPath = /<path[^>]* d="([^"]+)"/.exec(logo)[1];
const BELLE_ANCHO = 120; // ancho del nombre pintado bajo el morro
const belleEscala = BELLE_ANCHO / logoW;

// Pala de hélice: estrecha en el buje, ancha en el centro y redondeada en la punta.
const pala = (r) => `M0 0 C${(r * 0.1).toFixed(1)} ${(-r * 0.3).toFixed(1)} ${(r * 0.11).toFixed(1)} ${(-r * 0.78).toFixed(1)} 0 ${-r} C${(-r * 0.11).toFixed(1)} ${(-r * 0.78).toFixed(1)} ${(-r * 0.1).toFixed(1)} ${(-r * 0.3).toFixed(1)} 0 0Z`;

// Motor visto de frente: carenado redondo con la toma de aire, hélice de tres palas que gira de cara
// (ver .giro en el CSS) y buje. "n" (1-4) desfasa cada hélice para que no giren al unísono; va en
// clases porque la CSP no admite estilos en línea.
const motor = ({ x, y, r, n }) => {
  const R = Math.round(r * 2.3); // radio de la hélice
  return `<g class="motor" transform="translate(${x} ${y})">
      <circle class="oliva-sombra" r="${r + 6}"/>
      <circle class="oliva" r="${r}"/>
      <circle class="carenado" r="${(r * 0.74).toFixed(1)}"/>
      <path class="cilindros" d="M${-r * 0.74} 0 H${r * 0.74} M0 ${-r * 0.74} V${r * 0.74} M${-r * 0.52} ${-r * 0.52} L${r * 0.52} ${r * 0.52} M${r * 0.52} ${-r * 0.52} L${-r * 0.52} ${r * 0.52}"/>
      <circle class="helice-disco" r="${R}"/>
      <g class="giro giro-${n}">
        <path class="pala" d="${pala(R)}"/>
        <path class="pala" d="${pala(R)}" transform="rotate(120)"/>
        <path class="pala" d="${pala(R)}" transform="rotate(240)"/>
      </g>
      <circle class="buje" r="${(r * 0.26).toFixed(1)}"/>
    </g>`;
};

export const BOMBARDERO = `<div class="bombardero" aria-hidden="true">
  <svg class="bombardero-svg" viewBox="0 0 1200 640" focusable="false">
    <defs>
      <radialGradient id="bombardero-fuselaje" cx=".42" cy=".36" r=".7">
        <stop offset="0" stop-color="#7B8550"/>
        <stop offset=".6" stop-color="#5E673B"/>
        <stop offset="1" stop-color="#3B4026"/>
      </radialGradient>
      <radialGradient id="bombardero-cristal" cx=".4" cy=".35" r=".75">
        <stop offset="0" stop-color="#A9C3C2"/>
        <stop offset=".55" stop-color="#6F9396"/>
        <stop offset="1" stop-color="#3E5A5E"/>
      </radialGradient>
    </defs>
    <g class="bombardero-vuelo">
      <!-- Alas de frente: el borde de ataque, con un poco de diedro (suben hacia las puntas) -->
      <path class="oliva-sombra" d="M-120 318 L600 362 L1320 318 L1320 344 L600 392 L-120 344 Z"/>
      <path class="oliva" d="M-120 306 L600 350 L1320 306 L1320 322 L600 372 L-120 322 Z"/>
      <path class="oliva-luz" d="M-120 306 L600 350 L1320 306 L1320 312 L600 358 L-120 312 Z"/>

      <!-- Deriva asomando detrás y torreta superior -->
      <path class="oliva-sombra" d="M590 92 L600 40 L610 92 Z"/>
      <ellipse class="cristal" cx="600" cy="128" rx="44" ry="26"/>

      <!-- Fuselaje: la sección redonda del morro -->
      <circle fill="url(#bombardero-fuselaje)" cx="600" cy="300" r="170"/>
      <!-- Cabina: los dos parabrisas de los pilotos -->
      <path class="cristal-oscuro" d="M520 176 C540 160 570 152 596 150 L596 200 L532 208 Z"/>
      <path class="cristal-oscuro" d="M680 176 C660 160 630 152 604 150 L604 200 L668 208 Z"/>
      <path class="marco" d="M556 160 L560 204 M644 160 L640 204"/>

      <!-- Morro acristalado del bombardero, de frente -->
      <circle class="oliva-sombra" cx="600" cy="318" r="112"/>
      <circle fill="url(#bombardero-cristal)" cx="600" cy="318" r="104"/>
      <path class="marco" d="M496 318 H704 M600 214 V422 M527 245 L673 391 M673 245 L527 391"/>
      <circle class="marco" cx="600" cy="318" r="62"/>
      <circle class="cristal-oscuro" cx="600" cy="318" r="20"/>
      <path class="cristal-luz" d="M530 268 C548 240 578 226 606 224 C584 240 564 262 552 290 Z"/>

      <!-- "Belle" pintado bajo el morro -->
      <g transform="translate(${600 - BELLE_ANCHO / 2} 432) rotate(-6 ${BELLE_ANCHO / 2} 20) scale(${belleEscala.toFixed(5)}) translate(${-logoX} ${-logoY})">
        <path class="belle-morro" d="${logoPath}"/>
      </g>

      <!-- Cuatro motores con sus hélices -->
      ${motor({ x: 90, y: 326, r: 64, n: 1 })}
      ${motor({ x: 1110, y: 326, r: 64, n: 2 })}
      ${motor({ x: 330, y: 344, r: 70, n: 3 })}
      ${motor({ x: 870, y: 344, r: 70, n: 4 })}
    </g>
  </svg>
</div>`;
