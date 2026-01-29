import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

import PageTransition from "../components/ui/PageTransition.jsx";
import MagneticButton from "../components/ui/MagneticButton.jsx";
import FloatingCard from "../components/ui/FloatingCard.jsx";

import DoctorsSection from "../components/sections/DoctorsSection.jsx";
import TestimonialsSlider from "../components/sections/TestimonialsSlider.jsx";
import { isLoggedIn } from "../utils/storage.js";

const services = [
  { title: "24x7 Emergency", desc: "Rapid response team and ICU-ready support." },
  { title: "Diagnostics", desc: "X-ray, ultrasound, pathology & advanced tests." },
  { title: "Cardiac Care", desc: "ECG/ECHO and specialist consultation." },
  { title: "Women Care", desc: "Gynecology, maternity & wellness programs." },
  { title: "Child Care", desc: "Pediatrics, vaccines and neonatal care." },
  { title: "Physiotherapy", desc: "Rehab, posture correction & pain management." },
];

export default function Home() {
  const nav = useNavigate();
  const boxRef = useRef(null);

  let logged = isLoggedIn();

  useEffect(() => {
    // simple gsap entry animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".heroIn",
        { opacity: 0, y: 18, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        }
      );
    }, boxRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div ref={boxRef}>
        {/* HERO */}
        <div className="pt-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* LEFT */}
            <div>
              <div className="heroIn inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-white/70 text-sm">
                  Trusted Care • Fast Booking • 24x7 Support
                </span>
              </div>

              <h1 className="heroIn text-4xl sm:text-5xl font-semibold leading-tight mt-5">
                Swastik{" "}
                <span className="text-white/85">Multispecialist Hospital</span>
                <span className="text-white/70"> — your health, our priority.</span>
              </h1>

              <p className="heroIn mt-5 text-white/70 leading-relaxed max-w-xl">
                Book appointments, choose specialists, and manage your visits with a smooth premium experience.
              </p>

              <div className="heroIn mt-8 flex flex-col sm:flex-row gap-3">
                <MagneticButton onClick={() => nav("/appointment")}>
                  Book Appointment
                </MagneticButton>

                <button
                  onClick={() => nav("/doctors")}
                  className="px-5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                  View Doctors
                </button>

                {logged && (
                  <button
                    onClick={() => nav("/dashboard")}
                    className="px-5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
                  >
                    Dashboard
                  </button>
                )}
              </div>

              <div className="heroIn mt-8 grid grid-cols-3 gap-3 max-w-xl">
                <div className="glass rounded-2xl p-4 border border-white/10">
                  <p className="text-white/60 text-xs">Patients</p>
                  <p className="text-lg font-semibold mt-1">10k+</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-white/10">
                  <p className="text-white/60 text-xs">Specialists</p>
                  <p className="text-lg font-semibold mt-1">30+</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-white/10">
                  <p className="text-white/60 text-xs">Support</p>
                  <p className="text-lg font-semibold mt-1">24x7</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="heroIn">
              <FloatingCard>
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Quick Booking</p>
                      <p className="font-semibold mt-1 text-white/90">
                        Pick Doctor • Pick Slot • Confirm
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 text-emerald-200 text-sm">
                      Open
                    </div>
                  </div>

                  <div className="p-5 pt-0 grid gap-3">
                    {["General Physician", "Dermatology", "Cardiac Care"].map((x) => (
                      <button
                        key={x}
                        onClick={() => nav("/appointment")}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                      >
                        <span className="text-white/80">{x}</span>
                        <span className="text-white/60 text-sm">Book</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-white/60 text-xs">Avg wait time</p>
                    <p className="text-lg font-semibold mt-1">12 min</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-white/60 text-xs">Rating</p>
                    <p className="text-lg font-semibold mt-1">4.8 ★</p>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div className="mt-16">
          <p className="text-white/60 text-sm tracking-wider uppercase">
            Departments & Services
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-2">
            Complete care under one roof
          </h2>
          <p className="text-white/70 mt-2 max-w-2xl">
            Multi-specialist services with modern diagnostics and a patient-first approach.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="group glass rounded-3xl p-5 border border-white/10 hover:border-white/20 transition hover:bg-white/10"
              >
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <span className="text-white/80">+</span>
                </div>
                <h3 className="mt-4 font-semibold text-lg text-white/90">
                  {s.title}
                </h3>
                <p className="mt-2 text-white/70 text-sm">{s.desc}</p>
                <div className="mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-emerald-400/50" />
              </div>
            ))}
          </div>
        </div>

        {/* DOCTORS */}
        <DoctorsSection onBook={() => nav("/appointment")} />

        {/* TESTIMONIALS SLIDER */}
        <TestimonialsSlider />

        {/* CTA */}
        <div className="mt-16 mb-6">
          <div className="glass rounded-3xl p-7 border border-white/10 overflow-hidden relative">
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30
                         bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.7),transparent_60%)]"
            />
            <div className="relative">
              <h3 className="text-2xl font-semibold">Ready to book your visit?</h3>
              <p className="text-white/70 mt-2 max-w-2xl">
                Choose a doctor, pick a slot and confirm—simple and fast.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <MagneticButton onClick={() => nav("/appointment")}>
                  Book Appointment
                </MagneticButton>

                <button
                  onClick={() => nav("/contact")}
                  className="px-5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
