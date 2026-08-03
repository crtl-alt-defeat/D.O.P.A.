import express from "express";
const goalsRouter = express.Router();

//middleware
//todo: import requireBody (copy middleware folder from previous assignments)

//queries
import {
  createGoal,
  getGoals,
  getGoal,
  getGoalsByUserId,
} from "../db/queries/goals.js";

goalsRouter.get("/", async (req, res, next) => {
  try {
    const goals = await getGoals();
    res.send(goals);
  } catch (error) {
    next(error);
  }
});

//todo: use middleware (requireBody)
goalsRouter.get("/:id", async (req, res, next) => {
  try {
    const goal = await getGoal(req.params.id);
    if (!goal) return res.status(404).send({ message: "Goal not found." });
    res.send(goal);
  } catch (error) {
    next(error);
  }
});

//todo: move to users and change from 'GET /goals/user/:userId' to 'GET /users/me/goals'
//todo:   requiring a token and getting user from token (use getUserFromToken and requireUser middleware)
goalsRouter.get("/user/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userGoals = await getGoalsByUserId(userId);
    if (!userGoals.length)
      return res.status(404).send({ message: "Goals not found." });
    res.send(userGoals);
  } catch (error) {
    next(error);
  }
});

//todo: make more secure (restrict this call to admins?)
//todo: use middleware (require body)
goalsRouter.post("/", async (req, res, next) => {
  try {
    const { name, type_id } = req.body;
    if (!name || !type_id)
      return res.status(400).send({ message: "Missing required field." });
    const newGoal = await createGoal({ name, type_id });
    res.status(201).send(newGoal);
  } catch (error) {
    next(error);
  }
});

export default goalsRouter;
