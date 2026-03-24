const CACHE_NAME = 'aiti-guru-cdn-images-v3';


const inflight = new Map();

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('aiti-guru-cdn-images-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
    ]),
  );
});


function cacheKeyRequest(request) {
  return new Request(request.url, { method: 'GET' });
}


async function getOrFetch(cache, request) {
  const key = cacheKeyRequest(request);

  const cached = await cache.match(key);
  if (cached) {
    return cached;
  }

  const url = key.url;
  const existing = inflight.get(url);
  if (existing) {
    const shared = await existing;
    return shared.clone();
  }

  const fetching = (async () => {

    let response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
    }).catch(() => fetch(key));

    const canCache = response.ok || response.type === 'opaque';
    if (canCache) {
      try {
        await cache.put(key, response.clone());
      } catch {
       
      }
    }
    return response;
  })();

  inflight.set(url, fetching);
  fetching.finally(() => inflight.delete(url));

  const response = await fetching;
  return response.clone();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.hostname !== 'cdn.dummyjson.com') {
    return;
  }

  if (!/\.(webp|png|jpe?g|gif|svg|avif)(\?|$)/i.test(url.pathname)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => getOrFetch(cache, request)),
  );
});
