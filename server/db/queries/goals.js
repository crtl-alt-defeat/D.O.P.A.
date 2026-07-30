import client from "../client.js";

export async function createGoal({ name, type_id }) {
  const SQL = `
    INSERT INTO goals (name, type_id)
    VALUES ($1, $2)
    RETURNING *
    `;
  const {
    rows: [goal],
  } = await client.query(SQL, [name, type_id]);
  return goal;
}
