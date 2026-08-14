import client from "../client.js";

export async function createType(name) {
  const insert = await client.query(
    `INSERT INTO types (name)
     VALUES ($1)
     ON CONFLICT (name) DO NOTHING
     RETURNING *`,
    [name],
  );
  if (insert.rows.length > 0) {
    return insert.rows[0];
  }
  const existing = await client.query(`SELECT * FROM types WHERE name = $1`, [
    name,
  ]);

  return existing.rows[0];
}

export async function getTypes() {
  const SQL = `
  SELECT *
  FROM types
  `;
  const { rows: types } = await client.query(SQL);
  return types;
}

export async function getType(id) {
  const SQL = `
  SELECT *
  FROM types
  WHERE id = $1
  `;
  const {
    rows: [type],
  } = await client.query(SQL, [id]);
  return type;
}

export async function getTypesByUserId(userId) {
  const SQL = `
  SELECT types.*
  FROM types
  JOIN users_types ON users_types.type_id = types.id
  WHERE users_types.user_id = $1
  `;
  const { rows: types } = await client.query(SQL, [userId]);
  return types;
}
