import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./Layout.jsx";
import "./style.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
/* Notification related, ignore unless interfereing. */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service worker registered"))
    .catch((err) => console.error("SW registration failed:", err));
}
