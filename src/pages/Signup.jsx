import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition.jsx";
import { getUsers, setUsers } from "../utils/storage.js";

export default function Signup() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    pass: "",
    cpass: "",
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors((old) => ({ ...old, [e.target.name]: "" }));
  };

  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    if (!form.contact.trim()) err.contact = "Contact is required";

    if (!form.pass.trim()) err.pass = "Password is required";

    if (!form.cpass.trim()) err.cpass = "Confirm password is required";
    else if (form.pass !== form.cpass) err.cpass = "Password not match";

    const users = getUsers();
    if (form.email.trim() && users.find((u) => u.email === form.email.trim())) {
      err.email = "Email already registered";
    }

    setErrors(err);

    if (Object.keys(err).length > 0) return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const users = getUsers();

    const newUser = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
    };

    users.push(newUser);
    setUsers(users);

    nav("/login", { replace: true });
  };

  return (
    <PageTransition>
      <div className="max-w-md mx-auto">
        <div className="glass rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* NAME */}
            {errors.name && <p className="error">{errors.name}</p>}
            <input
              className="input"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />

            {/* EMAIL */}
            {errors.email && <p className="error">{errors.email}</p>}
            <input
              className="input"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            {/* CONTACT */}
            {errors.contact && <p className="error">{errors.contact}</p>}
            <input
              className="input"
              name="contact"
              placeholder="Contact"
              value={form.contact}
              onChange={handleChange}
            />

            {/* PASSWORD */}
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
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="eye-btn"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            {errors.cpass && <p className="error">{errors.cpass}</p>}
            <div className="relative">
              <input
                className="input pr-12"
                type={showCPass ? "text" : "password"}
                name="cpass"
                placeholder="Confirm Password"
                value={form.cpass}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowCPass(!showCPass)}
                className="eye-btn"
              >
                {showCPass ? "🙈" : "👁️"}
              </button>
            </div>

            <button type="submit" className="btn-primary">
              Create Account
            </button>
          </form>

          <p className="text-white/70 mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
