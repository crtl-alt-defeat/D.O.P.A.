import express from "express";
const oauthRouter = express.Router();

import githubRouter from "./github.js";
import googleRouter from "./google.js";
import linkedinRouter from "./linkedin.js";

oauthRouter.use("/github", githubRouter);
oauthRouter.use("/google", googleRouter);
oauthRouter.use("/linkedin", linkedinRouter);

export default oauthRouter;
