import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MagneticButton({ children, onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * 0.18, y: y * 0.18, duration: 0.35, ease: "power3.out" });
    };

    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="relative px-5 py-2.5 rounded-2xl font-medium
                 bg-white/10 border border-white/15 backdrop-blur
                 hover:bg-white/16 transition duration-300
                 active:scale-[0.98]
                 shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                 overflow-hidden"
    >
      <span className="relative z-10">{children}</span>

      <span
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition
                   bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),transparent_55%)]"
      />

      <span
        className="absolute -left-20 top-0 h-full w-24 rotate-12 opacity-0 hover:opacity-100 transition duration-300
                   bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]"
      />
    </button>
  );
}
