/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jetbrains_mono: ["var(--font-jetbrains_mono)", ...fontFamily.mono],
      },
    },
  },
  plugins: [],
};
