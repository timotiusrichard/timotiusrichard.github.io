/* Wealth Tracker — Service Worker
   Caches the app shell on first load so it works fully offline after that. */

const CACHE = 'wealth-v1';

// Install: cache the app
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add('./'))
  );
  self.skipWaiting(); // activate immediately
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
