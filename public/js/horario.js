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

export function textoEstado(e) {
  if (e.abierto) return `Abierto ahora, hasta las ${e.cierra}`;
  if (e.abre) return `Cerrado. Abrimos ${e.cuando} a las ${e.abre}`;
  return 'Cerrado';
}

// ¿Abre ese día? (para avisar en el formulario de reservas). fechaISO: "2026-10-09".
export function abreEseDia(dias, fechaISO) {
  const [a, m, d] = fechaISO.split('-').map(Number);
  const dia = (new Date(Date.UTC(a, m - 1, d)).getUTCDay() + 6) % 7;
  return Boolean(dias[DIAS[dia]]);
}
