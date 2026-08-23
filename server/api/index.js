import express from "express";
const router = express.Router();

//middleware
import getUserFromToken from "../middleware/getUsersFromToken.js";

// routes
import usersRouter from "./users.js";
import typesRouter from "./types.js";
import goalsRouter from "./goals.js";
import usersGoalsRouter from "./usersGoals.js";
import notificationsRouter from "./notifications.js";
import pingRouter from "./ping.js";
import selectionsRouter from "./selectedGoals.js";
import oauthRouter from "./oauth/oauth.js";

router.use("/users", usersRouter);
router.use("/types", typesRouter);
router.use("/goals", goalsRouter);
router.use("/usersGoals", usersGoalsRouter);
router.use("/selectedGoals", selectionsRouter);
router.use("/notifications", getUserFromToken, notificationsRouter);
router.use("/ping", pingRouter);
router.use("/oauth", oauthRouter);

export default router;
