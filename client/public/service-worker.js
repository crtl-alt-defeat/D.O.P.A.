/* Testing, ignore unless interfering, then comment out. */
self.addEventListener("push", (event) => {
  /* Why raw? */
  const raw = event.data ? event.data.text() : null;

  const data = event.data
    ? event.data.json()
    : { title: "Notification", body: "No payload received" };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
