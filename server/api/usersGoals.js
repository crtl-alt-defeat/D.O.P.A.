import { Router } from "express";
const usersGoalsRouter = Router();

import client from "../db/client.js";

import getUserFromToken from "../middleware/getUsersFromToken.js";
import requireUser from "../middleware/requireUser.js";
import getTimeZoneFromQuery from "../middleware/getTimeZoneFromQuery.js";

import { getPartialStreak } from "../db/queries/usersGoals.js";

usersGoalsRouter.get(
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

export default usersGoalsRouter;

/* import { Router } from "express";
import { getPartialStreak } from "../db/queries/usersGoals";
import { requireUser } from "../middleware/auth.js";
const router = usersGoalsRouter();
usersGoalsRouter.get("/streak", requireUser, async (requireUser, res) => {
  const streak = await getPartialStreak(req.user.id);
  res.send({ streak });
});
export default usersGoalsRouter; */
