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

// Serve main index.html
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html")),
);

app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets")),
);

// Serve service worker explicitly (required for Render + Vite)
app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/service-worker.js"));
});

// API routes
app.use("/api", router);

// Catch-all for incorrect routes
app.use("/{*path}", (req, res) => {
  //res.status(404).send("Incorrect resource request");
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Custom error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message || err });
});
