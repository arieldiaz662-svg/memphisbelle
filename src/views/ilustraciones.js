// Ilustraciones de línea de la web: cóctel ahumándose, las cuatro escenas de "El oficio", los iconos de la carta
// y el sello giratorio. Son SVG propios, en línea para que el CSS (public/css/site.css) los anime.
// Los retardos y direcciones de cada pieza van en atributos data-s="N" con sus reglas en el CSS: la política de
// seguridad (CSP) no admite estilos en el propio HTML.

// Símbolos reutilizables (marca redonda "MB"): se incluyen una vez al principio de la página.
export const SPRITE = `<svg class="sprite" aria-hidden="true"><defs><linearGradient id="mb-oro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8BE80"/><stop offset=".55" stop-color="#C9A961"/><stop offset="1" stop-color="#B8964F"/></linearGradient></defs><symbol id="mb-marca" viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" fill="url(#mb-oro)"/><circle cx="100" cy="100" r="89" fill="none" stroke="#0A0A0A" stroke-width=".9" opacity=".55"/><g transform="translate(41.00 129.97) scale(0.03995)" fill="#0A0A0A"><path transform="translate(-41.82261137664318 0)" d="M758.4789959713817 20.0 202.47899597138166 -1500.0H427.3305050394235L871.4451308101416 -303.0183262452483L1293.0880266353488 -1500.0H1307.449428319931L774.2953990474343 20.0ZM209.4070480465889 -1500.0V-13.50836181640625H362.5693154782057V0.0H51.23429350554943V-13.50836181640625H195.31731384247541V-1486.4916381835938H41.82261137664318V-1500.0ZM1666.6079366207123 -1500.0V-1486.4916381835938H1526.5698991939425V-13.50836181640625H1666.6079366207123V0.0H1142.1444356441498V-13.50836181640625H1303.0044209957123V-1500.0Z"/><path transform="translate(1733.0 0)" d="M41.82261137664318 0.0V-13.50836181640625H658.1273583102939Q742.6359048336744 -13.50836181640625 812.9056191891432 -65.5633544921875Q883.1753335446119 -117.61834716796875 925.3182841427624 -209.30917358398438Q967.4612347409129 -301.0 967.4612347409129 -420.0Q967.4612347409129 -539.0 925.3182841427624 -614.8943113647401Q883.1753335446119 -690.7886227294803 813.0024919364822 -727.0661190673709Q742.8296503283525 -763.3436154052615 658.3439208712366 -763.3436154052615H424.2629925534129V-773.086669921875H690.316900328191Q835.2976479977369 -773.086669921875 955.7479043453932 -738.60498046875Q1076.1981606930494 -704.123291015625 1148.3182778805494 -625.6614990234375Q1220.4383950680494 -547.19970703125 1220.4383950680494 -414.3994140625Q1220.4383950680494 -191.4996337890625 1079.5066174084157 -95.74981689453125Q938.574839748782 0.0 690.4287915074511 0.0ZM221.23429350554943 -5.759901806712151V-1494.2400981932878H445.69779448211193V-5.759901806712151ZM424.2629925534129 -766.913330078125V-776.8900146484375H638.6624066159129Q713.2622601315379 -776.8900146484375 779.2187968380749 -810.5316772460938Q845.1753335446119 -844.17333984375 886.4350991696119 -917.4508361816406Q927.6948647946119 -990.7283325195312 927.6948647946119 -1109.7283325195312Q927.6948647946119 -1228.7283325195312 886.4350991696119 -1312.9191589355469Q845.1753335446119 -1397.1099853515625 779.1075748692954 -1441.8008117675781Q713.0398161939789 -1486.4916381835938 638.6624066159129 -1486.4916381835938H41.82261137664318V-1500.0H649.9016159176826Q883.1642376706004 -1500.0 1022.1335127316415 -1412.5Q1161.1027877926826 -1325.0 1161.1027877926826 -1130.0Q1161.1027877926826 -937.3338497802615 1029.6525314450264 -852.1235899291933Q898.2022750973701 -766.913330078125 649.9016159176826 -766.913330078125Z"/></g></symbol><symbol id="mb-marca-chica" viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" fill="url(#mb-oro)"/><g transform="translate(32.00 134.54) scale(0.04605)" fill="#0A0A0A"><path transform="translate(-41.82261137664318 0)" d="M758.4789959713817 20.0 202.47899597138166 -1500.0H427.3305050394235L871.4451308101416 -303.0183262452483L1293.0880266353488 -1500.0H1307.449428319931L774.2953990474343 20.0ZM209.4070480465889 -1500.0V-13.50836181640625H362.5693154782057V0.0H51.23429350554943V-13.50836181640625H195.31731384247541V-1486.4916381835938H41.82261137664318V-1500.0ZM1666.6079366207123 -1500.0V-1486.4916381835938H1526.5698991939425V-13.50836181640625H1666.6079366207123V0.0H1142.1444356441498V-13.50836181640625H1303.0044209957123V-1500.0Z"/><path transform="translate(1733.0 0)" d="M41.82261137664318 0.0V-13.50836181640625H658.1273583102939Q742.6359048336744 -13.50836181640625 812.9056191891432 -65.5633544921875Q883.1753335446119 -117.61834716796875 925.3182841427624 -209.30917358398438Q967.4612347409129 -301.0 967.4612347409129 -420.0Q967.4612347409129 -539.0 925.3182841427624 -614.8943113647401Q883.1753335446119 -690.7886227294803 813.0024919364822 -727.0661190673709Q742.8296503283525 -763.3436154052615 658.3439208712366 -763.3436154052615H424.2629925534129V-773.086669921875H690.316900328191Q835.2976479977369 -773.086669921875 955.7479043453932 -738.60498046875Q1076.1981606930494 -704.123291015625 1148.3182778805494 -625.6614990234375Q1220.4383950680494 -547.19970703125 1220.4383950680494 -414.3994140625Q1220.4383950680494 -191.4996337890625 1079.5066174084157 -95.74981689453125Q938.574839748782 0.0 690.4287915074511 0.0ZM221.23429350554943 -5.759901806712151V-1494.2400981932878H445.69779448211193V-5.759901806712151ZM424.2629925534129 -766.913330078125V-776.8900146484375H638.6624066159129Q713.2622601315379 -776.8900146484375 779.2187968380749 -810.5316772460938Q845.1753335446119 -844.17333984375 886.4350991696119 -917.4508361816406Q927.6948647946119 -990.7283325195312 927.6948647946119 -1109.7283325195312Q927.6948647946119 -1228.7283325195312 886.4350991696119 -1312.9191589355469Q845.1753335446119 -1397.1099853515625 779.1075748692954 -1441.8008117675781Q713.0398161939789 -1486.4916381835938 638.6624066159129 -1486.4916381835938H41.82261137664318V-1500.0H649.9016159176826Q883.1642376706004 -1500.0 1022.1335127316415 -1412.5Q1161.1027877926826 -1325.0 1161.1027877926826 -1130.0Q1161.1027877926826 -937.3338497802615 1029.6525314450264 -852.1235899291933Q898.2022750973701 -766.913330078125 649.9016159176826 -766.913330078125Z"/></g></symbol></svg>`;

