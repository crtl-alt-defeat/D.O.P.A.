import express from "express";
const googleRouter = express.Router();

import getInfoFromGoogleToken from "../../middleware/getInfoFromGoogleToken.js";
import {
  authenticateUsingGoogle,
  createUserUsingGoogle,
} from "../../db/queries/users.js";

googleRouter.post("/register", getInfoFromGoogleToken, async (req, res) => {
  const newUser = {
    name: req.name,
    sub: req.sub,
  };
  const token = await createUserUsingGoogle(newUser);
  res.send(token);
});

googleRouter.post("/login", getInfoFromGoogleToken, async (req, res) => {
  const token = await authenticateUsingGoogle(req.sub);
  res.send(token);
});

export default googleRouter;
