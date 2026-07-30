import client from "../client.js";

export async function createUserType({ user_id, type_id }) {
  const SQL = `
    INSERT INTO users_types (user_id, type_id)
    VALUES ($1, $2)
    RETURNING *
    `;
  const {
    rows: [userType],
  } = await client.query(SQL, [user_id, type_id]);
  return userType;
}
