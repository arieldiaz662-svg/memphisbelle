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
    kicker: 'Coctelería · Santa Cruz de Tenerife',
    kickerRight: 'Clásicos de coctelería',
    title: ['Coctelería', 'de verdad'],
    lead: 'Los mejores clásicos de coctelería, en el centro de Santa Cruz. Dry Martini, Manhattan y terraza.',
    cta: 'Reservar mesa',
    secondary: 'Ver la carta',
    // Fondo de la portada: el B-17 al atardecer (generada con Gemini a partir de docs/PROMPTS-HIGGSFIELD.md,
    // P1). Decorativa, con alt vacío. Sin imagen, la portada usa la ilustración vectorial (bombardero.js).
    image: { src: 'img/portada/b17', widths: [640, 1024, 1376], width: 1376, height: 768 },
    imageCaption: 'Memphis Belle, B-17',
    // Textos del pie de la portada (el primero es el estado "Abierto ahora", que calcula el navegador).
    foot: ['Clásicos y cócteles de la casa', 'Terraza en la calle de los Sueños'],
  },
  // Cinta de la portada: nombres que pasan en bucle (decorativa). Los cócteles salen de la carta.
  cinta: ['Dry Martini', 'Manhattan', 'Negroni', 'Old Fashioned', 'Daiquiri', 'Margarita', 'Bloody Mary', 'Mié–dom hasta las 2:00'],
  // 01 · El bar: titular y texto de presentación, con cuatro fotos de cócteles.
  bar: {
    title: 'Cócteles de autor, <em>sin prisa</em>',
    declaration: 'Cada copa se prepara al momento, con hielo de verdad, técnica clásica y un toque propio.',
    text: 'Pasa por la barra, pide lo que te apetezca o déjate aconsejar: siempre hay algo en la carta que no esperabas.',
    photos: [
      { src: 'img/ambiente/coctel-naranja', alt: 'Cóctel naranja con rodaja de lima en copa de martini', caption: 'Naranja, lima y copa escarchada', pos: 'a' },
      { src: 'img/ambiente/coctel-espuma', alt: 'Cóctel con espuma blanca y romero', caption: 'Espuma y romero', pos: 'b' },
      { src: 'img/ambiente/coctel-tiki', alt: 'Cócteles tiki en vasos de cerámica sobre la barra', caption: 'Tiki en cerámica', pos: 'c' },
      { src: 'img/ambiente/coctel-canela', alt: 'Cóctel con espuma, canela y rodajas de naranja deshidratada', caption: 'Espuma, canela y naranja', pos: 'b' },
    ],
    revisar: 'Confirmar con el local que los textos de presentación describen su forma de trabajar y que las fotos de cócteles son suyas o de uso libre',
  },
  // 02 · El oficio: cuatro escenas de barra dibujadas (animación decorativa) y el cóctel ahumado.
  oficio: {
    title: 'El oficio, <em>en movimiento</em>',
    text: 'Así nacen algunas de las copas que ves en las fotos. Técnica de barra, sin atajos.',
    items: [
      { id: 'humo', title: 'Ahumado al soplete', text: 'La llama toca el borde, salta la chispa y el humo perfuma la copa antes del primer trago.', aria: 'Cóctel ahumándose con un soplete: la llama toca el borde del vaso, saltan chispas y sube el humo' },
      { id: 'colar', title: 'Agitado y colado', text: 'Hielo, coctelera y un colado fino directo a la copa escarchada.', aria: 'Coctelera inclinada colando un cóctel en una copa de martini escarchada que se va llenando' },
      { id: 'espuma', title: 'Espuma de seda', text: 'Agitado en seco para montar la espuma y una rama de romero para el aroma.', aria: 'Coctelera agitándose con fuerza junto a un vaso con espuma blanca y una rama de romero' },
      { id: 'tiki', title: 'Swizzle tiki', text: 'Hielo picado y la varilla girando hasta que la taza escarcha.', aria: 'Varilla swizzle girando dentro de una taza tiki con hielo picado mientras el vaso escarcha' },
      { id: 'canela', title: 'Canela al momento', text: 'Canela rallada sobre la espuma y naranja deshidratada al lado.', aria: 'Rama de canela rallándose sobre un vaso alto con espuma; el polvo cae sobre la espuma' },
    ],
    revisar: 'Confirmar que estas técnicas (ahumado, espuma, tiki, canela) se usan de verdad en la barra; si no, quitar las que sobren',
  },
  // 03 · La carta: tres clásicos destacados con su icono (el precio sale de la carta).
  highlights: [
    { name: 'Dry Martini', icon: 'martini', text: 'Tres ingredientes y cien años de debate sobre la proporción exacta. Aquí, la nuestra.', ingredients: 'Ginebra · vermut · aceituna', epoch: 'Principios del s. XX' },
    { name: 'Manhattan', icon: 'manhattan', text: 'La fórmula que no envejece. Perfecto antes de cenar o después de cualquier cosa.', ingredients: 'Whisky · vermut rojo · bitters', epoch: 'Década de 1880' },
    { name: 'Daiquiri', icon: 'daiquiri', text: 'El trago que hizo famoso El Floridita de La Habana, en su versión más pura.', ingredients: 'Ron blanco · lima · azúcar', epoch: 'Popular desde los años 30' },
  ],

  // EL LOCAL (servicios de la ficha de Google). Mosaico de 3: el primero va grande.
  // "image" es opcional ({ src: 'img/local/terraza.jpg', alt: '...' }, foto propia en public/img/): sin
  // fotos, la sección es tipográfica; con alguna, se muestra el mosaico. Nunca hay huecos vacíos.
  local: {
    title: 'Ladrillo, botellas <em>y luz cálida</em>',
    // Fotos del local (galería). Alt y pie describen lo que se ve.
    gallery: [
      { src: 'img/ambiente/barra-estanteria', widths: [640, 1000], width: 1000, height: 764, alt: 'Barra de madera y estantería de botellas con luz verde', caption: 'La barra' },
      { src: 'img/ambiente/ventana', widths: [640], width: 624, height: 1104, alt: 'Interior del bar junto a la ventana', caption: 'Junto a la ventana' },
      { src: 'img/ambiente/baldosa', widths: [640], width: 624, height: 820, alt: 'Mesas altas y suelo de baldosa hidráulica', caption: 'Baldosa hidráulica' },
    ],
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
    titleEn: 'The menu',
    note: 'Precios con IGIC incluido. Pregunta por los cócteles fuera de carta.',
    noteEn: 'Prices include IGIC (Canary Islands tax). Ask about cocktails off the menu.',
    pendiente: 'Carta de ejemplo: sustituir por la carta real con precios y su traducción al inglés',
    // ALÉRGENOS: aviso general siempre visible en la página de la carta. Por bebida, opcional: añadir
    // `allergens: ['sulfitos', 'gluten']` (claves de ALERGENOS en src/views/carta.js) y se muestran bajo
    // el plato con su leyenda. Rellenarlo con la información real de cada bebida; no hay datos de ejemplo
    // para no dar información falsa sobre alérgenos.
    allergensNote: 'Si tienes alguna alergia o intolerancia, díselo a quien te atienda: te informamos de los alérgenos de cada bebida.',
    allergensNoteEn: 'If you have an allergy or intolerance, please tell our staff: we will let you know the allergens in each drink.',
    sections: [
      {
        id: 'clasicos',
        name: 'Clásicos', nameEn: 'Classics',
        items: [
          { name: 'Dry Martini', text: 'Ginebra, vermut seco, aceituna o twist de limón.', textEn: 'Gin, dry vermouth, olive or lemon twist.', price: '9,00 €' },
          { name: 'Manhattan', text: 'Rye whiskey, vermut rojo, angostura.', textEn: 'Rye whiskey, sweet vermouth, bitters.', price: '9,00 €' },
          { name: 'Negroni', text: 'Ginebra, Campari, vermut rojo.', textEn: 'Gin, Campari, sweet vermouth.', price: '9,00 €' },
          { name: 'Old Fashioned', text: 'Bourbon, azúcar, angostura, piel de naranja.', textEn: 'Bourbon, sugar, bitters, orange peel.', price: '9,50 €' },
          { name: 'Daiquiri', text: 'Ron blanco, lima, azúcar.', textEn: 'White rum, lime, sugar.', price: '8,50 €' },
          { name: 'Margarita', text: 'Tequila, triple seco, lima.', textEn: 'Tequila, triple sec, lime.', price: '8,50 €' },
          { name: 'Bloody Mary', text: 'Vodka, tomate, lima, Worcestershire, tabasco, sal de apio.', textEn: 'Vodka, tomato, lime, Worcestershire, Tabasco, celery salt.', price: '9,50 €' },
        ],
      },
      {
        id: 'de-la-casa',
        name: 'De la casa', nameEn: 'House cocktails',
        items: [
          { name: 'Memphis Belle', text: 'El cóctel de la casa.', textEn: 'The house cocktail.', price: '10,00 €' },
          { name: 'Calle de los Sueños', text: 'Ron añejo canario, miel de palma, lima.', textEn: 'Aged Canarian rum, palm honey, lime.', price: '10,00 €' },
          { name: 'Espresso Martini', text: 'Vodka, café, licor de café.', textEn: 'Vodka, coffee, coffee liqueur.', price: '9,50 €' },
        ],
      },
      {
        id: 'sin-alcohol',
        name: 'Sin alcohol', nameEn: 'Alcohol-free',
        items: [
          { name: 'Virgin Mojito', text: 'Lima, hierbabuena, soda.', textEn: 'Lime, mint, soda.', price: '6,00 €' },
          { name: 'Refresco', nameEn: 'Soft drink', price: '2,50 €' },
          { name: 'Agua', nameEn: 'Water', price: '2,00 €' },
        ],
      },
      {
        id: 'cervezas-y-vinos',
        name: 'Cervezas y vinos', nameEn: 'Beer and wine',
        items: [
          { name: 'Cerveza', nameEn: 'Beer', price: '3,00 €' },
          { name: 'Copa de vino', nameEn: 'Glass of wine', price: '4,00 €' },
          { name: 'Copa de cava', nameEn: 'Glass of cava', price: '5,00 €' },
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
    // Imagen de ambiente de fondo (generada con ChatGPT: una barra genérica, NO es el local; según los
    // términos de OpenAI, la imagen generada es nuestra y admite uso comercial). Va sin pie de foto y con
    // alt vacío, porque es decorativa. Versiones en public/img/ambiente/barra-<ancho>.webp/.jpg.
    image: { src: 'img/ambiente/barra', widths: [640, 1024, 1536], width: 1536, height: 1024 },
  },

  // VALORACIÓN EN GOOGLE (opcional). Si rating está vacío no se muestra.
  // Copiarla de la ficha y actualizarla de vez en cuando: un número antiguo resta credibilidad.
  // DÉJANOS UNA RESEÑA: franja fija bajo "Visítanos" y enlace en el pie. Es lo más importante para el
  // dueño: cada reseña en Google ayuda a que el bar aparezca antes en las búsquedas.
  // "writeUrl" es el enlace directo a escribir la reseña. Se saca de la ficha de Google Business:
  // Perfil de la empresa > "Pedir reseñas" > copiar el enlace (empieza por https://g.page/r/ o
  // https://search.google.com/local/writereview). Mientras esté vacío, el botón lleva a la ficha del bar
  // en Google Maps (googleMapsUrl), donde también se puede escribir la reseña.
  reviewCta: {
    title: '¿Has estado con nosotros?',
    text: 'Tu opinión en Google ayuda a que más gente nos encuentre.',
    button: 'Déjanos una reseña en Google',
    titleEn: 'Been with us?',
    textEn: 'Your Google review helps more people find us.',
    buttonEn: 'Leave us a Google review',
    writeUrl: '',
    revisar: 'Copiar de la ficha de Google Business el enlace de "Pedir reseñas" en reviewCta.writeUrl para que el botón lleve directo a escribir la reseña',
  },

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

  // VERSIÓN EN INGLÉS de la portada (en.html). Cada bloque se mezcla sobre el español: lo que no se traduce
  // aquí se queda como está (nombres de cócteles, fotos, números). La carta tiene sus propios campos nameEn/textEn.
  en: {
    title: 'Memphis Belle Cocktail Bar | Classic cocktails in Santa Cruz de Tenerife',
    description: 'Cocktail bar in the centre of Santa Cruz de Tenerife. Dry Martini, Manhattan and all the classics, with a terrace and pets welcome. See the menu and opening hours, and book by WhatsApp.',
    hero: {
      kicker: 'Cocktail bar · Santa Cruz de Tenerife',
      kickerRight: 'Classic cocktails',
      title: ['Cocktails', 'done right'],
      lead: 'The best classic cocktails in the heart of Santa Cruz. Dry Martini, Manhattan and a terrace.',
      cta: 'Book a table',
      secondary: 'See the menu',
      imageCaption: 'Memphis Belle, B-17',
      foot: ['Classics and house cocktails', 'Terrace on Calle de los Sueños'],
    },
    cinta: ['Dry Martini', 'Manhattan', 'Negroni', 'Old Fashioned', 'Daiquiri', 'Margarita', 'Bloody Mary', 'Wed–Sun until 2:00'],
    featured: {
      label: 'Signature cocktail',
      text: 'The classic of vodka and tomato, with the heat and the salt our way. Served long, with plenty of ice and its celery stick.',
      ingredients: ['Vodka', 'Tomato juice', 'Lime', 'Worcestershire sauce', 'Tabasco', 'Celery salt and black pepper'],
    },
    bar: {
      title: 'Craft cocktails, <em>no rush</em>',
      declaration: 'Every drink is made to order, with real ice, classic technique and a touch of our own.',
      text: 'Come to the bar, order what you fancy or let us advise you: there is always something on the menu you did not expect.',
      photos: [
        { alt: 'Orange cocktail with a slice of lime in a martini glass', caption: 'Orange, lime and a frosted glass' },
        { alt: 'Cocktail with white foam and rosemary', caption: 'Foam and rosemary' },
        { alt: 'Tiki cocktails in ceramic mugs on the bar', caption: 'Tiki in ceramic' },
        { alt: 'Cocktail with foam, cinnamon and dehydrated orange slices', caption: 'Foam, cinnamon and orange' },
      ],
    },
    oficio: {
      title: 'The craft, <em>in motion</em>',
      text: 'This is how some of the drinks in the photos are born. Bar technique, no shortcuts.',
      items: [
        { title: 'Smoked with a torch', text: 'The flame touches the rim, a spark flies and the smoke perfumes the glass before the first sip.', aria: 'Cocktail being smoked with a torch: the flame touches the rim of the glass, sparks fly and smoke rises' },
        { title: 'Shaken and strained', text: 'Ice, shaker and a fine strain straight into the frosted glass.', aria: 'Tilted shaker straining a cocktail into a frosted martini glass that slowly fills' },
        { title: 'Silky foam', text: 'Dry shaken to build the foam, with a sprig of rosemary for the aroma.', aria: 'Shaker being shaken hard next to a glass with white foam and a sprig of rosemary' },
        { title: 'Tiki swizzle', text: 'Crushed ice and the swizzle stick spinning until the mug frosts.', aria: 'Swizzle stick spinning inside a tiki mug of crushed ice while the glass frosts' },
        { title: 'Fresh cinnamon', text: 'Cinnamon grated over the foam and dehydrated orange on the side.', aria: 'Cinnamon stick being grated over a tall glass with foam; the powder falls onto the foam' },
      ],
    },
    highlights: [
      { text: 'Three ingredients and a hundred years of debate over the exact proportion. Here, ours.', ingredients: 'Gin · vermouth · olive', epoch: 'Early 20th century' },
      { text: 'The formula that never ages. Perfect before dinner or after anything.', ingredients: 'Whiskey · red vermouth · bitters', epoch: '1880s' },
      { text: 'The drink that made El Floridita in Havana famous, in its purest version.', ingredients: 'White rum · lime · sugar', epoch: 'Popular since the 1930s' },
    ],
    local: {
      title: 'Brick, bottles <em>and warm light</em>',
      gallery: [
        { alt: 'Wooden bar and shelves of bottles under green light', caption: 'The bar' },
        { alt: 'Inside the bar by the window', caption: 'By the window' },
        { alt: 'High tables and hydraulic tile floor', caption: 'Hydraulic tiles' },
      ],
      items: [
        { title: 'Terrace', text: 'About 30 people outside, on Calle de los Sueños.' },
        { title: 'Inside', text: '40 people, by the bar and the bomber mural.' },
        { title: 'Pets welcome', text: 'Your dog is welcome inside and on the terrace.' },
      ],
    },
    visit: { title: 'Visit us', note: 'In the centre of Santa Cruz.' },
    booking: {
      title: 'Book your table',
      intro: 'Tell us how many of you there are and when you are coming. WhatsApp opens with the message already written: just send it and we will confirm.',
      groupsNote: 'For groups of more than 12 people, call us.',
    },
  },
};
