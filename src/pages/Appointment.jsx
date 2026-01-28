import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import PageTransition from "../components/ui/PageTransition.jsx";
import DoctorCartoon from "../components/ui/DoctorCartoon.jsx";
import { getAuthUser, isLoggedIn, saveAppointment } from "../utils/storage.js";

const DOCTORS = [
  { id: "d1", name: "Dr. Asha Verma", spec: "Cardiologist", fee: 600 },
  { id: "d2", name: "Dr. Rohan Mehta", spec: "Dermatologist", fee: 450 },
  { id: "d3", name: "Dr. Neha Sharma", spec: "Pediatrician", fee: 500 },
  { id: "d4", name: "Dr. Kabir Singh", spec: "General Physician", fee: 300 },
];

const SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

const todayISO = new Date().toISOString().split("T")[0]; // ✅ past dates blocked

export default function Appointment() {
  const nav = useNavigate();
  const user = getAuthUser();

  const [step, setStep] = useState(1);

  const [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [success, setSuccess] = useState(false);

  const doctor = useMemo(() => DOCTORS.find((d) => d.id === doctorId), [doctorId]);

  // ✅ gate
  useEffect(() => {
    if (!isLoggedIn()) nav("/login", { replace: true });
  }, [nav]);

  // ✅ step animation
  useEffect(() => {
    gsap.fromTo(
      ".stepCard",
      { opacity: 0, y: 16, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }
    );
  }, [step, success]);

  // ✅ polish: button states
  const canGoNext = () => {
    if (step === 1) return true; // doctor always selected
    if (step === 2) return !!date && !!slot; // must pick both
    return true;
  };

  const canConfirm = () => symptoms.trim().length >= 3;

  const next = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (!date) return;
      if (!slot) return;
      setStep(3);
    }
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const confirm = () => {
    if (!canConfirm()) return;

    const appt = {
      id: crypto?.randomUUID?.() || String(Date.now()),
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

    saveAppointment(appt);
    setSuccess(true);

    gsap.fromTo(
      ".successPop",
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  };

  const resetForm = () => {
    setSuccess(false);
    setStep(1);
    setDoctorId(DOCTORS[0].id);
    setDate("");
    setSlot("");
    setSymptoms("");
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
                <span className={`px-3 py-1 rounded-2xl text-sm border ${step === 1 ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10"} `}>
                  1. Doctor
                </span>
                <span className={`px-3 py-1 rounded-2xl text-sm border ${step === 2 ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10"} `}>
                  2. Slot
                </span>
                <span className={`px-3 py-1 rounded-2xl text-sm border ${step === 3 ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10"} `}>
                  3. Confirm
                </span>
              </div>
            </div>

            {/* BODY */}
            {!success && (
              <>
                {/* STEP 1: Doctor */}
                {step === 1 && (
                  <div className="mt-6">
                    <p className="text-white/80 font-medium mb-3">Choose your doctor</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {DOCTORS.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDoctorId(d.id)}
                          className={`text-left p-4 rounded-2xl border transition
                            ${doctorId === d.id ? "bg-white/15 border-white/25" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                          type="button"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{d.name}</p>
                              <p className="text-white/70 text-sm mt-1">{d.spec}</p>
                            </div>
                            <div className="text-sm text-white/70">₹{d.fee}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Date + Slot */}
                {step === 2 && (
                  <div className="mt-6">
                    <p className="text-white/80 font-medium mb-3">Pick date & time</p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <label className="text-white/70 text-sm">Select Date</label>

                        <input
                          type="date"
                          min={todayISO} // ✅ past disabled
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none"
                        />

                        <p className="text-white/50 text-xs mt-2">
                          Past date select nahi hogi ✅
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <label className="text-white/70 text-sm">Time Slots</label>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {SLOTS.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSlot(t)}
                              className={`px-3 py-2 rounded-2xl text-sm border transition
                                ${slot === t ? "bg-white/15 border-white/25" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                              type="button"
                            >
                              {t}
                            </button>
                          ))}
                        </div>

                        {!date || !slot ? (
                          <p className="text-amber-200/80 text-xs mt-3">
                            Date + Slot dono select karo tab Next enable hoga.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Confirm */}
                {step === 3 && (
                  <div className="mt-6">
                    <p className="text-white/80 font-medium mb-3">Confirm details</p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-white/70 text-sm">Selected Doctor</p>
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
                      <label className="text-white/70 text-sm">Symptoms / Notes</label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Eg: fever, headache, skin allergy..."
                        className="mt-2 w-full min-h-[110px] px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none"
                      />
                      {!canConfirm() ? (
                        <p className="text-amber-200/80 text-xs mt-2">
                          Minimum 3 characters likho, tab Confirm enable hoga.
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={back}
                    disabled={step === 1}
                    className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition
                               disabled:opacity-40 disabled:hover:bg-white/5"
                    type="button"
                  >
                    Back
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={next}
                      disabled={!canGoNext()}
                      className="px-6 py-2.5 rounded-2xl bg-white/15 hover:bg-white/20 transition border border-white/15 relative overflow-hidden
                                 disabled:opacity-40 disabled:hover:bg-white/15"
                      type="button"
                    >
                      Next
                      <span className="absolute -left-20 top-0 h-full w-24 rotate-12 opacity-0 hover:opacity-100 transition duration-300
                        bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />
                    </button>
                  ) : (
                    <button
                      onClick={confirm}
                      disabled={!canConfirm()}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/25 transition border border-emerald-400/20
                                 disabled:opacity-40 disabled:hover:bg-emerald-500/20"
                      type="button"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              </>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mt-6 successPop">
                <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-400/20">
                  <h3 className="text-xl font-semibold">✅ Appointment Confirmed</h3>
                  <p className="text-white/70 mt-2">
                    {doctor.name} • {date} • {slot}
                  </p>
                  <p className="text-white/60 mt-2 text-sm">Symptoms: {symptoms}</p>

                  <div className="mt-5 flex gap-2 flex-wrap">
                    <button
                      onClick={() => nav("/dashboard", { replace: true })}
                      className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/20 transition border border-white/15"
                      type="button"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
                      type="button"
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Cartoon Doctor */}
        <div className="lg:col-span-1">
          <DoctorCartoon className="sticky top-6" />
        </div>
      </div>
    </PageTransition>
  );
}
