import client from "./client.js";
import seed from "./seed.js";

await client.connect();
await seed();
await client.end();
console.log("🌱 Database seeded.");
