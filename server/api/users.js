import express from "express";
const usersRouter = express.Router();
import client from "../db/client.js";

//middleware
import requireBody from "../middleware/requireBody.js";
import getUserFromToken from "../middleware/getUsersFromToken.js";
import requireUser from "../middleware/requireUser.js";
import {
  getSubscriptionForUser,
  sendGoalNotification,
} from "./notifications.js";

//queries
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
import { createUserType, deleteUserType } from "../db/queries/usersTypes.js";
import {
  getDailyGoals,
  getTypesByUserId,
  getWeeksGoals,
  createUserGoal,
  getUncompletedDailyGoals,
} from "../db/queries/usersGoals.js";
import { attemptGiveUserRandomGoals } from "../utils/cron.js";

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

usersRouter.post(
  "/me/types/:id",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const newUserType = {
        user_id: req.user.id,
        type_id: req.params.id,
      };

      const created = await createUserType(newUserType);
      if (!created) {
        return res.status(404).send({ message: "failed to create" });
      }

      res.send(created);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.delete(
  "/me/types/:id",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const oldUserType = {
        user_id: req.user.id,
        type_id: req.params.id,
      };

      const deleted = await deleteUserType(oldUserType);
      if (!deleted) {
        return res.status(404).send({ message: "failed to delete" });
      }

      res.send({
        message: `users_types with user_id ${req.user.id} and type_id ${req.params.id} has been deleted`,
      });
    } catch (error) {
      next(error);
    }
  },
);

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

      if (!potentialGoals || !potentialGoals.length) {
        return res.send([]);
      }

      res.send(potentialGoals);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.get(
  "/me/potentialGoals/random",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const potentialGoals = await getPotentialGoals(req.user.id);

      if (!potentialGoals || !potentialGoals.length) {
        return res.send([]);
      }

      const newGoals = [];
      for (let i = 0; i < 3; i++) {
        let foundUnique = false;
        do {
          const newGoalIndex = Math.floor(
            Math.random() * potentialGoals.length,
          );
          const newGoal = potentialGoals[newGoalIndex];

          const findGoal = newGoals.find((goal) => goal.id == newGoal.id);
          foundUnique = !findGoal;

          if (foundUnique) {
            newGoals.push(newGoal);
          } else if (newGoals.length == potentialGoals.length) {
            break;
          }
        } while (!foundUnique);
      }

      res.send(newGoals);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.post(
  "/me/daily",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const timeZone = req.query.timeZone || "UTC";

      //console.log(`--🌐 attempting to give goals to ${req.user.name}`);
      const created = await attemptGiveUserRandomGoals(req.user, timeZone);

      if (!created)
        return res.status(422).send({ message: "failed to create goals" });

      res.status(201).send(created);
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
      const userId = req.user.id;
      const timeZone = req.query.timeZone || "UTC";
      const dailyGoals = await getDailyGoals(userId, timeZone);

      if (dailyGoals.length === 0) {
        return res.status(404).send({ message: "User has no goals" });
      }

      res.status(200).send(dailyGoals);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.get(
  "/me/schedules",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const timeZone = req.query.timeZone || "UTC";
      const weeklyGoals = await getWeeksGoals(userId, timeZone);

      const labeledGoals = weeklyGoals.map((goal) => {
        const formatter = new Intl.DateTimeFormat("en-us", {
          timeZone: timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const complete = formatter.format(new Date(goal.date_complete));
        const today = formatter.format(new Date());

        let status;

        if (!goal.date_complete) {
          status = "Not Completed";
        } else if (complete === today) {
          status = "Completed Today";
        } else {
          status = "Completed Previously";
        }

        const dateMade = new Date(goal.date_made);
        const dayName = dateMade.toLocaleDateString("en-us", {
          timeZone: timeZone,
          weekday: "long",
        });
        const weekdays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayOfWeek = weekdays.indexOf(dayName);

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
        date_made: new Date().toISOString(),
        date_complete: null,
      });
      const subscription = getSubscriptionForUser(req.user.id);

      if (subscription) {
        await sendGoalNotification(subscription, name);
      } else {
        console.log("No subscription found for user, skipping push");
      }

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
      const timeZone = req.query.timeZone || "UTC";
      const goals = await getUncompletedDailyGoals(userId, timeZone);

      const uncompleted = goals.filter((g) => !g.date_complete);

      res.status(200).send(uncompleted);
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
        SET date_complete = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND goal_id = $2
        RETURNING *;
      `;

      const { rows } = await client.query(SQL, [req.user.id, goalId]);

      if (!rows.length) {
        return res.status(404).send({ message: "Goal not found for user" });
      }

      const goalSQL = `
        SELECT *
        FROM goals
        WHERE id = $1;
      `;
      const { rows: goalRows } = await client.query(goalSQL, [goalId]);

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
    next(error); // sends to custom error handler is server/index.js <- should I do this? // (raven: maybe??? If you want to?)
  }
});
export default usersRouter;
