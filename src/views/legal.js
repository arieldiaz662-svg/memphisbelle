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
  const titular = legal.owner
    ? `${esc(legal.owner)} (NIF/CIF ${esc(legal.taxId)}), ${esc(legal.address)}`
    : `${esc(site.fullName)}, ${esc(site.address.street)}, ${esc(site.address.postalCode)} ${esc(site.address.city)}`;
  return page({
    site, config, path: '/privacidad', title: 'Política de privacidad',
    sections: [
      ['Responsable del tratamiento', `<p>${titular}. Correo de contacto: ${reach}. Esta política se aplica a este sitio web, a su carta y a los canales de contacto que enlaza (correo electrónico e Instagram).</p>
  <p>Cumplimos el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>`],
      ['Qué datos tratamos y de dónde salen', `<p>Esta web no tiene formularios, no crea cuentas, no guarda cookies propias ni de análisis o publicidad y no vende nada. Tratamos datos personales solo en estos casos:</p>
  <ul>
    <li><strong>Si nos escribes</strong> por correo o por Instagram: tu dirección de correo o tu usuario, tu nombre si nos lo das y el contenido de tu mensaje.</li>
    <li><strong>Si visitas la web</strong>: el servicio de alojamiento (Cloudflare) recibe de forma técnica tu dirección IP, el tipo de navegador y la página que pides para poder enviártela y proteger el sitio de ataques. Nosotros no consultamos ni guardamos esos registros de forma individual.</li>
    <li><strong>Si pulsas «Ver el mapa»</strong>: tu navegador se conecta con Google (ver el apartado de Google Maps).</li>
    <li><strong>Si pulsas «Cómo llegar» o «Déjanos una reseña en Google»</strong>: abres otra pestaña, en la que Google trata tus datos como responsable propio.</li>
  </ul>`],
      ['Google Maps y reseñas de Google', `<p>La web incluye un mapa de Google Maps y enlaces a la ficha del local y a la página para escribir una reseña.</p>
  <ul>
    <li><strong>Mapa integrado.</strong> No se carga hasta que pulsas «Ver el mapa». Hasta entonces no se envía ningún dato a Google. Al pulsarlo, Google recibe tu dirección IP, datos de tu navegador y de tu dispositivo, y puede guardar cookies o identificadores, según su propia política. La base legal es tu consentimiento (art. 6.1.a RGPD), que das al pulsar el botón y puedes retirar dejando de usar el mapa y borrando los datos de tu navegador.</li>
    <li><strong>Enlaces a Google Maps y a la reseña.</strong> Son enlaces normales: al pulsarlos sales de esta web y el tratamiento pasa a ser de Google LLC, que actúa como responsable independiente. Si escribes una reseña, será pública y estará asociada a tu cuenta de Google; nosotros no la recibimos antes de que la publiques y no podemos editarla ni borrarla (solo puedes hacerlo tú).</li>
    <li><strong>Reseñas mostradas en esta web.</strong> Mostramos algunas reseñas ya publicadas en Google con el nombre que aparece en ellas. Si quieres que quitemos la tuya de esta web, escríbenos y la retiramos.</li>
    <li><strong>Más información.</strong> Política de privacidad de Google: <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">policies.google.com/privacy</a>.</li>
  </ul>`],
      ['Para qué los usamos y con qué base legal', `<ul>
    <li><strong>Atender tu consulta o mensaje</strong>: tu consentimiento al escribirnos (art. 6.1.a RGPD) y la aplicación de medidas a petición tuya (art. 6.1.b).</li>
    <li><strong>Mostrarte el mapa de Google</strong>: tu consentimiento al pulsar el botón (art. 6.1.a).</li>
    <li><strong>Seguridad y funcionamiento de la web</strong> (registros técnicos del alojamiento): interés legítimo en mantener el sitio disponible y seguro (art. 6.1.f).</li>
    <li><strong>Cumplir obligaciones legales</strong> cuando nos lo exija una norma (art. 6.1.c).</li>
  </ul>
  <p>No enviamos publicidad ni boletines, no elaboramos perfiles y no tomamos decisiones automatizadas. Si algún día lo hiciéramos, te lo pediremos antes y actualizaremos esta política.</p>`],
      ['Cuánto tiempo los guardamos', '<p>Las conversaciones por correo o por Instagram se borran en un plazo máximo de 3 meses desde el último mensaje, salvo que debamos conservarlas para atender una reclamación o por una obligación legal, durante los plazos de prescripción que correspondan. Los registros técnicos del alojamiento los gestiona Cloudflare con sus propios plazos. El mapa y Google se rigen por la política de Google.</p>'],
      ['Con quién los compartimos', `<p>No vendemos ni cedemos tus datos. Pueden acceder a ellos, solo para prestarnos su servicio, estos encargados y proveedores:</p>
  <ul>
    <li><strong>Cloudflare, Inc.</strong>: alojamiento y seguridad de la web.</li>
    <li><strong>Google LLC</strong>: correo electrónico (Gmail) y, si lo pides, el mapa y las reseñas.</li>
    <li><strong>Meta Platforms Ireland Ltd.</strong>: si nos escribes por Instagram.</li>
  </ul>
  <p>También podremos comunicar datos a las autoridades cuando una ley nos obligue.</p>`],
      ['Transferencias internacionales', '<p>Algunos de esos proveedores tienen sede en Estados Unidos. Las transferencias se amparan en la decisión de adecuación de la Comisión Europea para las empresas adheridas al Marco de Privacidad de Datos UE-EE. UU. o, en su defecto, en cláusulas contractuales tipo. Puedes pedirnos más información escribiéndonos.</p>'],
      ['Tus derechos', `<p>Puedes ejercer en cualquier momento tus derechos de <strong>acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad</strong>, y <strong>retirar el consentimiento</strong> que hayas dado, escribiéndonos a ${reach} e indicando qué derecho quieres ejercer. Podemos pedirte que acredites tu identidad. Respondemos en el plazo máximo de un mes.</p>
  <p>Si consideras que no hemos atendido correctamente tu solicitud, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener noreferrer" target="_blank">www.aepd.es</a>).</p>`],
      ['Menores', '<p>Esta web está dirigida a personas mayores de edad. No tratamos datos de menores de 14 años a sabiendas. Si crees que un menor nos ha escrito, avísanos y lo borraremos.</p>'],
      ['Seguridad', '<p>La web es estática, no recoge datos en formularios y se sirve siempre por una conexión cifrada (HTTPS). Aplicamos medidas técnicas razonables: política estricta de contenidos, cabeceras de seguridad, ningún script ni recurso de terceros sin tu consentimiento y acceso protegido al alojamiento y al código.</p>'],
      ['Cambios en esta política', `<p>Podemos actualizarla cuando cambie la web o la normativa. La fecha de la última actualización figura al principio de esta página.</p>`],
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
