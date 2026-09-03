/* ZANA · Anti-embebido (clickjacking)
   Sustituto de la cabecera frame-ancestors, que no se puede usar en GitHub
   Pages. El "frame-buster" clásico (window.top.location = ...) ya no sirve:
   los navegadores bloquean que un iframe de otro origen navegue la ventana
   principal, así que se limitaba a fallar. Lo que sí funciona es que la app se
   niegue a renderizarse dentro de un marco: sin interfaz operativa no hay
   clic que robar. Se carga el primero, antes que el resto de scripts. */
(function () {
  if (window.top === window.self) return;   // uso normal
  window.__zanaFramed = true;

  var aviso = function () {
    var url = window.self.location.href;
    document.documentElement.innerHTML =
      '<head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<style>body{margin:0;font:600 16px/1.5 system-ui,sans-serif;background:#FFF8F0;' +
      'color:#2B2118;display:grid;place-items:center;min-height:100vh;padding:24px;' +
      'text-align:center}a{color:#D8541A}</style></head>' +
      '<body><div><div style="font-size:44px">🥕</div>' +
      '<p>Zana no se abre dentro de otra web.</p>' +
      '<p style="font-weight:400"><a id="z-abrir" target="_blank" rel="noopener">Abrir Zana</a></p>' +
      '</div></body>';
    var a = document.getElementById("z-abrir");
    if (a) a.href = url;   // por propiedad, nunca interpolado en el HTML
  };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", aviso);
  else aviso();
})();
