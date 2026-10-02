import { readFileSync } from 'node:fs';

// Ilustración del bombardero (un B-17 de los años 40, como el del mural del local) para el fondo de la
// portada. Dibujo propio en SVG con acabado realista, como un cartel de aviación de la época: sin
// contornos, metal sombreado como un cilindro, reflejos, la luz naranja del cielo rebotando en la panza
// y líneas de paneles discretas. Vista a 45 grados, grande y recortada a la mitad del avión: morro de
// cristal, cabina, torreta y el ala cercana con sus motores; la cola queda fuera del encuadre.
// Va en línea en el HTML para que el CSS pueda animar las hélices y el vuelo
// (public/css/site.css → "Bombardero"). El nombre del morro es el trazado del logotipo
// (public/img/logo-belle.svg).

const logo = readFileSync(new URL('../../public/img/logo-belle.svg', import.meta.url), 'utf8');
const [, logoX, logoY, logoW] = /viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(logo).map(Number);
const logoPath = /<path[^>]* d="([^"]+)"/.exec(logo)[1];
const BELLE_ANCHO = 190; // ancho del nombre pintado en el costado del morro
const belleEscala = BELLE_ANCHO / logoW;

// Pala "fantasma" de una hélice a toda velocidad: apenas se intuye dentro del disco desenfocado.
const pala = (r) => `M0 0 C${(r * 0.12).toFixed(1)} ${(-r * 0.3).toFixed(1)} ${(r * 0.14).toFixed(1)} ${(-r * 0.78).toFixed(1)} 0 ${-r} C${(-r * 0.14).toFixed(1)} ${(-r * 0.78).toFixed(1)} ${(-r * 0.12).toFixed(1)} ${(-r * 0.3).toFixed(1)} 0 0Z`;

// Motor a 45 grados: góndola hacia atrás, carenado mirando hacia delante y hélice girando: un disco
// translúcido (como en una foto a velocidad real) con tres palas fantasma que giran (ver .giro en el
// CSS). "n" (1-4) desfasa cada hélice; va en clases porque la CSP no admite estilos en línea.
const motor = ({ x, y, r, n }) => {
  const R = Math.round(r * 2.2); // radio de la hélice
  return `<g transform="translate(${x} ${y})">
      <path fill="url(#bm-gondola)" d="M${-r * 0.2} ${-r} L${r * 2.2} ${-r * 2} L${r * 2.6} ${r * 0.2} L${r * 0.3} ${r} Z"/>
      <path class="bm-panel" d="M${r * 0.9} ${-r * 1.28} L${r * 1.15} ${r * 0.62}"/>
      <g transform="rotate(-25) scale(.62 1)">
        <circle fill="url(#bm-carenado)" r="${r}"/>
        <circle fill="url(#bm-toma)" r="${(r * 0.74).toFixed(1)}"/>
        <circle fill="url(#bm-disco)" r="${R}"/>
        <g class="giro giro-${n}">
          <path class="bm-pala" d="${pala(R)}"/>
          <path class="bm-pala" d="${pala(R)}" transform="rotate(120)"/>
          <path class="bm-pala" d="${pala(R)}" transform="rotate(240)"/>
        </g>
        <circle fill="url(#bm-buje)" r="${(r * 0.26).toFixed(1)}"/>
      </g>
    </g>`;
};

