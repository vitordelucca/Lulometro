const CACHE_NAME = 'lulometro-v4';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './chart.js',
  './advanced-analytics.js',
  './advanced-export.js',
  './chart-type-toggle.js',
  './data-table.js',
  './date-filter.js',
  './keyboard-nav.js',
  './loading.js',
  './error-handler.js',
  './theme-toggle.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
