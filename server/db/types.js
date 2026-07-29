import client from "../db/client.js";
export async function createType(name) {
  const SQL = `
    INSERT INTO goals (name)
    VALUES ($1)
    RETURNING *
    `;
  const reponse = await client.query(SQL, [name]);
  return response.rows[0];
}
