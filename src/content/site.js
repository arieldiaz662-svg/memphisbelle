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
  phone: '34636864193', // con prefijo de país, solo dígitos
  phoneDisplay: '636 864 193',
  // WhatsApp para dudas (el bar no admite reservas). Se asume el mismo número que el teléfono: confirmarlo.
  whatsapp: { number: '34636864193', pendiente: 'Confirmar que el 636 864 193 tiene WhatsApp y que atienden dudas por ahí' },
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
    lead: 'Una de las pocas coctelerías especializadas de Santa Cruz. Rones añejos, whiskies y ginebras para quien sabe lo que busca… y para quien quiere descubrirlo.',
    cta: 'Ver la carta',
    secondary: 'Cómo llegar',
    // Fondo de la portada: el B-17 al atardecer (generada con Gemini a partir de docs/PROMPTS-HIGGSFIELD.md,
    // P1). Decorativa, con alt vacío. Sin imagen, la portada usa la ilustración vectorial (bombardero.js).
    image: { src: 'img/portada/b17', widths: [640, 1024, 1376], width: 1376, height: 768 },
    imageCaption: 'Memphis Belle, B-17',
    // Textos del pie de la portada (el primero es el estado "Abierto ahora", que calcula el navegador).
    foot: ['Cócteles desde 8 €', 'Dorada y Guinness de barril'],
  },
  // Cinta de la portada: nombres que pasan en bucle (decorativa).
  cinta: ['Dry Martini', 'Negroni', 'Mojito', 'Pisco Sour', 'Moscow Mule', 'Old Fashioned', 'Porn Star Martini', 'Guinness de barril'],
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
  // 03 · La carta: "Los imprescindibles" (con su icono) antes de toda la carta. El precio va aquí porque el
  // Hemingway Daiquiri solo está en la carta "con fruta".
  highlights: [
    { name: 'Dry Martini', icon: 'martini', text: 'Dos ingredientes y cien años de debate sobre la proporción exacta. Aquí, la nuestra.', ingredients: 'Ginebra · vermut seco', price: '10 €' },
    { name: 'Manhattan', icon: 'manhattan', text: 'La fórmula que no envejece. Perfecto antes de cenar o después de cualquier cosa.', ingredients: 'Whisky · vermut rojo · angostura', price: '10 €' },
    { name: 'Hemingway Daiquiri', icon: 'daiquiri', text: 'El clásico de La Habana, en nuestra versión con fruta.', ingredients: 'Ron · lima · fruta', price: '10 €' },
  ],
  carta: {
    intro: 'Veintitrés cócteles, copas y cerveza de barril. Empieza por los imprescindibles de la casa.',
    imprescindibles: 'Los imprescindibles',
    todaLaCarta: 'Toda la carta',
  },
  // GALERÍA del local: tira de fotos sin título (alt describe lo que se ve). Sin pie de foto.
  local: {
    gallery: [
      { src: 'img/ambiente/barra-estanteria', widths: [640, 1000], width: 1000, height: 764, alt: 'Barra de madera y estantería de botellas con luz verde' },
      { src: 'img/ambiente/ventana', widths: [640], width: 624, height: 1104, alt: 'Interior del bar junto a la ventana' },
      { src: 'img/ambiente/baldosa', widths: [640], width: 624, height: 820, alt: 'Mesas altas y suelo de baldosa hidráulica' },
    ],
  },
  // VISITA / CONTACTO: el bar no admite reservas. No hay formulario: se viene directamente.
  visit: {
    title: '¿Vienes a <em>Memphis Belle?</em>',
    text: 'Sin reservas: entra, siéntate en la barra y déjate aconsejar.',
    place: 'Sin reservas · entra sin avisar',
    whatsappText: 'Hola, tengo una pregunta sobre Memphis Belle.',
    mapsText: 'Cómo llegar',
    whatsappLabel: 'Escríbenos por WhatsApp',
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
          { name: 'St-Germain', text: 'St-Germain y cava', textEn: 'St-Germain and cava', price: '10 €' },
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
          { name: 'Pisco Sour', text: 'Pisco, lima, azúcar y clara', textEn: 'Pisco, lime, sugar and egg white', price: '10 €' },
          { name: 'Whisky Sour', text: 'Whisky, lima, azúcar y clara', textEn: 'Whisky, lime, sugar and egg white', price: '10 €' },
          { name: 'Amaretto Sour', text: 'Amaretto, lima, azúcar y clara', textEn: 'Amaretto, lime, sugar and egg white', price: '10 €' },
          { name: 'Mezcalita', text: 'Mezcal, limón, triple seco y agave', textEn: 'Mezcal, lemon, triple sec and agave', price: '10 €' },
          { name: 'Hemingway Daiquiri con fruta', nameEn: 'Hemingway Daiquiri with fruit', text: 'Ron, lima y fruta', textEn: 'Rum, lime and fruit', price: '10 €' },
          { name: 'Porn Star Martini', text: 'Vodka de vainilla, licor Passoa, puré de maracuyá y sirope', textEn: 'Vanilla vodka, Passoa liqueur, passion fruit purée and syrup', price: '10 €' },
        ],
      },
      {
        id: 'intensos', name: 'Intensos', nameEn: 'Strong',
        intro: 'Para quien lo quiere con carácter', introEn: 'For those who like it with character',
        items: [
          { name: 'Dry Martini', text: 'Ginebra y vermut seco', textEn: 'Gin and dry vermouth', price: '10 €' },
          { name: 'Manhattan', text: 'Whisky, vermut rojo y angostura', textEn: 'Whisky, red vermouth and bitters', price: '10 €' },
          { name: 'Negroni', text: 'Ginebra, Campari y vermut', textEn: 'Gin, Campari and vermouth', price: '10 €' },
          { name: 'Boulevardier', text: 'Bourbon, Campari y vermut', textEn: 'Bourbon, Campari and vermouth', price: '10 €' },
          { name: 'Old Fashioned', text: 'Ron, angostura y sirope', textEn: 'Rum, bitters and syrup', price: '10 €' },
          { name: 'Chefa', nameEn: 'Chefa', text: 'Whisky, Aperol, Campari y limón', textEn: 'Whisky, Aperol, Campari and lemon', price: '10 €' },
          { name: 'Bloody Mary', text: 'Vodka, zumo de tomate, salsa Perrins y lima', textEn: 'Vodka, tomato juice, Worcestershire sauce and lime', price: '10 €' },
        ],
      },
      {
        id: 'copas', name: 'Copas y cañas', nameEn: 'Long drinks and beer',
        intro: 'Combinados y cerveza de barril', introEn: 'Mixed drinks and draught beer',
        items: [
          { name: 'Copa de combinado', nameEn: 'Mixed drink', price: '8 €' },
          { name: 'Copa premium', nameEn: 'Premium mixed drink', price: '10 / 12 €' },
          { name: 'Caña Dorada Especial', nameEn: 'Dorada Especial draught beer', text: 'De barril', textEn: 'On draught', price: '2 €' },
          { name: 'Caña Guinness', nameEn: 'Guinness draught beer', text: 'De barril', textEn: 'On draught', price: '4 €' },
        ],
      },
    ],
    // Cuántos cócteles hay (para el titular de la carta): 23 entre refrescantes, sour e intensos.
    barril: { text: 'Dorada Especial y Guinness, directas del grifo.', textEn: 'Dorada Especial and Guinness, straight from the tap.', label: 'De barril', labelEn: 'On draught' },
    allergensNote: 'Si tienes alguna alergia o intolerancia, dínoslo antes de pedir.',
    allergensNoteEn: 'If you have any allergy or intolerance, please tell us before ordering.',
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
    title: 'Memphis Belle Cocktail Bar | Classic cocktails in Santa Cruz',
    description: 'Cocktail bar in the centre of Santa Cruz de Tenerife. Dry Martini, Manhattan and plenty more classics, with the full menu and prices, opening hours and directions. No bookings.',
    hero: {
      kicker: 'Cocktail bar · Santa Cruz de Tenerife',
      kickerRight: 'Classic cocktails',
      title: ['Cocktails', 'done right'],
      lead: 'One of the few specialist cocktail bars in Santa Cruz. Aged rums, whiskies and gins for those who know what they are after… and for those who want to find out.',
      cta: 'See the menu',
      secondary: 'Get directions',
      imageCaption: 'Memphis Belle, B-17',
      foot: ['Cocktails from €8', 'Dorada and Guinness on draught'],
    },
    cinta: ['Dry Martini', 'Negroni', 'Mojito', 'Pisco Sour', 'Moscow Mule', 'Old Fashioned', 'Porn Star Martini', 'Draught Guinness'],
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
      { text: 'Two ingredients and a hundred years of debate over the exact proportion. Here, ours.', ingredients: 'Gin · dry vermouth' },
      { text: 'The formula that never ages. Perfect before dinner or after anything.', ingredients: 'Whiskey · red vermouth · bitters' },
      { text: 'The Havana classic, in our version with fruit.', ingredients: 'Rum · lime · fruit' },
    ],
    carta: {
      intro: 'Twenty-three cocktails, mixed drinks and draught beer. Start with the house essentials.',
      imprescindibles: 'The essentials',
      todaLaCarta: 'The full menu',
    },
    local: {
      gallery: [
        { alt: 'Wooden bar and shelves of bottles under green light' },
        { alt: 'Inside the bar by the window' },
        { alt: 'High tables and hydraulic tile floor' },
      ],
    },
    visit: {
      title: 'Coming to <em>Memphis Belle?</em>',
      text: 'No bookings: walk in, sit at the bar and let us advise you.',
      place: 'No bookings · just walk in',
      whatsappText: 'Hi, I have a question about Memphis Belle.',
      mapsText: 'Get directions',
      whatsappLabel: 'Message us on WhatsApp',
    },
  },
};
