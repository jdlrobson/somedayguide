const OFFLINE_URL = '/dashboard';
const CACHE_KEY = process.env.CACHE_KEY;
const ONLINE = navigator.onLine;

self.skipWaiting();

self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(CACHE_KEY).then(function(cache) {
        return cache.addAll([
          '/dashboard.html',
          '/index.json',
          '/index.css',
          '/index.js',
          '/offline.html',
          '/craft_left.jpg',
          '/craft_right.jpg',
          '/images/someday-map.png',
          '/images/grid.png'
        ]);
      })
    );
});


// Cache all fetches and serve them when offline.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // if the user is online, send the cached version
      if (response !== undefined && !ONLINE) {
        return response;
      } else {
        // otherwise update cache
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();

          caches.open(CACHE_KEY).then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch((e) => {
          if (
            event.request.url.match(/\/destination\//) ||
            event.request.url.match(/\/country\//)
          ) {
            return caches.match('/offline.html');
          }
        });
      }
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activating...');
});
