/* ZANA · Service Worker (offline cache) */
const CACHE = "zana-v22";
// Precache: solo el esqueleto de la app. js/photos.js (2,7 MB de imágenes)
// queda fuera a propósito: addAll() es atómico y, con mala cobertura, esa
// descarga hacía fallar la instalación entera del service worker y la app se
// quedaba sin modo offline. Se cachea igualmente al vuelo en el fetch.
const ASSETS = [
  "index.html",
  "manifest.webmanifest",
  "css/app.css?v=22",
  "js/data.js?v=22",
  "js/knowledge.js?v=22",
  "js/i18n.js?v=22",
  "js/engine.js?v=22",
  "js/store.js?v=22",
  "js/mascot.js?v=22",
  "js/ui.js?v=22",
  "js/app.js?v=22",
  "assets/icon.svg",
  "assets/icon-maskable.svg",
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

  // ignoreSearch solo en navegaciones: para los assets versionados (?v=22) la
  // coincidencia debe ser exacta, o una entrada vieja podría servirse en lugar
  // de la nueva y el usuario nunca recibiría un parche.
  const esNavegacion = req.mode === "navigate";
  e.respondWith(
    caches.match(req, { ignoreSearch: esNavegacion }).then(cached => {
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
