import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LogoMark({ size = 52 }) {
  const ring = useRef(null);
  const pulse = useRef(null);

  useEffect(() => {
    gsap.to(ring.current, {
      rotate: 360,
      transformOrigin: "50% 50%",
      duration: 24,
      ease: "none",
      repeat: -1,
    });

    gsap.to(pulse.current, {
      scale: 1.08,
      opacity: 0.7,
      transformOrigin: "50% 50%",
      duration: 2.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {/* glow */}
        <div
          ref={pulse}
          className="absolute inset-0 rounded-full blur-2xl opacity-60
                     bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.55),transparent_60%)]"
        />

        <svg viewBox="0 0 64 64" className="relative w-full h-full">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(34,197,94,0.95)" />
              <stop offset="1" stopColor="rgba(59,130,246,0.85)" />
            </linearGradient>
            <linearGradient id="plusGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.75)" />
            </linearGradient>
          </defs>

          {/* rotating outer ring */}
          <g ref={ring} opacity="0.95">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#ringGrad)" strokeWidth="2.2" strokeDasharray="10 8" />
          </g>

          {/* inner glass */}
          <circle cx="32" cy="32" r="19" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.6" />

          {/* heartbeat line */}
          <path
            d="M16 34h9l3-6 4 12 4-8h12"
            fill="none"
            stroke="rgba(34,197,94,0.75)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* plus */}
          <path
            d="M30 21h4v9h9v4h-9v9h-4v-9h-9v-4h9v-9z"
            fill="url(#plusGrad)"
          />

          {/* accent dot */}
          <circle cx="49" cy="20" r="3" fill="rgba(34,197,94,0.95)" />
        </svg>
      </div>

            <div className="leading-tight">
            <div className="flex items-baseline gap-1">
              <span className="text-white font-bold tracking-wider text-[16px]">
                Swastik
              </span>
              <span className="text-white/80 font-medium tracking-wide text-[14px]">
                Multispecialist
              </span>
            </div>
            <div className="text-white/50 text-[11px] tracking-wide -mt-0.5">
              Hospital & Care Centre
            </div>
          </div>


    </div>
  );
}
