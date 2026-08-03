import express from "express";
import router from "./api/index.js";

import path from "path";

import typesRouter from "./api/types.js";
import goalsRouter from "./api/goals.js";

const app = express();
export default app;

//body parsing middleware
app.use(express.json());

//todo: move to /server/api/index.js
app.use("/types", typesRouter);
app.use("/goals", goalsRouter);

//for deployment only
const __dirname = import.meta.dirname;

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html")),
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets")),
);

//use api routes
app.use("/api", router);

//express routes catch all
app.use("/{*path}", (req, res, next) => {
  res.status(404).send("Incorrect resource request");
});

//custom error handling route
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});
