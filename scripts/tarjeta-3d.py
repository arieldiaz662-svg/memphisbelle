#!/usr/bin/env python3
"""Tarjeta de reseña Memphis Belle lista para impresora 3D (multicolor).

Genera en tarjetas/3d/ (para cada idioma, es y en):
  tarjeta-resena-<id>.3mf         las tres piezas (base, marfil, amarillo) en su sitio: se abre en Bambu Studio,
                                  OrcaSlicer, PrusaSlicer o Cura y se asigna un filamento a cada pieza
  <id>-1-base-negro.stl           base lisa de 80 x 125 mm con esquinas redondeadas
  <id>-2-relieve-marfil.stl       texto en relieve (marca, titular, mensaje del NFC)
  <id>-3-relieve-amarillo.stl     estrellas, "Belle", "Google", icono NFC y filete
  <id>-capa-*.svg                 el dibujo de cada pieza en 2D, a escala 1:1 (mm)
  tarjeta-resena-3d.pdf           hoja a escala 1:1 con la vista previa, cada capa y los ajustes de impresión

Uso:  pip install fonttools brotli shapely trimesh mapbox-earcut uharfbuzz svgpathtools lxml networkx numpy
      python3 scripts/tarjeta-3d.py            (necesita Playwright con Chromium para el PDF, como og-image)

Diseño pensado para imprimir: base de 2,0 mm y relieve de 0,8 mm (se imprime todo de una vez cambiando de
filamento en la capa 2,0 mm, o con una impresora multicolor). Los trazos finos de las letras se engrosan hasta
un mínimo de 0,6 mm (una pasada y media de una boquilla de 0,4) para que se impriman bien. Sin QR: el NFC va incrustado.
"""
import io
import json
import math
import subprocess
import sys
from functools import reduce
from pathlib import Path

import numpy as np
import trimesh
import uharfbuzz as hb
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont
from shapely import affinity
from shapely.geometry import LineString, Point, Polygon, box
from shapely.ops import unary_union
from svgpathtools import parse_path

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "tarjetas" / "3d"
FUENTES = RAIZ / "public" / "fonts"

# --- Medidas (mm) ---
ANCHO, ALTO, RADIO = 80.0, 125.0, 6.0
BASE_Z = 2.0          # grosor de la base
RELIEVE = 0.8         # altura del texto y los dibujos
MIN_TRAZO = 0.6       # trazo mínimo que se busca (una pasada y media de boquilla de 0,4)
COLORES = {"base": "#0B0A09", "marfil": "#F2EDE4", "amarillo": "#E8BE45"}

TEXTOS = {
    "es": {"linea1": "Déjanos tu reseña", "en": "en ", "google": "Google", "nfc": ["Acerca tu", "móvil"]},
    "en": {"linea1": "Leave us a", "en": "review on ", "google": "Google", "nfc": ["Tap your", "phone"]},
}


# ---------- Texto: contornos de la fuente -> polígonos ----------
class PenPoligonos(BasePen):
    """Aplana los contornos de un glifo en polilíneas."""

    def __init__(self, glyphset, escala, dx, dy):
        super().__init__(glyphset)
        self.k, self.dx, self.dy = escala, dx, dy
        self.contornos, self.actual = [], []

    def _p(self, pt):
        return (self.dx + pt[0] * self.k, self.dy + pt[1] * self.k)

    def _moveTo(self, pt):
        self.actual = [self._p(pt)]

    def _lineTo(self, pt):
        self.actual.append(self._p(pt))

    def _curveToOne(self, p1, p2, p3):
        p0 = self._ultimo
        for i in range(1, 13):
            t = i / 12
            x = (1 - t) ** 3 * p0[0] + 3 * (1 - t) ** 2 * t * p1[0] + 3 * (1 - t) * t ** 2 * p2[0] + t ** 3 * p3[0]
            y = (1 - t) ** 3 * p0[1] + 3 * (1 - t) ** 2 * t * p1[1] + 3 * (1 - t) * t ** 2 * p2[1] + t ** 3 * p3[1]
            self.actual.append(self._p((x, y)))

    def _qCurveToOne(self, p1, p2):
        p0 = self._ultimo
        for i in range(1, 13):
            t = i / 12
            x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
            y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
            self.actual.append(self._p((x, y)))

    @property
    def _ultimo(self):
        return self._getCurrentPoint()

    def _closePath(self):
        if len(self.actual) > 2:
            self.contornos.append(self.actual)
        self.actual = []

    _endPath = _closePath


