import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          dark: "#05070c",
          card: "#0d1321",
          border: "rgba(255, 77, 0, 0.1)",
          orange: "#ff4d00",
          gold: "#ffaa00",
          charcoal: "#161c2c",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 77, 0, 0.2)",
        "glow-gold": "0 0 20px rgba(255, 170, 0, 0.2)",
      }
    },
  },
  plugins: [],
};
export default config;
