import client from "./db/client.js";
import seed from "./db/seed.js";

import app from "./app.js";

const init = async () => {
  const PORT = process.env.PORT || 3000;
  await client.connect();
  console.log("connected to database");

  if (process.env.SEED ? process.env.SEED == "true" : true) {
    await seed();
    console.log("🌱 Database seeded.");
  }
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
};

init();
