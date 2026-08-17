/* ZANA · Service Worker (offline cache) */
const CACHE = "zana-v19";
const ASSETS = [
  "index.html",
  "manifest.webmanifest",
  "css/app.css?v=19",
  "js/data.js?v=19",
  "js/photos.js?v=19",
  "js/knowledge.js?v=19",
  "js/i18n.js?v=19",
  "js/engine.js?v=19",
  "js/store.js?v=19",
  "js/mascot.js?v=19",
  "js/ui.js?v=19",
  "js/app.js?v=19",
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
