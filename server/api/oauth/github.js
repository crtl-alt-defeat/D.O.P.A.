import express from "express";
const githubRouter = express.Router();

githubRouter.post("/register", async (req, res, next) => {
  res.send("POST /oauth/github/register: test");
});
githubRouter.post("/login", async (req, res, next) => {
  res.send("POST /oauth/github/login: test");
});
githubRouter.put("/link", async (req, res, next) => {
  res.send("PUT /oauth/github/link: test");
});

export default githubRouter;
