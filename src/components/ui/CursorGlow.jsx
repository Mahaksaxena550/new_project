import React, { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e) => {
      el.style.transform = `translate(${e.clientX - 140}px, ${e.clientY - 140}px)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-[280px] h-[280px] rounded-full pointer-events-none
                 blur-3xl opacity-25 mix-blend-screen z-10
                 bg-[radial-gradient(circle_at_30%_30%,rgba(236,72,153,0.85),transparent_60%)]"
    />
  );
}
