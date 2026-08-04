/* Testing, ignore unless interfering, then comment out. */
async function registerPush() {
  const registration =
    await navigator.serviceWorker.register("/service-worker.js");

  const publicKey = await fetch(
    "https://YOUR-RENDER-BACKEND/vapidPublicKey",
  ).then((res) => res.text());

  const key = urlBase64ToUint8Array(publicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: key,
  });

  await fetch("https://YOUR-RENDER-BACKEND/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
