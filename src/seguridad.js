// Seguridad de la web: política de contenidos (CSP) y cabeceras. Una sola fuente para el <meta> de cada página,
// el archivo _headers de dist/ y el Worker (que las vuelve a poner en todas las respuestas, también en las
// redirecciones y en errores, por si el alojamiento no aplica _headers).

// CSP del <meta> (vale en cualquier alojamiento, también en la vista previa local). Todo es del propio dominio:
// sin scripts ni estilos en línea, sin tipografías ni imágenes de terceros. Solo se admite un marco de
// www.google.com para el mapa, que no se carga hasta que la persona lo pide. "require-trusted-types-for" cierra
// la inyección de HTML/JS desde el DOM: el JavaScript de la web no usa ninguna de esas vías.
export const STATIC_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "media-src 'self'",
  "manifest-src 'self'",
  "connect-src 'self'",
  'frame-src https://www.google.com',
  "worker-src 'none'",
  "form-action 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "require-trusted-types-for 'script'",
].join('; ');

// Solo como cabecera: el <meta> no admite estas dos directivas.
export const CSP_CABECERA = `${STATIC_CSP}; frame-ancestors 'none'; upgrade-insecure-requests`;

export const CABECERAS_SEGURIDAD = {
  'Content-Security-Policy': CSP_CABECERA,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'accelerometer=(), autoplay=(), camera=(), display-capture=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), usb=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
};
