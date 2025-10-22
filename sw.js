// A more robust service worker using Stale-While-Revalidate strategy
const CACHE_NAME = 'obsek-cache-v2'; // Incremented cache name
const SHELL_URLS = [ // Only cache the app shell on install
  '/',
  'index.html',
  'manifest.json'
];

// Install event: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(SHELL_URLS);
      })
  );
});

// Fetch event: Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // 1. Try to fetch from network
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // 2. If successful, update the cache
          // We clone the response because it can only be consumed once
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // 3. Return cached response immediately if available,
        //    otherwise wait for the network response.
        // This ensures the app loads fast (from cache)
        // and updates in the background.
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name.startsWith('obsek-cache-') && name !== CACHE_NAME)
                  .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});
