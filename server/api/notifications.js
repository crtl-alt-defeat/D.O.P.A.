import express from "express";
import webpush from "web-push";
import fs from "fs";
import path from "path";
import requireUser from "../middleware/requireUser.js";
import getUserFromToken from "../middleware/getUsersFromToken.js";
const router = express.Router();

const subscriptionsPath = path.join(
  process.cwd(),
  "server",
  "subscriptions.json",
);
if (!fs.existsSync(subscriptionsPath)) {
  fs.writeFileSync(subscriptionsPath, "{}");
}
function saveSubscription(userId, subscription) {
  const data = JSON.parse(fs.readFileSync(subscriptionsPath, "utf8"));
  data[userId] = subscription;
  fs.writeFileSync(subscriptionsPath, JSON.stringify(data, null, 2));
}
export function getSubscriptionForUser(userId) {
  const data = JSON.parse(fs.readFileSync(subscriptionsPath, "utf8"));
  return data[userId];
}
export async function sendGoalNotification(subscription, goalName) {
  const payload = JSON.stringify({
    title: "New Goal Created",
    body: `You created a new goal: ${goalName}`,
    icon: "/Icon.png",
    badge: "/Icon.png",
  });

  await webpush.sendNotification(subscription, payload);
}
webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

router.get("/vapidPublicKey", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});
router.post("/subscribe", getUserFromToken, requireUser, (req, res) => {
  console.log("Subscription received:", req.body);

  saveSubscription(req.user.id, req.body);

  res.json({ ok: true });
});

router.post("/test", async (req, res) => {
  const subscription = req.body.subscription;

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Test Notification",
        body: "Push test from backend",
        icon: "/icon.png",
        badge: "/badge.png",
      }),
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

export default router;
