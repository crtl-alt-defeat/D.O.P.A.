import { Router } from "express";
const usersGoalsRouter = Router();

import client from "../db/client.js";

import getUserFromToken from "../middleware/getUsersFromToken.js";
import requireUser from "../middleware/requireUser.js";
import getTimeZoneFromQuery from "../middleware/getTimeZoneFromQuery.js";
import { markGoalIncomplete } from "../db/queries/usersGoals.js";
import { getPartialStreak } from "../db/queries/usersGoals.js";
usersGoalsRouter.get(
  "/completedToday",
  getUserFromToken,
  requireUser,
  getTimeZoneFromQuery,
  async (req, res, next) => {
    try {
      const SQL = `
      SELECT 
  users_goals.goal_id,
  users_goals.user_id,
  users_goals.date_complete,
  goals.name,
  goals.type_id
FROM users_goals
JOIN goals ON goals.id = users_goals.goal_id
WHERE users_goals.user_id = $1
  AND users_goals.date_complete = (CURRENT_TIMESTAMP AT TIME ZONE $2)::date`;
      const { rows } = await client.query(SQL, [req.user.id, req.timeZone]);
      res.send(rows);
    } catch (err) {
      next(err);
    }
  },
);
/* usersGoalsRouter.get(
  "/completedToday",
  getUserFromToken,
  requireUser,
  getTimeZoneFromQuery,
  async (req, res, next) => {
    try {
      const SQL = `
      SELECT goals.*
      FROM goals
      JOIN users_goals ON users_goals.goal_id = goals.id
      WHERE users_goals.user_id = $1
        AND users_goals.date_complete = (CURRENT_TIMESTAMP AT TIME ZONE $2)::date
      `;
      const { rows } = await client.query(SQL, [req.user.id, req.timeZone]);
      res.send(rows);
    } catch (err) {
      next(err);
    }
  },
);
 */
usersGoalsRouter.get(
  "/streak",
  getUserFromToken,
  requireUser,
  getTimeZoneFromQuery,
  async (req, res, next) => {
    try {
      const streak = await getPartialStreak(req.user.id, req.timeZone);
      res.send({ streak });
    } catch (err) {
      next(err);
    }
  },
);
/* import { Router } from "express";
import { getPartialStreak } from "../db/queries/usersGoals";
import { requireUser } from "../middleware/auth.js";
const router = usersGoalsRouter();
usersGoalsRouter.get("/streak", requireUser, async (requireUser, res) => {
  const streak = await getPartialStreak(req.user.id);
  res.send({ streak });
});
export default usersGoalsRouter; */
/* Uncomplete Goal */
usersGoalsRouter.put("/incomplete", async (req, res, next) => {
  try {
    const { user_id, goal_id } = req.body;

    const updatedGoal = await markGoalIncomplete({ user_id, goal_id });

    res.send(updatedGoal);
  } catch (err) {
    next(err);
  }
});
// WEEKLY GOALS
usersGoalsRouter.get(
  "/weekly",
  getUserFromToken,
  requireUser,
  getTimeZoneFromQuery,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const timeZone = req.timeZone;

      const SQL = `
  SELECT 
    users_goals.user_id,
    users_goals.goal_id,
    goals.name,
    goals.type_id,
    users_goals.date_made,
    users_goals.date_complete
  FROM goals
  JOIN users_goals ON users_goals.goal_id = goals.id
  WHERE users_goals.user_id = $1
    AND users_goals.date_made >= (
      CURRENT_TIMESTAMP AT TIME ZONE $2 
      - (EXTRACT(DOW FROM CURRENT_TIMESTAMP AT TIME ZONE $2) * INTERVAL '1 day')
    )::date
    AND users_goals.date_made <= (CURRENT_TIMESTAMP AT TIME ZONE $2)::date;
`;

      const { rows } = await client.query(SQL, [userId, timeZone]);
      res.send(rows);
    } catch (err) {
      next(err);
    }
  },
);

export default usersGoalsRouter;
