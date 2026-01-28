import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Appointment from "../pages/Appointment.jsx";
import Dashboard from "../pages/Dashboard.jsx";

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
