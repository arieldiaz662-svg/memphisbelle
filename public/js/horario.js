// Horario del local: qué días abre y si está abierto ahora, en hora de Canarias.
// Módulo compartido: lo usan el navegador (estado "Abierto ahora"), la construcción de la web (tabla
// de horario y datos para Google) y los tests. Sin dependencias.

export const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
export const NOMBRES = {
  lunes: 'lunes', martes: 'martes', miercoles: 'miércoles', jueves: 'jueves',
  viernes: 'viernes', sabado: 'sábado', domingo: 'domingo',
};
export const ZONA = 'Atlantic/Canary';

const minutos = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};
// Una franja que cierra a una hora "menor" que la de apertura termina al día siguiente (18:00 → 02:00).
const pasaMedianoche = ([abre, cierra]) => minutos(cierra) <= minutos(abre);

// Día de la semana (0 = lunes) y minutos desde medianoche en Canarias, sea cual sea la zona del equipo.
export function horaCanaria(fecha) {
  const partes = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(fecha).map((p) => [p.type, p.value]));
  const dia = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(partes.weekday);
  return { dia, minuto: Number(partes.hour) * 60 + Number(partes.minute) };
}

// { abierto: true, cierra: '02:00' } o { abierto: false, abre: '18:00', cuando: 'hoy' | 'mañana' | 'el miércoles' }.
// Si no abre ningún día, { abierto: false }.
export function estado(dias, fecha = new Date()) {
  const { dia, minuto } = horaCanaria(fecha);
  const franja = (i) => dias[DIAS[(i + 7) % 7]];

  const ayer = franja(dia - 1);
  if (ayer && pasaMedianoche(ayer) && minuto < minutos(ayer[1])) return { abierto: true, cierra: ayer[1] };

  const hoy = franja(dia);
  if (hoy) {
    const [abre, cierra] = hoy.map(minutos);
    if (minuto >= abre && (pasaMedianoche(hoy) || minuto < cierra)) return { abierto: true, cierra: hoy[1] };
    if (minuto < abre) return { abierto: false, abre: hoy[0], cuando: 'hoy' };
  }
  for (let i = 1; i <= 7; i++) {
    const siguiente = franja(dia + i);
    if (siguiente) {
      const cuando = i === 1 ? 'mañana' : `el ${NOMBRES[DIAS[(dia + i) % 7]]}`;
      return { abierto: false, abre: siguiente[0], cuando };
    }
  }
  return { abierto: false };
}

const DIAS_EN = {
  lunes: 'Monday', martes: 'Tuesday', miercoles: 'Wednesday', jueves: 'Thursday',
  viernes: 'Friday', sabado: 'Saturday', domingo: 'Sunday',
};

// "Abierto ahora, hasta las 02:00" (o en inglés: "Open now, until 02:00").
export function textoEstado(e, idioma = 'es') {
  if (idioma === 'en') {
    if (e.abierto) return `Open now, until ${e.cierra}`;
    if (e.abre) {
      const dia = Object.keys(NOMBRES).find((d) => `el ${NOMBRES[d]}` === e.cuando);
      const cuando = e.cuando === 'hoy' ? 'today' : e.cuando === 'mañana' ? 'tomorrow' : `on ${DIAS_EN[dia]}`;
      return `Closed. We open ${cuando} at ${e.abre}`;
    }
    return 'Closed';
  }
  if (e.abierto) return `Abierto ahora, hasta las ${e.cierra}`;
  if (e.abre) return `Cerrado. Abrimos ${e.cuando} a las ${e.abre}`;
  return 'Cerrado';
}

// Horario agrupado en pocas líneas, para leerlo de un vistazo: primero los días que abre y luego los
// que cierra. ["De miércoles a domingo, de 18:00 a 02:00", "Lunes y martes, cerrado"].
// Junta los días seguidos con la misma franja, también de domingo a lunes (p. ej. "De sábado a lunes").
export function resumen(dias) {
  const clave = (d) => (dias[d] ? dias[d].join('-') : 'cerrado');
  const grupos = [];
  DIAS.forEach((d, i) => {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.clave === clave(d)) ultimo.dias.push(i);
    else grupos.push({ clave: clave(d), dias: [i] });
  });
  // El último grupo (que acaba en domingo) sigue en el primero (que empieza en lunes) si es igual.
  if (grupos.length > 1 && grupos[0].clave === grupos[grupos.length - 1].clave) {
    grupos[0].dias = [...grupos.pop().dias, ...grupos[0].dias];
  }
  const nombre = (i) => NOMBRES[DIAS[i]];
  const capital = (t) => `${t[0].toUpperCase()}${t.slice(1)}`;
  const cuando = (ds) => {
    if (ds.length === 1) return capital(nombre(ds[0]));
    if (ds.length === 2) return `${capital(nombre(ds[0]))} y ${nombre(ds[1])}`;
    if (ds.length === 7) return 'Todos los días';
    return `De ${nombre(ds[0])} a ${nombre(ds[ds.length - 1])}`;
  };
  const linea = (g) => (g.clave === 'cerrado'
    ? `${cuando(g.dias)}, cerrado`
    : `${cuando(g.dias)}, de ${dias[DIAS[g.dias[0]]][0]} a ${dias[DIAS[g.dias[0]]][1]}`);
  const porDia = (a, b) => a.dias[0] - b.dias[0];
  const abiertos = grupos.filter((g) => g.clave !== 'cerrado').sort(porDia);
  const cerrados = grupos.filter((g) => g.clave === 'cerrado').sort(porDia);
  return [...abiertos, ...cerrados].map(linea);
}

// ¿Abre ese día? (para avisar en el formulario de reservas). fechaISO: "2026-10-09".
export function abreEseDia(dias, fechaISO) {
  const [a, m, d] = fechaISO.split('-').map(Number);
  const dia = (new Date(Date.UTC(a, m - 1, d)).getUTCDay() + 6) % 7;
  return Boolean(dias[DIAS[dia]]);
}
