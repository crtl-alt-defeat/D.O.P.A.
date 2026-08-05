import express from "express";
const usersRouter = express.Router();

//middleware
//todo: import requireBody (copy middleware folder from previous assignments)
//todo: import getUserFromToken (copy middleware folder from previous assignments)
//todo: import requireUser (copy middleware folder from previous assignments)

//queries
import { createUser, getUserById } from "../db/queries/users.js";
import { getDailyGoals } from "../db/queries/usersGoals.js";

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

//todo: use middleware (requireBody)
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ message: "Missing required field(s)" });
    }

    const newUser = await createUser({ username, email, password });
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});
//get daily goals by user id
goalsRouter.get("/daily/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({ message: "Missing required field userId" });
    }
    const dailyGoals = await getDailyGoals(userId);

    if (dailyGoals.length === 0) {
      return res.status(404).send({ message: "User has no goals" });
    }
    res.status(200).send(dailyGoals);
  } catch (error) {
    next(error);
  }
});

//get weekly goals by user id
goalsRouter.get("/schedules/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({ message: "Missing required field userId" });
    }
    const weeklyGoals = await getWeeksGoals(userId);
    if (weeklyGoals.length === 0) {
      return res.status(404).send({ message: "User has no goals" });
    }
    res.status(200).send(weeklyGoals);
  } catch (error) {
    next(error);
  }
});
//todo: make a 'POST /login' route

//todo: make a 'GET /me' route, that requires a token and returns a user

//todo: move 'GET /types/user/:userId' to here as 'GET /users/me/types
//todo:   requiring a token and returning a list of types

//todo: move 'GET /goals/user/:userId' to here as 'GET /users/me/goals
//todo:   requiring a token and returning a list of goals

export default usersRouter;
