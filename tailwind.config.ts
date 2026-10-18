import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)"],
        mono: ["var(--font-poppins)"],
      },
      colors: {
        brand: { 50: "#ececff", 500: "#5b5bd6", 700: "#4343ad" },
        accent: { 50: "#fff0eb", 500: "#e36b47", 700: "#bd4e2e" },
      },
    },
  },
  plugins: [],
};

export default config;
