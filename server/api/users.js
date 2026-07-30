import express from "express";
const usersRouter = express.Router();
import { createUser, getUserById } from "../db/usersQueries.js";

usersRouter.get("/:id", async (req, res, next) => {
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

export default usersRouter;
