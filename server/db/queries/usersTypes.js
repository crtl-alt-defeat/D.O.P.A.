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

export async function deleteUserType({ user_id, type_id }) {
  const SQL = `
  DELETE FROM users_types
  WHERE user_id = $1 AND type_id = $2
  RETURNING *
  `;
  const {
    rows: [userType],
  } = await client.query(SQL, [user_id, type_id]);
  return userType;
}

export async function getUsersTypes() {
  const SQL = `
  SELECT *
  FROM users_types
  `;
  const { rows: usersTypes } = await client.query(SQL);
  return usersTypes;
}