export const HUMO = `<svg class="ilustracion-coctel" viewBox="44 -6 176 146" role="img" aria-label="Cóctel ahumándose con un soplete: la llama toca el borde del vaso, saltan chispas y sube el humo" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="vaso-dentro"><path d="M86 66L154 66L148 128Q147 132 143 132L97 132Q93 132 92 128Z"/></clipPath></defs>
        <path d="M58 134H182" stroke="#C9A961" stroke-width="1" opacity=".35" stroke-linecap="round"/>
        <g class="humo-grupo" fill="none" stroke="#F8F7F3" stroke-width="1" stroke-linecap="round">
          <path class="humo" data-s="1" d="M108 60q-6-7 0-14q6-7 0-14q-6-7 0-12"/>
          <path class="humo" data-s="2" d="M118 58q6-7 0-14q-6-7 0-14q6-7 0-14"/>
          <path class="humo" data-s="3" d="M127 60q-5-6 0-12q5-6 0-12q-5-6 0-10"/>
        </g>
        <path d="M86 66L154 66L148 128Q147 132 143 132L97 132Q93 132 92 128Z" fill="#1A1A1A" stroke="#C9A961" stroke-width="1.2" stroke-linejoin="round"/>
        <g clip-path="url(#vaso-dentro)">
          <g class="liquido"><path d="M80 86Q100 82 120 86T160 86V140H80Z" fill="#C9A961" fill-opacity=".16"/><path d="M80 86Q100 82 120 86T160 86" fill="none" stroke="#C9A961" stroke-width="1" opacity=".7"/></g>
          <g class="hielo"><rect x="103" y="77" width="30" height="28" rx="5" transform="rotate(-8 118 91)" fill="#F8F7F3" fill-opacity=".05" stroke="#F8F7F3" stroke-width="1" opacity=".85"/><path d="M109 84l6-1" stroke="#F8F7F3" stroke-width="1" stroke-linecap="round" opacity=".7"/></g>
        </g>
        <path d="M93 124H147" stroke="#C9A961" stroke-width="1" opacity=".45"/>
        <path d="M144 67q4-11 15-9q-7 3-8 11" fill="#C9A961" fill-opacity=".3" stroke="#C9A961" stroke-width="1.1" stroke-linejoin="round"/>
        <ellipse class="resplandor" cx="121" cy="67" rx="12" ry="3.2" fill="#D8BE80"/>
        <g fill="#F8F7F3">
          <circle class="chispa" data-s="4" cx="121" cy="65" r="1.1"/>
          <circle class="chispa" data-s="5" cx="121" cy="65" r=".9"/>
          <circle class="chispa" data-s="6" cx="121" cy="65" r="1"/>
          <circle class="chispa" data-s="7" cx="121" cy="65" r=".8" fill="#D8BE80"/>
        </g>
        <g transform="translate(152 46) rotate(-35)">
          <g class="llama">
            <path d="M0-5C-9-10-25-7-40 0C-25 6-9 9 0 5Z" fill="#C9A961" fill-opacity=".28" stroke="#C9A961" stroke-width="1" stroke-linejoin="round"/>
            <path class="llama-nucleo" d="M0-2.6C-6-4.4-15-3.2-23 0C-15 3.2-6 4.4 0 2.6Z" fill="#F8F7F3" opacity=".9"/>
          </g>
          <g fill="#1A1A1A" stroke="#C9A961" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
            <rect x="0" y="-3" width="16" height="6" rx="1.5"/>
            <rect x="16" y="-6.5" width="9" height="13" rx="2"/>
            <rect x="25" y="-11" width="44" height="22" rx="7"/><rect x="67" y="-13.5" width="9" height="27" rx="3"/>
            <path d="M36 11q1 9 9 9" fill="none"/>
            <circle cx="64" cy="-14" r="3"/>
            <path d="M33-4H62" fill="none" stroke-width="1" opacity=".5"/>
          </g>
        </g>
      </svg>`;

