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

export const getDailyGoals = async (userId) => {
  const SQL = `
    select goals.*
    FROM goals
    JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
    AND goals.date_made = CURRENT_DATE`;
  const { rows } = await client.query(SQL, [userId]);
  return rows;
};

export const getWeeksGoals = async (userId) => {
  const SQL = `
    select goals.*
    FROM goals
    JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
    AND goals.date_made BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE`;
  const { rows } = await client.query(SQL, [userId]);
  return rows;
};

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
