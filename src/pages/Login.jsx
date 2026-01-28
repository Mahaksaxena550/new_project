import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition.jsx";
import { getUsers } from "../utils/storage.js";

export default function Login() {
  const nav = useNavigate();

  const [form, setForm] = useState({ email: "", pass: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let err = {};

    if (!form.email) err.email = "Email is required";
    if (!form.pass) err.pass = "Password is required";

    const users = getUsers();
    const found = users.find(
      (u) => u.email === form.email && u.pass === form.pass
    );

    if (!found) err.pass = "Invalid email or password";

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    localStorage.setItem(
      "auth_user",
      JSON.stringify({ name: found.name, email: found.email })
    );

    nav("/dashboard", { replace: true });
  };

  return (
    <PageTransition>
      <div className="max-w-md mx-auto">
        <div className="glass rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          <form onSubmit={handleLogin} className="space-y-3">
            {errors.email && <p className="error">{errors.email}</p>}
            <input
              className="input"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            {errors.pass && <p className="error">{errors.pass}</p>}
            <div className="relative">
              <input
                className="input pr-12"
                type={showPass ? "text" : "password"}
                name="pass"
                placeholder="Password"
                value={form.pass}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="eye-btn">
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            <button className="btn-primary">Login</button>
          </form>

          <p className="text-white/70 mt-4 text-sm">
            New user?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
