/* Notification related Ignore */
export async function subscribeUser(token) {
  console.log("Starting subscription…");

  if (!token) {
    alert("Please log in again before enabling notifications.");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const response = await fetch("/api/notifications/vapidPublicKey");
  const { publicKey } = await response.json();

  const convertedKey = urlBase64ToUint8Array(publicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });

  window._pushSubscription = subscription;

  await fetch("/api/notifications/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subscription),
  });

  return subscription;
}

export async function sendTestPush(subscription) {
  const res = await fetch("/api/notifications/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription }),
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
