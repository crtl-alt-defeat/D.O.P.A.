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

export async function getUsersGoals() {
  const SQL = `
    SELECT *
    FROM users_goals
  `;
  const { rows: usersGoals } = await client.query(SQL);
  return usersGoals;
}

export const getDailyGoals = async (userId, timeZone) => {
  const SQL = `
    select goals.*
    FROM goals
    JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
    AND (users_goals.date_made::timestamptz AT TIME ZONE $2)::date = (CURRENT_TIMESTAMP AT TIME ZONE $2)::date`;
  const { rows } = await client.query(SQL, [userId, timeZone]);
  return rows;
};

export const getUncompletedDailyGoals = async (userId, timeZone) => {
  const SQL = `
    select goals.*
    FROM goals
    JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
    AND (users_goals.date_made::timestamptz AT TIME ZONE $2)::date = (CURRENT_TIMESTAMP AT TIME ZONE $2)::date
    AND users_goals.date_complete IS NULL`;
  const { rows } = await client.query(SQL, [userId, timeZone]);
  return rows;
};

export const getWeeksGoals = async (userId, timeZone) => {
  const localDate = new Date().toLocaleString("en-US", {
    timeZone: timeZone,
  });
  const dayInteger = new Date(localDate).getDay() + 1;

  const SQL = `
    SELECT 
      goals.*,
      users_goals.date_made,
      users_goals.date_complete
    FROM goals
    JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
      AND (users_goals.date_made::timestamptz AT TIME ZONE $2) >= (LOCALTIMESTAMP AT TIME ZONE $2 - ($3::text || ' days')::interval)
      AND (users_goals.date_made::timestamptz AT TIME ZONE $2) <  (LOCALTIMESTAMP AT TIME ZONE $2);
  `;
  const { rows } = await client.query(SQL, [userId, timeZone, dayInteger]);
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
