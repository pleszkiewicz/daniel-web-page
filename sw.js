const CACHE_NAME = "daniel-nagorka-static-html-v15";
const BASE_PATH = new URL("./", self.location.href).pathname.replace(/\/$/, "");
const withBasePath = function (path) {
  return BASE_PATH + path;
};
const OFFLINE_URL = withBasePath("/offline.html");
const STATIC_ASSETS = [
  withBasePath("/"),
  withBasePath("/index.html"),
  withBasePath("/galleries/index.html"),
  withBasePath("/galleries/category/index.html"),
  withBasePath("/en/"),
  withBasePath("/en/index.html"),
  withBasePath("/en/galleries/index.html"),
  withBasePath("/en/galleries/category/index.html"),
  withBasePath("/de/"),
  withBasePath("/de/index.html"),
  withBasePath("/de/galleries/index.html"),
  withBasePath("/de/galleries/category/index.html"),
  withBasePath("/uk/"),
  withBasePath("/uk/index.html"),
  withBasePath("/uk/galleries/index.html"),
  withBasePath("/uk/galleries/category/index.html"),
  OFFLINE_URL,
  withBasePath("/assets/styles.css?v=20260718-layout2"),
  withBasePath("/assets/styles.css?v=20260718-gallery-back"),
  withBasePath("/assets/config.js?v=20260718-contact"),
  withBasePath("/assets/app.js?v=20260718-contact"),
  withBasePath("/assets/app.js?v=20260718-gallery-back"),
  withBasePath("/assets/brand/logo.jpg"),
  withBasePath("/assets/icons/icon-192.png"),
  withBasePath("/assets/icons/icon-512.png"),
  withBasePath("/assets/icons/apple-touch-icon.png"),
  withBasePath("/favicon.ico")
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        STATIC_ASSETS.map(function (asset) {
          return cache.add(asset).catch(function () {});
        }),
      );
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.pathname.startsWith(withBasePath("/api/"))) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(function () {
        return caches.match(OFFLINE_URL);
      }),
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(function (cachedResponse) {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then(function (networkResponse) {
          if (networkResponse.ok) {
            var clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        });
      }),
    );
  }
});
