// apps/nextjs/tailwind.config.js
/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}", // Ensure Shadcn UI content
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssAnimate],
};