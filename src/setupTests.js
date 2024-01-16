// Loaded automatically by Create React App's Jest setup.
import "@testing-library/jest-dom";

// jsdom does not implement these, and flowbite-react / the print button use them.
if (typeof window.matchMedia !== "function") {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
