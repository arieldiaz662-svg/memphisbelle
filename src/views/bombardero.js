import { readFileSync } from 'node:fs';

// Ilustración del bombardero (un B-17 de los años 40, como el del mural del local) para el fondo de la
// portada. Dibujo propio en SVG, en estilo cartoon de los 90: contorno negro grueso, colores planos,
// sombras de bloque y brillos blancos. Vista a 45 grados (entre frente y perfil), grande y recortada a
// la mitad del avión: morro, cabina y el ala cercana con sus motores; la cola queda fuera del encuadre.
// Va en línea en el HTML para que el CSS pueda animar las hélices y el vuelo
// (public/css/site.css → "Bombardero"). El nombre del morro es el trazado del logotipo
// (public/img/logo-belle.svg).

const logo = readFileSync(new URL('../../public/img/logo-belle.svg', import.meta.url), 'utf8');
const [, logoX, logoY, logoW] = /viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(logo).map(Number);
const logoPath = /<path[^>]* d="([^"]+)"/.exec(logo)[1];
const BELLE_ANCHO = 190; // ancho del nombre pintado en el costado del morro
const belleEscala = BELLE_ANCHO / logoW;

// Pala de hélice: estrecha en el buje, ancha en el centro y redondeada en la punta.
const pala = (r) => `M0 0 C${(r * 0.12).toFixed(1)} ${(-r * 0.3).toFixed(1)} ${(r * 0.14).toFixed(1)} ${(-r * 0.78).toFixed(1)} 0 ${-r} C${(-r * 0.14).toFixed(1)} ${(-r * 0.78).toFixed(1)} ${(-r * 0.12).toFixed(1)} ${(-r * 0.3).toFixed(1)} 0 0Z`;

// Motor a 45 grados: carenado ovalado mirando hacia delante, góndola hacia atrás, y hélice de tres
// palas que gira en el plano del carenado (ver .giro en el CSS), con un disco y dos arcos de velocidad
// de dibujo animado. "n" (1-4) desfasa cada hélice; va en clases porque la CSP no admite estilos en
// línea.
const motor = ({ x, y, r, n }) => {
  const R = Math.round(r * 2.2); // radio de la hélice
  return `<g class="motor" transform="translate(${x} ${y})">
      <path class="oliva" d="M${-r * 0.2} ${-r} L${r * 2.2} ${-r * 2} L${r * 2.6} ${r * 0.2} L${r * 0.3} ${r} Z"/>
      <path class="oliva-sombra sin-linea" d="M${r * 0.1} ${r * 0.45} L${r * 2.5} ${-r * 0.4} L${r * 2.6} ${r * 0.2} L${r * 0.3} ${r} Z"/>
      <g transform="rotate(-25) scale(.62 1)">
        <circle class="oliva" r="${r}"/>
        <circle class="carenado" r="${(r * 0.72).toFixed(1)}"/>
        <circle class="helice-disco sin-linea" r="${R}"/>
        <path class="arco sin-linea" d="M${-R * 0.82} ${-R * 0.45} A${R * 0.94} ${R * 0.94} 0 0 1 ${-R * 0.2} ${-R * 0.9} M${R * 0.82} ${R * 0.45} A${R * 0.94} ${R * 0.94} 0 0 1 ${R * 0.2} ${R * 0.9}"/>
        <g class="giro giro-${n}">
          <path class="pala" d="${pala(R)}"/>
          <path class="pala" d="${pala(R)}" transform="rotate(120)"/>
          <path class="pala" d="${pala(R)}" transform="rotate(240)"/>
        </g>
        <circle class="buje" r="${(r * 0.28).toFixed(1)}"/>
      </g>
    </g>`;
};

