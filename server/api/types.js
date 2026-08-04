import express from "express";
const typesRouter = express.Router();

//middleware
//todo: import requireBody (copy middleware folder from previous assignments)

//queries
import {
  createType,
  getTypes,
  getType,
  getTypesByUserId,
} from "../db/queries/types.js";

typesRouter.get("/", async (req, res, next) => {
  try {
    const types = await getTypes();
    res.send(types);
  } catch (error) {
    next(error);
  }
});

//todo: make a param route for id

typesRouter.get("/:id", async (req, res, next) => {
  try {
    const type = await getType(req.params.id);
    if (!type) return res.status(404).send({ message: "Type not found." });
    res.send(type);
  } catch (error) {
    next(error);
  }
});

//todo: make a 'GET /:id/goals' to get all goals of a specific type

//todo: move to users and change from 'GET /types/user/:userId' to 'GET /users/me/types'
//todo:   requiring a token and getting user from token (use getUserFromToken and requireUser middleware)
typesRouter.get("/user/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userTypes = await getTypesByUserId(userId);
    if (!userTypes.length)
      return res.status(404).send({ message: "Types not found." });
    res.send(userTypes);
  } catch (error) {
    next(error);
  }
});

//todo: make more secure (restrict this call to admins?)
//todo: use middleware (requireBody)
typesRouter.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).send({ message: "Missing required field." });
    const newType = await createType(name);
    res.status(201).send(newType);
  } catch (error) {
    next(error);
  }
});

export default typesRouter;
