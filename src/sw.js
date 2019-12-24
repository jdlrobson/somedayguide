const OFFLINE_URL = '/dashboard';
const CACHE_KEY = process.env.CACHE_KEY;
const ARTICLE_CACHE_KEY = `${CACHE_KEY}-articles`;
const ONLINE = navigator.onLine;
const host = location.host;

const STATIC = [
  '/',
  '/dashboard',
  '/index.json',
  '/index.css',
  '/index.js',
  '/offline',
  '/craft_left.jpg',
  '/craft_right.jpg',
  '/images/someday-map.png',
  '/images/grid.png'
];

self.skipWaiting();

self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(CACHE_KEY).then(function(cache) {
        return cache.addAll(STATIC);
      })
    );
});

function isPage(request) {
  return request.url.match(/\/destination\//) || request.url.match(/\/country\//);
}

function getPath(url) {
  return url.replace(
    `${location.protocol}//${location.host}`
  );
}

function isCacheable(request) {
  const uri = getPath(request.url);
  return STATIC.includes(uri) || isPage(request);
}

// Cache all fetches and serve them when offline.
self.addEventListener('fetch', event => {
  if (event.request.method != 'GET') {
    return;
  }

  if (!caches.match(STATIC[0]) || !isCacheable(event.request)) {
    // nothing cached yet or not something we want to cache.
    return;
  }

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

          if (isPage(event.request)) {
            return caches.open(ARTICLE_CACHE_KEY).then(function (cache) {
              cache.put(event.request, responseClone);
              return response;
            });
          } else {
            return response;
          }
        }).catch(() => {
          return caches.match('/offline.html');
        });
      }
    })
  );
});

self.addEventListener('activate', event => {
  // clear old caches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_KEY && cacheName !== ARTICLE_CACHE_KEY)
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
