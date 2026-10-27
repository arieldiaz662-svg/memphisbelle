#!/usr/bin/env python3
"""Genera el logotipo de Memphis Belle (SVG con el texto convertido a trazados, sin depender de fuentes).

Emblema: dos cucharas de bar cruzadas, la coctelera arriba y una copa abajo, como el cartel de la puerta del local.
Variantes: horizontal y vertical, sobre fondo oscuro (marfil + amarillo) y sobre fondo claro (tinta + ocre), y el emblema solo.
Uso: python3 scripts/logo.py      Salida: public/img/logo/*.svg y *.png (los PNG con Playwright).
"""
import math, os, subprocess, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FUENTES = os.path.join(RAIZ, 'public', 'fonts')
SALIDA = os.path.join(RAIZ, 'public', 'img', 'logo')
os.makedirs(SALIDA, exist_ok=True)

def fuente(nombre):
    return TTFont(os.path.join(FUENTES, nombre))

def texto_a_trazado(font, texto, tam, x=0, y=0, tracking=0.0):
    """Devuelve (d, ancho) del texto como trazado SVG con la línea base en y."""
    cmap = font.getBestCmap(); glyphs = font.getGlyphSet(); upm = font['head'].unitsPerEm
    esc = tam / upm; cursor = 0.0; partes = []
    hmtx = font['hmtx']
    kern = None
    for i, ch in enumerate(texto):
        g = cmap.get(ord(ch))
        if g is None:
            continue
        pen = SVGPathPen(glyphs)
        glyphs[g].draw(TransformPen(pen, (esc, 0, 0, -esc, x + cursor, y)))
        partes.append(pen.getCommands())
        cursor += hmtx[g][0] * esc + tracking * tam
    return ' '.join(p for p in partes if p), cursor - tracking * tam

def emblema(color, acento, sw=4.6):
    a = math.degrees(math.atan2(128, 96))
    return f'''<g fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M60 44 L148 160"/><path d="M140 44 L52 160"/>
    <ellipse cx="52" cy="33" rx="10.5" ry="6" transform="rotate({a:.1f} 52 33)"/>
    <ellipse cx="148" cy="33" rx="10.5" ry="6" transform="rotate({-a:.1f} 148 33)"/>
    <circle cx="150" cy="163" r="3.4" fill="{color}" stroke="none"/><circle cx="50" cy="163" r="3.4" fill="{color}" stroke="none"/>
    <path d="M94 24 L106 24 L108 33 L92 33 Z"/><path d="M89 36 L111 36 L108.5 74 L91.5 74 Z"/><path d="M90 52 H110"/>
    <path d="M83 138 H117 L100 159 Z"/><path d="M100 159 V176"/><path d="M89 178 H111"/>
  </g>
  <g stroke="{acento}" stroke-width="2.4" stroke-linecap="round"><path d="M104 130 L97 146" fill="none"/></g>
  <circle cx="106.5" cy="127" r="3.6" fill="{acento}"/>'''

serif = fuente('instrument-serif.woff2'); cursiva = fuente('instrument-serif-italic.woff2'); poppins = fuente('poppins-500.woff2')

def lockup(vertical, fondo, claro, acento, tinta, nombre):
    memphis_d, memphis_w = texto_a_trazado(serif, 'Memphis ', 100, tracking=-0.012)
    belle_d, belle_w = texto_a_trazado(cursiva, 'Belle', 100, tracking=-0.012)
    total = memphis_w + belle_w
    coct_d, coct_w = texto_a_trazado(poppins, 'COCTELERÍA', 21, tracking=0.46)
    def palabra(x, y, k):
        m = texto_a_trazado(serif, 'Memphis ', 100 * k, x, y, -0.012)[0]
        b = texto_a_trazado(cursiva, 'Belle', 100 * k, x + memphis_w * k, y, -0.012)[0]
        return f'<path fill="{tinta}" d="{m}"/><path fill="{acento}" d="{b}"/>'
    emb = lambda s, x, y: f'<g transform="translate({x} {y}) scale({s})">{emblema(tinta, acento)}</g>'
    fondo_rect = lambda w, h: f'<rect width="{w}" height="{h}" fill="{fondo}"/>' if fondo else ''
    if vertical:
        w, h = 640, 520
        s = 1.5; ex = (w - 200 * s) / 2
        k = 1.0; px = (w - total * k) / 2
        cx = (w - coct_w) / 2
        coct = texto_a_trazado(poppins, 'COCTELERÍA', 21, cx, 486, 0.46)[0]
        cuerpo = f'{emb(s, ex, 10)}{palabra(px, 400, k)}<path fill="{tinta}" opacity=".85" d="{coct}"/>'
    else:
        w, h = 940, 232
        s = 0.9; k = 1.0
        px = 200 * s + 34
        coct = texto_a_trazado(poppins, 'COCTELERÍA', 21, px + 6, 188, 0.46)[0]
        cuerpo = f'{emb(s, 10, 20)}{palabra(px, 130, k)}<path fill="{tinta}" opacity=".85" d="{coct}"/>'
        w = int(px + total + 40)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="Memphis Belle Coctelería">{fondo_rect(w, h)}{cuerpo}</svg>\n'
    open(os.path.join(SALIDA, nombre), 'w').write(svg)
    return w, h

