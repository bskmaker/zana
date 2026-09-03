/* ZANA · Service Worker (offline cache) */
const CACHE = "zana-v29";
// Precache: solo el esqueleto de la app. js/photos.js (2,7 MB de imagenes)
// queda fuera a proposito: addAll() es atomico y, con mala cobertura, esa
// descarga hacia fallar la instalacion entera del service worker y la app se
// quedaba sin modo offline. Se cachea igual al vuelo en el fetch.
const ASSETS = [
  "index.html",
  "manifest.webmanifest",
  "css/app.css?v=29",
  "js/data.js?v=29",
  "js/knowledge.js?v=29",
  "js/i18n.js?v=29",
  "js/engine.js?v=29",
  "js/store.js?v=29",
  "js/mascot.js?v=29",
  "js/ui.js?v=29",
  "js/app.js?v=29",
  "js/frame-guard.js?v=29",
  "js/sw-register.js?v=29",
  "assets/icon.svg",
  "assets/icon-maskable.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/icon-maskable-192.png",
  "assets/icon-maskable-512.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // No cachear llamadas a las APIs de IA
  if (url.hostname.includes("googleapis.com") || url.hostname.includes("groq.com") || url.hostname.includes("pollinations.ai")) return;

  // El CÓDIGO (html/js/css y navegaciones) va "red primero": si hay internet, siempre
  // trae la última versión y actualiza la caché; sin internet, tira de la caché.
  // El resto (fotos, iconos) va "caché primero" para que cargue rápido y offline.
  const isCode = req.mode === "navigate" || /\.(html|js|css)$/i.test(url.pathname);

  if (isCode && url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(cached => {
      const fetched = fetch(req).then(res => {
        if (res && res.status === 200 && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
