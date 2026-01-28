/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
      animation: {
    spinSlow: "spin 18s linear infinite",
    pulseSlow: "pulse 3s ease-in-out infinite",
  },
  } },
  plugins: [],
};
