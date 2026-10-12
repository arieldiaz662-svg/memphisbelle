// Se carga en <head>, antes de pintar. Marca que hay JavaScript (para que las entradas animadas, que ocultan el
// contenido hasta que aparece, solo se activen entonces) y decide si se enseña la intro de marca: solo en las páginas
// que la llevan (<html data-intro>), la primera vez en la visita y nunca con movimiento reducido. Sin JavaScript,
// todo se ve desde el principio.
(function () {
  const r = document.documentElement;
  r.classList.add('js');
  try {
    if (r.hasAttribute('data-intro') && !sessionStorage.getItem('mb-intro') && !matchMedia('(prefers-reduced-motion: reduce)').matches) r.classList.add('intro');
  } catch (e) {}
})();
