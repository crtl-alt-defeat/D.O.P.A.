import express from "express";
import path from "path";

//api imports
import usersRouter from "./api/users.js";
import typesRouter from "./api/types.js";
import goalsRouter from "./api/goals.js";

const app = express();
export default app;

//body parsing middleware
app.use(express.json());

//api routes
app.use("/users", usersRouter);
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
