import express from "express";
const router = express.Router();

//routes
import usersRouter from "./users.js";
import typesRouter from "./types.js";
import goalsRouter from "./goals.js";

router.use("/users", usersRouter);
router.use("/types", typesRouter);
router.use("/goals", goalsRouter);

export default router;