class Fuente:
    def __init__(self, archivo):
        self.tt = TTFont(str(archivo))
        self.upem = self.tt["head"].unitsPerEm
        self.glyphset = self.tt.getGlyphSet()
        self.orden = self.tt.getGlyphOrder()
        datos = io.BytesIO()
        copia = TTFont(str(archivo))
        copia.flavor = None
        copia.save(datos)
        self.hb_font = hb.Font(hb.Face(hb.Blob(datos.getvalue())))

    def texto(self, cadena, tam):
        """Polígono del texto con la línea base en y = 0, empezando en x = 0, y su ancho."""
        buf = hb.Buffer()
        buf.add_str(cadena)
        buf.guess_segment_properties()
        hb.shape(self.hb_font, buf, {"kern": True, "liga": True})
        k = tam / self.upem
        x, piezas = 0.0, []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            nombre = self.orden[info.codepoint]
            pen = PenPoligonos(self.glyphset, k, x + pos.x_offset * k, pos.y_offset * k)
            self.glyphset[nombre].draw(pen)
            polis = [Polygon(c).buffer(0) for c in pen.contornos if len(c) > 2]
            if polis:
                piezas.append(reduce(lambda a, b: a.symmetric_difference(b), polis))
            x += pos.x_advance * k
        return (unary_union(piezas) if piezas else Polygon()), x


# ---------- Dibujos ----------
def estrella(cx, cy, r):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.41
        a = -math.pi / 2 + i * math.pi / 5
        pts.append((cx + rr * math.cos(a), cy - rr * math.sin(a) * -1))
    return Polygon(pts)


def icono_nfc(cx, cy, tam):
    """Un punto y tres ondas (como el símbolo NFC), centrado en (cx, cy)."""
    k = tam / 60.0
    px, py = 9 * k, 30 * k
    piezas = [Point(px, py).buffer(4.2 * k, 24)]
    a = math.radians(38)
    for r in (12, 22, 32):
        pts = [(px + r * k * math.cos(t), py + r * k * math.sin(t)) for t in np.linspace(-a, a, 40)]
        piezas.append(LineString(pts).buffer(2.1 * k, cap_style="round", quad_segs=12))
    g = unary_union(piezas)
    minx, miny, maxx, maxy = g.bounds
    return affinity.translate(g, cx - (minx + maxx) / 2, cy - (miny + maxy) / 2)


def logo_belle():
    """El 'Belle' del logotipo (public/img/logo-belle.svg) como polígono, en unidades del SVG, con y hacia abajo."""
    svg = (RAIZ / "public" / "img" / "logo-belle.svg").read_text()
    d = svg.split(' d="', 1)[1].split('"', 1)[0]
    contornos = []
    for sub in parse_path(d).continuous_subpaths():
        pts = []
        for seg in sub:
            for t in np.linspace(0, 1, 16, endpoint=False):
                p = seg.point(t)
                pts.append((p.real, p.imag))
        if len(pts) > 2:
            contornos.append(Polygon(pts).buffer(0))
    return reduce(lambda a, b: a.symmetric_difference(b), contornos)


def colocar(geom, ancho_obj=None, alto_obj=None, cx=None, y_base=None, cy=None, giro=0, voltear=False):
    """Escala (si se pide), gira y coloca una forma. Coordenadas del diseño: y hacia abajo en mm."""
    minx, miny, maxx, maxy = geom.bounds
    if ancho_obj or alto_obj:
        k = (ancho_obj / (maxx - minx)) if ancho_obj else (alto_obj / (maxy - miny))
        geom = affinity.scale(geom, k, k, origin=(0, 0))
        minx, miny, maxx, maxy = geom.bounds
    if giro:
        geom = affinity.rotate(geom, giro, origin=((minx + maxx) / 2, (miny + maxy) / 2))
        minx, miny, maxx, maxy = geom.bounds
    dx = (cx - (minx + maxx) / 2) if cx is not None else 0
    if y_base is not None:
        dy = y_base - maxy
    elif cy is not None:
        dy = cy - (miny + maxy) / 2
    else:
        dy = 0
    return affinity.translate(geom, dx, dy)


