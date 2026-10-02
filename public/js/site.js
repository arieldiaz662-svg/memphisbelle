// JavaScript de la portada. Todo es mejora progresiva: sin JavaScript se ve la carta completa,
// el horario en tabla y los enlaces de llamar y WhatsApp funcionan igual.
import { DIAS, abreEseDia, estado, horaCanaria, textoEstado } from './horario.js';

// Pestañas accesibles de la carta (clic, flechas del teclado, Inicio/Fin). Sin JavaScript se ven
// todas las secciones seguidas.
function initTabs(tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panelOf = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

  function select(tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      panelOf(t).hidden = !selected;
    });
  }

  tablist.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) select(tab);
  });
  tablist.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const tab = tabs[(next + tabs.length) % tabs.length];
    select(tab);
    tab.focus();
  });

  tablist.hidden = false;
  document.documentElement.classList.add('carta-con-pestanas');
  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
}
document.querySelectorAll('[role="tablist"]').forEach(initTabs);
// A partir de aquí, cambiar de pestaña lleva un fundido corto (ver .tabs-listas en site.css).
requestAnimationFrame(() => document.documentElement.classList.add('tabs-listas'));

// "Abierto ahora / Cerrado" con la hora de Canarias, y el día de hoy marcado en la tabla. Se
// actualiza cada minuto y al volver a la pestaña, para que no se quede desfasado.
function pintarEstado() {
  document.querySelectorAll('.estado[data-horario]').forEach((el) => {
    const e = estado(JSON.parse(el.dataset.horario));
    el.querySelector('.estado-texto').textContent = textoEstado(e);
    el.classList.toggle('abierto', e.abierto);
    el.hidden = false;
  });
  const hoy = DIAS[horaCanaria(new Date()).dia];
  document.querySelectorAll('.horario tr').forEach((tr) => {
    const esHoy = tr.dataset.dia === hoy;
    tr.classList.toggle('hoy', esHoy);
    if (esHoy) tr.setAttribute('aria-current', 'date');
    else tr.removeAttribute('aria-current');
  });
}
pintarEstado();
setInterval(pintarEstado, 60 * 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) pintarEstado(); });

// Formulario de reserva: compone el mensaje y abre WhatsApp (la web no guarda ningún dato).
// Se abre dentro del propio evento submit para que el navegador no lo trate como ventana emergente.
const form = document.getElementById('formulario');
if (form) {
  const aviso = document.getElementById('form-aviso');
  const dias = JSON.parse(form.dataset.horario);
  const el = form.elements;
  // No se puede reservar para un día pasado (fecha de Canarias).
  const hoyISO = new Intl.DateTimeFormat('en-CA', { timeZone: 'Atlantic/Canary' }).format(new Date());
  el.dia.min = hoyISO;

  const avisar = (texto, campo) => {
    aviso.textContent = texto;
    aviso.hidden = !texto;
    if (campo) campo.focus();
  };
  el.dia.addEventListener('change', () => {
    avisar(el.dia.value && !abreEseDia(dias, el.dia.value) ? 'Ese día estamos cerrados. Elige otro día.' : '');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = el.nombre.value.trim();
    if (!nombre) return avisar('Escribe tu nombre.', el.nombre);
    if (!el.dia.value) return avisar('Elige el día.', el.dia);
    if (el.dia.value < hoyISO) return avisar('Esa fecha ya ha pasado.', el.dia);
    if (!abreEseDia(dias, el.dia.value)) return avisar('Ese día estamos cerrados. Elige otro día.', el.dia);
    if (!el.hora.value) return avisar('Elige la hora.', el.hora);
    avisar('');

    const [a, m, d] = el.dia.value.split('-').map(Number);
    const formato = (opciones) => new Intl.DateTimeFormat('es-ES', { ...opciones, timeZone: 'UTC' }).format(new Date(Date.UTC(a, m - 1, d)));
    const fecha = `${formato({ weekday: 'long' })} ${formato({ day: 'numeric', month: 'long' })}`; // "viernes 9 de octubre"
    const personas = Number(el.personas.value);
    const comentario = el.comentario.value.trim();
    const text = `Hola, soy ${nombre}. Quería reservar mesa para ${personas} ${personas === 1 ? 'persona' : 'personas'} el ${fecha} a las ${el.hora.value}.${comentario ? ` ${comentario}` : ''}`;
    const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(text)}`;
    // Con "noopener" window.open siempre devuelve null, así que se corta el opener a mano.
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else location.href = url; // si el navegador bloquea la pestaña nueva, se abre en la misma
  });
}
