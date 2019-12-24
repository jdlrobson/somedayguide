const OFFLINE_URL = '/dashboard';
const CACHE_KEY = process.env.CACHE_KEY;
const ONLINE = navigator.onLine;

self.skipWaiting();

self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(CACHE_KEY).then(function(cache) {
        return cache.addAll([
          '/dashboard',
          '/index.json',
          '/index.css',
          '/index.js',
          '/offline',
          '/craft_left.jpg',
          '/craft_right.jpg',
          '/images/someday-map.png',
          '/images/grid.png'
        ]);
      })
    );
});

function isPage(request) {
  return request.url.match(/\/destination\//) || request.url.match(/\/country\//);
}

function isResource(request) {
  return request.url.slice(-2) === 'js';
}

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

          if (isPage(event.request) || isResource(event.request)) {
            return caches.open(CACHE_KEY).then(function (cache) {
              cache.put(event.request, responseClone);
              return response;
            });
          } else {
            return response;
          }
        }).catch((e) => {
          if (
            isPage(event.request)
          ) {
            return caches.match('/offline.html');
          } else {
            return e;
          }
        });
      }
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activating...');
});