export const ANIMS = {
  colar: `<svg class="ilustracion-anim anim-colar" viewBox="0 0 200 150" role="img" aria-label="Coctelera inclinada colando un cóctel en una copa de martini escarchada que se va llenando" fill="none" stroke="#C9A961" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <defs><clipPath id="cp-colar"><path d="M104 70H176L140 108Z"/></clipPath></defs>
          <path d="M20 140H184" stroke-width="1" opacity=".35"/>
          <path d="M104 70H176L140 108Z" fill="#1A1A1A" stroke="none"/>
          <g clip-path="url(#cp-colar)"><g class="nivel"><rect x="96" y="76" width="88" height="40" fill="#C9A961" fill-opacity=".24" stroke="none"/><path d="M96 76H184" stroke-width="1" opacity=".7"/></g></g>
          <path class="chorro" d="M128 54Q133 64 139 82" stroke="#D8BE80" stroke-width="2"/>
          <path d="M104 70H176L140 108Z"/>
          <path d="M106 72.5h4m4 0h4m4 0h4m4 0h4m4 0h4m4 0h4m4 0h4m4 0h4m4 0h4" stroke="#F8F7F3" stroke-width="1.3" opacity=".55"/>
          <path d="M140 108V134M124 136Q140 131 156 136"/>
          <path d="M112 76L124 89" stroke="#F8F7F3" stroke-width="1" opacity=".3"/>
          <g class="agitador">
            <rect x="-7" y="-6" width="14" height="7" rx="2" fill="#1A1A1A"/>
            <path d="M-11 1H11L15 44Q15 49 10 49H-10Q-15 49-15 44Z" fill="#1A1A1A"/>
            <path d="M-12.5 15H12.5" stroke-width="1" opacity=".6"/>
            <path d="M-7 22L-5 40" stroke="#F8F7F3" stroke-width="1" opacity=".3"/>
          </g>
        </svg>`,
  espuma: `<svg class="ilustracion-anim anim-espuma" viewBox="0 0 200 150" role="img" aria-label="Coctelera agitándose con fuerza junto a un vaso con espuma blanca y una rama de romero" fill="none" stroke="#C9A961" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <defs><clipPath id="cp-espuma"><path d="M114 52H170L168 110Q166 128 142 128Q118 128 116 110Z"/></clipPath></defs>
          <path d="M16 140H184" stroke-width="1" opacity=".35"/>
          <g class="lineas-mov" stroke-width="1"><path d="M26 56l-8-3M24 70h-9M26 84l-8 3M82 56l8-3M84 70h9M82 84l8 3"/></g>
          <g class="coctelera">
            <rect x="46" y="22" width="16" height="9" rx="3" fill="#1A1A1A"/>
            <path d="M42 31H66L63 42H45Z" fill="#1A1A1A"/>
            <path d="M40 42H68L72 104Q72 110 66 110H42Q36 110 36 104Z" fill="#1A1A1A"/>
            <path d="M38.5 58H69.5" stroke-width="1" opacity=".6"/>
            <path d="M45 64L47 98" stroke="#F8F7F3" stroke-width="1" opacity=".3"/>
          </g>
          <path d="M114 52H170L168 110Q166 128 142 128Q118 128 116 110Z" fill="#1A1A1A" stroke="none"/>
          <g clip-path="url(#cp-espuma)">
            <rect x="100" y="84" width="80" height="50" fill="#C9A961" fill-opacity=".24" stroke="none"/>
            <rect x="100" y="58" width="80" height="26" fill="#F8F7F3" fill-opacity=".38" stroke="none"/>
            <path d="M112 84q4-2.5 8 0t8 0 8 0 8 0 8 0 8 0 8 0 8 0" stroke="#F8F7F3" stroke-width="1" opacity=".55"/>
          </g>
          <path d="M114 52H170L168 110Q166 128 142 128Q118 128 116 110Z"/>
          <path d="M121 62Q120 96 126 114" stroke="#F8F7F3" stroke-width="1" opacity=".3"/>
          <g fill="none" stroke="#F8F7F3" stroke-width=".8">
            <circle class="burbuja" data-s="1" cx="128" cy="64" r="1.4"/>
            <circle class="burbuja" data-s="8" cx="140" cy="62" r="1"/>
            <circle class="burbuja" data-s="9" cx="152" cy="65" r="1.3"/>
            <circle class="burbuja" data-s="10" cx="161" cy="61" r=".9"/>
          </g>
          <g class="romero">
            <path d="M156 24Q153 42 146 62" stroke="#B5BE8E" stroke-width="1.2"/>
            <path d="M155.6 30l-6-3M155.4 32l6-3M154.4 38l-6-2M154 40l6-3M152.4 46l-6-1M151.8 48l6-2M150 54l-5 0M149.3 56l5-1.5" stroke="#B5BE8E" stroke-width="1.6"/>
          </g>
        </svg>`,
  tiki: `<svg class="ilustracion-anim anim-tiki" viewBox="0 0 200 150" role="img" aria-label="Varilla swizzle girando dentro de una taza tiki con hielo picado mientras el vaso escarcha" fill="none" stroke="#C9A961" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 140H184" stroke-width="1" opacity=".35"/>
          <path d="M100 10V58" stroke-width="1.6"/>
          <g class="giro-estrella"><path d="M91 14H109M93.5 8.5L106.5 19.5M93.5 19.5L106.5 8.5" stroke-width="1.3"/></g>
          <ellipse class="orbita" cx="100" cy="32" rx="16" ry="4" stroke="#F8F7F3" stroke-width=".9" stroke-dasharray="6 10" opacity=".6"/>
          <path d="M76 46H124L128 126Q128 132 122 132H78Q72 132 72 126Z" fill="#1A1A1A"/>
          <path d="M76 46q3-7 8-3q3-7 9-2q4-6 8-1q5-6 9 0q4-5 7 1q4-3 7 5" stroke="#F8F7F3" stroke-width="1" fill="#F8F7F3" fill-opacity=".06"/>
          <path d="M84 62h10M106 62h10" stroke-width="1.6"/>
          <rect x="84" y="66" width="10" height="8" rx="1"/><rect x="106" y="66" width="10" height="8" rx="1"/>
          <path d="M100 70v14M96 84h8"/>
          <rect x="84" y="92" width="32" height="16" rx="2"/>
          <path d="M92 92v16M100 92v16M108 92v16" stroke-width="1"/>
          <path d="M74 118H126" stroke-width="1" opacity=".5"/>
          <g fill="#F8F7F3" stroke="none">
            <circle class="escarcha" data-s="1" cx="80" cy="56" r="1"/>
            <circle class="escarcha" data-s="11" cx="120" cy="58" r="1"/>
            <circle class="escarcha" data-s="12" cx="78" cy="100" r="1"/>
            <circle class="escarcha" data-s="2" cx="122" cy="104" r="1"/>
            <circle class="escarcha" data-s="13" cx="80" cy="122" r="1"/>
            <circle class="escarcha" data-s="14" cx="121" cy="86" r="1"/>
          </g>
          <path d="M124 42L138 22" stroke-width="1"/>
          <path d="M126 23Q137 7 152 18Z" fill="#C9A961" fill-opacity=".25"/>
          <path d="M84 44q-4-10 2-16q2 8-2 16M88 43q2-9 9-12q-2 8-9 12" stroke="#B5BE8E" stroke-width="1.1" fill="#B5BE8E" fill-opacity=".15"/>
        </svg>`,
  canela: `<svg class="ilustracion-anim anim-canela" viewBox="0 0 200 150" role="img" aria-label="Rama de canela rallándose sobre un vaso alto con espuma; el polvo cae sobre la espuma" fill="none" stroke="#C9A961" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <defs><clipPath id="cp-canela"><path d="M72 76H128L124 134Q124 138 120 138H80Q76 138 76 134Z"/></clipPath></defs>
          <path d="M16 140H184" stroke-width="1" opacity=".35"/>
          <path d="M72 76H128L124 134Q124 138 120 138H80Q76 138 76 134Z" fill="#1A1A1A" stroke="none"/>
          <g clip-path="url(#cp-canela)">
            <rect x="60" y="92" width="80" height="50" fill="#C9A961" fill-opacity=".22" stroke="none"/>
            <rect x="60" y="80" width="80" height="12" fill="#F8F7F3" fill-opacity=".38" stroke="none"/>
            <path d="M70 92q4-2 8 0t8 0 8 0 8 0 8 0 8 0 8 0" stroke="#F8F7F3" stroke-width="1" opacity=".5"/>
            <path d="M84 100l6 6l-6 6M108 104l6 5l-6 5M94 118l6 5" stroke="#F8F7F3" stroke-width=".8" opacity=".35"/>
          </g>
          <path d="M72 76H128L124 134Q124 138 120 138H80Q76 138 76 134Z"/>
          <path d="M80 86Q80 112 84 128" stroke="#F8F7F3" stroke-width="1" opacity=".3"/>
          <g fill="#B07A45" stroke="none"><circle cx="90" cy="82.5" r=".9"/><circle cx="96" cy="81.5" r="1"/><circle cx="102" cy="83" r=".9"/><circle cx="108" cy="82" r="1"/><circle cx="99" cy="84" r=".8"/></g>
          <g transform="translate(146 124)">
            <circle r="12" fill="#0A0A0A"/><circle r="9.3" fill="#C9A961" fill-opacity=".25" stroke="none"/><circle r="12"/>
            <path d="M-9.3 0H9.3M0-9.3V9.3M-6.6-6.6L6.6 6.6M-6.6 6.6L6.6-6.6" stroke-width=".8"/>
          </g>
          <g fill="#C08A50" stroke="none">
            <circle class="polvo" data-s="1" cx="92" cy="46" r="1"/>
            <circle class="polvo" data-s="15" cx="99" cy="45" r=".9"/>
            <circle class="polvo" data-s="8" cx="105" cy="44" r="1.1"/>
            <circle class="polvo" data-s="16" cx="96" cy="46" r=".8"/>
          </g>
          <g transform="translate(100 38) rotate(-8)">
            <rect x="-50" y="-5" width="76" height="10" rx="2" fill="#1A1A1A"/>
            <path d="M-44-1.5h4M-36 1.5h4M-28-1.5h4M-20 1.5h4M-12-1.5h4M-4 1.5h4M4-1.5h4M12 1.5h4M20-1.5h3" stroke-width=".8" opacity=".7"/>
            <rect x="26" y="-4" width="30" height="8" rx="4" fill="#1A1A1A"/>
            <g class="canela">
              <rect x="-28" y="-14" width="34" height="8" rx="4" fill="#3D2817"/>
              <path d="M-24-10h26" stroke-width=".8" opacity=".6"/>
              <path d="M-26-12.5q2 2.5 0 5" stroke-width=".8"/>
            </g>
          </g>
        </svg>`,
};

