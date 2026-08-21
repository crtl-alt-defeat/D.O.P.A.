import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router";
import WelcomePage from "./pages/Welcome.jsx";
import RegisterPage from "./auth/Register.jsx";
import IntakePage from "./pages/IntakeForm.jsx";
import LoginPage from "./auth/Login.jsx";
import HomePage from "./pages/Home.jsx";
import SettingsPage from "./pages/settings/Settings.jsx";
import SchedulesPage from "./pages/Schedules.jsx";
import Layout from "./Layout.jsx";
import TestOAuth from "./auth/OAuth/TestOAuth.jsx";

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
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/OAuth-test" element={<TestOAuth />} />
      </Route>
    </Routes>
  );
}

export default App;
