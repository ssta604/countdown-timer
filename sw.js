const CACHE_NAME = 'countdown-timer-cache-v7';
const urlsToCache = [
  '/countdown-timer/index.html',
  '/countdown-timer/favicon.ico',
  '/countdown-timer/favicon.svg',
  '/countdown-timer/icon-192.svg',
  '/countdown-timer/icon-512.svg',
  '/countdown-timer/settings.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Roboto+Mono:wght@700&display=swap',
  'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
  'https://fonts.gstatic.com/s/robotomono/v22/L0x5DF4xlVMF-BfR8bXMIjhGq3-cXbKDO1w.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
