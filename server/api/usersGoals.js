import { Router } from "express";
import { getPartialStreak } from "../db/queries/usersGoals.js";
import requireUser from "../middleware/requireUser.js";
import client from "../db/client.js";
const usersGoalsRouter = Router();
usersGoalsRouter.get("/completedToday", requireUser, async (req, res, next) => {
  try {
    const SQL = `
      SELECT goals.*
      FROM goals
      JOIN users_goals ON users_goals.goal_id = goals.id
      WHERE users_goals.user_id = $1
        AND users_goals.date_complete = CURRENT_DATE
    `;
    const { rows } = await client.query(SQL, [req.user.id]);
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

usersGoalsRouter.get("/streak", requireUser, async (req, res, next) => {
  try {
    const streak = await getPartialStreak(req.user.id);
    res.send({ streak });
  } catch (err) {
    next(err);
  }
});

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
