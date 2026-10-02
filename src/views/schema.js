// Datos estructurados (schema.org en JSON-LD) para la portada: le dicen a Google qué es Memphis Belle,
// dónde está, su horario, su teléfono y su carta con precios. Todo sale de site.js, así que no se puede
// desincronizar con lo que se ve en la web (pero sí con la ficha de Google: revisarla al cambiar algo).
// Solo se generan si se conoce la dirección pública (Google necesita URLs absolutas).
import { DIAS } from '../../public/js/horario.js';

const DAY_OF_WEEK = {
  lunes: 'Monday', martes: 'Tuesday', miercoles: 'Wednesday', jueves: 'Thursday',
  viernes: 'Friday', sabado: 'Saturday', domingo: 'Sunday',
};

// "9,50 €" → 9.5
export function parsePrice(text) {
  const match = /^(\d+(?:,\d{1,2})?)\s*€$/.exec(String(text).trim());
  if (!match) throw new Error(`Precio no reconocido en la carta: "${text}"`);
  return Number(match[1].replace(',', '.'));
}

export function structuredDataObject({ site, config }) {
  const base = config.publicBaseUrl;
  const { address: a } = site;
  const prices = site.menu.sections.flatMap((s) => s.items.map((i) => parsePrice(i.price)));
  const bar = {
    '@type': 'BarOrPub',
    '@id': `${base}/#local`,
    name: site.fullName,
    url: `${base}/`,
    description: site.description,
    telephone: `+${site.phone}`,
    email: site.email,
    ...(site.ogImage ? { image: `${base}/assets/${site.ogImage}` } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      postalCode: a.postalCode,
      addressLocality: a.city,
      addressRegion: a.region,
      addressCountry: a.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.googleMapsUrl,
    sameAs: [site.googleMapsUrl, `https://www.instagram.com/${site.instagram}/`],
    openingHoursSpecification: DIAS.filter((d) => site.hours.days[d]).map((d) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_OF_WEEK[d],
      opens: site.hours.days[d][0],
      closes: site.hours.days[d][1],
    })),
    priceRange: `${Math.min(...prices)} € - ${Math.max(...prices)} €`,
    currenciesAccepted: 'EUR',
    acceptsReservations: true,
    hasMenu: {
      '@type': 'Menu',
      '@id': `${base}/#carta`,
      url: `${base}/#carta`,
      inLanguage: 'es',
      hasMenuSection: site.menu.sections.map((s) => ({
        '@type': 'MenuSection',
        name: s.name,
        hasMenuItem: s.items.map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          ...(item.text ? { description: item.text } : {}),
          offers: { '@type': 'Offer', price: parsePrice(item.price), priceCurrency: 'EUR' },
        })),
      })),
    },
    ...(site.reviews.rating && site.reviews.count ? {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: Number(site.reviews.rating.replace(',', '.')), reviewCount: Number(site.reviews.count), bestRating: 5 },
    } : {}),
  };
  const web = {
    '@type': 'WebSite',
    '@id': `${base}/#web`,
    url: `${base}/`,
    name: site.fullName,
    inLanguage: 'es',
    publisher: { '@id': bar['@id'] },
  };
  return { '@context': 'https://schema.org', '@graph': [bar, web] };
}

// <script type="application/ld+json">: es un bloque de datos, no se ejecuta, así que la CSP no lo
// bloquea. Se escapa "<" para que ningún texto pueda cerrar la etiqueta.
export function structuredData({ site, config }) {
  if (!config.publicBaseUrl) return '';
  const json = JSON.stringify(structuredDataObject({ site, config }), null, 2).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">\n${json}\n</script>\n`;
}
