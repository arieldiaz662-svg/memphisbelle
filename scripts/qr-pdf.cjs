// PDF vectorial de un QR con la página exactamente de mm × mm (Chromium redondea el tamaño de página,
// por eso se escribe a mano). Negro sobre blanco; "margen" son módulos en blanco alrededor, dentro de los mm.
const QRCode = require('qrcode');

function pdfQr(enlace, mm, { margen = 2, nivel = 'M' } = {}) {
  const q = QRCode.create(enlace, { errorCorrectionLevel: nivel }).modules;
  const n = q.size + 2 * margen; const pt = (mm / 25.4) * 72; const u = pt / n;
  let c = `1 1 1 rg 0 0 ${pt.toFixed(4)} ${pt.toFixed(4)} re f\n0 0 0 rg\n`;
  for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.get(x, y)) c += `${((x + margen) * u).toFixed(4)} ${((n - margen - 1 - y) * u).toFixed(4)} ${(u + 0.01).toFixed(4)} ${(u + 0.01).toFixed(4)} re f\n`;
  const o = [`<< /Type /Catalog /Pages 2 0 R >>`, `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pt.toFixed(4)} ${pt.toFixed(4)}] /Contents 4 0 R /Resources << >> >>`, `<< /Length ${Buffer.byteLength(c)} >>\nstream\n${c}endstream`];
  let out = '%PDF-1.4\n'; const pos = [];
  o.forEach((x, i) => { pos.push(Buffer.byteLength(out)); out += `${i + 1} 0 obj\n${x}\nendobj\n`; });
  const xref = Buffer.byteLength(out);
  out += `xref\n0 ${o.length + 1}\n0000000000 65535 f \n${pos.map((x) => String(x).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size ${o.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out);
}

module.exports = { pdfQr };
