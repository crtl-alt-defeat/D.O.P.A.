import express from "express";
const typesRouter = express.Router();

//middleware
import requireBody from "../middleware/requireBody.js";

//queries
import {
  createType,
  getTypes,
  getType,
  getTypesByUserId,
} from "../db/queries/types.js";

//todo: make more secure (restrict this call to admins?)
typesRouter.post("/", requireBody(["name"]), async (req, res, next) => {
  try {
    const newType = await createType(req.body.name);
    res.status(201).send(newType);
  } catch (error) {
    next(error);
  }
});

typesRouter.get("/", async (req, res, next) => {
  try {
    const types = await getTypes();
    res.send(types);
  } catch (error) {
    next(error);
  }
});

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

export default typesRouter;
