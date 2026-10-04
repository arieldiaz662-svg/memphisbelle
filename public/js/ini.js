// Se carga en <head>, antes de pintar: marca que hay JavaScript para que las entradas animadas (que ocultan
// el contenido hasta que aparece) solo se activen entonces. Sin JavaScript, todo se ve desde el principio.
document.documentElement.classList.add('js');
