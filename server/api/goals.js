import express from "express";
const goalsRouter = express.Router();
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
goalsRouter.get("/:id", async (req, res, next) => {
  try {
    const goal = await getGoal(req.params.id);
    if (!goal) return res.status(404).send({ message: "Goal not found." });
    res.send(goal);
  } catch (error) {
    next(error);
  }
});
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
