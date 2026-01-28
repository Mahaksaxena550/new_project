import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MagneticButton from "../ui/MagneticButton.jsx";
import DepartmentsMega from "../ui/DepartmentsMega.jsx";
import LogoMark from "../ui/LogoMark.jsx";
import { isLoggedIn, logout } from "../../utils/storage.js";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const logged = isLoggedIn();

  const [openMega, setOpenMega] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/coe", label: "Centres of Excellence" },
      { to: "/doctors", label: "Doctors" },
      { to: "/patients", label: "Patients & Visitors" },
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact Us" },
    ],
    []
  );

  const active = (to) => pathname === to;

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <header className="relative z-40">
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="bg-slate-950/55 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="h-16 flex items-center justify-between gap-6">

              {/* LOGO */}
              <Link to="/" className="shrink-0">
               <LogoMark size={56} />
              </Link>

              {/* DESKTOP LINKS */}
              <div className="hidden xl:flex flex-1 justify-center">
                <ul className="flex items-center gap-6 text-white/70 text-sm font-medium">
                  {links.slice(0, 3).map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className={`navlink ${active(l.to) ? "navactive" : ""}`}>
                        {l.label}
                      </Link>
                    </li>
                  ))}

                  {/* mega */}
                  <li
                    className="relative"
                    onMouseEnter={() => setOpenMega(true)}
                    onMouseLeave={() => setOpenMega(false)}
                  >
                    <span className={`navlink cursor-pointer ${openMega ? "navactive" : ""}`}>
                      Departments & Services
                    </span>

                    {openMega && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4">
                        <div className="rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur-xl p-3">
                          <DepartmentsMega dark />
                        </div>
                      </div>
                    )}
                  </li>

                  {links.slice(3).map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className={`navlink ${active(l.to) ? "navactive" : ""}`}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3 shrink-0">
                {logged && (
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={() => nav("/dashboard")}
                      className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/80
                                 hover:bg-white/10 hover:text-white transition"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-2xl bg-red-500/10 border border-red-400/20 text-red-200
                                 hover:bg-red-500/15 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}

                <MagneticButton onClick={() => nav("/appointment")}>
                  Appointment
                </MagneticButton>

                {/* MOBILE MENU */}
                <button
                  className="xl:hidden h-11 w-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Open menu"
                >
                  <span className="text-white/90 text-xl">{mobileOpen ? "✕" : "☰"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE DROPDOWN (simple) */}
        {mobileOpen && (
          <div className="xl:hidden bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid gap-2">
              {links.map((l) => (
                <button
                  key={l.to}
                  onClick={() => { setMobileOpen(false); nav(l.to); }}
                  className={`text-left px-4 py-3 rounded-2xl border transition
                    ${active(l.to)
                      ? "bg-white/10 border-white/15 text-white"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="h-16" />

      <style>{`
        .navlink{
          position:relative;
          padding:8px 2px;
          color:rgba(255,255,255,0.72);
          transition: color 160ms ease;
          white-space:nowrap;
        }
        .navlink:hover{ color: rgba(255,255,255,0.95); }
        .navlink::after{
          content:"";
          position:absolute;
          left:0;
          bottom:-6px;
          width:0%;
          height:2px;
          border-radius:999px;
          background: rgba(34,197,94,0.55);
          transition: width 220ms ease;
        }
        .navlink:hover::after{ width:100%; }
        .navactive{
          color: rgba(255,255,255,0.95) !important;
        }
        .navactive::after{ width:100%; }
      `}</style>
    </header>
  );
}
