// ① CACHE_NAME を更新（バージョン管理）
const CACHE_NAME = 'body-temp-log-v20260801-2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// インストール時に新キャッシュを保存し、即時待機状態をスキップ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ③ 古いキャッシュの自動削除と、通常ブラウザでの即時反映制御
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除します:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// フェッチ時にネットワーク優先、またはキャッシュフォールバックで常に最新を狙う最適化
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // ネットワークから正常に取得できた場合はそのまま返す（必要に応じてキャッシュ更新も可能）
        return response;
      })
      .catch(() => {
        // オフライン時はキャッシュから返す
        return caches.match(event.request);
      })
  );
});
