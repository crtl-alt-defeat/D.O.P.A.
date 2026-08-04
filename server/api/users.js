import express from "express";
const usersRouter = express.Router();

//middleware
import requireBody from "../middleware/requireBody.js";
import getUserFromToken from "../middleware/getUsersFromToken.js";
import requireUser from "../middleware/requireUser.js";

//queries
import { authenticate, createUser, getUserById } from "../db/queries/users.js";

usersRouter.post(
  "/register",
  requireBody(["name", "email", "password"]),
  async (req, res, next) => {
    try {
      const newUser = req.body;
      const token = await createUser(newUser);
      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.post(
  "/login",
  requireBody(["email", "password"]),
  async (req, res) => {
    const userInfo = req.body;
    const token = await authenticate(userInfo);
    res.send(token);
  },
);

//todo: make a 'GET /me' route, that requires a token and returns a user
usersRouter.get("/me", getUserFromToken, requireUser, async (req, res) => {
  console.log(req);
  res.send(req.user);
});

//todo: move 'GET /types/user/:userId' to here as 'GET /users/me/types
//todo:   requiring a token and returning a list of types

//todo: move 'GET /goals/user/:userId' to here as 'GET /users/me/goals
//todo:   requiring a token and returning a list of goals

usersRouter.get("/:id", async (req, res, next) => {
  //todo: make more secure maybe? (require token and restrict to admins? [this would require implementing an admin role in users])
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

export default usersRouter;
