import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import PageTransition from "../components/ui/PageTransition.jsx";
import DoctorCartoon from "../components/ui/DoctorCartoon.jsx";
import { getAuthUser, isLoggedIn } from "../utils/storage.js";

const API = "http://localhost:5000"; // json-server port (agar 3000 hai to yaha change kar do)
const todayISO = new Date().toISOString().split("T")[0];

const DOCTORS = [
  { id: "d1", name: "Dr. Asha Verma", spec: "Cardiologist", fee: 600 },
  { id: "d2", name: "Dr. Rohan Mehta", spec: "Dermatologist", fee: 450 },
  { id: "d3", name: "Dr. Neha Sharma", spec: "Pediatrician", fee: 500 },
  { id: "d4", name: "Dr. Kabir Singh", spec: "General Physician", fee: 300 },
];

const SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

export default function Appointment() {
  const nav = useNavigate();
  const user = getAuthUser();

  let [step, setStep] = useState(1);
  let [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  let [date, setDate] = useState("");
  let [slot, setSlot] = useState("");
  let [symptoms, setSymptoms] = useState("");

  let [success, setSuccess] = useState(false);
  let [loading, setLoading] = useState(false);
  let [msg, setMsg] = useState("");

  // toast (simple student style)
  let [toastOn, setToastOn] = useState(false);
  let [toastMsg, setToastMsg] = useState("");
  const toastBox = useRef(null);

  const doctor = useMemo(() => DOCTORS.find((d) => d.id === doctorId), [doctorId]);

  useEffect(() => {
    if (!isLoggedIn()) nav("/login", { replace: true });
  }, [nav]);

  // animation
  useEffect(() => {
    gsap.fromTo(
      ".stepCard",
      { opacity: 0, y: 16, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }
    );
  }, [step, success]);

  let toastShow = (text) => {
    setToastMsg(text);
    setToastOn(true);

    setTimeout(() => {
      if (!toastBox.current) return;
      gsap.fromTo(
        toastBox.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
    }, 0);

    setTimeout(() => {
      setToastOn(false);
      setToastMsg("");
    }, 2000);
  };

  let canGoNext = () => {
    if (step === 1) return true;
    if (step === 2) return !!date && !!slot;
    return true;
  };

  let next = () => {
    setMsg("");
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  let back = () => {
    setMsg("");
    setStep((s) => Math.max(1, s - 1));
  };

  let resetForm = () => {
    setSuccess(false);
    setStep(1);
    setDoctorId(DOCTORS[0].id);
    setDate("");
    setSlot("");
    setSymptoms("");
    setMsg("");
  };

  let confirm = async () => {
    setMsg("");

    if (!date || !slot) {
      setMsg("Select date and slot");
      toastShow("Fill details");
      return;
    }

    if (symptoms.trim().length < 3) {
      setMsg("Write symptoms min 3 letters");
      toastShow("Fill details");
      return;
    }

    let appt = {
      id: Date.now(),
      userEmail: user?.email,
      userName: user?.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.spec,
      fee: doctor.fee,
      date,
      slot,
      symptoms,
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      let res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appt),
      });

      if (!res.ok) throw new Error("Save failed");

      setSuccess(true);
      toastShow("Booked");
    } catch (err) {
      setMsg(err.message || "Booking failed");
      toastShow("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl p-6 stepCard shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Book Appointment</h2>
                <p className="text-white/70 mt-1">
                  {user?.name ? `Logged in as ${user.name}` : "Logged in"}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-2xl text-sm border ${
                    step === 1 ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10"
                  }`}
                >
                  1 Doctor
                </span>
                <span
                  className={`px-3 py-1 rounded-2xl text-sm border ${
                    step === 2 ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10"
                  }`}
                >
                  2 Slot
                </span>
                <span
                  className={`px-3 py-1 rounded-2xl text-sm border ${
                    step === 3 ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10"
                  }`}
                >
                  3 Confirm
                </span>
              </div>
            </div>

            {/* ERROR MSG */}
            {msg ? (
              <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-100 text-sm">
                {msg}
              </div>
            ) : null}

            {/* BODY */}
            {!success && (
              <>
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="mt-6">
                    <p className="text-white/80 font-medium mb-3">Choose doctor</p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {DOCTORS.map((d) => {
                        let sel = doctorId === d.id;

                        return (
                          <button
                            key={d.id}
                            onClick={() => setDoctorId(d.id)}
                            className={`text-left p-4 rounded-2xl border transition relative ${
                              sel
                                ? "bg-white/15 border-emerald-300/60 ring-2 ring-emerald-300/30 shadow-[0_0_0_6px_rgba(16,185,129,0.08)] scale-[1.01]"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                            type="button"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold">{d.name}</p>
                                <p className="text-white/70 text-sm mt-1">{d.spec}</p>
                              </div>

                              <div className="text-right">
                                <div className="text-sm text-white/70">₹{d.fee}</div>
                                {sel ? (
                                  <div className="text-emerald-200 text-xs font-semibold mt-1">
                                    Selected
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="mt-6">
                    <p className="text-white/80 font-medium mb-3">Pick date and time</p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <label className="text-white/70 text-sm">Date</label>

                        <input
                          type="date"
                          min={todayISO}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className={`mt-2 w-full px-4 py-3 rounded-2xl bg-white/5 border outline-none transition ${
                            date
                              ? "border-emerald-300/40 ring-2 ring-emerald-300/20"
                              : "border-white/10"
                          }`}
                        />

                        <p className="text-white/50 text-xs mt-2">Past date select nahi hogi</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <label className="text-white/70 text-sm">Slots</label>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {SLOTS.map((t) => {
                            let sel = slot === t;

                            return (
                              <button
                                key={t}
                                onClick={() => setSlot(t)}
                                className={`px-3 py-2 rounded-2xl text-sm border transition ${
                                  sel
                                    ? "bg-emerald-500/15 border-emerald-300/60 ring-2 ring-emerald-300/25 shadow-[0_0_0_6px_rgba(16,185,129,0.08)]"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                                type="button"
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>

                        {slot ? (
                          <p className="text-emerald-200/80 text-xs mt-3">
                            Selected slot: {slot}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="mt-6">
                    <p className="text-white/80 font-medium mb-3">Confirm details</p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-white/70 text-sm">Doctor</p>
                        <p className="font-semibold mt-1">{doctor.name}</p>
                        <p className="text-white/70 text-sm mt-1">
                          {doctor.spec} • ₹{doctor.fee}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-white/70 text-sm">Schedule</p>
                        <p className="font-semibold mt-1">{date}</p>
                        <p className="text-white/70 text-sm mt-1">{slot}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <label className="text-white/70 text-sm">Symptoms</label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Eg fever headache"
                        className={`mt-2 w-full min-h-[110px] px-4 py-3 rounded-2xl bg-white/5 border outline-none resize-none transition ${
                          symptoms.trim().length >= 3
                            ? "border-emerald-300/40 ring-2 ring-emerald-300/20"
                            : "border-white/10"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={back}
                    disabled={step === 1 || loading}
                    className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition disabled:opacity-40"
                    type="button"
                  >
                    Back
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={next}
                      disabled={!canGoNext() || loading}
                      className="px-6 py-2.5 rounded-2xl bg-white/15 hover:bg-white/20 transition border border-white/15 disabled:opacity-40"
                      type="button"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={confirm}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/20 transition border border-emerald-400/20 disabled:opacity-40"
                      type="button"
                    >
                      {loading ? "Saving" : "Confirm"}
                    </button>
                  )}
                </div>
              </>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mt-6">
                <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-400/20">
                  <h3 className="text-xl font-semibold">Appointment booked</h3>
                  <p className="text-white/70 mt-2">
                    {doctor.name} • {date} • {slot}
                  </p>

                  <div className="mt-5 flex gap-2 flex-wrap">
                    <button
                      onClick={() => nav("/dashboard", { replace: true })}
                      className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/20 transition border border-white/15"
                      type="button"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
                      type="button"
                    >
                      Book another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <DoctorCartoon className="sticky top-6" />
        </div>
      </div>

      {/* TOAST */}
      {toastOn && (
        <div
          ref={toastBox}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
                     px-5 py-3 rounded-2xl border border-white/15 bg-white/10 text-white
                     shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        >
          {toastMsg}
        </div>
      )}
    </PageTransition>
  );
}
