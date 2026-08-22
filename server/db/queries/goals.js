import client from "../client.js";

export async function createGoal({ name, type_id }) {
  const SQL = `
    INSERT INTO goals (name, type_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [name, type_id]);
  return response.rows[0];
}

export async function getGoals() {
  const SQL = `
    SELECT *
    FROM goals
  `;
  const { rows: goals } = await client.query(SQL);
  return goals;
}

export async function getGoal(id) {
  const SQL = `
    SELECT *
    FROM goals
    WHERE id = $1
  `;
  const {
    rows: [goal],
  } = await client.query(SQL, [id]);
  return goal;
}

export async function getGoalsByUserId(userId) {
  const SQL = `
    SELECT
      goals.*,
      users_goals.date_made,
      users_goals.date_complete
    FROM
      goals
      JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
  `;
  const { rows: goals } = await client.query(SQL, [userId]);
  return goals;
}

//todo: getGoalsByTypeId
export async function getGoalsByTypeId(typeId) {
  const SQL = `
    SELECT *
    FROM goals
    WHERE type_id = $1
  `;
  const { rows: goals } = await client.query(SQL, [typeId]);
  return goals;
}

export async function getPotentialGoals(userId) {
  const SQL = `
    WITH selected_types AS (
      SELECT types.*
      FROM
        users
        JOIN users_types ON users_types.user_id = users.id
        JOIN types ON types.id = users_types.type_id
      WHERE users.id = $1
    )

    SELECT goals.*
    FROM
      goals
      JOIN selected_types ON selected_types.id = goals.type_id
  `;
  const { rows: goals } = await client.query(SQL, [userId]);
  return goals;
}
