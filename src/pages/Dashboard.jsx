import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition.jsx";
import {
  getAuthUser,
  isLoggedIn,
  logout,
  getAppointmentsForUser,
  cancelAppointment,
} from "../utils/storage.js";

export default function Dashboard() {
  const nav = useNavigate();
  const user = getAuthUser();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) nav("/login", { replace: true });
  }, [nav]);

  const appts = useMemo(() => {
    if (!user?.email) return [];
    return getAppointmentsForUser(user.email);
  }, [user?.email, refresh]);

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  const handleCancel = (id) => {
    cancelAppointment(id);
    setRefresh((v) => v + 1); // ✅ re-render list
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto">
        {/* TOP CARD */}
        <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">My Dashboard</h2>
            <p className="text-white/70 mt-1">
              Welcome, <span className="font-medium">{user?.name || "User"}</span>
            </p>
            <p className="text-white/50 text-sm">{user?.email}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => nav("/appointment")}
              className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/20 transition border border-white/15"
            >
              Book Appointment
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-2xl bg-red-500/10 border border-red-400/20 text-red-200
                         hover:bg-red-500/15 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* APPOINTMENTS */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">My Appointments</h3>

          {appts.length === 0 ? (
            <div className="glass rounded-3xl p-6 border border-white/10 text-center">
              <p className="text-white/70">No appointments yet.</p>
              <button
                onClick={() => nav("/appointment")}
                className="mt-4 px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/20 transition border border-white/15"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {appts.map((a) => (
                <div
                  key={a.id}
                  className="glass rounded-3xl p-5 border border-white/10 hover:border-white/20 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-lg text-white/90">
                        {a.doctorName}
                      </p>
                      <p className="text-white/70 text-sm">{a.specialty}</p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-sm px-3 py-1 rounded-2xl bg-white/5 border border-white/10 text-white/70">
                          {a.date}
                        </span>
                        <span className="text-sm px-3 py-1 rounded-2xl bg-white/5 border border-white/10 text-white/70">
                          {a.slot}
                        </span>
                        <span className="text-sm px-3 py-1 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 text-emerald-200">
                          ₹ {a.fee}
                        </span>
                      </div>

                      {a.symptoms ? (
                        <p className="text-white/55 text-sm mt-3">
                          <span className="text-white/70">Symptoms:</span>{" "}
                          {a.symptoms}
                        </p>
                      ) : null}
                    </div>

                    <button
                      onClick={() => handleCancel(a.id)}
                      className="px-4 py-2 rounded-2xl bg-red-500/10 border border-red-400/20 text-red-200
                                 hover:bg-red-500/15 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
