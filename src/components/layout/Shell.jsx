import React from "react";
import Navbar from "./Navbar.jsx";
import AnimatedBg from "../ui/AnimatedBg.jsx";
import CursorGlow from "../ui/CursorGlow.jsx";

export default function Shell({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBg />
      <CursorGlow />
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  );
}
