import express from "express";
const usersRouter = express.Router();

//middleware
import requireBody from "../middleware/requireBody.js";
import getUserFromToken from "../middleware/getUsersFromToken.js";
import requireUser from "../middleware/requireUser.js";

//queries
import { createUser, getUserById } from "../db/queries/users.js";
import { getDailyGoals } from "../db/queries/usersGoals.js";
import { authenticate, createUser, getUserById } from "../db/queries/users.js";

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

//todo: move 'GET /types/user/:userId' to here as 'GET /users/me/types
//todo:   requiring a token and returning a list of types

//todo: move 'GET /goals/user/:userId' to here as 'GET /users/me/goals
//todo:   requiring a token and returning a list of goals

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
usersRouter.get(
  "/me/schedules",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const weeklyGoals = await getWeeksGoals(req.user.id);
      if (weeklyGoals.length === 0) {
        return res.status(404).send({ message: "User has no goals" });
      }
      res.status(200).send(weeklyGoals);
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
