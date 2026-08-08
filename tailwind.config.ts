import type { Config } from "tailwindcss";

/**
 * "Mediterranean Editorial" — the Beirut Apparel concept design system.
 * Warm linen paper, warm ink, deep lagoon-green accent, terracotta for sale.
 * Distinct from the Athlete Factory concept (volt green on cool paper).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F0E6",
        sand: "#EFE9DA",
        surface: "#FFFDF8",
        ink: "#1A1714",
        muted: "#7A7366",
        line: "#E6DFCF",
        "line-soft": "#EFE9DC",
        lagoon: {
          DEFAULT: "#0F4C3F",
          deep: "#0A3A30",
          ink: "#F3EFE3",
        },
        terracotta: "#B0522C",
        "terracotta-deep": "#93431F",
      },
      fontFamily: {
        display: [
          "var(--font-fraunces)",
          "Fraunces",
          "Georgia",
          "serif",
        ],
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      maxWidth: {
        shell: "1440px",
      },
      boxShadow: {
        lift: "0 1px 2px rgba(26,23,20,0.06), 0 8px 24px -8px rgba(26,23,20,0.12)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.985)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-up-late": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "60%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 36s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.5s ease both",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in-left": "slide-in-left 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.28s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
