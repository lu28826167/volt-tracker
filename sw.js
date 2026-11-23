/* VOLT Workout Tracker — service worker
 * Change VERSION whenever you upload new app files. Your workout data is NOT
 * stored in this cache, so changing it never deletes history.
 */
const VERSION = 'volt-v3.2.0';
const CACHE = VERSION;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];
const NETWORK_TIMEOUT_MS = 3500;
const REST_TAG = 'volt-rest';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('volt-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function inScope(url) {
  return url.origin === self.location.origin && url.href.startsWith(self.registration.scope);
}

// App page: network first (so updates show up right away), cached copy when
// offline or when the gym's signal is too slow.
async function handleNavigation(event) {
  const cache = await caches.open(CACHE);
  const network = fetch(event.request).then(response => {
    if (response && response.ok) cache.put('./index.html', response.clone());
    return response;
  });
  event.waitUntil(network.catch(() => {}));
  const timeout = new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS, null));
  try {
    const fast = await Promise.race([network, timeout]);
    if (fast && fast.ok) return fast;
  } catch (e) { /* offline */ }
  const cached = await cache.match('./index.html') || await cache.match('./');
  if (cached) return cached;
  return network; // nothing cached yet: let the browser show its own error
}

// Icons / manifest: serve from cache, refresh in the background.
async function handleAsset(event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(event.request, { ignoreSearch: true });
  const network = fetch(event.request).then(response => {
    if (response && response.ok) cache.put(event.request, response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!inScope(url)) return;
  if (url.pathname.endsWith('/sw.js')) return;
  if (req.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
  } else {
    event.respondWith(handleAsset(event));
  }
});

/* ---------- Rest-timer notification (best effort) ----------
 * The page sends the exact end time. This worker waits and shows a
 * notification if the app is not on screen. Android/Chrome may still stop
 * the worker (battery saver, long rests > ~5 min, app swiped away), so this
 * is a backup, not a guarantee.
 */
let pending = null;

function clearPending() {
  if (pending) {
    clearTimeout(pending.timer);
    pending.resolve();
    pending = null;
  }
}

async function showRestNotification(msg) {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const visible = windows.some(c => c.visibilityState === 'visible');
  if (visible && !msg.force) return; // the open app plays its own alert
  const existing = await self.registration.getNotifications({ tag: REST_TAG });
  if (existing.length && !msg.force) return;
  await self.registration.showNotification(msg.title || 'Rest over', {
    body: msg.body || 'Time for your next set.',
    tag: REST_TAG,
    renotify: true,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [400, 150, 400, 150, 700],
    data: { url: self.registration.scope }
  });
}

self.addEventListener('message', event => {
  const msg = event.data || {};
  if (msg.type === 'rest-cancel') {
    clearPending();
    return;
  }
  if (msg.type === 'rest-schedule') {
    clearPending();
    const delay = Math.max(0, Number(msg.endsAt) - Date.now());
    const done = new Promise(resolve => {
      const timer = setTimeout(() => {
        pending = null;
        showRestNotification(msg).catch(() => {}).finally(resolve);
      }, delay);
      pending = { timer, resolve, id: msg.id };
    });
    // Keeps the worker alive until the rest ends (Chrome allows a few minutes).
    event.waitUntil(done);
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of windows) {
      if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus();
    }
    return self.clients.openWindow(target);
  })());
});
