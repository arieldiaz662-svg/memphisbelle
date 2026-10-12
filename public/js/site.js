// JavaScript de la web. Todo es mejora progresiva: sin JavaScript se ve la carta completa,
// el horario agrupado y los enlaces funcionan igual.
import { estado, textoEstado } from './horario.js';

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

// Textos según el idioma de la página.
const IDIOMA = document.documentElement.lang === 'en' ? 'en' : 'es';
const TXT = {
  es: { pausar: 'Pausar animaciones', reanudar: 'Reanudar animaciones', cerrar: 'Cerrar' },
  en: { pausar: 'Pause animations', reanudar: 'Resume animations', cerrar: 'Close' },
}[IDIOMA];

// ---------- Movimiento y navegación (mejora progresiva: sin JavaScript todo se ve desde el principio) ----------
const root = document.documentElement;
const hayIO = 'IntersectionObserver' in window;

// Portada: el titular y la foto entran en cuanto la página está pintada (con intro, al levantarse el telón).
// Normalmente tras dos fotogramas; si el navegador congela los fotogramas, a los 150 ms como red de seguridad.
const entrar = () => {
  const ya = () => root.classList.add('cargado');
  requestAnimationFrame(() => requestAnimationFrame(ya));
  setTimeout(ya, 150);
};

// La portada abre directamente en la carta (salvo que el enlace pida otra sección). El salto es instantáneo y, con
// intro, ocurre detrás del telón: nadie ve la página desplazarse. La página de la carta del QR no tiene portada.
let destino = null;
try { destino = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch (e) { /* hash raro */ }
const carta = document.querySelector('.hero') ? (destino || document.getElementById('carta')) : null;
const irACarta = () => carta.scrollIntoView({ block: 'start', behavior: 'instant' });
if (carta) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  irACarta();
  // Las fuentes web cambian la altura del texto al cargar: se recoloca si el visitante aún no se ha movido.
  let movido = false;
  ['wheel', 'touchstart', 'keydown'].forEach((t) => addEventListener(t, () => { movido = true; }, { once: true, passive: true }));
  if (document.fonts) document.fonts.ready.then(() => { if (!movido || root.classList.contains('intro')) irACarta(); });
}

if (root.classList.contains('intro')) {
  try { sessionStorage.setItem('mb-intro', '1'); } catch (e) { /* sin almacenamiento */ }
  let fuera = false;
  const salir = () => {
    if (fuera) return;
    fuera = true;
    if (carta) irACarta(); // última recolocación antes de levantar el telón
    root.classList.add('intro-sale');
    setTimeout(entrar, 200); // el titular sube mientras se levanta el telón
    setTimeout(() => root.classList.remove('intro', 'intro-sale'), 900);
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => removeEventListener(t, salir));
  };
  setTimeout(salir, 2100);
  // Un toque, una tecla o un scroll la saltan: nunca bloquea a quien tiene prisa.
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, salir, { passive: true }));
} else {
  entrar();
}

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
  // Si se salta una parte de la página (enlace de ancla, scroll muy rápido), lo que queda por encima de la
  // pantalla no se vuelve a ver al subir con el elemento todavía oculto: se marca como visto.
  let barrido = false;
  addEventListener('scroll', () => {
    if (barrido) return;
    barrido = true;
    requestAnimationFrame(() => {
      barrido = false;
      reveals.forEach((e) => { if (!e.classList.contains('visto') && e.getBoundingClientRect().bottom < 0) e.classList.add('visto'); });
    });
  }, { passive: true });
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
  const fuera = [document.querySelector('.saltar'), document.querySelector('main'), document.querySelector('footer')].filter(Boolean);
  const textos = { abrir: botonMenu.firstElementChild.textContent, cerrar: TXT.cerrar };
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
  matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches) cerrar(false); });
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
    pausa.textContent = quieto ? TXT.reanudar : TXT.pausar;
  });
}

// Los bucles solo corren mientras se ven.
const bucles = document.querySelectorAll('.ilustracion-coctel, .ilustracion-anim, .cinta, .sello-giro');
if (bucles.length && hayIO) {
  const visibles = new IntersectionObserver((entradas) => entradas.forEach((e) => e.target.classList.toggle('en-pantalla', e.isIntersecting)));
  bucles.forEach((b) => visibles.observe(b));
}

// Carta en pestañas (sin JavaScript se ven todas las secciones seguidas).
document.querySelectorAll('.menu').forEach((menuCarta) => {
  const lista = menuCarta.querySelector('[role="tablist"]');
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const marca = lista.querySelector('.pestana-marca');
  const colocarMarca = (tab) => { marca.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth})`; };
  const elegir = (tab, porTeclado) => {
    lista.toggleAttribute('data-teclado', Boolean(porTeclado));
    tabs.forEach((t) => {
      const activa = t === tab;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !activa;
    });
    colocarMarca(tab);
    // En móvil desliza solo la fila de pestañas (nunca la página) para que la elegida se vea entera.
    if (tab.offsetLeft < lista.scrollLeft) lista.scrollLeft = tab.offsetLeft;
    else if (tab.offsetLeft + tab.offsetWidth > lista.scrollLeft + lista.clientWidth) lista.scrollLeft = tab.offsetLeft + tab.offsetWidth - lista.clientWidth;
  };
  menuCarta.classList.add('con-pestanas');
  elegir(tabs[0]);
  tabs.forEach((t) => t.addEventListener('click', () => elegir(t, false)));
  lista.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const destinoTab = { ArrowRight: tabs[(i + 1) % tabs.length], ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length], Home: tabs[0], End: tabs[tabs.length - 1] }[e.key];
    if (!destinoTab) return;
    e.preventDefault();
    destinoTab.focus();
    elegir(destinoTab, true);
  });
  // La marca se recoloca si cambia el ancho (giro del móvil, carga de la fuente).
  const recolocar = () => colocarMarca(tabs.find((t) => t.getAttribute('aria-selected') === 'true'));
  addEventListener('resize', recolocar);
  if (document.fonts) document.fonts.ready.then(recolocar);
});
