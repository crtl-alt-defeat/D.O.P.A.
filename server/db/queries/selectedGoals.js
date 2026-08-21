import client from "../client.js";

//add selected goal
export async function userSelectGoal({ user_id, goal_id }) {
  const SQL = `
  INSERT INTO selected_goals (user_id, goal_id)
  VALUES ($1, $2)
  RETURNING *`;
  const {
    rows: [userSelection],
  } = await client.query(SQL, [user_id, goal_id]);
  return userSelection;
}
//remove selected goal
export async function userDeselectGoal({ user_id, goal_id }) {
  const SQL = `
  DELETE FROM selected_goals
  WHERE user_id = $1 AND goal_id = $2
  RETURNING *
  `;
  const {
    rows: [userDeselection],
  } = await client.query(SQL, [user_id, goal_id]);
  return userDeselection;
}
//get selected goals by user id
export async function getUsersSelections(user_id) {
  const SQL = `
    SELECT goals.*
    FROM selected_goals
    JOIN goals ON selected_goals.goal_id
    WHERE selected_goals.user_id = 1$
  `;
  const { rows: goals } = await client.query(SQL, [user_id]);
  return goals;
}
//get selected goals by user id and type id
export async function getUsersSelectionByType(user_id, type_id) {
  const SQL = `
    SELECT goals.*
    FROM selected_goals
    JOIN goals On selected_goals.goal_id
    WHERE selected_goals.user_id = $1
    AND goals.type_id = $2
    `;
  const { rows: goals } = await client.query(SQL, [user_id, type_id]);
  return goals;
}
