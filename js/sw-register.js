/* ZANA · Registro del service worker
   Va en un fichero aparte (y no en línea) para que la CSP pueda ser
   script-src 'self', sin necesidad de 'unsafe-inline'.
   El anti-embebido está en js/frame-guard.js, que se carga antes. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
