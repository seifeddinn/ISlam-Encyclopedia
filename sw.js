const CACHE_NAME = 'islam-encyclopedia-v1.5.1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './recitations.html',
  './hadith.html',
  './fiqh.html',
  './fiqh_hanafi.html',
  './fiqh_maliki.html',
  './fiqh_shafi.html',
  './fiqh_hanbali.html',
  './fiqh_ibadat.html',
  './fiqh_muamalat.html',
  './fiqh_family.html',
  './fiqh_jinayat.html',
  './fiqh_usul.html',
  './fiqh_nawazil.html',
  './fatwa.html',
  './fatwa_ibadat.html',
  './fatwa_muamalat.html',
  './fatwa_family.html',
  './fatwa_aqeedah.html',
  './fatwa_women.html',
  './seerah.html',
  './aqeedah.html',
  './history.html',
  './library.html',
  './contact.html',
  './share.html',
  './search.html',
  './azkar.html',
  './asma-allah.html',
  './register.html',
  './usul.html',
  './404.html',
  './styles.css',
  './responsive.css',
  './script.js',
  './praytimes.js',
  './offline-library-data.js',
  './quran-offline-data.js',
  './quran-offline-engine.js',
  './_hadith_engine.js',
  './hadith-db.js',
  './offline_db.js',
  './nawawi.js',
  './reciters.js',
  './surahs.js',
  './manifest.json',
  './icons/logo.png',
  './icons/logo-emblem.png',
  './icons/logo-arabic.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32x32.png',
  './favicon.ico'
];

// Install Event - Pre-cache core assets safely with Promise.allSettled
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Pre-caching static core assets individually');
      await Promise.allSettled(
        STATIC_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[SW] Could not cache ${asset}:`, err.message);
          })
        )
      );
    })
  );
});

// Activate Event - Clean up old caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache version:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Smart caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // External dynamic APIs (skip aggressive caching, use network first)
  if (
    url.hostname.includes('api.aladhan.com') ||
    url.hostname.includes('api.alquran.cloud') ||
    url.hostname.includes('api.quran.com') ||
    url.hostname.includes('dorar.net') ||
    url.hostname.includes('mp3quran.net') ||
    url.hostname.includes('everyayah.com')
  ) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Navigation requests (HTML pages): Network first, fallback to cached page or index
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html') || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Local Static Assets (CSS, JS, Fonts, Images): Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch((err) => {
            // Network failure is expected when offline; cached response will be used
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Third-party CDN libraries (Bootstrap, FontAwesome, Google Fonts)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(request).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        }).catch(() => null)
      );
    })
  );
});

