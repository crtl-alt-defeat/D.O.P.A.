import express from "express";
const githubRouter = express.Router();

githubRouter.post("/register", async (req, res, next) => {
  res.send("POST /oauth/github/register: test");
});
githubRouter.post("/login", async (req, res, next) => {
  res.send("POST /oauth/github/lgin: test");
});

export default githubRouter;
