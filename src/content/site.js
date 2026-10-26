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
    'Coctelería en el centro de Santa Cruz de Tenerife. Dry Martini, Manhattan y muchos clásicos más, con la carta y los precios, el horario y cómo llegar. Sin reservas.',
  // Imagen de vista previa al compartir el enlace (WhatsApp, redes). 1200×630, en public/img/.
  // Se regenera con: npm run og-image (tras cambios visibles en la portada).
  ogImage: 'img/og.jpg',
  ogImageAlt: 'Memphis Belle Coctelería, Santa Cruz de Tenerife.',

  // CONTACTO
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

  // Crédito de la web en el pie.
  credit: { name: 'Alcance Isleño', url: 'https://alcanceisleno.com' },

  // PORTADA
  hero: {
    kicker: 'Coctelería · Santa Cruz de Tenerife',
    kickerRight: 'Clásicos de coctelería',
    title: ['Coctelería', 'de verdad'],
    lead: 'Coctelería especializada en Santa Cruz de Tenerife. Rones añejos, whiskies y ginebras, para el paladar exigente y para quien desea descubrir algo nuevo.',
    cta: 'Ver la carta',
    secondary: 'Cómo llegar',
    // Fondo de la portada: foto real del mural del B-17 pintado en la pared, con el nombre en amarillo (el dueño pidió
    // no mostrar la cara del bartender). Decorativa, con alt vacío. Sin imagen, la portada usa la ilustración vectorial.
    image: { src: 'img/portada/lampara', widths: [640, 1024, 1333], width: 1333, height: 2000 },
    imageCaption: 'Memphis Belle, B-17',
    // Textos del pie de la portada (el primero es el estado "Abierto ahora", que calcula el navegador).
    foot: ['Cócteles desde 8 €', 'Dorada y Guinness de barril'],
  },
  // Cinta de la portada: nombres que pasan en bucle (decorativa).
  // Lo que hay en la carta, por tipo de bebida (no cócteles concretos): quien mira sabe si tiene ron, ginebra, whisky…
  cinta: ['Ron', 'Whisky', 'Ginebra', 'Vodka', 'Tequila', 'Mezcal', 'Cachaza', 'Pisco', 'Bourbon', 'Vermut', 'Cava', 'Cerveza de barril'],
  // 01 · El bar: titular y texto de presentación, con cuatro fotos de cócteles.
  bar: {
    title: 'Cócteles de autor, <em>sin prisa</em>',
    declaration: 'Cada copa se prepara al momento, con hielo de verdad, técnica clásica y un toque propio.',
    text: 'Pasa por la barra, pide lo que te apetezca o déjate aconsejar: siempre hay algo en la carta que no esperabas.',
    photos: [
      { src: 'img/ambiente/lampara-memphis', alt: 'Lámpara colgante sobre la barra, con los grifos de cerveza al fondo', caption: 'La barra, a media luz' },
      { src: 'img/ambiente/grifos-barril', alt: 'Grifos de cerveza de barril Guinness y Dorada Especial', caption: 'Dorada y Guinness, de barril' },
      { src: 'img/ambiente/chapas-carteles', alt: 'Pared con chapas y carteles antiguos de bebidas bajo tres focos', caption: 'Chapas y carteles de la casa' },
      { src: 'img/ambiente/whiskies', alt: 'Botellas de whisky en una balda de madera', caption: 'Whiskies de todo el mundo' },
    ],
    revisar: 'Confirmar con el local que los textos de presentación describen su forma de trabajar',
  },
  carta: {
    intro: 'Veintitrés cócteles, copas y cerveza de barril. Precios con IGIC incluido.',
    todaLaCarta: 'Toda la carta',
  },
  // GALERÍA del local: tira de fotos sin título (alt describe lo que se ve). Sin pie de foto.
  local: {
    gallery: [
      { src: 'img/ambiente/estanteria-rones', widths: [640, 1024, 1600], width: 1600, height: 1066, alt: 'Estantería de rones y ginebras con los vasos iluminados en azul' },
    ],
  },
  // VISITA / CONTACTO: el bar no admite reservas. No hay formulario: se viene directamente.
  visit: {
    title: '¿Vienes a <em>Memphis Belle?</em>',
    text: 'Sin reservas: entra, siéntate en la barra y déjate aconsejar.',
    place: 'Sin reservas, entra sin avisar',
    mapsText: 'Cómo llegar',
  },

  // CARTA DIGITAL (la real del local). Precios con IGIC incluido, tal como se cobran en la barra.
  // "text" y "nameEn"/"textEn" son opcionales; "allergens" (claves de ALERGENOS en landing.js) también.
  menu: {
    title: 'La carta',
    titleEn: 'The menu',
    sections: [
      {
        id: 'refrescantes', name: 'Refrescantes', nameEn: 'Refreshing',
        intro: 'Largos, frescos y con burbuja', introEn: 'Long, fresh and sparkling',
        items: [
          { name: 'St-Germain', text: 'St-Germain y cava', textEn: 'St-Germain and cava', allergens: ['sulfitos'], price: '10 €' },
          { name: 'Moscow Mule', text: 'Vodka, cerveza de jengibre y lima', textEn: 'Vodka, ginger beer and lime', price: '10 €' },
          { name: 'Caipiriña', nameEn: 'Caipirinha', text: 'Cachaza, lima y soda', textEn: 'Cachaça, lime and soda', price: '10 €' },
          { name: 'Caipiriña con fruta', nameEn: 'Caipirinha with fruit', text: 'Cachaza y fruta', textEn: 'Cachaça and fruit', price: '10 €' },
          { name: 'Mojito', text: 'Ron, lima y soda', textEn: 'Rum, lime and soda', price: '8 €' },
          { name: 'Mojito con fruta', nameEn: 'Mojito with fruit', text: 'Ron, hierbabuena y fruta', textEn: 'Rum, mint and fruit', price: '10 €' },
          { name: 'Tom Collins', text: 'Ginebra, lima y soda', textEn: 'Gin, lime and soda', price: '10 €' },
          { name: 'Garibaldi', nameEn: 'Garibaldi', text: 'Campari, zumo de naranja, caipiroska, cachaza y lima', textEn: 'Campari, orange juice, caipiroska, cachaça and lime', price: '10 €' },
          { name: 'Long Island', text: 'Vodka, ron, tequila, ginebra, lima, sirope y triple seco', textEn: 'Vodka, rum, tequila, gin, lime, syrup and triple sec', price: '10 €' },
        ],
      },
      {
        id: 'sour', name: 'Ácidos y sour', nameEn: 'Sours and citrus',
        intro: 'Cítricos, con espuma y equilibrados', introEn: 'Citrusy, foamy and balanced',
        items: [
          { name: 'Margarita', text: 'Tequila, Cointreau y lima', textEn: 'Tequila, Cointreau and lime', price: '10 €' },
          { name: 'Pisco Sour', text: 'Pisco, lima, azúcar y clara', textEn: 'Pisco, lime, sugar and egg white', allergens: ['huevos'], price: '10 €' },
          { name: 'Whisky Sour', text: 'Whisky, lima, azúcar y clara', textEn: 'Whisky, lime, sugar and egg white', allergens: ['huevos'], price: '10 €' },
          { name: 'Amaretto Sour', text: 'Amaretto, lima, azúcar y clara', textEn: 'Amaretto, lime, sugar and egg white', allergens: ['huevos', 'frutos_secos'], price: '10 €' },
          { name: 'Mezcalita', text: 'Mezcal, limón, triple seco y agave', textEn: 'Mezcal, lemon, triple sec and agave', price: '10 €' },
          { name: 'Hemingway Daiquiri con fruta', nameEn: 'Hemingway Daiquiri with fruit', text: 'Ron, lima y fruta', textEn: 'Rum, lime and fruit', price: '10 €' },
          { name: 'Porn Star Martini', text: 'Vodka de vainilla, licor Passoa, puré de maracuyá y sirope', textEn: 'Vanilla vodka, Passoa liqueur, passion fruit purée and syrup', price: '10 €' },
        ],
      },
      {
        id: 'intensos', name: 'Intensos', nameEn: 'Strong',
        intro: 'Para quien lo quiere con carácter', introEn: 'For those who like it with character',
        items: [
          { name: 'Dry Martini', text: 'Ginebra y vermut seco', textEn: 'Gin and dry vermouth', allergens: ['sulfitos'], price: '10 €' },
          { name: 'Manhattan', text: 'Whisky, vermut rojo y angostura', textEn: 'Whisky, red vermouth and bitters', allergens: ['sulfitos'], price: '10 €' },
          { name: 'Negroni', text: 'Ginebra, Campari y vermut', textEn: 'Gin, Campari and vermouth', allergens: ['sulfitos'], price: '10 €' },
          { name: 'Boulevardier', text: 'Bourbon, Campari y vermut', textEn: 'Bourbon, Campari and vermouth', allergens: ['sulfitos'], price: '10 €' },
          { name: 'Old Fashioned', text: 'Ron, angostura y sirope', textEn: 'Rum, bitters and syrup', price: '10 €' },
          { name: 'Chefa', nameEn: 'Chefa', text: 'Whisky, Aperol, Campari y limón', textEn: 'Whisky, Aperol, Campari and lemon', price: '10 €' },
          { name: 'Bloody Mary', text: 'Vodka, zumo de tomate, salsa Perrins y lima', textEn: 'Vodka, tomato juice, Worcestershire sauce and lime', allergens: ['gluten', 'pescado'], price: '10 €' },
        ],
      },
      {
        id: 'copas', name: 'Copas y cañas', nameEn: 'Long drinks and beer',
        intro: 'Combinados y cerveza de barril', introEn: 'Mixed drinks and draught beer',
        items: [
          { name: 'Copa de combinado', nameEn: 'Mixed drink', price: '8 €' },
          { name: 'Copa premium', nameEn: 'Premium mixed drink', price: '10 / 12 €' },
          { name: 'Caña Dorada Especial', nameEn: 'Dorada Especial draught beer', allergens: ['gluten'], price: '2 €' },
          { name: 'Caña Guinness', nameEn: 'Guinness draught beer', allergens: ['gluten'], price: '4 €' },
        ],
      },
    ],
    // Fotos bajo la carta (sesión de fotos del local). Para cambiarlas: archivos en public/img/carta (640 y 1024 px, webp y jpg).
    photos: [
      { src: 'img/carta/jarra-cobre', widths: [640, 1024], width: 1024, height: 1536, alt: 'Moscow Mule en jarra de cobre con lima y hielo picado' },
      { src: 'img/carta/rocks-lima', widths: [640, 1024], width: 1024, height: 1536, alt: 'Cóctel en vaso corto con rodaja de lima y hielo' },
      { src: 'img/carta/coupe-crema', widths: [640, 1024], width: 1024, height: 1536, alt: 'Cóctel cremoso en copa coupe' },
      { src: 'img/carta/martini-naranja', widths: [640, 835], width: 835, height: 1252, alt: 'Cóctel naranja en copa de martini con piel de naranja' },
      { src: 'img/carta/highball-lima', widths: [640, 1024], width: 1024, height: 1536, alt: 'Cóctel largo con lima y pajita negra' },
      { src: 'img/carta/coupe-especiado', widths: [640, 1024], width: 1024, height: 1536, alt: 'Cóctel en copa coupe con borde especiado y naranja deshidratada' },
      { src: 'img/carta/vaso-corto-naranja', widths: [640, 1024], width: 1024, height: 1536, alt: 'Cóctel rojizo en vaso corto con piel de naranja' },
      { src: 'img/carta/martini-espresso', widths: [640, 1024], width: 1024, height: 1536, alt: 'Cóctel oscuro con espuma en copa de martini' },
      { src: 'img/carta/highball-capas', widths: [640, 1024], width: 1024, height: 1536, alt: 'Cóctel largo en capas con pajita negra' },
      { src: 'img/carta/cana-barril', widths: [640, 1024], width: 1024, height: 1536, alt: 'Caña de cerveza oscura de barril en copa' },
    ],
    // Cuántos cócteles hay (para el titular de la carta): 23 entre refrescantes, sour e intensos.
    barril: { text: 'Dorada Especial y Guinness, directas del grifo.', textEn: 'Dorada Especial and Guinness, straight from the tap.', label: 'De barril', labelEn: 'On draught' },
    revisar: 'Alérgenos publicados según la receta base de la carta (docs/ALERGENOS.md): confirmar con el dueño las marcas (amaretto, cerveza de jengibre), los zumos y el apio del Bloody Mary',
    allergensNote: 'Alérgenos según la receta base de cada cóctel. Si tienes alguna alergia o intolerancia, dínoslo antes de pedir.',
    allergensNoteEn: "Allergens are listed according to each cocktail's base recipe. If you have any allergy or intolerance, please tell us before ordering.",
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
    writeUrl: 'https://g.page/r/CbHxxpLWAlm2EBM/review',
  },

  // RESEÑAS: la sección solo aparece si hay valoración. Citas reales de Google (con su autor tal como
  // aparece en la reseña), máximo 3 líneas cada una: { text: '...', author: 'Nombre' }.
  reviews: { rating: '4,7', count: '112', quotes: [
    // Cita real de Google (hace unos 2 meses). Se omite lo de la comida, que no está en la carta, marcado con […].
    { text: 'Excelente lugar para pasar un excelente rato, trato inmejorable, cócteles […] Con cada cóctel te dan la explicación de su preparación. Lo recomiendo al 100%', author: 'Sonia Perera' },
    { text: 'Hemos venido varias veces con amigos y en pareja (incluso con el perro) y siempre de lujo. Cocteles clásicos y de autor. Buena música. […] El trato genial. Seguiremos viniendo 100%.', author: 'Elena' },
  ], revisar: 'Valoración de la ficha de Google (octubre de 2026): actualizar la nota y el número de vez en cuando; añadir alguna cita más si se quiere (hay dos)' },

  // Datos del titular para el aviso legal (LSSI-CE). Mientras "owner" esté vacío, la página
  // "Aviso legal" y su enlace no se publican.
  legal: {
    owner: '', // nombre o razón social
    taxId: '', // NIF/CIF
    address: '', // dirección postal
    registry: '', // datos registrales, si es sociedad
    lastUpdated: '20 de octubre de 2026',
    pendiente: 'Datos del titular (nombre o razón social, NIF/CIF y dirección) para el aviso legal',
  },

  // VERSIÓN EN INGLÉS de la portada (en.html). Cada bloque se mezcla sobre el español: lo que no se traduce
  // aquí se queda como está (nombres de cócteles, fotos, números). La carta tiene sus propios campos nameEn/textEn.
  en: {
    title: 'Memphis Belle Cocktail Bar | Classic cocktails in Santa Cruz',
    description: 'Cocktail bar in the centre of Santa Cruz de Tenerife. Dry Martini, Manhattan and plenty more classics, with the full menu and prices, opening hours and directions. No bookings.',
    hero: {
      kicker: 'Cocktail bar · Santa Cruz de Tenerife',
      kickerRight: 'Classic cocktails',
      title: ['Cocktails', 'done right'],
      lead: 'Specialist cocktail bar in Santa Cruz de Tenerife. Aged rums, whiskies and gins, for the discerning palate and for those who wish to discover something new.',
      cta: 'See the menu',
      secondary: 'Get directions',
      imageCaption: 'Memphis Belle, B-17',
      foot: ['Cocktails from €8', 'Dorada and Guinness on draught'],
    },
    menu: {
      photos: [
        { alt: 'Moscow Mule in a copper mug with lime and crushed ice' },
        { alt: 'Short cocktail with a lime wheel and ice' },
        { alt: 'Creamy cocktail in a coupe glass' },
        { alt: 'Orange cocktail in a martini glass with orange peel' },
        { alt: 'Tall cocktail with lime and a black straw' },
        { alt: 'Cocktail in a coupe with a spiced rim and dried orange' },
        { alt: 'Reddish cocktail in a short glass with orange peel' },
        { alt: 'Dark cocktail with foam in a martini glass' },
        { alt: 'Layered tall cocktail with a black straw' },
        { alt: 'Dark draught beer in a stemmed glass' },
      ],
    },
    cinta: ['Rum', 'Whisky', 'Gin', 'Vodka', 'Tequila', 'Mezcal', 'Cachaça', 'Pisco', 'Bourbon', 'Vermouth', 'Cava', 'Draught beer'],
    bar: {
      title: 'Craft cocktails, <em>no rush</em>',
      declaration: 'Every drink is made to order, with real ice, classic technique and a touch of our own.',
      text: 'Come to the bar, order what you fancy or let us advise you: there is always something on the menu you did not expect.',
      photos: [
        { alt: 'Pendant lamp over the bar with the beer taps behind', caption: 'The bar, in low light' },
        { alt: 'Guinness and Dorada Especial draught beer taps', caption: 'Dorada and Guinness, on draught' },
        { alt: 'Wall of old drinks signs and posters under three spotlights', caption: 'Signs and posters from the house' },
        { alt: 'Whisky bottles on a wooden shelf', caption: 'Whiskies from around the world' },
      ],
    },
    carta: {
      intro: 'Twenty-three cocktails, mixed drinks and draught beer. Prices include IGIC.',
      todaLaCarta: 'The full menu',
    },
    local: {
      gallery: [
        { alt: 'Shelves of rums and gins with the glasses lit in blue' },
      ],
    },
    visit: {
      title: 'Coming to <em>Memphis Belle?</em>',
      text: 'No bookings: walk in, sit at the bar and let us advise you.',
      place: 'No bookings, just walk in',
      mapsText: 'Get directions',
    },
  },
};
