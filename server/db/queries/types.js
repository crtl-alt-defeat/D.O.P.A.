import client from "../client.js";

export async function createType(name) {
  const SQL = `
    INSERT INTO types (name)
    VALUES ($1)
    RETURNING *
    `;
  const response = await client.query(SQL, [name]);
  return response.rows[0];
}
