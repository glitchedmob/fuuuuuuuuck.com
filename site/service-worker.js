var CACHE_VERSION = 'fuuuuuuuuck-v1';

self.addEventListener('install', function (event) {
	event.waitUntil(caches.open(CACHE_VERSION).then(function (cache) {
		// Download all required resources to render the app.
		return cache.addAll(['./']);
	}));
});

self.addEventListener('fetch', function (event) {
	var fetchAndCache = function fetchAndCache(request) {
		return caches.open(CACHE_VERSION).then(function (cache) {
			return (
				// Load the response from the network.
				fetch(request).then(function (response) {
					// Add the response to the cache.
					cache.put(request, response.clone());
					return response;
				})
			);
		});
	};

	event.respondWith(
		// Check for cached data.
		caches.match(event.request)
		// Return the cached data OR hit the network.
		.then(function (data) {
			return data || fetchAndCache(event.request);
		}).catch(function () {
			var url = new URL(event.request.url);

			// If anything else is loaded, show an offline page.
			return caches.match('./');
		}));
});