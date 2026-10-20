import { esc, layout } from './html.js';

// PLANTILLAS ORIENTATIVAS. Deben revisarse con un profesional antes de publicar la web.

const contactLine = (site) => `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`;

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
      ['Objeto', `<p>Este sitio web ofrece información sobre ${esc(site.fullName)}: carta, precios, horario, ubicación y contacto.</p>`],
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
      ['Qué datos tratamos', '<p>Esta web no guarda ningún dato y no tiene formularios. Los enlaces de contacto (correo e Instagram) abren tu aplicación: solo nos llega lo que tú decidas enviarnos. En ese caso tratamos tu dirección de correo o tu usuario de Instagram y el contenido de tu mensaje. Si decides ver el mapa de la sección «Visítanos», Google recibe tu dirección IP para mostrártelo (consulta la política de cookies).</p>'],
      ['Para qué los usamos', '<p>Únicamente para responder a tu consulta. No enviamos publicidad ni tomamos decisiones automatizadas.</p>'],
      ['Base legal', '<p>Tu consentimiento al escribirnos (art. 6.1.a RGPD).</p>'],
      ['Cuánto tiempo los guardamos', '<p>Borramos la conversación en un plazo máximo de 3 meses, salvo que la necesitemos para atender una reclamación.</p>'],
      ['Con quién los compartimos', '<p>No cedemos tus datos a terceros salvo obligación legal.</p>'],
      ['Tus derechos', `<p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiéndonos a ${reach}. Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener">www.aepd.es</a>).</p>`],
    ],
  });
}

export function renderCookies({ site, config }) {
  return page({
    site, config, path: '/cookies', title: 'Política de cookies',
    sections: [
      ['Qué cookies usamos', `<p>La web de ${esc(site.fullName)} no utiliza cookies propias ni de análisis o publicidad, y las tipografías se sirven desde nuestro propio alojamiento. Por eso no te mostramos un aviso de cookies al entrar.</p>`],
      ['Mapa de Google Maps', '<p>En la sección «Visítanos» el mapa no se carga hasta que pulsas «Ver el mapa». Al hacerlo, tu navegador se conecta con Google (google.com), que puede guardar cookies y tratar datos como tu dirección IP según su propia política. Si no lo pulsas, no se envía nada a Google.  Con el botón «Cómo llegar» abres la ubicación en Google Maps en otra pestaña, y desde ese momento se aplica la política de cada servicio.</p>'],
      ['Memoria temporal del navegador', '<p>Para no repetir la pantalla de entrada en cada página, la web guarda un único aviso (<code>mb-intro</code>) en la memoria de sesión de tu navegador. No es una cookie, no contiene datos personales, no se envía a ningún servidor y se borra al cerrar la pestaña.</p>'],
      ['Enlaces externos', '<p>Al pulsar los enlaces de Instagram o Google Maps sales de esta web; desde ese momento se aplica la política de cookies de cada servicio.</p>'],
    ],
  });
}
