import express from "express";
const goalsRouter = express.Router();

//middleware
import requireBody from "../middleware/requireBody.js";

//queries
import {
  createGoal,
  getGoals,
  getGoal,
  getGoalsByUserId,
} from "../db/queries/goals.js";

//todo: make more secure (restrict this call to admins?)
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

//todo: make more secure (restrict this call to admins?)
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

//todo: goalsRouter.get("/type/:typeId") (get goals by type_id)

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
