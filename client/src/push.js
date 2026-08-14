/* Testing, ignore unless interfering, then comment out. */
async function registerPush() {
  const registration =
    await navigator.serviceWorker.register("/service-worker.js");

  const res = await fetch("/api/notifications/vapidPublicKey");
  const { publicKey } = await res.json();

  const key = urlBase64ToUint8Array(publicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: key,
  });

  await fetch("/api/notifications/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
}
