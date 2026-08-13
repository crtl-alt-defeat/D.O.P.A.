import express from "express";
import { getGoals, getGoalsByTypeId } from "../db/queries/goals.js";
const typesRouter = express.Router();

//middleware
import requireBody from "../middleware/requireBody.js";

//queries
import {
  createType,
  getTypes,
  getType,
  getTypesByUserId,
  getTypeByName,
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

// typesRouter.param("name", async (req, res, next) => {
//   const type = await getTypeByName(req.params.name);
//   if (!type) return res.status(404).send({ message: "type not found" });
//   req.type = type;
//   next();
// });

typesRouter.get("/name", async (req, res, next) => {
  try {
    const type = await getTypeByName(req.query.name);
    if (!type) return res.status(404).send({ message: "type not found" });
    res.send(type);
  } catch (error) {
    next(error);
  }
});

//todo: make more secure (restrict this call to admins?)
typesRouter.get("/user/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userTypes = await getTypesByUserId(userId);
    /*     if (!userTypes.length)
      return res.status(404).send({ message: "Types not found." }); */
    console.log(userTypes);
    res.send(userTypes);
  } catch (error) {
    next(error);
  }
});

typesRouter.param("id", async (req, res, next) => {
  const type = await getType(req.params.id);
  if (!type) return res.status(404).send({ message: "type not found" });
  req.type = type;
  next();
});

typesRouter.get("/:id", async (req, res, next) => {
  try {
    res.send(req.type);
  } catch (error) {
    next(error);
  }
});

typesRouter.get("/:id/goals", async (req, res, next) => {
  try {
    const typeId = req.params.id;
    const goalType = await getGoalsByTypeId(typeId);

    res.send(goalType);
  } catch (error) {
    next(error);
  }
});

export default typesRouter;
