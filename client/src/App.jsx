import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router";
import WelcomePage from "./pages/Welcome.jsx";
import RegisterPage from "./auth/Register.jsx";
import IntakePage from "./pages/IntakeForm.jsx";
import LoginPage from "./auth/Login.jsx";
import HomePage from "./pages/Home.jsx";
import SettingsPage from "./pages/Settings.jsx";
import Layout from "./Layout.jsx";

/* 
function NavigationBar() {
  const location = useLocation();

  return (
    <nav>
      <Link to="/">Welcome</Link> | <Link to="/login">Log In</Link> |{" "}
      <Link to="/register">Register</Link> | <Link to="/home">Home</Link> |{" "}
      <Link to="/settings">Settings</Link>
    </nav>
  );
} */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/intake" element={<IntakePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
