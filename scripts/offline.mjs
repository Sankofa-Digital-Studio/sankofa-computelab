import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const assets = (await readdir('dist/assets')).map(name => '/assets/' + name)
const version = createHash('sha256').update(await readFile('dist/index.html')).digest('hex').slice(0, 12)
const files = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', ...assets]
await writeFile('dist/sw.js', `
const CACHE = 'sankofa-shell-${version}';
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(${JSON.stringify(files)})).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('sankofa-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    if (!url.pathname.startsWith('/papers/')) event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }
  if (${JSON.stringify(files)}.includes(url.pathname)) event.respondWith(caches.open(CACHE).then(cache => cache.match(url.pathname)).then(cached => cached || fetch(event.request)));
});
self.addEventListener('push', event => {
  let message = {};
  try { message = event.data?.json() || {}; } catch { message.body = event.data?.text(); }
  event.waitUntil(self.registration.showNotification(message.title || 'Sankofa ComputeLab', {body: message.body || 'There is a new college update.', icon: '/icon-192.png'}));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/#notices'));
});
`)
