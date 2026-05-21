/* Wealth Tracker — Service Worker
   Bump CACHE version every time you deploy a new index.html.
   This forces the browser to discard the old cache and fetch fresh. */

const CACHE = 'wealth-v3'; // ← increment this on every deploy

const SHELL = ['./'];

// Install: cache the app shell immediately
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting()) // activate without waiting for old SW to die
  );
});

// Activate: nuke ALL old caches so stale HTML never serves again
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('[SW] Deleting old cache:', k);
        return caches.delete(k);
      })))
      .then(() => self.clients.claim()) // take control of open tabs immediately
  );
});

// Fetch: network-first for navigation (HTML), cache-first for everything else
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Always fetch fresh HTML from network (so updates appear immediately)
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          // Update cache with fresh copy
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request)) // offline fallback
    );
    return;
  }

  // For everything else (fonts, icons, etc): cache-first
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
      )
  );
});
