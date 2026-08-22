<<<<<<< HEAD
//potential handlers for selected goals
=======
import express from "express";
const selectionsRouter = express.Router();

// middleware
import requireBody from "../middleware/requireBody.js";

// correct imports — these match your SQL file
import {
  userSelectGoal,
  userDeselectGoal,
  getUsersSelections,
  getUsersSelectionByType, // ✔ THIS is the correct function
} from "../db/queries/selectedGoals.js";

/* creates selection*/
selectionsRouter.post(
  "/",
  requireBody(["user_id", "goal_id"]),
  async (req, res, next) => {
    try {
      const { user_id, goal_id } = req.body;
      const userSelection = await userSelectGoal({ user_id, goal_id });
      res.status(201).send(userSelection);
    } catch (err) {
      next(err);
    }
  },
);

/*Deletes goal selection*/
selectionsRouter.delete(
  "/",
  requireBody(["user_id", "goal_id"]),
  async (req, res, next) => {
    try {
      const { user_id, goal_id } = req.body;
      const userDeselection = await userDeselectGoal({ user_id, goal_id });
      res.send(userDeselection);
    } catch (err) {
      next(err);
    }
  },
);

/*Gets all of users selected goals by type*/
selectionsRouter.get("/user/:userId/type/:typeId", async (req, res, next) => {
  try {
    const { userId, typeId } = req.params;

    // ✔ use the correct SQL function
    const selected = await getUsersSelectionByType(userId, typeId);

    res.send(selected || []);
  } catch (err) {
    next(err);
  }
});
/* gets all of users selected goals */
selectionsRouter.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const goals = await getUsersSelections(user_id);
    res.send(goals);
  } catch (err) {
    next(err);
  }
});

export default selectionsRouter;
>>>>>>> 80a29d2c22dac8a507557337f8df36ddf50ae4c6
