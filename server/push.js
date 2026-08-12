/* Testing, ignore unless interfering, then comment out. */
const webpush = require("web-push");

const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:you@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

let subscriptions = [];

module.exports = {
  vapidPublicKey: vapidKeys.publicKey,

  addSubscription(sub) {
    subscriptions.push(sub);
  },

  sendNotification(payload) {
    subscriptions.forEach((sub) => {
      webpush
        .sendNotification(sub, JSON.stringify(payload))
        .catch((err) => console.error(err));
    });
  },
};
