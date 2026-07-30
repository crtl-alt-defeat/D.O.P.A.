import client from "../client.js";
import bcrypt from "bcrypt";

export async function createUser({ email, password, name }) {
  const hash = bcrypt.hash(password, 12);
  const SQL = `
    INSERT INTO users (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [user],
  } = await client.query(SQL, [email, hash, name]);
  return user;
}