OSC = dict(tinta='#F2EDE4', acento='#E8BE45')
CLA = dict(tinta='#2A1412', acento='#8F6208')
for vertical, base in ((True, 'vertical'), (False, 'horizontal')):
    lockup(vertical, None, False, nombre=f'logo-{base}-claro.svg', **OSC)   # texto claro, para fondos oscuros
    lockup(vertical, None, True, nombre=f'logo-{base}-oscuro.svg', **CLA)   # texto oscuro, para fondos claros
for nombre, col in (('emblema-claro.svg', OSC), ('emblema-oscuro.svg', CLA)):
    open(os.path.join(SALIDA, nombre), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Memphis Belle">{emblema(col["tinta"], col["acento"])}</svg>\n')

def neon(vertical):
    """Versión de neón: tubos cálidos con halo (filtro de desenfoque), para fondos oscuros o pared de ladrillo."""
    w, h = (640, 470) if vertical else (1000, 260)
    memphis_d, memphis_w = texto_a_trazado(serif, 'Memphis ', 100, tracking=-0.012)
    belle_d, belle_w = texto_a_trazado(cursiva, 'Belle', 100, tracking=-0.012)
    total = memphis_w + belle_w
    def palabra(x, y, k=1.0):
        m = texto_a_trazado(serif, 'Memphis ', 100 * k, x, y, -0.012)[0]
        b = texto_a_trazado(cursiva, 'Belle', 100 * k, x + memphis_w * k, y, -0.012)[0]
        return m, b
    defs = '<defs><filter id="halo" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="a"/><feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="a"/><feMergeNode in="a"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
    emb_body = emblema('#FFF3CF', '#FFB347', 4.2)
    if vertical:
        s_ = 1.4; ex = (w - 200 * s_) / 2
        m, b = palabra((w - total) / 2, 408)
        cuerpo = f'<g filter="url(#halo)"><g transform="translate({ex} 6) scale({s_})">{emb_body}</g><path fill="#FFF3CF" d="{m}"/><path fill="#FFD25E" d="{b}"/></g>'
    else:
        s_ = 1.0; px = 200 * s_ + 40
        m, b = palabra(px, 150)
        cuerpo = f'<g filter="url(#halo)"><g transform="translate(10 25) scale({s_})">{emb_body}</g><path fill="#FFF3CF" d="{m}"/><path fill="#FFD25E" d="{b}"/></g>'
        w = int(px + total + 40)
    open(os.path.join(SALIDA, f"logo-neon-{'vertical' if vertical else 'horizontal'}.svg"), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="Memphis Belle Coctelería">{defs}{cuerpo}</svg>\n')
neon(True); neon(False)
print('Logotipos SVG en', SALIDA)

# PNG con Playwright (fondo transparente)
js = r'''
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => { const b = await chromium.launch(); const dir = process.argv[2];
 for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.svg'))) {
  const svg = fs.readFileSync(path.join(dir, f), 'utf8'); const [, w, h] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
  await p.setContent(`<body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${w}" height="${h}" `)}</body>`);
  await p.screenshot({ path: path.join(dir, f.replace('.svg', '.png')), omitBackground: true }); await p.close(); }
 await b.close(); })();
'''
open(os.path.join(os.environ.get('TMPDIR', '/tmp'), 'logo-png.cjs'), 'w').write(js)
env = dict(os.environ, NODE_PATH=subprocess.check_output(['npm', 'root', '-g']).decode().strip())
subprocess.run(['node', os.path.join(os.environ.get('TMPDIR', '/tmp'), 'logo-png.cjs'), SALIDA], check=True, env=env)
print('PNG generados')
