import express from "express";
const router = express.Router();

import usersRouter from "./users.js";

//define api routes here
router.use("/users", usersRouter);
//todo: add route to types (move from /server/index.js)
//todo: add route to goals (move from /server/index.js)

export default router;
