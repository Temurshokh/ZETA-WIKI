const CACHE_NAME = 'zeta-wiki-v2.1-cache';
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Only intercept local static assets
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Stale-While-Revalidate: return cache immediately, update in background
                    fetch(event.request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                const responseClone = networkResponse.clone();
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                            }
                        })
                        .catch(() => {
                            // Network failure during background revalidation is normal when offline
                        });
                    return cachedResponse;
                }

                // If not in cache, fetch from network and cache
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Safe fallback for HTML navigation requests when offline
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        return new Response('Network error occurred and asset is not cached', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                        });
                    });
            })
        );
    }
});
