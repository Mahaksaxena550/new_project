import React from "react";

const departments = [
  [
    "Accident & Emergency",
    "Brain Sciences",
    "Critical Care",
    "Dietetics",
    "Gastroenterology",
    "Internal Medicine",
    "Nephrology",
    "Orthopaedics, Joint Replacement & Sports Injury",
    "Pharmacy",
    "Pulmonary",
  ],
  [
    "Anaesthesiology",
    "Cardiac Sciences",
    "Dental Care",
    "Endocrinology & Metabolism",
    "General and Bariatric Surgery",
    "IVF and Fertility",
    "Oncology (Medical and Surgical)",
    "Paediatrics",
    "Physiotherapy",
    "Radiology",
  ],
  [
    "Blood Bank",
    "Clinical Haematology",
    "Dermatology",
    "ENT",
    "Gynaecology and Obstetrics",
    "Neonatology",
    "Ophthalmology",
    "Pathology",
    "Psychiatry",
    "Urology",
  ],
];

export default function DepartmentsMega({ dark = false }) {
  return (
    <div
      className={`w-[920px] rounded-2xl p-6 grid grid-cols-3 gap-6 text-sm
      ${dark ? "bg-transparent text-white/80" : "bg-white text-slate-700"}`}
    >
      {departments.map((col, i) => (
        <ul key={i} className="space-y-3">
          {col.map((item, idx) => (
            <li
              key={idx}
              className={`border-b pb-2 cursor-pointer transition
                ${dark
                  ? "border-white/10 hover:text-white"
                  : "border-slate-200 hover:text-blue-700"}`}
            >
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
