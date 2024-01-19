/**
 * Flowbite theme overrides.
 *
 * Flowbite's stock palette is cyan/blue; the product palette is the `brand` scale
 * defined in tailwind.config.js. Overriding here - once - keeps every button and
 * input on brand without sprinkling one-off class names through the components.
 */
export const flowbiteTheme = {
  button: {
    color: {
      brand:
        "text-white bg-brand-600 border border-transparent enabled:hover:bg-brand-700 focus:ring-4 focus:ring-brand-200 disabled:opacity-60",
      light:
        "text-ink-800 bg-white border border-ink-200 enabled:hover:bg-ink-50 focus:ring-4 focus:ring-ink-100",
    },
  },
  textInput: {
    field: {
      input: {
        colors: {
          gray: "bg-white border-ink-200 text-ink-900 placeholder-ink-400 focus:border-brand-500 focus:ring-brand-500",
          failure:
            "bg-red-50 border-red-400 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
        },
      },
    },
  },
  select: {
    field: {
      select: {
        colors: {
          gray: "bg-white border-ink-200 text-ink-900 focus:border-brand-500 focus:ring-brand-500",
          failure:
            "bg-red-50 border-red-400 text-red-900 focus:border-red-500 focus:ring-red-500",
        },
      },
    },
  },
  badge: {
    root: {
      color: {
        info: "bg-brand-100 text-brand-800",
        gray: "bg-ink-100 text-ink-700",
      },
    },
  },
};

export default flowbiteTheme;