export const BOMBARDERO = `<div class="bombardero" aria-hidden="true">
  <svg class="bombardero-svg" viewBox="0 0 1200 800" focusable="false">
    <g class="bombardero-vuelo">
      <!-- Ala lejana con sus dos motores, detrás del fuselaje (arriba a la izquierda) -->
      <path class="oliva-sombra" d="M700 250 L330 120 L300 150 L640 320 Z"/>
      ${motor({ x: 410, y: 168, r: 34, n: 1 })}
      ${motor({ x: 560, y: 222, r: 40, n: 2 })}

      <!-- Fuselaje, cortado a la mitad del avión por el borde derecho -->
      <path class="oliva" d="M316 364 L1300 -96 L1440 200 L443 636 Z"/>
      <path class="oliva-sombra sin-linea" d="M410 556 L1380 104 L1440 200 L443 636 Z"/>
      <path class="oliva-luz sin-linea" d="M332 392 L1312 -64 L1318 -46 L338 410 Z"/>
      <path class="remaches sin-linea" d="M640 236 L660 470 M820 152 L846 384 M1000 70 L1030 300"/>

      <!-- Insignia de la época en el costado -->
      <g transform="translate(960 250) rotate(-25) scale(.74 1)">
        <rect class="insignia-barra" x="-70" y="-13" width="140" height="26" rx="3"/>
        <circle class="insignia-azul" r="38"/>
        <path class="insignia-blanca sin-linea" d="M0 -32 L9.4 -11 L30.4 -9.8 L14.6 4.8 L18.8 26 L0 14.8 L-18.8 26 L-14.6 4.8 L-30.4 -9.8 L-9.4 -11 Z"/>
      </g>

      <!-- Torreta superior y cabina -->
      <ellipse class="cristal" cx="560" cy="250" rx="58" ry="34" transform="rotate(-25 560 250)"/>
      <path class="brillo sin-linea" d="M528 248 C534 232 552 222 570 220 C556 232 546 244 540 258 Z"/>
      <path class="cristal-oscuro" d="M420 350 C440 318 474 300 512 290 L540 340 L446 386 Z"/>
      <path class="marco" d="M470 312 L494 360"/>
      <path class="brillo sin-linea" d="M440 350 C452 334 466 324 482 318 L486 328 C470 334 458 344 450 356 Z"/>

      <!-- Morro: la cara delantera del fuselaje y el morro acristalado que viene hacia nosotros -->
      <ellipse class="oliva" cx="380" cy="500" rx="150" ry="84" transform="rotate(65 380 500)"/>
      <path class="cristal" d="M334 378 C262 392 196 468 186 552 C178 616 236 656 320 656 C380 656 424 646 440 628 C396 560 360 470 334 378 Z"/>
      <path class="marco" d="M334 378 C300 450 262 540 236 640 M386 520 C320 530 250 548 190 576 M214 470 C260 480 320 500 404 560"/>
      <ellipse class="cristal-oscuro" cx="252" cy="572" rx="20" ry="26" transform="rotate(-25 252 572)"/>
      <path class="brillo sin-linea" d="M226 486 C240 444 268 414 304 402 C282 428 266 456 258 492 Z"/>
      <circle class="brillo sin-linea" cx="300" cy="430" r="10"/>

      <!-- "Belle" pintado en el costado del morro, con contorno de dibujo animado -->
      <g transform="translate(470 450) rotate(-25) scale(${belleEscala.toFixed(5)}) translate(${-logoX} ${-logoY})">
        <path class="belle-morro" d="${logoPath}" vector-effect="non-scaling-stroke"/>
      </g>

      <!-- Ala cercana con sus dos motores, saliendo del encuadre por abajo a la derecha -->
      <path class="oliva" d="M690 560 L1260 860 L1420 760 L900 470 Z"/>
      <path class="oliva-luz sin-linea" d="M700 566 L1266 862 L1282 852 L716 556 Z"/>
      ${motor({ x: 990, y: 772, r: 64, n: 3 })}
      ${motor({ x: 812, y: 654, r: 72, n: 4 })}
    </g>
  </svg>
</div>`;
