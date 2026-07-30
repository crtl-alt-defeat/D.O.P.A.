import express from "express";
const typesRouter = express.Router();
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
typesRouter.get("/:id", async (req, res, next) => {
  try {
    const type = await getType(req.params.id);
    if (!type) return res.status(404).send({ message: "Type not found." });
    res.send(type);
  } catch (error) {
    next(error);
  }
});
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
typesRouter.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).send({ message: "Missing required field." });
    const newType = await createType({ name });
    res.status(201).send(newType);
  } catch (error) {
    next(error);
  }
});

export default typesRouter;
