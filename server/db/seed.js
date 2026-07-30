import client from "./client.js";

const seed = async () => {
  try {
    console.log("Making your table girl..");

    await client.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL
    password TEXT NOT NULL
    );
    `);
    console.log("Table built! Woot!");
  } catch (error) {
    console.error("Boo! Error seeding database:", error);
  }
};

export default seed;
