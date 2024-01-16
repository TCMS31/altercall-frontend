/**
 * Brand colours live under `theme.extend.colors`. Defining them at `theme.colors`
 * would replace Tailwind's palette instead of adding to it.
 *
 * The look borrows from a gym whiteboard: chalk-paper background, pine green for
 * actions, and a signal orange kept for the numbers a coach actually reads
 * (sets, reps, RPE).
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f5f2ea",
        brand: {
          50: "#eef6f1",
          100: "#d5eadd",
          200: "#aed4bd",
          300: "#7db896",
          400: "#4f9870",
          500: "#2f7b55",
          600: "#226345",
          700: "#1c5039",
          800: "#18402f",
          900: "#123224",
          950: "#0b2017",
        },
        ink: {
          50: "#f8f6f1",
          100: "#eeebe3",
          200: "#dcd7cb",
          300: "#bdb6a6",
          400: "#958d7c",
          500: "#6b6455",
          600: "#555044",
          700: "#433f36",
          800: "#2f2c26",
          900: "#1f1d19",
          950: "#141310",
        },
        signal: {
          100: "#fde5d6",
          400: "#f2804a",
          500: "#e2591f",
          600: "#c2470f",
          700: "#a03a0d",
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"],
        display: ['"Barlow Condensed"', '"Arial Narrow"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 rgba(31, 29, 25, 0.04), 0 10px 30px -18px rgba(31, 29, 25, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 220ms ease-out both",
      },
    },
  },
};
