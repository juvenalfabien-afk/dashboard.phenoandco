// Notifications du dashboard PHENO&CO (quand un client répond dans sa carte). Pas de cache : le dashboard reste toujours à jour.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  // Pastille sur l'icône de l'appli : nombre de messages clients en attente
  try { if (d.badge > 0 && self.navigator.setAppBadge) self.navigator.setAppBadge(d.badge); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title || 'PHENO&CO', {
    body: d.body || 'Un client t’a répondu.',
    icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || 'pnc-staff', renotify: true,
    data: { url: './#inbox' }
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) { list[i].postMessage({ go: 'inbox' }); return list[i].focus(); } }
    return self.clients.openWindow('./#inbox');
  }));
});
