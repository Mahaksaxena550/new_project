import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import PageTransition from "../components/ui/PageTransition.jsx";
import { getAuthUser, logout, isLoggedIn } from "../utils/storage.js";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";


const API = "http://localhost:5000";
const slots = ["09:00 AM", "10:30 AM", "12:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];
const today = new Date().toISOString().split("T")[0];

export default function Dashboard() {
  const nav = useNavigate();
  const user = getAuthUser();

  let [all, setAll] = useState([]);
  let [load, setLoad] = useState(true);

  let [tab, setTab] = useState("up"); // up | past | all

  // toast
  let [toastOn, setToastOn] = useState(false);
  let [toastMsg, setToastMsg] = useState("");
  let toastRef = useRef(null);

  // reschedule (simple panel)
  let [editId, setEditId] = useState(null);
  let [edate, setEdate] = useState("");
  let [eslot, setEslot] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) nav("/login", { replace: true });
  }, [nav]);

  function showToast(text) {
    setToastMsg(text);
    setToastOn(true);

    setTimeout(() => {
      if (!toastRef.current) return;
      gsap.fromTo(toastRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.22 });
    }, 0);

    setTimeout(() => {
      setToastOn(false);
      setToastMsg("");
    }, 2000);
  }

  function pastCheck(a) {
    if (!a || !a.date) return false;
    return a.date < today;
  }

  async function getData() {
    try {
      setLoad(true);

      //simple logic
      let url = `${API}/appointments?userEmail=${encodeURIComponent(user?.email || "")}`;
      let res = await fetch(url);
      if (!res.ok) {
        showToast("API is not working");
        setAll([]);
        setLoad(false);
        return;
      }

      let data = await res.json();
      data = data.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setAll(data);
    } catch (err) {
      showToast("API error");
      setAll([]);
    } finally {
      setLoad(false);
    }
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  let upcoming = useMemo(() => all.filter((x) => !pastCheck(x)), [all]);
  let past = useMemo(() => all.filter((x) => pastCheck(x)), [all]);

  let showList = useMemo(() => {
    if (tab === "up") return upcoming;
    if (tab === "past") return past;
    return all;
  }, [tab, upcoming, past, all]);

  let totalCount = all.length;
  let upCount = upcoming.length;
  let recentCount = all.slice(0, 3).length;

  function doLogout() {
    logout();
    nav("/", { replace: true });
  }

let cancelAppt = async (id) => {
  let result = await Swal.fire({
    title: "Cancel appointment",
    text: "Do you to delete appointment?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Cancel",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  try {
    let res = await fetch(`${API}/appointments/${id}`, {
      method: "DELETE",
    });

    if (!(res.status === 200 || res.status === 204)) {
      showToast("Cancel fail");
      return;
    }

    setAll((old) => old.filter((x) => x.id !== id));
    showToast("Cancelled ✅");
  } catch (err) {
    showToast("Cancel fail");
  }
};


  function openReschedule(a) {
    setEditId(a.id);
    setEdate(a.date || "");
    setEslot(a.slot || "");

    setTimeout(() => {
      gsap.fromTo(
        ".resBox",
        { opacity: 0, y: 10, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.25 }
      );
    }, 0);
  }

  function closeReschedule() {
    setEditId(null);
    setEdate("");
    setEslot("");
  }

  async function saveReschedule() {
    if (!editId) return;

    if (edate === "" || eslot === "") {
      showToast("Date aur slot select karo");
      return;
    }

    if (edate < today) {
      showToast("Past date nahi");
      return;
    }

    try {
      let old = all.find((x) => x.id === editId);
      if (!old) {
        closeReschedule();
        return;
      }

      let body = {
        ...old,
        date: edate,
        slot: eslot,
        updatedAt: new Date().toISOString(),
      };

      let res = await fetch(`${API}/appointments/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        showToast("Reschedule fail");
        return;
      }

      let saved = await res.json();

      setAll((prev) => prev.map((x) => (x.id === editId ? saved : x)));
      closeReschedule();
      showToast("Rescheduled ✅");
    } catch (err) {
      showToast("Reschedule fail");
    }
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-white/70 mt-1">
              {user?.name} • {user?.email}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => nav("/appointment")}
              className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
              type="button"
            >
              Book Appointment
            </button>

            <button
              onClick={doLogout}
              className="px-5 py-2.5 rounded-2xl border border-rose-400/20 bg-rose-500/10 hover:bg-rose-500/15 transition text-rose-100"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        {/* counters */}
        <div className="mt-7 grid sm:grid-cols-3 gap-4">
          <div className="glass rounded-3xl p-5 border border-white/10">
            <p className="text-white/60 text-sm">Total</p>
            <p className="text-2xl font-semibold mt-2">{totalCount}</p>
          </div>

          <div className="glass rounded-3xl p-5 border border-white/10">
            <p className="text-white/60 text-sm">Upcoming</p>
            <p className="text-2xl font-semibold mt-2">{upCount}</p>
          </div>

          <div className="glass rounded-3xl p-5 border border-white/10">
            <p className="text-white/60 text-sm">Recent</p>
            <p className="text-2xl font-semibold mt-2">{recentCount}</p>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-8 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setTab("up")}
            className={`px-4 py-2 rounded-2xl border transition ${
              tab === "up" ? "bg-white/15 border-white/25" : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            type="button"
          >
            Upcoming
          </button>

          <button
            onClick={() => setTab("past")}
            className={`px-4 py-2 rounded-2xl border transition ${
              tab === "past" ? "bg-white/15 border-white/25" : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            type="button"
          >
            Past
          </button>

          <button
            onClick={() => setTab("all")}
            className={`px-4 py-2 rounded-2xl border transition ${
              tab === "all" ? "bg-white/15 border-white/25" : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            type="button"
          >
            All
          </button>

          <button
            onClick={getData}
            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            type="button"
          >
            Refresh
          </button>
        </div>

        {/* list */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Your Appointments</h2>

          {load ? (
            <div className="mt-4 text-white/70">Loading...</div>
          ) : showList.length === 0 ? (
            <div className="mt-4 text-white/70">No appointments</div>
          ) : (
            <div className="mt-4 grid gap-4">
              {showList.map((a) => {
                let pastOne = pastCheck(a);
                let editing = editId === a.id;

                return (
                  <div
                    key={a.id}
                    className={`glass rounded-3xl p-5 border border-white/10 ${
                      pastOne ? "opacity-60" : "hover:border-white/20"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">
                          {a.doctorName} <span className="text-white/70">• {a.specialty}</span>
                        </p>

                        <p className="text-white/70 mt-1">
                          {a.date} • {a.slot} • ₹{a.fee}
                        </p>

                        <p className="text-white/60 text-sm mt-1">Symptoms: {a.symptoms}</p>

                        {pastOne ? <p className="text-white/50 text-xs mt-2">Past appointment</p> : null}
                      </div>

                      <div className="flex gap-2 justify-end flex-wrap">
                        <button
                          onClick={() => openReschedule(a)}
                          disabled={pastOne}
                          className="px-4 py-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition disabled:opacity-40"
                          type="button"
                        >
                          Reschedule
                        </button>

                        <button
                          onClick={() => cancelAppt(a.id)}
                          disabled={pastOne}
                          className="px-4 py-2 rounded-2xl border border-rose-400/20 bg-rose-500/10 hover:bg-rose-500/15 transition text-rose-100 disabled:opacity-40"
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* RESCHEDULE PANEL */}
                    {editing ? (
                      <div className="resBox mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                        <p className="text-white/80 font-medium">Reschedule form</p>
                        <p className="text-white/60 text-sm mt-1">Date aur slot change karo</p>

                        <div className="mt-4 grid sm:grid-cols-2 gap-3">
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <label className="text-white/70 text-sm">Date</label>
                            <input
                              type="date"
                              min={today}
                              value={edate}
                              onChange={(e) => setEdate(e.target.value)}
                              className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none"
                            />
                          </div>

                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <label className="text-white/70 text-sm">Slot</label>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {slots.map((t) => {
                                let selected = eslot === t;

                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setEslot(t)}
                                    className={`px-3 py-2 rounded-2xl text-sm border transition
                                      ${selected ? "bg-white/15 border-emerald-300/40 shadow-[0_0_0_1px_rgba(52,211,153,0.2)]" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                          <button
                            onClick={closeReschedule}
                            className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
                            type="button"
                          >
                            Close
                          </button>

                          <button
                            onClick={saveReschedule}
                            className="px-5 py-2.5 rounded-2xl border border-emerald-400/20 bg-emerald-500/15 hover:bg-emerald-500/20 transition text-emerald-50"
                            type="button"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* toast */}
        {toastOn ? (
          <div
            ref={toastRef}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
                       px-5 py-3 rounded-2xl border border-white/15 bg-white/10 text-white
                       shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          >
            {toastMsg}
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
}
