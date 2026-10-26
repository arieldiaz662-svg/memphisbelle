import { esc, layout } from './html.js';
import { NAV_EN } from './landing.js';

// PLANTILLAS ORIENTATIVAS. Deben revisarse con un profesional antes de publicar la web.

const contactLine = (site) => `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`;

function page({ site, config, path, title, sections, lang = 'es', alterno = null, head = '', actualizado = 'Última actualización', descripcion = '' }) {
  const body = `<main id="contenido" tabindex="-1" class="pagina-simple legal"><div class="wrap">
  <h1>${esc(title)}</h1>
  <p class="suave">${esc(actualizado)}: ${esc(lang === 'en' ? site.legal.lastUpdatedEn : site.legal.lastUpdated)}</p>
  ${sections.map(([heading, text]) => `<h2>${esc(heading)}</h2>\n  ${text}`).join('\n  ')}
</div></main>`;
  return layout({ site, config, title: `${title} | ${site.fullName}`, description: descripcion || `${title} de ${site.fullName}.`, path, body, lang, alterno, head, ...(lang === 'en' ? { nav: NAV_EN } : {}) });
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
  const base = config.publicBaseUrl;
  return page({
    site, config, path: '/privacidad', title: 'Política de privacidad',
    alterno: { href: 'privacy-en.html', lang: 'en', texto: 'EN', etiqueta: 'View in English' },
    head: base ? `<link rel="alternate" hreflang="es" href="${esc(`${base}/privacidad.html`)}">\n<link rel="alternate" hreflang="en" href="${esc(`${base}/privacy-en.html`)}">\n` : '',
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

export function renderPrivacyEn({ site, config }) {
  const { legal } = site;
  const reach = contactLine(site);
  const controller = legal.owner
    ? `${esc(legal.owner)} (tax ID ${esc(legal.taxId)}), ${esc(legal.address)}`
    : `${esc(site.fullName)}, ${esc(site.address.street)}, ${esc(site.address.postalCode)} ${esc(site.address.city)}, Spain`;
  const base = config.publicBaseUrl;
  return page({
    site, config, path: '/privacy-en', title: 'Privacy policy', lang: 'en', actualizado: 'Last updated',
    descripcion: `Privacy policy of ${site.fullName}: what personal data we process, why, who receives it (including Google Maps) and your rights.`,
    alterno: { href: 'privacidad.html', lang: 'es', texto: 'ES', etiqueta: 'Ver en español' },
    head: base ? `<link rel="alternate" hreflang="es" href="${esc(`${base}/privacidad.html`)}">\n<link rel="alternate" hreflang="en" href="${esc(`${base}/privacy-en.html`)}">\n` : '',
    sections: [
      ['Data controller', `<p>${controller}. Contact email: ${reach}. This policy applies to this website, its menu and the contact channels it links to (email and Instagram).</p>
  <p>We comply with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 on the Protection of Personal Data and the guarantee of digital rights (LOPDGDD).</p>`],
      ['What data we process and where it comes from', `<p>This website has no forms, does not create accounts, does not store first-party, analytics or advertising cookies and does not sell anything. We process personal data only in these cases:</p>
  <ul>
    <li><strong>If you write to us</strong> by email or on Instagram: your email address or username, your name if you give it to us and the content of your message.</li>
    <li><strong>If you visit the website</strong>: our hosting provider (Cloudflare) technically receives your IP address, browser type and the page you request in order to deliver it and protect the site from attacks. We do not look at or keep those records individually.</li>
    <li><strong>If you click “Show the map”</strong>: your browser connects to Google (see the Google Maps section).</li>
    <li><strong>If you click “Get directions” or “Leave us a Google review”</strong>: you open another tab, where Google processes your data as its own controller.</li>
  </ul>`],
      ['Google Maps and Google reviews', `<p>The website includes a Google Maps map and links to the venue’s listing and to the page for writing a review.</p>
  <ul>
    <li><strong>Embedded map.</strong> It does not load until you click “Show the map”. Until then, no data is sent to Google. When you click it, Google receives your IP address and data about your browser and device, and may store cookies or identifiers, according to its own policy. The legal basis is your consent (art. 6.1.a GDPR), which you give by clicking the button and can withdraw by no longer using the map and clearing your browser data.</li>
    <li><strong>Links to Google Maps and to the review page.</strong> These are ordinary links: when you click them you leave this website and the processing becomes the responsibility of Google LLC, acting as an independent controller. If you write a review, it will be public and linked to your Google account; we do not receive it before you publish it and we cannot edit or delete it (only you can).</li>
    <li><strong>Reviews shown on this website.</strong> We show some reviews already published on Google, with the name that appears on them. If you want us to remove yours from this website, write to us and we will take it down.</li>
    <li><strong>More information.</strong> Google’s privacy policy: <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">policies.google.com/privacy</a>.</li>
  </ul>`],
      ['Why we use it and on what legal basis', `<ul>
    <li><strong>Answering your enquiry or message</strong>: your consent when you write to us (art. 6.1.a GDPR) and steps taken at your request (art. 6.1.b).</li>
    <li><strong>Showing you the Google map</strong>: your consent when you click the button (art. 6.1.a).</li>
    <li><strong>Security and operation of the website</strong> (technical hosting logs): legitimate interest in keeping the site available and secure (art. 6.1.f).</li>
    <li><strong>Complying with legal obligations</strong> where a law requires it (art. 6.1.c).</li>
  </ul>
  <p>We do not send advertising or newsletters, we do not build profiles and we do not make automated decisions. If we ever did, we would ask you first and update this policy.</p>`],
      ['How long we keep it', '<p>Email and Instagram conversations are deleted within 3 months of the last message, unless we have to keep them to deal with a claim or because of a legal obligation, for the applicable limitation periods. Technical hosting logs are managed by Cloudflare under its own retention periods. The map and Google are governed by Google’s policy.</p>'],
      ['Who we share it with', `<p>We do not sell or transfer your data. The following processors and providers may access it, solely to provide their service to us:</p>
  <ul>
    <li><strong>Cloudflare, Inc.</strong>: hosting and security of the website.</li>
    <li><strong>Google LLC</strong>: email (Gmail) and, if you request them, the map and reviews.</li>
    <li><strong>Meta Platforms Ireland Ltd.</strong>: if you write to us on Instagram.</li>
  </ul>
  <p>We may also disclose data to the authorities where the law requires us to.</p>`],
      ['International transfers', '<p>Some of these providers are based in the United States. Transfers rely on the European Commission’s adequacy decision for companies certified under the EU-US Data Privacy Framework or, failing that, on standard contractual clauses. You can ask us for more information by writing to us.</p>'],
      ['Your rights', `<p>You can exercise at any time your rights of <strong>access, rectification, erasure, objection, restriction of processing and portability</strong>, and <strong>withdraw any consent</strong> you have given, by writing to ${reach} and saying which right you want to exercise. We may ask you to prove your identity. We reply within one month at most.</p>
  <p>If you believe we have not handled your request properly, you can lodge a complaint with the Spanish Data Protection Agency (<a href="https://www.aepd.es" rel="noopener noreferrer" target="_blank">www.aepd.es</a>) or with the supervisory authority of your country of residence.</p>`],
      ['Minors', '<p>This website is aimed at adults. We do not knowingly process data of children under 14. If you believe a minor has written to us, let us know and we will delete it.</p>'],
      ['Security', '<p>The website is static, collects no data through forms and is always served over an encrypted connection (HTTPS). We apply reasonable technical measures: a strict content policy, security headers, no third-party scripts or resources without your consent, and protected access to the hosting and the code.</p>'],
      ['Changes to this policy', '<p>We may update it when the website or the regulations change. The date of the last update appears at the top of this page.</p>'],
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
