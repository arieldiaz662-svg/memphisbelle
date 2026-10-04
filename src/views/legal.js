import { esc, escPhone, layout } from './html.js';

// PLANTILLAS ORIENTATIVAS. Deben revisarse con un profesional antes de publicar la web.

const contactLine = (site) => `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a> o el teléfono <a href="tel:+${esc(site.phone)}">${escPhone(site.phoneDisplay)}</a>`;

function page({ site, config, path, title, sections }) {
  const body = `<main id="contenido" tabindex="-1" class="pagina-simple legal"><div class="wrap">
  <h1>${esc(title)}</h1>
  <p class="suave">Última actualización: ${esc(site.legal.lastUpdated)}</p>
  ${sections.map(([heading, text]) => `<h2>${esc(heading)}</h2>\n  ${text}`).join('\n  ')}
</div></main>`;
  return layout({ site, config, title: `${title} | ${site.fullName}`, description: `${title} de ${site.fullName}.`, path, body });
}

export function renderLegalNotice({ site, config }) {
  const { legal } = site;
  return page({
    site, config, path: '/aviso-legal', title: 'Aviso legal',
    sections: [
      ['Titular del sitio web', `<p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este sitio web es titularidad de <strong>${esc(legal.owner)}</strong>, con NIF/CIF ${esc(legal.taxId)} y domicilio en ${esc(legal.address)}.${legal.registry ? ` ${esc(legal.registry)}.` : ''}</p>
  <p>Contacto: ${contactLine(site)}.</p>`],
      ['Objeto', `<p>Este sitio web ofrece información sobre ${esc(site.fullName)}: carta, precios, horario, ubicación y reservas.</p>`],
      ['Propiedad intelectual', '<p>Los textos, diseños, fotografías y logotipos de este sitio web son propiedad de su titular o se usan con autorización. No se permite su reproducción sin consentimiento previo.</p>'],
      ['Responsabilidad', '<p>Los precios y el horario pueden cambiar; en caso de diferencia, prevalecen los del local. El titular no se hace responsable de los contenidos de sitios web externos enlazados.</p>'],
      ['Legislación aplicable', '<p>Este aviso legal se rige por la legislación española.</p>'],
    ],
  });
}

export function renderPrivacy({ site, config }) {
  const { legal } = site;
  const reach = contactLine(site);
  return page({
    site, config, path: '/privacidad', title: 'Política de privacidad',
    sections: [
      ['Responsable del tratamiento', legal.owner
        ? `<p>${esc(legal.owner)} (NIF/CIF ${esc(legal.taxId)}), ${esc(legal.address)}. Contacto: ${reach}.</p>`
        : `<p>${esc(site.fullName)}, ${esc(site.address.street)}, ${esc(site.address.postalCode)} ${esc(site.address.city)}. Contacto: ${reach}.</p>`],
      ['Qué datos tratamos', '<p>Esta web no guarda ningún dato. El formulario de reserva solo prepara un mensaje de WhatsApp en tu dispositivo: nos llega únicamente si tú decides enviarlo. En ese caso tratamos tu nombre, tu número de teléfono y los datos de la reserva.</p>'],
      ['Para qué los usamos', '<p>Únicamente para gestionar tu reserva y responderte. No enviamos publicidad ni tomamos decisiones automatizadas.</p>'],
      ['Base legal', '<p>Tu consentimiento al escribirnos (art. 6.1.a RGPD) y la gestión de la reserva que nos pides (art. 6.1.b RGPD).</p>'],
      ['Cuánto tiempo los guardamos', '<p>Borramos la conversación de la reserva en un plazo máximo de 3 meses, salvo que la necesitemos para atender una reclamación.</p>'],
      ['Con quién los compartimos', '<p>No cedemos tus datos a terceros salvo obligación legal. Al usar WhatsApp se aplican además las condiciones y la política de privacidad de WhatsApp (Meta).</p>'],
      ['Tus derechos', `<p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiéndonos a ${reach}. Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener">www.aepd.es</a>).</p>`],
    ],
  });
}

export function renderCookies({ site, config }) {
  return page({
    site, config, path: '/cookies', title: 'Política de cookies',
    sections: [
      ['Qué cookies usamos', `<p>La web de ${esc(site.fullName)} no utiliza cookies de ningún tipo, y las tipografías se sirven desde nuestro propio alojamiento. Por eso no te mostramos un aviso de cookies.</p>`],
      ['Enlaces externos', '<p>Al pulsar los enlaces de WhatsApp, Instagram o Google Maps sales de esta web; desde ese momento se aplica la política de cookies de cada servicio.</p>'],
    ],
  });
}
