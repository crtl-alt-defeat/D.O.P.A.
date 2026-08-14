import express from "express";
import path from "path";
import router from "./api/index.js";

const app = express();
export default app;

// Body parsing middleware
app.use(express.json());

// Deployment-only dirname
const __dirname = import.meta.dirname;

// Serve main index.html
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html")),
);

// Serve static assets (JS, CSS, images)
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
  res.status(404).send("Incorrect resource request");
});

// Custom error handler
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});
