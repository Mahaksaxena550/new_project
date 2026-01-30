import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition.jsx";
import { getAuthUser, isLoggedIn, logout } from "../utils/storage.js";

const API = "http://localhost:5000/appointments";

export default function Dashboard() {
  const nav = useNavigate();
  const user = getAuthUser();

  const [loading, setLoading] = useState(true);
  const [appts, setAppts] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) nav("/login", { replace: true });
  }, [nav]);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      const res = await fetch(`${API}?userEmail=${encodeURIComponent(user?.email)}`);
      if (!res.ok) throw new Error("GET failed");

      const data = await res.json();
      setAppts(data);
    } catch (e) {
      setErr("API nahi chal rahi? `npm run api` terminal me chalao.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const upcomingCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return appts.filter((a) => a.date >= today).length;
  }, [appts]);

  const handleLogout = () => {
    logout();
    nav("/", { replace: true });
  };

const cancelAppt = async (id) => {
  if (!confirm("Cancel this appointment?")) return;

  const url = `${API}/${encodeURIComponent(id)}`;

  try {
    setErr("");

    const res = await fetch(url, { method: "DELETE" });

    if (!(res.status === 200 || res.status === 204)) {
      const txt = await res.text().catch(() => "");
      throw new Error(`DELETE ${res.status} ${res.statusText} :: ${txt}`);
    }

    load(); // reload list
  } catch (e) {
    setErr(`Cancel failed: ${e.message}`);
  }
};


  return (
    <PageTransition>
      <div className="glass rounded-3xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-white/70 mt-1">{user?.name} • {user?.email}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => nav("/appointment")}
              className="px-4 py-2 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
              type="button"
            >
              Book Appointment
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-400/20 hover:bg-rose-500/20 transition"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/60 text-xs">Total</p>
            <p className="text-lg font-semibold mt-1">{appts.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/60 text-xs">Upcoming</p>
            <p className="text-lg font-semibold mt-1">{upcomingCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/60 text-xs">Recent</p>
            <p className="text-lg font-semibold mt-1">{Math.min(5, appts.length)}</p>
          </div>
        </div>

        {err ? (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm">
            {err}
          </div>
        ) : null}

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Your Appointments</h3>

          {loading ? (
            <p className="text-white/70 mt-3">Loading...</p>
          ) : appts.length === 0 ? (
            <p className="text-white/70 mt-3">No appointments yet.</p>
          ) : (
            <div className="mt-3 grid gap-3">
              {appts.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold">{a.doctorName} • <span className="text-white/70">{a.specialty}</span></p>
                    <p className="text-white/70 text-sm mt-1">{a.date} • {a.slot} • ₹{a.fee}</p>
                    <p className="text-white/60 text-xs mt-1">Symptoms: {a.symptoms}</p>
                  </div>

                  <button
                    onClick={() => cancelAppt(a.id)}
                    className="px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-400/20 hover:bg-rose-500/20 transition"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
