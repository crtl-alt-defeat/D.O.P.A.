import express from "express";
import { createUserType } from "../db/queries/usersTypes.js";
import requireBody from "../middleware/requireBody.js";

const router = express.Router();

router.post(
  "/",
  requireBody(["user_id", "type_id"]),
  async (req, res, next) => {
    try {
      const { user_id, type_id } = req.body;

      const userType = await createUserType({ user_id, type_id });

      res.status(201).send(userType);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
