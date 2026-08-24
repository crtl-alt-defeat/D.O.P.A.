import express from "express";
const linkedinRouter = express.Router();

linkedinRouter.post("/register", async (req, res, next) => {
  res.send("POST /oauth/linkedin/register: test");
});

linkedinRouter.post("/login", async (req, res, next) => {
  res.send("POST /oauth/linkedin/lgin: test");
});

export default linkedinRouter;