def texto_y_abajo(fuente, cadena, tam):
    """Texto con la línea base en y = 0 y hacia abajo (convención del diseño): se voltea el eje y."""
    g, ancho = fuente.texto(cadena, tam)
    return affinity.scale(g, 1, -1, origin=(0, 0)), ancho


def engrosar(geom, minimo=MIN_TRAZO):
    """Ensancha el trazo hasta que casi nada baje de `minimo` mm; devuelve la forma y los mm que añadió."""
    g, d = geom, 0.0
    for paso in (0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4):
        # Un trazo más fino que `minimo` desaparece al abrir (erosionar y dilatar) la forma.
        perdida = g.area - g.buffer(-minimo / 2).buffer(minimo / 2).area
        if perdida < 0.03 * g.area:
            break
        d = paso
        g = geom.buffer(d, join_style="round", quad_segs=6)
    return g, d


# ---------- Diseño de una cara ----------
def disenar(idioma, fuentes):
    t = TEXTOS[idioma]
    serif, cursiva = fuentes
    cx = ANCHO / 2
    marfil, amarillo, aviso = [], [], []

    def E(g):
        g2, d = engrosar(g)
        aviso.append(d)
        return g2

    # Marca: "Memphis" (marfil) + "Belle" (amarillo, inclinado), centrados juntos.
    mem, w_mem = texto_y_abajo(serif, "Memphis", 9.6)
    mem = E(mem)
    belle = colocar(logo_belle(), alto_obj=13.5, giro=0)
    belle = E(belle)
    belle = affinity.rotate(belle, -4, origin="center")  # inclinado hacia arriba, como en el logotipo
    bx0, by0, bx1, by1 = belle.bounds
    gap = 2.2
    total = w_mem + gap + (bx1 - bx0)
    x0 = cx - total / 2
    y_marca = 21.0
    marfil.append(affinity.translate(mem, x0, y_marca))
    amarillo.append(affinity.translate(belle, x0 + w_mem + gap - bx0, y_marca + 1.6 - by1))

    # Estrellas
    for i in range(5):
        amarillo.append(estrella(cx + (i - 2) * 13.2, 36.0, 5.6))

    # Titular: línea 1 en marfil; línea 2 "en " en marfil y "Google" en cursiva amarilla.
    tam = 11.4
    l1, w1 = texto_y_abajo(serif, t["linea1"], tam)
    l1 = E(l1)
    marfil.append(affinity.translate(l1, cx - w1 / 2, 61.0))
    pre, wp = texto_y_abajo(serif, t["en"], tam)
    pre = E(pre)
    goo, wg = texto_y_abajo(cursiva, t["google"], tam)
    goo = E(goo)
    x2 = cx - (wp + wg) / 2
    marfil.append(affinity.translate(pre, x2, 74.5))
    amarillo.append(affinity.translate(goo, x2 + wp, 74.5))

    # Mensaje del NFC (texto a la izquierda) e icono (a la derecha)
    for i, linea in enumerate(t["nfc"]):
        g, _ = texto_y_abajo(serif, linea, 7.4)
        g = E(g)
        marfil.append(affinity.translate(g, 10.0, 98.0 + i * 9.0))
    amarillo.append(icono_nfc(57.5, 100.0, 26.0))

    # Filete interior (a 3 mm del borde, 1 mm de ancho)
    exterior = box(3, 3, ANCHO - 3, ALTO - 3).buffer(0)
    anillo = Polygon(rounded(3.0, 3.0, ANCHO - 3, ALTO - 3, RADIO - 2.5)).difference(
        Polygon(rounded(4.0, 4.0, ANCHO - 4, ALTO - 4, RADIO - 3.5)))
    amarillo.append(anillo)

    return unary_union(marfil), unary_union(amarillo), max(aviso)


