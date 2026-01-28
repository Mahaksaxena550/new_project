import React from "react";
import RevealOnScroll from "../ui/RevealOnScroll.jsx";

const TESTIMONIALS = [
  { name: "Riya S.", text: "Very smooth appointment process. Doctors explained everything clearly." },
  { name: "Aman K.", text: "Clean facility & fast service. Staff was supportive and professional." },
  { name: "Neha P.", text: "Best experience for my family. Booking and follow-up was super easy." },
];

export default function TestimonialsSection() {
  return (
    <section className="mt-16">
      <RevealOnScroll>
        <p className="text-white/60 text-sm tracking-wider uppercase">Testimonials</p>
        <h2 className="text-2xl sm:text-3xl font-semibold mt-2">What patients say</h2>
        <p className="text-white/70 mt-2 max-w-2xl">Real feedback from our patients.</p>
      </RevealOnScroll>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <RevealOnScroll key={t.name} delay={i * 0.07}>
            <div className="glass rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition">
              <p className="text-white/85 leading-relaxed">“{t.text}”</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold text-white/90">{t.name}</span>
                <span className="text-white/60 text-sm">Verified</span>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
