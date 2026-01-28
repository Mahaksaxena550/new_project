import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedBg() {
  const blob1 = useRef(null);
  const blob2 = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "sine.inOut" },
    });

    tl.to(blob1.current, { x: 140, y: -80, scale: 1.15, duration: 6 }, 0)
      .to(blob2.current, { x: -120, y: 100, scale: 1.2, duration: 7 }, 0);

    return () => tl.kill();
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />

      <div
        ref={blob1}
        className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-35
                   bg-gradient-to-r from-fuchsia-500 to-indigo-500"
      />
      <div
        ref={blob2}
        className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full blur-3xl opacity-30
                   bg-gradient-to-r from-cyan-400 to-emerald-400"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:22px_22px] opacity-40" />
    </div>
  );
}
