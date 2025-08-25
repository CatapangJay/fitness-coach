/* eslint-disable no-restricted-globals */
// Custom Service Worker additions for next-pwa

self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Fitness Coach';
    const body = data.body || 'You have a new notification';
    const options = {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: data.data || {},
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    // Fallback if payload is not JSON
    event.waitUntil(
      self.registration.showNotification('Fitness Coach', {
        body: 'New notification',
        icon: '/icons/icon-192.png',
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
