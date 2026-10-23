const V = 'notare-v3';
const FILES = ['./', 'index.html', 'app.js', 'Bravura.woff2', 'spessasynth_processor.min.js', 'gm-sounds.ogg', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => Promise.allSettled(FILES.map((f) => c.add(new Request(f, { cache: 'reload' }))))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
// rede primeiro para a página e o código (sempre a versão nova quando online); arquivos grandes: cache primeiro
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET' || !r.url.startsWith(self.location.origin)) return;
  const big = /\.(ogg|woff2|sf3)$/.test(r.url);
  if (big) { e.respondWith(caches.match(r, { ignoreSearch: true }).then((c) => c || fetch(r).then((res) => { const cp = res.clone(); caches.open(V).then((ch) => ch.put(r, cp)); return res; }))); return; }
  e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(V).then((ch) => ch.put(r, cp)); return res; }).catch(() => caches.match(r, { ignoreSearch: true })));
});
