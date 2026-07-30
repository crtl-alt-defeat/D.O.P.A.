import client from "../client.js";

export async function createUserGoal({
  user_id,
  goal_id,
  date_made,
  date_complete,
}) {
  const SQL = `
    INSERT INTO users_goals (user_id, goal_id, date_made, date_complete)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
  const {
    rows: [userGoal],
  } = await client.query(SQL, [user_id, goal_id, date_made, date_complete]);
  return userGoal;
}
