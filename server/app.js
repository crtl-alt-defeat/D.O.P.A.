import express from "express";
import path from "path";
import getUserFromToken from "./middleware/getUsersFromToken.js";

import router from "./api/index.js";

const app = express();
export default app;

app.use(express.json());
app.use((req, res, next) => {
  if (req.originalUrl.includes("/api/notifications/vapidPublicKey")) {
    return next();
  }
  return getUserFromToken(req, res, next);
});
const __dirname = import.meta.dirname;

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html")),
);

app.get("/home", (req, res) => {
  res.send("test");
});

app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets")),
);
app.use("/api", router);

app.use("/{*path}", (req, res) => {
  //res.status(404).send("Incorrect resource request");
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message || err });
});
