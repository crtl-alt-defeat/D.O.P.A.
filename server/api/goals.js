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
import requireBody from "../middleware/requireBody.js";

//todo: make more secure (restrict this call to admins?)
//todo: use middleware (require body)
goalsRouter.post(
  "/",
  requireBody(["name", "type_id"]),
  async (req, res, next) => {
    try {
      const newGoal = await createGoal(req.body);
      res.status(201).send(newGoal);
    } catch (error) {
      next(error);
    }
  },
);

goalsRouter.get("/", async (req, res, next) => {
  try {
    const goals = await getGoals();
    res.send(goals);
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

export default goalsRouter;
