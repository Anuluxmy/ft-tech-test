// I am a service worker
var cacheKey = 'ft-tech-test-v1';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(fromNetwork(event.request, 2000).catch(function () {
    return fromCache(event.request);
  }));
});

function fromNetwork(request, timeout) {
  return new Promise(function (resolve, reject) {
    var timeoutId = setTimeout(reject, timeout);

    fetch(request).then(function (response) {
      console.log('Fetched ' + request.url);
      clearTimeout(timeoutId);
      cacheResponse(request, response);
      resolve(response);
    }, reject);
  });
}

function cacheResponse(request, response) {
  var clone = response.clone();
  caches.open(cacheKey).then(function (cache) {
    console.log('Caching ' + request.url);
    cache.put(request, clone);
  });
}

function fromCache(request) {
  return caches.open(cacheKey).then(function (cache) {
    return cache.match(request).then(function (matching) {
      console.log('Using cache for ' + request.url + '. Present ' + !!matching);
      return matching || Promise.reject('no-match');
    });
  });
}