def rounded(x0, y0, x1, y1, r, n=24):
    r = max(r, 0.01)
    pts = []
    for cx, cy, a0 in ((x1 - r, y0 + r, -90), (x1 - r, y1 - r, 0), (x0 + r, y1 - r, 90), (x0 + r, y0 + r, 180)):
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


# ---------- Mallas ----------
def mallas(geom, z0, altura):
    """Extruye un (multi)polígono (y hacia abajo) a una malla con y hacia arriba, de z0 a z0 + altura."""
    polis = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    partes = []
    for p in polis:
        if p.is_empty or p.area < 0.01:
            continue
        p = affinity.scale(p, 1, -1, origin=(0, 0))      # el diseño va hacia abajo; el modelo, hacia arriba
        p = affinity.translate(p, 0, ALTO)
        m = trimesh.creation.extrude_polygon(p, altura)
        m.apply_translation([0, 0, z0])
        partes.append(m)
    return trimesh.util.concatenate(partes)


def a_svg(geom, color, fondo=None):
    polis = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    d = []
    for p in polis:
        for anillo in [p.exterior, *p.interiors]:
            c = list(anillo.coords)
            d.append("M" + " L".join(f"{x:.3f} {y:.3f}" for x, y in c) + "Z")
    base = f'<rect width="{ANCHO}" height="{ALTO}" rx="{RADIO}" fill="{fondo}"/>' if fondo else ""
    return f'{base}<path d="{" ".join(d)}" fill="{color}" fill-rule="evenodd"/>'


def svg_pagina(contenido, borde=True):
    marco = f'<rect width="{ANCHO}" height="{ALTO}" rx="{RADIO}" fill="none" stroke="#888" stroke-width=".2" stroke-dasharray="1 1"/>' if borde else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{ANCHO}mm" height="{ALTO}mm" viewBox="0 0 {ANCHO} {ALTO}">'
            f'{contenido}{marco}</svg>')


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    fuentes = (Fuente(FUENTES / "instrument-serif.woff2"), Fuente(FUENTES / "instrument-serif-italic.woff2"))
    placa = Polygon(rounded(0, 0, ANCHO, ALTO, RADIO))
    info = {}
    for idioma in TEXTOS:
        marfil, amarillo, engrosado = disenar(idioma, fuentes)
        # Dentro de la placa y sin solaparse: lo amarillo manda donde se tocan.
        marfil = marfil.intersection(placa).difference(amarillo)
        amarillo = amarillo.intersection(placa)
        m_base = mallas(placa, 0, BASE_Z)
        m_marfil = mallas(marfil, BASE_Z - 0.02, RELIEVE + 0.02)
        m_amarillo = mallas(amarillo, BASE_Z - 0.02, RELIEVE + 0.02)
        for nombre, m in (("1-base-negro", m_base), ("2-relieve-marfil", m_marfil), ("3-relieve-amarillo", m_amarillo)):
            m.export(SALIDA / f"{idioma}-{nombre}.stl")
        escena = trimesh.Scene()
        escena.add_geometry(m_base, node_name="1 base negro", geom_name="base")
        escena.add_geometry(m_marfil, node_name="2 relieve marfil", geom_name="marfil")
        escena.add_geometry(m_amarillo, node_name="3 relieve amarillo", geom_name="amarillo")
        escena.export(SALIDA / f"tarjeta-resena-{idioma}.3mf")
        (SALIDA / f"{idioma}-capa-1-base-negro.svg").write_text(svg_pagina(a_svg(placa, COLORES["base"])))
        (SALIDA / f"{idioma}-capa-2-marfil.svg").write_text(svg_pagina(a_svg(marfil, "#000")))
        (SALIDA / f"{idioma}-capa-3-amarillo.svg").write_text(svg_pagina(a_svg(amarillo, "#000")))
        info[idioma] = {
            "caja": [round(float(x), 2) for x in np.ptp(trimesh.util.concatenate([m_base, m_marfil, m_amarillo]).vertices, axis=0)],
            "estancos": bool(m_base.is_watertight and m_marfil.is_watertight and m_amarillo.is_watertight),
            "engrosado_mm": round(engrosado, 2),
            "volumen_mm3": {k: round(float(m.volume), 1) for k, m in (("base", m_base), ("marfil", m_marfil), ("amarillo", m_amarillo))},
        }
        # Vista previa en color para el PDF
        prev = a_svg(placa, COLORES["base"]) + a_svg(marfil, COLORES["marfil"]) + a_svg(amarillo, COLORES["amarillo"])
        (SALIDA / f".prev-{idioma}.svg").write_text(svg_pagina(prev, borde=False))
    (SALIDA / ".info.json").write_text(json.dumps(info, indent=1))
    print(json.dumps(info, indent=1))




