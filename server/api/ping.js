import express from "express";
const pingRouter = express.Router();

pingRouter.get("/", (req, res, next) => {
  res.send("🏓pinged!");
});

export default pingRouter;
