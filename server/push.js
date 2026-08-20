const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

let subscriptions = [];

module.exports = {
  getPublicKey() {
    return process.env.VAPID_PUBLIC_KEY;
  },

  addSubscription(sub) {
    if (!subscriptions.find((s) => s.endpoint === sub.endpoint)) {
      subscriptions.push(sub);
    }
  },

  removeSubscription(endpoint) {
    subscriptions = subscriptions.filter((s) => s.endpoint !== endpoint);
  },

  async sendNotification(payload) {
    const jsonPayload = JSON.stringify(payload);
    const updated = [];

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, jsonPayload);
        updated.push(sub);
      } catch (err) {
        if (err.statusCode === 410) {
          console.log("Removing expired subscription:", sub.endpoint);
        } else {
          console.error("Push error:", err);
          updated.push(sub);
        }
      }
    }

    subscriptions = updated;
  },
};
