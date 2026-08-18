import express from "express";
import getUserFromToken from "../middleware/getUsersFromToken.js";
const router = express.Router();

// routes
import usersRouter from "./users.js";
import typesRouter from "./types.js";
import goalsRouter from "./goals.js";
import usersGoalsRouter from "./usersGoals.js";
import notificationsRouter from "./notifications.js";
router.use("/users", usersRouter);
router.use("/types", typesRouter);
router.use("/goals", goalsRouter);
router.use("/usersGoals", usersGoalsRouter);
router.use("/notifications", getUserFromToken, notificationsRouter);
import pingRouter from "./ping.js";

router.use("/users", usersRouter);
router.use("/types", typesRouter);
router.use("/goals", goalsRouter);
router.use("/ping", pingRouter);

export default router;
