import express from "express";
const googleRouter = express.Router();

//middleware
import getUserFromToken from "../../middleware/getUsersFromToken.js";
import requireUser from "../../middleware/requireUser.js";

//queries
import getInfoFromGoogleToken from "../../middleware/getInfoFromGoogleToken.js";
import {
  authenticateUsingGoogle,
  createUserUsingGoogle,
  linkUserToGoogle,
  unlinkUserFromGoogle,
} from "../../db/queries/users.js";

//register with google
googleRouter.post("/register", getInfoFromGoogleToken, async (req, res) => {
  const newUser = {
    name: req.name,
    sub: req.sub,
  };
  const token = await createUserUsingGoogle(newUser);
  res.send(token);
});

//login with google
googleRouter.post("/login", getInfoFromGoogleToken, async (req, res) => {
  const token = await authenticateUsingGoogle(req.sub);
  res.send(token);
});

//link to google
googleRouter.put(
  "/link",
  getInfoFromGoogleToken,
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    if (!req.sub) return res.status(401).send({ message: "invalid token" });

    const user = await linkUserToGoogle(req.user.id, req.sub);
    res.send(user);
  },
);

//unlink to google
googleRouter.put(
  "/unlink",
  getInfoFromGoogleToken,
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    if (!req.sub)
      return res.status(200).send({ message: "user isn't linked to google" });

    const user = await unlinkUserFromGoogle(req.user.id, req.sub);
    res.send(user);
  },
);

export default googleRouter;
