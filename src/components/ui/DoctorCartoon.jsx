import React from "react";

export default function DoctorCartoon({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-6 rounded-3xl blur-2xl opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.6),transparent_60%)]" />
      <div className="glass rounded-3xl p-5 border border-white/10">
        <svg viewBox="0 0 420 420" className="w-full h-auto">
          {/* background */}
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.03)" />
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="380" height="380" rx="36" fill="url(#bg)" />

          {/* head */}
          <circle cx="210" cy="150" r="70" fill="#FFD9B3" />
          {/* hair */}
          <path
            d="M150 150c0-48 30-80 60-80 34 0 68 24 70 76-10-18-26-28-42-28-20 0-34 10-48 10-14 0-26-6-40 22z"
            fill="#2B2B2B"
            opacity="0.95"
          />

          {/* eyes */}
          <circle cx="185" cy="155" r="8" fill="#1f2937" />
          <circle cx="235" cy="155" r="8" fill="#1f2937" />
          <circle cx="182" cy="152" r="2.8" fill="#fff" />
          <circle cx="232" cy="152" r="2.8" fill="#fff" />

          {/* smile */}
          <path d="M190 185c10 12 30 12 40 0" stroke="#7c2d12" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* body coat */}
          <path
            d="M120 340c8-86 55-120 90-120s82 34 90 120H120z"
            fill="#f8fafc"
            opacity="0.95"
          />
          <path d="M210 220v120" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
          <path d="M150 340c4-64 28-92 60-92" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
          <path d="M270 340c-4-64-28-92-60-92" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />

          {/* shirt */}
          <path d="M175 340c2-55 14-75 35-75s33 20 35 75h-70z" fill="#93c5fd" opacity="0.7" />

          {/* stethoscope */}
          <path
            d="M170 245v35c0 24 16 38 40 38s40-14 40-38v-35"
            stroke="#0f172a"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="170" cy="242" r="10" fill="#0f172a" />
          <circle cx="250" cy="242" r="10" fill="#0f172a" />
          <circle cx="210" cy="323" r="16" fill="#0f172a" />
          <circle cx="210" cy="323" r="8" fill="#94a3b8" />

          {/* plus badge */}
          <circle cx="310" cy="250" r="28" fill="#22c55e" opacity="0.9" />
          <path d="M310 238v24" stroke="#052e16" strokeWidth="8" strokeLinecap="round" />
          <path d="M298 250h24" stroke="#052e16" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <p className="mt-3 text-center text-white/70 text-sm">
          Your friendly doctor 👨‍⚕️
        </p>
      </div>
    </div>
  );
}
