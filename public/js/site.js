// JavaScript de la web. Todo es mejora progresiva: sin JavaScript se ve la carta completa,
// el horario agrupado y los enlaces de llamar y WhatsApp funcionan igual.
import { abreEseDia, estado, textoEstado } from './horario.js';

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

// "Abierto ahora / Cerrado" con la hora de Canarias. Se actualiza cada minuto y al volver a la
// pestaña, para que no se quede desfasado.
function pintarEstado() {
  document.querySelectorAll('.estado[data-horario]').forEach((el) => {
    const e = estado(JSON.parse(el.dataset.horario));
    el.querySelector('.estado-texto').textContent = textoEstado(e, document.documentElement.lang);
    el.classList.toggle('abierto', e.abierto);
    el.hidden = false;
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

// ---------- Movimiento y navegación (mejora progresiva: sin JavaScript todo se ve desde el principio) ----------
const root = document.documentElement;
const hayIO = 'IntersectionObserver' in window;

// Portada: el titular y la foto entran en cuanto la página está pintada.
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('cargado')));

// Entradas al hacer scroll (una sola vez por elemento).
const reveals = [...document.querySelectorAll('[data-reveal]')];
if (!hayIO) reveals.forEach((e) => e.classList.add('visto', 'listo'));
else {
  const io = new IntersectionObserver((entradas) => entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    const el = entrada.target;
    el.classList.add('visto');
    io.unobserve(el);
    // Cuando termina la entrada de la carta, el hover usa tiempos cortos y sin retardo.
    if (el.classList.contains('carta-fila')) setTimeout(() => el.classList.add('listo'), 1800);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  reveals.forEach((e) => io.observe(e));
}

// Cabecera: el cristal aparece solo cuando hay contenido pasando por debajo.
const cabecera = document.querySelector('header');
if (cabecera) {
  const marcarScroll = () => cabecera.toggleAttribute('data-scrolled', scrollY > 8);
  addEventListener('scroll', marcarScroll, { passive: true });
  marcarScroll();
}

// Menú móvil a pantalla completa.
const botonMenu = document.querySelector('.menu-btn');
const menuMovil = document.getElementById('menu-movil');
if (botonMenu && menuMovil) {
  const fuera = [document.querySelector('main'), document.querySelector('footer')];
  const textos = { abrir: botonMenu.firstElementChild.textContent, cerrar: root.lang === 'en' ? 'Close' : 'Cerrar' };
  const abrir = () => {
    root.setAttribute('data-menu', '');
    botonMenu.setAttribute('aria-expanded', 'true');
    botonMenu.firstElementChild.textContent = textos.cerrar;
    fuera.forEach((e) => { e.inert = true; });
    menuMovil.querySelector('a').focus({ preventScroll: true });
  };
  const cerrar = (foco) => {
    if (!root.hasAttribute('data-menu')) return;
    root.removeAttribute('data-menu');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.firstElementChild.textContent = textos.abrir;
    fuera.forEach((e) => { e.inert = false; });
    if (foco) botonMenu.focus();
  };
  botonMenu.addEventListener('click', () => (root.hasAttribute('data-menu') ? cerrar(true) : abrir()));
  menuMovil.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => cerrar(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(true); });
  matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) cerrar(false); });
}

// Orientación: el punto marca la sección que estás viendo.
if (hayIO) {
  const enlaces = new Map([...document.querySelectorAll('.principal a')].map((a) => [a.hash.slice(1), a]));
  if (enlaces.size) {
    const espia = new IntersectionObserver((entradas) => entradas.forEach((entrada) => {
      const a = enlaces.get(entrada.target.id);
      if (!a) return;
      if (entrada.isIntersecting) { enlaces.forEach((x) => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'location'); }
      else if (a.hasAttribute('aria-current')) a.removeAttribute('aria-current');
    }), { rootMargin: '-45% 0px -50% 0px' });
    enlaces.forEach((_, id) => { const seccion = document.getElementById(id); if (seccion) espia.observe(seccion); });
  }
}

// Pausar / reanudar todo lo que se mueve en bucle.
const pausa = document.querySelector('.pausa-anim');
if (pausa) {
  pausa.hidden = false;
  pausa.addEventListener('click', () => {
    const quieto = root.toggleAttribute('data-quieto');
    pausa.setAttribute('aria-pressed', String(quieto));
    pausa.textContent = quieto ? 'Reanudar animaciones' : 'Pausar animaciones';
  });
}

// Los bucles solo corren mientras se ven.
const bucles = document.querySelectorAll('.ilustracion-coctel, .ilustracion-anim, .cinta, .sello-giro');
if (bucles.length && hayIO) {
  const visibles = new IntersectionObserver((entradas) => entradas.forEach((e) => e.target.classList.toggle('en-pantalla', e.isIntersecting)));
  bucles.forEach((b) => visibles.observe(b));
}
