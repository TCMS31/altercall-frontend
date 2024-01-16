import flowbitePlugin from "flowbite/plugin";

/**
 * Tailwind is enabled by Create React App purely because this file exists
 * (react-scripts injects the `tailwindcss` PostCSS plugin when it finds one),
 * so there is deliberately no postcss.config.js - CRA 5 ignores it.
 *
 * This file is ESM on purpose: no `require`, no `createRequire` shim.
 *
 * Brand colours live under `theme.extend.colors`. Defining them at `theme.colors`
 * would replace Tailwind's palette instead of adding to it, which is what used to
 * happen here and silently deleted `cyan`, `sky`, `slate` and friends.
 */
/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
];

export const darkMode = "class";

export const theme = {
  extend: {
    colors: {
      brand: {
        50: "#effcfb",
        100: "#c9f7f3",
        200: "#96ece7",
        300: "#5ddbd6",
        400: "#2fc0bf",
        500: "#17a2a4",
        600: "#0f8184",
        700: "#11666a",
        800: "#135255",
        900: "#144548",
      },
      ink: {
        50: "#f6f7f9",
        100: "#eceef2",
        200: "#d4d9e2",
        300: "#adb7c8",
        400: "#7f8da3",
        500: "#5f6d85",
        600: "#4a566b",
        700: "#3d4657",
        800: "#343c4a",
        900: "#1d222c",
        950: "#11141b",
      },
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
    },
    boxShadow: {
      panel: "0 1px 2px rgba(17, 20, 27, 0.06), 0 8px 24px -12px rgba(17, 20, 27, 0.25)",
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
};

export const plugins = [flowbitePlugin];
