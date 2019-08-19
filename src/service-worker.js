var cacheName = 'cache'

self.addEventListener('install', function (event) {
  console.log('sw -> install')
  // waitUntil() ensures that the Service Worker will not
  // install until the code inside has successfully occurred
  event.waitUntil(
    // Create cache with the name supplied above and
    // return a promise for it
    caches.open(cacheName).then(function (cache) {
      // Important to `return` the promise here to have `skipWaiting()`
      // fire after the cache has been updated.
      var assets = []
      self.__precacheManifest.forEach(asset => {
        assets.push(asset.url)
      })
      return cache.addAll(assets)
    }).then(function () {
      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      return self.skipWaiting()
    }))
})

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', function (event) {
  // `claim()` sets this worker as the active worker for all clients that
  // match the workers scope and triggers an `oncontrollerchange` event for
  // the clients.
  console.log('sw -> activate')
  return self.clients.claim()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function (cacheName) {
          return caches.delete(cacheName)
        })
      )
    })
  )
})

self.addEventListener('fetch', function (event) {
  console.log('Fetch event for ', event.request.url)
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache')
        return response
      }
      console.log('Network request for ', event.request.url)
      return fetch(event.request)
    }).catch(function (error) {
      console.error('Fetch error', error)
      return caches.match('index.html')
    }))
})
