import client from "./db/client.js";
import seed from "./db/seed/seed.js";
import app from "./app.js";
import { goalsScheduler } from "./utils/cron.js";

/* Notification testing Ignore */

const init = async () => {
  const PORT = process.env.PORT || 3000;
  await client.connect();
  console.log("connected to database");

  if (process.env.SYNC ? process.env.SYNC == "true" : true) {
    await seed();
    console.log("🌱 Database seeded.");
  }
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });

  goalsScheduler();
};

init();
