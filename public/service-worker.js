// I am a service worker
var cacheKey = 'ft-tech-test-v1';

function cacheResponse(request, response) {
  var clone = response.clone();
  caches.open(cacheKey).then(function (cache) {
    console.log('Caching ' + request.url);
    cache.put(request, clone);
  });
}

function fetchOrFallback(request, timeout) {
  return new Promise(function (resolve, reject) {
    caches.open(cacheKey).then(function (cache) {
      cache.match(request).then(function (isInCache) {
        function fallbackIfInCache () {
          if (isInCache) {
            resolve(isInCache);
          }
        }
        function failIfNotInCache (error) {
          if (!isInCache) {
            reject(error);
          } else {
            resolve(isInCache);
          }
        }
        const timeoutId = setTimeout(fallbackIfInCache, timeout);

        fetch(request).then(function (response) {
          clearTimeout(timeoutId);
          cacheResponse(request, response);
          resolve(response);
        }, failIfNotInCache);
      });
    });
  });
}

self.addEventListener('fetch', function (event) {
  var fetchPromise = fetchOrFallback(event.request, 400);
  event.waitUntil(fetchPromise);
  event.respondWith(fetchPromise);
});
