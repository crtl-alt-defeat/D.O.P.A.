import express from "express";
const usersRouter = express.Router();

import { createUserType } from "../db/queries/usersTypes.js";
import { getTypesByUserId } from "../db/queries/types.js";
import { getGoalsByUserId } from "../db/queries/goals.js";

//middleware
import requireBody from "../middleware/requireBody.js";
import getUserFromToken from "../middleware/getUsersFromToken.js";
import requireUser from "../middleware/requireUser.js";

//queries
import {
  getDailyGoals,
  getTypesByUserId,
  getWeeksGoals,
  createUserGoal,
} from "../db/queries/usersGoals.js";
import {
  authenticate,
  createUser,
  getUserById,
  updateUser,
} from "../db/queries/users.js";
import {
  createGoal,
  getGoalsByUserId,
  getPotentialGoals,
} from "../db/queries/goals.js";
import client from "../db/client.js";

usersRouter.post(
  "/register",
  requireBody(["name", "email", "password"]),
  async (req, res, next) => {
    try {
      const newUser = req.body;
      const token = await createUser(newUser);
      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.post(
  "/login",
  requireBody(["email", "password"]),
  async (req, res) => {
    const userInfo = req.body;
    const token = await authenticate(userInfo);
    res.send(token);
  },
);

usersRouter.get("/me", getUserFromToken, requireUser, async (req, res) => {
  res.send(req.user);
});

usersRouter.post(
  "/me/types",
  getUserFromToken,
  requireUser,
  requireBody(["type_id"]),
  async (req, res, next) => {
    try {
      const userTypeLink = await createUserType({
        user_id: req.user.id,
        type_id: req.body.type_id,
      });

      res.status(201).send(userTypeLink);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.put(
  "/me/update",
  getUserFromToken,
  requireUser,
  requireBody(["id", "name", "email", "password"]),
  async (req, res) => {
    const newUser = await updateUser(req.body);
    res.send(newUser);
  },
);

//todo: move 'GET /types/user/:userId' to here as 'GET /users/me/types
//todo:   requiring a token and returning a list of types
usersRouter.get(
  "/me/types",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const userTypes = await getTypesByUserId(req.user.id);

      if (!userTypes || !userTypes.length) {
        return res.send([]);
      }

      res.send(userTypes);
    } catch (error) {
      next(error);
    }
  },
);

//todo: move 'GET /goals/user/:userId' to here as 'GET /users/me/goals
//todo:   requiring a token and returning a list of goals
usersRouter.get(
  "/me/goals",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const userGoals = await getGoalsByUserId(req.user.id);

      if (!userGoals || !userGoals.length) {
        return res.send([]);
      }
      res.send(userGoals);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.get(
  "/me/potentialGoals",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const potentialGoals = await getPotentialGoals(req.user.id);
      res.send(potentialGoals);
    } catch (error) {
      next(error);
    }
  },
);

//get daily goals for logged in user
usersRouter.get(
  "/me/daily",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const dailyGoals = await getDailyGoals(req.user.id);

      if (dailyGoals.length === 0) {
        return res.status(404).send({ message: "User has no goals" });
      }
      res.status(200).send(dailyGoals);
    } catch (error) {
      next(error);
    }
  },
);

//get weekly goals by user id
/* usersRouter.get(
  "/me/schedules",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    const weeklyGoals = await getWeeksGoals(req.user.id);
    res.status(200).send(weeklyGoals);
  },
); */
usersRouter.get(
  "/me/schedules",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const weeklyGoals = await getWeeksGoals(req.user.id);

      const labeledGoals = weeklyGoals.map((goal) => {
        const complete = goal.date_complete;
        const today = new Date().toISOString().slice(0, 10);

        let status;

        if (!complete) {
          status = "Not Completed";
        } else if (complete === today) {
          status = "Completed Today";
        } else {
          status = "Completed Previously";
        }
        const dayOfWeek = new Date(goal.date_made).getDay();

        return { ...goal, status, dayOfWeek };
      });

      res.status(200).send(labeledGoals);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.post(
  "/me/goals",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const { name, type_id } = req.body;
      const goal = await createGoal({ name, type_id });
      const userGoal = await createUserGoal({
        user_id: req.user.id,
        goal_id: goal.id,
        date_made: new Date(),
        date_complete: null,
      });

      res.status(201).send({ goal, userGoal });
    } catch (error) {
      next(error);
    }
  },
);
/* added Fri */
usersRouter.get(
  "/me/goals/uncompleted",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const userId = req.user.id;

      const goals = await getGoalsByUserId(userId);

      const uncompleted = goals.filter((g) => !g.date_complete);

      res.status(200).send(uncompleted.slice(0, 3));
    } catch (error) {
      next(error);
    }
  },
);
usersRouter.put(
  "/me/goals/:goalId/complete",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const goalId = req.params.goalId;

      const SQL = `
        UPDATE users_goals
        SET date_complete = CURRENT_DATE
        WHERE user_id = $1 AND goal_id = $2
        RETURNING *;
      `;

      const { rows } = await client.query(SQL, [req.user.id, goalId]);

      if (!rows.length) {
        return res.status(404).send({ message: "Goal not found for user" });
      }

      // Fetch the goal details
      const goalSQL = `
        SELECT *
        FROM goals
        WHERE id = $1;
      `;
      const { rows: goalRows } = await client.query(goalSQL, [goalId]);

      // Return both
      res.status(200).send({
        userGoal: rows[0],
        goal: goalRows[0],
      });
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.get("/:id", async (req, res, next) => {
  //todo: make more secure maybe? (require token and restrict to admins? [this would require implementing an admin role in users])
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    next(error); // sends to custom error handler is server/index.js <- should I do this?
  }
});
export default usersRouter;
