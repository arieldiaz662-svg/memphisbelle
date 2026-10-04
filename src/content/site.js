// CONTENIDO EDITABLE DE LA WEB.
// Cambia aquí textos, carta, precios, horario y contacto. Todo lo que ve el cliente sale de este archivo.
//
// DATOS SIN CONFIRMAR: `npm run pendientes` los lista.
// - "pendiente": imprescindible antes de publicar. Mientras quede alguno, Cloudflare no publica la web
//   (ver test/publicacion.test.js).
// - "revisar": conviene completarlo, pero no bloquea la publicación.

export const site = {
  name: 'Memphis Belle',
  fullName: 'Memphis Belle Coctelería',
  title: 'Memphis Belle Coctelería | Cócteles clásicos en Santa Cruz de Tenerife',
  description:
    'Coctelería en el centro de Santa Cruz de Tenerife. Dry Martini, Manhattan y los clásicos de siempre, con terraza y mascotas bienvenidas. Consulta la carta, el horario y reserva por WhatsApp.',
  // Imagen de vista previa al compartir el enlace (WhatsApp, redes). 1200×630, en public/img/.
  // Se regenera con: npm run og-image (tras cambios visibles en la portada).
  ogImage: 'img/og.jpg',
  ogImageAlt: 'Memphis Belle Coctelería, Santa Cruz de Tenerife.',

  // CONTACTO
  phone: '34636864193', // con prefijo de país, solo dígitos
  phoneDisplay: '636 864 193',
  // WhatsApp para reservas. Se asume el mismo número que el teléfono: confirmarlo con el local.
  whatsapp: { number: '34636864193', pendiente: 'Confirmar que el 636 864 193 tiene WhatsApp y que aceptan reservas por ahí' },
  email: 'memphiscocteleria@gmail.com',
  instagram: 'memphisbelle_cocteleria',

  // UBICACIÓN (la de la ficha de Google Business)
  address: {
    street: 'Calle de los Sueños, 1',
    postalCode: '38006',
    city: 'Santa Cruz de Tenerife',
    region: 'Canarias',
    country: 'ES',
  },
  geo: { lat: 28.468885, lng: -16.2608065 },
  googleMapsUrl: 'https://www.google.com/maps/place/Memphis+Belle+Cocteler%C3%ADa/@28.468885,-16.2608065,17z/data=!4m6!3m5!1s0xc41cd835a3e7f6d:0xb65902d692c6f1b1!8m2!3d28.468885!4d-16.2608065!16s%2Fg%2F11l1mdryqy',

  // HORARIO. Una franja por día ([abre, cierra]); null = cerrado. Si cierra después de medianoche,
  // la hora de cierre es menor que la de apertura (18:00 → 02:00). Hora de Canarias.
  // Debe coincidir con la ficha de Google: es lo primero que se desincroniza.
  hours: {
    pendiente: 'Las fuentes no coinciden (miércoles a domingo o jueves a sábado): copiarlo de la ficha de Google Business',
    days: {
      lunes: null,
      martes: null,
      miercoles: ['18:00', '02:00'],
      jueves: ['18:00', '02:00'],
      viernes: ['18:00', '02:00'],
      sabado: ['18:00', '02:00'],
      domingo: ['18:00', '02:00'],
    },
  },

  // PORTADA
  hero: {
    lead: 'Los mejores clásicos de coctelería, en el centro de Santa Cruz. Dry Martini, Manhattan y terraza.',
    cta: 'Reservar mesa',
    secondary: 'Ver la carta',
  },

  // EL LOCAL (servicios de la ficha de Google). Mosaico de 3: el primero va grande.
  // "image" es opcional ({ src: 'img/local/terraza.jpg', alt: '...' }, foto propia en public/img/): sin
  // fotos, la sección es tipográfica; con alguna, se muestra el mosaico. Nunca hay huecos vacíos.
  local: {
    title: 'El local',
    items: [
      { title: 'Terraza', text: 'Unas 30 personas fuera, en la calle de los Sueños.', image: null },
      { title: 'Dentro', text: '40 personas, junto a la barra y el mural del bombardero.', image: null },
      { title: 'Mascotas bienvenidas', text: 'Tu perro puede acompañarte dentro y en la terraza.', image: null },
    ],
    revisar: 'Completar con los servicios y atributos de la ficha de Google (accesibilidad, pagos, ambiente...) y añadir fotos propias del local',
  },

  // VISÍTANOS: foto opcional de la fachada o la calle, para reconocer la puerta al llegar.
  visit: {
    title: 'Visítanos',
    note: 'En el centro de Santa Cruz.',
    image: null, // { src: 'img/local/fachada.jpg', alt: 'Fachada de Memphis Belle en la calle de los Sueños' }
  },

  // CÓCTEL ESTRELLA: sección destacada justo después de la portada. Debe estar también en la carta
  // (menu) con el mismo nombre y precio; un test lo comprueba. "image" es opcional (foto propia del
  // cóctel, en public/img/): sin foto, la sección es solo tipográfica.
  featured: {
    label: 'Cóctel estrella',
    name: 'Bloody Mary',
    text: 'El clásico de vodka y tomate, con el picante y la sal a nuestra manera. Se sirve largo, con mucho hielo y su rama de apio.',
    ingredients: ['Vodka', 'Zumo de tomate', 'Lima', 'Salsa Worcestershire', 'Tabasco', 'Sal de apio y pimienta negra'],
    image: null, // { src: 'img/bloody-mary.jpg', alt: 'Bloody Mary en la barra de Memphis Belle' }
    pendiente: 'Cóctel estrella de ejemplo: confirmar con el local cuál es, su receta y su precio, y conseguir una foto propia',
  },

  // CARTA DIGITAL. Precios con IGIC incluido, tal como se cobran en la barra.
  // "text" es opcional (ingredientes o una línea de descripción).
  menu: {
    title: 'La carta',
    note: 'Precios con IGIC incluido. Pregunta por los cócteles fuera de carta.',
    pendiente: 'Carta de ejemplo: sustituir por la carta real con precios',
    sections: [
      {
        id: 'clasicos',
        name: 'Clásicos',
        items: [
          { name: 'Dry Martini', text: 'Ginebra, vermut seco, aceituna o twist de limón.', price: '9,00 €' },
          { name: 'Manhattan', text: 'Rye whiskey, vermut rojo, angostura.', price: '9,00 €' },
          { name: 'Negroni', text: 'Ginebra, Campari, vermut rojo.', price: '9,00 €' },
          { name: 'Old Fashioned', text: 'Bourbon, azúcar, angostura, piel de naranja.', price: '9,50 €' },
          { name: 'Daiquiri', text: 'Ron blanco, lima, azúcar.', price: '8,50 €' },
          { name: 'Margarita', text: 'Tequila, triple seco, lima.', price: '8,50 €' },
          { name: 'Bloody Mary', text: 'Vodka, tomate, lima, Worcestershire, tabasco, sal de apio.', price: '9,50 €' },
        ],
      },
      {
        id: 'de-la-casa',
        name: 'De la casa',
        items: [
          { name: 'Memphis Belle', text: 'El cóctel de la casa.', price: '10,00 €' },
          { name: 'Calle de los Sueños', text: 'Ron añejo canario, miel de palma, lima.', price: '10,00 €' },
          { name: 'Espresso Martini', text: 'Vodka, café, licor de café.', price: '9,50 €' },
        ],
      },
      {
        id: 'sin-alcohol',
        name: 'Sin alcohol',
        items: [
          { name: 'Virgin Mojito', text: 'Lima, hierbabuena, soda.', price: '6,00 €' },
          { name: 'Refresco', price: '2,50 €' },
          { name: 'Agua', price: '2,00 €' },
        ],
      },
      {
        id: 'cervezas-y-vinos',
        name: 'Cervezas y vinos',
        items: [
          { name: 'Cerveza', price: '3,00 €' },
          { name: 'Copa de vino', price: '4,00 €' },
          { name: 'Copa de cava', price: '5,00 €' },
        ],
      },
    ],
  },

  // RESERVAS: el formulario no guarda nada, solo prepara el mensaje de WhatsApp.
  booking: {
    title: 'Reserva tu mesa',
    intro: 'Dinos cuántos sois y cuándo venís. Se abre WhatsApp con el mensaje escrito: solo tienes que enviarlo y te confirmamos.',
    maxPeople: 12,
    groupsNote: 'Para grupos de más de 12 personas, llámanos.',
    // Imagen de ambiente de fondo (generada con IA: una barra genérica, NO es el local). Va sin pie de
    // foto y con alt vacío, porque es decorativa. Versiones en public/img/ambiente/barra-<ancho>.webp/.jpg.
    image: { src: 'img/ambiente/barra', widths: [640, 1024, 1536], width: 1536, height: 1024 },
    revisar: 'Confirmar que la herramienta con la que se generó la imagen de fondo de reservas permite uso comercial',
  },

  // VALORACIÓN EN GOOGLE (opcional). Si rating está vacío no se muestra.
  // Copiarla de la ficha y actualizarla de vez en cuando: un número antiguo resta credibilidad.
  // RESEÑAS: la sección solo aparece si hay valoración. Citas reales de Google (con su autor tal como
  // aparece en la reseña), máximo 3 líneas cada una: { text: '...', author: 'Nombre' }.
  reviews: { rating: '', count: '', quotes: [], revisar: 'Copiar la valoración, el número de reseñas y 2 o 3 citas reales de la ficha de Google' },

  // Datos del titular para el aviso legal (LSSI-CE). Mientras "owner" esté vacío, la página
  // "Aviso legal" y su enlace no se publican.
  legal: {
    owner: '', // nombre o razón social
    taxId: '', // NIF/CIF
    address: '', // dirección postal
    registry: '', // datos registrales, si es sociedad
    lastUpdated: '2 de octubre de 2026',
    pendiente: 'Datos del titular (nombre o razón social, NIF/CIF y dirección) para el aviso legal',
  },
};
