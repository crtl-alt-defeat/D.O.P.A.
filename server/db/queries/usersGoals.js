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

export const getDailyGoals = async (userId) => {
  const SQL = `
    select goals.*
    FROM goals
    JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
    AND users_goals.date_made = (CURRENT_TIMESTAMP AT TIME ZONE 'America/Chicago')::date`;
  const { rows } = await client.query(SQL, [userId]);
  return rows;
};

export const getUncompletedDailyGoals = async (userId) => {
  const SQL = `
    select goals.*
    FROM goals
    JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
    AND users_goals.date_made = (CURRENT_TIMESTAMP AT TIME ZONE 'America/Chicago')::date
    AND users_goals.date_complete IS NULL`;
  const { rows } = await client.query(SQL, [userId]);
  return rows;
};

export const getWeeksGoals = async (userId) => {
  const SQL = `
    SELECT 
      goals.*,
      users_goals.date_made,
      users_goals.date_complete
    FROM goals
    JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
      AND users_goals.date_made BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
  `;
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

//attepted streaks query
export async function getPartialStreak(userId) {
  const SQL = `
  -- pulls dates form users goals, renames date_complete to day, filters out incompleted dates and today
  WITH days AS (
  SELECT date_complete AS day
  FROM  users_goals
  WHERE user_id = $1
  AND date_complete IS NOT NULL
  AND date_complete < CURRENT_DATE
  ),
  -- sorts the days so that sorts the dates by recency and assigns a row number
  ordered AS (
  SELECT day,
  ROW_NUMBER() OVER (ORDER BY day DESC) AS rn
  FROM days
  ),
  -- groups 
  grouped AS (
  SELECT day, rn, (day + rn * INTERVAL '1 day') AS grp
  FROM ordered)
  SELECT COUNT(*) AS streak
  FROM grouped
  WHERE grp = (SELECT grp FROM grouped ORDER BY day DESC LIMIT 1)`;
  const {
    rows: [{ streak }],
  } = await client.query(SQL, [userId]);
  return streak;
}
