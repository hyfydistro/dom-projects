const cacheName = "v1";

const cacheAssets = [
  "index.html",
  "style.css",
  "script.js",
  "fonts/myanmar-text/mmrtext.ttf",
  "fonts/myanmar-text/mmrtextb.ttf",
  "fonts/quicksand/Quicksand-Bold.ttf",
  "fonts/quicksand/Quicksand-Regular.ttf",
  "images/android-chrome-192x192.png",
  "images/android-chrome-512x512.png",
  "images/apple-touch-icon.png",
  "images/calendar-icon.png",
  "images/color-change-icon.png",
  "images/favicon-16x16.png",
  "images/favicon-32x32.png",
];

// Call Install Event
self.addEventListener("install", (e) => {

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
// Where you clean up any old cache
self.addEventListener("activate", (e) => {
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", (e) => {
  // Check whether the live set is available, and
  // if not, use the cache
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