// Iconos de cóctel de la carta: oliva (martini), cereza (manhattan) y lima (daiquiri).
export const ICONOS = {
  martini: `<svg class="coctel-icono" viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="#C9A961" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <defs><clipPath id="cp-martini"><path d="M16 30H104L60 78Z"/></clipPath></defs>
          <g clip-path="url(#cp-martini)"><g class="liquido"><rect y="40" width="120" height="50" fill="#C9A961" fill-opacity=".14" stroke="none"/><path d="M0 40H120" stroke-width="1" opacity=".7"/></g></g>
          <path d="M16 30H104L60 78Z"/>
          <path d="M60 78V103M42 105Q60 100 78 105"/>
          <path d="M25 35L40 52" stroke="#F8F7F3" stroke-width="1" opacity=".3"/>
          <g class="adorno adorno-oliva">
            <path d="M90 12L50 60" stroke-width="1.2"/>
            <ellipse cx="66" cy="41" rx="7.5" ry="5.6" transform="rotate(-48 66 41)" fill="#0A0A0A"/>
            <circle cx="68.6" cy="38.4" r="1.7" fill="#C9A961" stroke="none"/>
          </g>
        </svg>`,
  manhattan: `<svg class="coctel-icono" viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="#C9A961" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <defs><clipPath id="cp-manhattan"><path d="M18 36H102C102 62 84 78 60 78C36 78 18 62 18 36Z"/></clipPath></defs>
          <g clip-path="url(#cp-manhattan)"><g class="liquido"><rect y="44" width="120" height="40" fill="#C9A961" fill-opacity=".14" stroke="none"/><path d="M0 44H120" stroke-width="1" opacity=".7"/></g></g>
          <g class="adorno adorno-cereza">
            <path d="M58 53C60 42 68 32 80 26" stroke-width="1.2"/>
            <circle cx="56" cy="59" r="6.5" fill="#C9A961" fill-opacity=".35"/>
            <path d="M52.5 57Q54 54.5 57 54" stroke-width="1" opacity=".8"/>
          </g>
          <path d="M18 36H102C102 62 84 78 60 78C36 78 18 62 18 36Z"/>
          <path d="M60 78V103M42 105Q60 100 78 105"/>
          <path d="M26 44Q29 60 41 68" stroke="#F8F7F3" stroke-width="1" opacity=".3"/>
        </svg>`,
  daiquiri: `<svg class="coctel-icono" viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="#C9A961" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <defs><clipPath id="cp-daiquiri"><path d="M26 38H94C94 62 79 76 60 76C41 76 26 62 26 38Z"/></clipPath></defs>
          <g clip-path="url(#cp-daiquiri)"><g class="liquido"><rect y="45" width="120" height="40" fill="#C9A961" fill-opacity=".14" stroke="none"/><path d="M0 45H120" stroke-width="1" opacity=".7"/><path d="M29 48.5H91" stroke="#F8F7F3" stroke-width="1.3" stroke-dasharray=".5 3.5" opacity=".5"/></g></g>
          <path d="M26 38H94C94 62 79 76 60 76C41 76 26 62 26 38Z"/>
          <path d="M60 76V103M42 105Q60 100 78 105"/>
          <path d="M33 46Q36 60 46 66" stroke="#F8F7F3" stroke-width="1" opacity=".3"/>
          <g transform="translate(91 34)">
            <g class="adorno adorno-lima">
              <circle r="14" fill="#0A0A0A"/>
              <circle r="10.8" fill="#C9A961" fill-opacity=".12" stroke="none"/>
              <circle r="14"/><circle r="10.8" stroke-width="1"/>
              <path d="M-10.8 0H10.8M0-10.8V10.8M-7.6-7.6L7.6 7.6M-7.6 7.6L7.6-7.6" stroke-width="1"/>
            </g>
          </g>
        </svg>`,
};

export const SELLO = `<svg class="sello-giro" viewBox="0 0 200 200" aria-hidden="true">
          <defs><path id="circulo-texto" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"/></defs>
          <g class="sello-anillo"><text font-family="Geist Mono, ui-monospace, monospace" font-size="11.5" fill="#F2EDE4" fill-opacity=".72"><textPath href="#circulo-texto" textLength="486" lengthAdjust="spacing">MEMPHIS BELLE · COCTELERÍA · SANTA CRUZ DE TENERIFE ·</textPath></text></g>
          <use href="#mb-marca-chica" x="64" y="64" width="72" height="72"/>
        </svg>`;
export const MARCA = '<svg class="marca-icono" aria-hidden="true"><use href="#mb-marca-chica"/></svg>';
