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
    FROM
      goals
      JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE
      users_goals.user_id = $1
      AND users_goals.date_made = (CURRENT_TIMESTAMP AT TIME ZONE $2)::date`;
  const { rows } = await client.query(SQL, [userId, timeZone]);
  return rows;
};

export const getUncompletedDailyGoals = async (userId, timeZone) => {
  const SQL = `
    select
      goals.*,
      users_goals.id as user_goal_id
    FROM
      goals
      JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE
      users_goals.user_id = $1
      AND users_goals.date_made = (CURRENT_TIMESTAMP AT TIME ZONE $2)::date
      AND users_goals.date_complete IS NULL`;
  const { rows } = await client.query(SQL, [userId, timeZone]);
  return rows;
};

export const getWeeksGoals = async (userId, timeZone) => {
  const localDate = new Date().toLocaleString("en-US", {
    timeZone: timeZone,
  });
  const dayInteger = new Date(localDate).getDay();

<<<<<<< HEAD
  const SQL = `
    SELECT 
      goals.*,
      users_goals.date_made,
      users_goals.date_complete
    FROM
      goals
      JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE
      users_goals.user_id = $1
      AND users_goals.date_made >= (CURRENT_TIMESTAMP AT TIME ZONE $2 - ($3 * INTERVAL '1 day'))::date
      AND users_goals.date_made <= (CURRENT_TIMESTAMP AT TIME ZONE $2)::date;
  `;
=======
  const SQL = `SELECT 
  users_goals.user_id,
  users_goals.goal_id,
  goals.name,
  goals.type_id,
  users_goals.status,
  users_goals.dayOfWeek,
  users_goals.date_made,
  users_goals.date_complete
FROM goals
JOIN users_goals ON users_goals.goal_id = goals.id
WHERE users_goals.user_id = $1
  AND users_goals.date_made >= (CURRENT_TIMESTAMP AT TIME ZONE $2 - ($3 * INTERVAL '1 day'))::date
  AND users_goals.date_made <= (CURRENT_TIMESTAMP AT TIME ZONE $2)::date;
`;
>>>>>>> 80a29d2c22dac8a507557337f8df36ddf50ae4c6
  const { rows } = await client.query(SQL, [userId, timeZone, dayInteger]);
  return rows;
};

export async function getGoalsByUserId(userId) {
  const SQL = `
    SELECT goals.*
    FROM
      goals
      JOIN users_goals ON users_goals.goal_id = goals.id
    WHERE users_goals.user_id = $1
  `;
  const { rows: goals } = await client.query(SQL, [userId]);
  return goals;
}

export async function getTypesByUserId(userId) {
  const SQL = `
  SELECT types.*
  FROM
    types
    JOIN users_types ON users_types.type_id = types.id
  WHERE users_types.user_id = $1
  `;
  const { rows: types } = await client.query(SQL, [userId]);
  return types;
}

//attepted streaks query
export async function getPartialStreak(userId, timeZone) {
  const SQL = `
  -- pulls dates form users goals, renames date_complete to day, filters out incompleted dates and today
  WITH days AS (
    SELECT DISTINCT date_complete AS day
    FROM  users_goals
    WHERE user_id = $1
      AND date_complete IS NOT NULL
      AND date_complete <= (CURRENT_TIMESTAMP AT TIME ZONE $2)::date
  ),
  
  -- sorts the days so that sorts the dates by recency and assigns a row number
  ordered AS (
    SELECT
      day,
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
  } = await client.query(SQL, [userId, timeZone]);
  return streak;
}
/* Uncomplete goal */
export async function markGoalIncomplete({ user_id, goal_id }) {
  const SQL = `
    UPDATE users_goals
    SET date_complete = NULL
    WHERE user_id = $1 AND goal_id = $2
    RETURNING *;
  `;

  const {
    rows: [updatedGoal],
  } = await client.query(SQL, [user_id, goal_id]);

  return updatedGoal;
}
