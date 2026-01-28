import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function FloatingCard({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, { y: -10, duration: 2.6, ease: "sine.inOut" });

    return () => tl.kill();
  }, []);

  return (
    <div
      ref={ref}
      className={`glass rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] ${className}`}
    >
      {children}
    </div>
  );
}
