import React from "react";
import RevealOnScroll from "../ui/RevealOnScroll.jsx";

const DOCTORS = [
  { name: "Dr. Asha Verma", spec: "Cardiologist", exp: "10+ yrs", fee: "₹600", days: "Mon–Sat" },
  { name: "Dr. Rohan Mehta", spec: "Dermatologist", exp: "8+ yrs", fee: "₹450", days: "Mon–Fri" },
  { name: "Dr. Neha Sharma", spec: "Pediatrician", exp: "7+ yrs", fee: "₹500", days: "Mon–Sat" },
  { name: "Dr. Kabir Singh", spec: "General Physician", exp: "12+ yrs", fee: "₹300", days: "Daily" },
  { name: "Dr. Isha Jain", spec: "Gynecologist", exp: "9+ yrs", fee: "₹550", days: "Mon–Sat" },
  { name: "Dr. Arjun Patel", spec: "Orthopedics", exp: "11+ yrs", fee: "₹650", days: "Mon–Fri" },
];

export default function DoctorsSection({ onBook }) {
  return (
    <section className="mt-16">
      <RevealOnScroll>
        <p className="text-white/60 text-sm tracking-wider uppercase">Our Specialists</p>
        <h2 className="text-2xl sm:text-3xl font-semibold mt-2">Meet our expert doctors</h2>
        <p className="text-white/70 mt-2 max-w-2xl">
          Verified specialists with experience across multiple departments.
        </p>
      </RevealOnScroll>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCTORS.map((d, i) => (
          <RevealOnScroll key={d.name} delay={i * 0.05}>
            <div className="group glass rounded-3xl p-5 border border-white/10 hover:border-white/20 transition
                            hover:bg-white/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white/90">{d.name}</p>
                  <p className="text-white/70 text-sm mt-1">{d.spec}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-2xl bg-white/5 border border-white/10 text-white/70">
                  {d.exp}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-xs">Consultation</p>
                  <p className="text-white font-semibold mt-1">{d.fee}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-xs">Available</p>
                  <p className="text-white/85 font-semibold mt-1">{d.days}</p>
                </div>
              </div>

              <button
                onClick={onBook}
                className="mt-5 w-full px-4 py-3 rounded-2xl bg-white/12 hover:bg-white/18 transition
                           border border-white/15 text-white/90"
              >
                Book Appointment
              </button>

              <div className="mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-emerald-400/50" />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