export const BOMBARDERO = `<div class="bombardero" aria-hidden="true">
  <svg class="bombardero-svg" viewBox="0 0 1200 800" focusable="false">
    <defs>
      <!-- Fuselaje como un cilindro: luz cenital, sombra propia y el naranja del cielo rebotando abajo.
           El degradado va perpendicular al eje del avión, así que sirve a todo lo largo. -->
      <linearGradient id="bm-fuselaje" gradientUnits="userSpaceOnUse" x1="316" y1="364" x2="443" y2="636">
        <stop offset="0" stop-color="#3E4227"/>
        <stop offset=".14" stop-color="#7E8455"/>
        <stop offset=".24" stop-color="#6A7043"/>
        <stop offset=".6" stop-color="#4C5130"/>
        <stop offset=".86" stop-color="#2E3020"/>
        <stop offset="1" stop-color="#8A5A2C"/>
      </linearGradient>
      <radialGradient id="bm-tapa" cx=".35" cy=".3" r=".8">
        <stop offset="0" stop-color="#727848"/>
        <stop offset=".7" stop-color="#454A2B"/>
        <stop offset="1" stop-color="#2C2E1D"/>
      </radialGradient>
      <!-- Cristal del morro: oscuro, con el cielo naranja reflejado abajo y un brillo arriba. -->
      <linearGradient id="bm-cristal" x1="0" y1="0" x2=".4" y2="1">
        <stop offset="0" stop-color="#9DB3AE"/>
        <stop offset=".35" stop-color="#3F5556"/>
        <stop offset=".75" stop-color="#1F2B2C"/>
        <stop offset="1" stop-color="#8C5A2E"/>
      </linearGradient>
      <linearGradient id="bm-cabina" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#5F7472"/>
        <stop offset="1" stop-color="#162021"/>
      </linearGradient>
      <linearGradient id="bm-ala" gradientUnits="userSpaceOnUse" x1="760" y1="470" x2="700" y2="600">
        <stop offset="0" stop-color="#6C7246"/>
        <stop offset=".7" stop-color="#474C2D"/>
        <stop offset="1" stop-color="#7A5230"/>
      </linearGradient>
      <linearGradient id="bm-ala-lejana" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4A4F30"/>
        <stop offset="1" stop-color="#2D2F1F"/>
      </linearGradient>
      <linearGradient id="bm-gondola" x1="0" y1="0" x2=".3" y2="1">
        <stop offset="0" stop-color="#737949"/>
        <stop offset=".6" stop-color="#454A2C"/>
        <stop offset="1" stop-color="#7C5230"/>
      </linearGradient>
      <radialGradient id="bm-carenado" cx=".38" cy=".3" r=".75">
        <stop offset="0" stop-color="#7B8150"/>
        <stop offset=".8" stop-color="#3E4228"/>
        <stop offset="1" stop-color="#25271A"/>
      </radialGradient>
      <radialGradient id="bm-toma" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#3A352E"/>
        <stop offset=".8" stop-color="#15130F"/>
        <stop offset="1" stop-color="#0D0C0A"/>
      </radialGradient>
      <radialGradient id="bm-buje" cx=".35" cy=".3" r=".7">
        <stop offset="0" stop-color="#C9C6B4"/>
        <stop offset="1" stop-color="#55534A"/>
      </radialGradient>
      <!-- Disco de la hélice a toda velocidad: borde algo más marcado, centro casi transparente. -->
      <radialGradient id="bm-disco" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#E9E2D0" stop-opacity="0"/>
        <stop offset=".75" stop-color="#E9E2D0" stop-opacity=".06"/>
        <stop offset=".96" stop-color="#E9E2D0" stop-opacity=".16"/>
        <stop offset="1" stop-color="#E9E2D0" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="bm-torreta" cx=".4" cy=".3" r=".75">
        <stop offset="0" stop-color="#A9BDB8"/>
        <stop offset=".5" stop-color="#425859"/>
        <stop offset="1" stop-color="#1A2425"/>
      </radialGradient>
    </defs>

    <g class="bombardero-vuelo">
      <!-- Ala lejana con sus dos motores, detrás del fuselaje y algo apagada por la distancia -->
      <g class="bm-lejos">
        <path fill="url(#bm-ala-lejana)" d="M700 250 L330 120 L300 150 L640 320 Z"/>
        ${motor({ x: 410, y: 168, r: 34, n: 1 })}
        ${motor({ x: 560, y: 222, r: 40, n: 2 })}
      </g>

      <!-- Fuselaje, cortado a la mitad del avión por el borde derecho -->
      <path fill="url(#bm-fuselaje)" d="M316 364 L1300 -96 L1440 200 L443 636 Z"/>
      <path class="bm-panel" d="M640 236 L668 470 M820 152 L852 384 M1000 70 L1036 300 M560 290 L1300 -55"/>
      <path class="bm-remaches" d="M652 236 L680 470 M832 152 L864 384 M1012 70 L1048 300"/>

      <!-- Insignia de la época, pintada y algo gastada -->
      <g class="bm-pintura" transform="translate(960 250) rotate(-25) scale(.74 1)">
        <rect fill="#24365C" x="-70" y="-13" width="140" height="26" rx="2"/>
        <circle fill="#24365C" r="38"/>
        <path fill="#D9D3C2" d="M0 -32 L9.4 -11 L30.4 -9.8 L14.6 4.8 L18.8 26 L0 14.8 L-18.8 26 L-14.6 4.8 L-30.4 -9.8 L-9.4 -11 Z"/>
      </g>

      <!-- Torreta superior y cabina -->
      <ellipse fill="url(#bm-torreta)" cx="560" cy="250" rx="58" ry="34" transform="rotate(-25 560 250)"/>
      <path class="bm-reflejo" d="M530 246 C538 232 554 224 572 222 C558 232 548 242 542 254 Z"/>
      <path fill="url(#bm-cabina)" d="M420 350 C440 318 474 300 512 290 L540 340 L446 386 Z"/>
      <path class="bm-marco" d="M470 312 L494 360"/>
      <path class="bm-reflejo" d="M440 350 C452 334 466 324 482 318 L485 324 C470 330 458 340 448 354 Z"/>

      <!-- Morro: la cara delantera del fuselaje y el morro acristalado que viene hacia nosotros -->
      <ellipse fill="url(#bm-tapa)" cx="380" cy="500" rx="150" ry="84" transform="rotate(65 380 500)"/>
      <path fill="url(#bm-cristal)" d="M334 378 C262 392 196 468 186 552 C178 616 236 656 320 656 C380 656 424 646 440 628 C396 560 360 470 334 378 Z"/>
      <path class="bm-marco" d="M334 378 C300 450 262 540 236 640 M386 520 C320 530 250 548 190 576 M214 470 C260 480 320 500 404 560"/>
      <path class="bm-reflejo" d="M228 482 C242 444 268 416 302 404 C282 428 268 456 260 488 Z"/>

      <!-- "Belle" pintado en el costado del morro -->
      <g class="bm-pintura" transform="translate(470 450) rotate(-25) scale(${belleEscala.toFixed(5)}) translate(${-logoX} ${-logoY})">
        <path fill="#D9AE3E" d="${logoPath}"/>
      </g>

      <!-- Ala cercana con sus dos motores, saliendo del encuadre por abajo a la derecha -->
      <path fill="url(#bm-ala)" d="M690 560 L1260 860 L1420 760 L900 470 Z"/>
      <path class="bm-borde-ataque" d="M694 562 L1262 860"/>
      ${motor({ x: 990, y: 772, r: 64, n: 3 })}
      ${motor({ x: 812, y: 654, r: 72, n: 4 })}
    </g>
  </svg>
</div>`;
