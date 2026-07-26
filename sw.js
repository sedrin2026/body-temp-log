const CACHE_NAME = 'yukino-health-v1';
const urlsToCache = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// インストール時にキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// オフライン時でもキャッシュから返す
self.addEventListener('fetch', event => {
  event.respondIn(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