# ---------- PDF a escala 1:1 ----------
def pdf():
    info = json.loads((SALIDA / ".info.json").read_text())
    def inline(nombre):
        return (SALIDA / nombre).read_text()
    paginas = []
    for idioma, etiqueta in (("es", "Cara en español"), ("en", "Cara en inglés (English side)")):
        capas = [
            ("1 · Base negra", "Imprime en negro (#0B0A09). 2,0 mm de grosor, lisa.", f"{idioma}-capa-1-base-negro.svg"),
            ("2 · Relieve marfil", "Filamento marfil / blanco hueso (#F2EDE4). 0,8 mm de relieve sobre la base.", f"{idioma}-capa-2-marfil.svg"),
            ("3 · Relieve amarillo", "Filamento amarillo (#E8BE45). 0,8 mm de relieve sobre la base.", f"{idioma}-capa-3-amarillo.svg"),
        ]
        paginas.append(f'''<section><h1>Tarjeta de reseña · Memphis Belle</h1><h2>{etiqueta} · vista previa a escala 1:1 (80 × 125 mm)</h2>
          <div class="fila"><div class="obj">{inline(f".prev-{idioma}.svg")}</div>
          <ul><li><b>Tamaño:</b> {info[idioma]["caja"][0]} × {info[idioma]["caja"][1]} × {info[idioma]["caja"][2]} mm</li>
          <li><b>Base:</b> 2,0 mm, esquinas de 6 mm</li><li><b>Relieve:</b> 0,8 mm (altura total 2,8 mm)</li>
          <li><b>Filamentos:</b> negro, marfil y amarillo</li>
          <li><b>Material de cada pieza:</b> base {info[idioma]["volumen_mm3"]["base"]/1000:.1f} cm³ · marfil {info[idioma]["volumen_mm3"]["marfil"]/1000:.2f} cm³ · amarillo {info[idioma]["volumen_mm3"]["amarillo"]/1000:.2f} cm³</li>
          <li><b>Archivo para el laminador:</b> <code>tarjeta-resena-{idioma}.3mf</code> (o los 3 STL)</li></ul></div></section>''')
        for titulo, nota, svg in capas:
            paginas.append(f'<section><h1>{titulo}</h1><h2>{etiqueta} · capa a escala 1:1 (la línea discontinua es el contorno de la tarjeta)</h2><p class="nota">{nota}</p><div class="obj centrado">{inline(svg)}</div></section>')
    paginas.append('''<section class="guia"><h1>Ajustes de impresión</h1>
      <h2>Recomendados (FDM, boquilla de 0,4 mm)</h2>
      <table><tr><th>Altura de capa</th><td>0,16 – 0,20 mm (base) · 0,12 – 0,16 mm si quieres un texto más nítido</td></tr>
      <tr><th>Boquilla</th><td>0,4 mm (los trazos más finos del diseño miden 0,6 mm; no uses boquilla de 0,6 o mayor)</td></tr>
      <tr><th>Paredes</th><td>3 · Relleno 15 – 20 % · Capas superiores 5</td></tr>
      <tr><th>Orientación</th><td>Plana, con el relieve hacia arriba. No hacen falta soportes.</td></tr>
      <tr><th>Cambio de filamento</th><td>Base negra hasta 2,0 mm (la capa donde empieza el relieve). A partir de ahí, marfil y amarillo. Con AMS / multicolor: abre el 3MF y asigna un filamento a cada pieza. Impresora de un solo color: cambia el filamento con pausa (M600) en la capa de 2,0 mm e imprime primero el marfil y luego el amarillo, o imprime cada color por separado y pega.</td></tr>
      <tr><th>Primera capa</th><td>Lenta y bien calibrada; la base es una placa grande de 80 × 125 mm: usa borde de adhesión o lámina PEI limpia para evitar que se curve.</td></tr>
      <tr><th>NFC</th><td>Si vas a incrustar la etiqueta NFC, pausa la impresión tras la capa de 1,0 – 1,2 mm de la base, coloca la pastilla bajo el símbolo NFC (a 57 mm del borde izquierdo y 25 mm del borde inferior) y continúa. Con 2,0 mm de base entra una pastilla fina; si es más gruesa, hay que ahuecar la base. Dime el diámetro y el grosor y lo preparo.</td></tr></table>
      <h2>Por qué este diseño imprime bien</h2>
      <p>Sin QR (el NFC va incrustado), con texto grande y en relieve de 0,8 mm, y con los trazos finos de las letras engrosados hasta un mínimo de 0,6 mm para que no se rompan. Los modelos son sólidos y estancos (comprobado).</p>
      <p class="nota">Archivos: tarjeta-resena-es.3mf, tarjeta-resena-en.3mf y, por pieza, los STL (1 base negro, 2 relieve marfil, 3 relieve amarillo). Un PDF no se puede imprimir en 3D: este documento es la guía y la referencia a escala; el modelo está en los 3MF / STL.</p></section>''')
    html = f'''<!doctype html><meta charset="utf-8"><style>
    @page {{ size: A4; margin: 0 }} * {{ box-sizing: border-box }} body {{ margin: 0; font: 11pt/1.45 -apple-system, "Segoe UI", Arial, sans-serif; color: #1a1a1a }}
    section {{ width: 210mm; height: 297mm; padding: 14mm 16mm; break-after: page; position: relative }}
    h1 {{ font-size: 18pt; margin: 0 0 2mm }} h2 {{ font-size: 10.5pt; font-weight: 400; color: #555; margin: 0 0 6mm }}
    .nota {{ color: #444; margin: 0 0 5mm }} .fila {{ display: flex; gap: 10mm; align-items: flex-start }} .fila ul {{ margin: 0; padding-left: 5mm; font-size: 10pt }} .fila li {{ margin-bottom: 2.5mm }}
    .obj {{ width: 80mm; height: 125mm; flex: none }} .obj svg {{ display: block; width: 80mm; height: 125mm }} .centrado {{ margin: 8mm auto 0 }}
    table {{ border-collapse: collapse; width: 100%; font-size: 10pt }} th {{ text-align: left; vertical-align: top; width: 34mm; padding: 2mm 3mm 2mm 0; border-top: 1px solid #ccc }} td {{ padding: 2mm 0; border-top: 1px solid #ccc }}
    code {{ background: #eee; padding: 0 2px }} .guia p {{ max-width: 150mm }}
    </style>{"".join(paginas)}'''
    (SALIDA / ".pdf.html").write_text(html)
    js = ("const {chromium}=require(process.argv[2]);(async()=>{const b=await chromium.launch();const p=await b.newPage();"
          "await p.goto('file://'+process.argv[3]);await p.pdf({path:process.argv[4],format:'A4',printBackground:true,margin:{top:0,right:0,bottom:0,left:0}});await b.close()})()")
    nodepw = subprocess.check_output(["npm", "root", "-g"]).decode().strip() + "/playwright"
    (SALIDA / ".pdf.cjs").write_text(js)
    subprocess.check_call(["node", str(SALIDA / ".pdf.cjs"), nodepw, str(SALIDA / ".pdf.html"), str(SALIDA / "tarjeta-resena-3d.pdf")])
    for f in (".pdf.cjs", ".pdf.html", ".prev-es.svg", ".prev-en.svg", ".info.json"):
        (SALIDA / f).unlink()


if __name__ == "__main__":
    main()
    pdf()
