import client from "../db/client.js";

export async function createGoal(name, goal_id) {
  const SQL = `
    INSERT INTO goals (name, type_id)
    VALUES ($1, $2)
    RETURNING *
    `;
  const response = await client.query(SQL, [name, goal_id]);
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
  SELECT goals.*
  FROM goals
  JOIN users_goals ON users_goals.goal_id = goals.id
  WHERE users_goals.user_id = $1
  `;
  const { rows: goals } = await client.query(SQL, [userId]);
  return goals;
}
