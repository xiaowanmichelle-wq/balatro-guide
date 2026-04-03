// Balatro Guide Service Worker
// Version-based cache for easy updates
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `balatro-guide-${CACHE_VERSION}`;

// Core app shell files - always cache these
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './i18n.js',
  './seeds.js',
  './custom-tierlist.js',
  './lang/zh-CN.js',
  './lang/en.js',
  './lang/ja.js',
  './manifest.json',
  './favicon.ico',
  './og-image.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        // Activate new SW immediately
        return self.skipWaiting();
      })
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('balatro-guide-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Take control of all open tabs immediately
        return self.clients.claim();
      })
  );
});

// Fetch: Stale-While-Revalidate for HTML/JS/CSS, Cache-First for images
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests and GET
  if (request.method !== 'GET') return;

  // Skip cross-origin API calls (Supabase, etc.)
  if (url.origin !== self.location.origin) {
    // For external images (card images from wikis), try network-first with cache fallback
    if (request.destination === 'image') {
      event.respondWith(networkFirstWithCache(request));
    }
    return;
  }

  // App shell and static assets: Stale-While-Revalidate
  // Serves cached version instantly, updates cache in background
  event.respondWith(staleWhileRevalidate(request));
});

// Strategy: Stale-While-Revalidate
// Returns cached version immediately, fetches update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      // Only cache successful responses
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Network failed, that's ok - we have cache
      return null;
    });

  // Return cached response immediately, or wait for network
  return cachedResponse || fetchPromise;
}

// Strategy: Network-first with cache fallback (for external images)
async function networkFirstWithCache(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return a placeholder for failed images
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
